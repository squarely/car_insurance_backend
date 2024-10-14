import bcrypt from 'bcryptjs';
import dotenv from 'dotenv'
import { create, findOne, findByIdAndUpdate, find, findById, count } from '..//Repositories/user.repository.js';
import { getAccessToken, getRefreshToken, getId, emptyRespose } from '../Utils/utils.js';
import AppError from '../Errors/AppError.js'

dotenv.config()

export const getUsers = async (req, res, next) => {
    try {
        const resultPerPage = 100

        const query = req.query;

        const page = query.page ? Number(query.page) : 1;

        if (query.hasOwnProperty('page')) delete query.page;

        const numberOfResult = await count(req.query)

        if (!numberOfResult) {
            return res.status(200).json(emptyRespose())
        }

        const numberOfPage = Math.ceil(numberOfResult / resultPerPage);
        if (page > numberOfPage) page = numberOfPage
        else if (page < 1) page = 1
        const startingLimit = (page - 1) * resultPerPage;

        const data = await find(req.query).skip(startingLimit).limit(resultPerPage).select('-password');

        res.status(200).json({
            count: data.length,
            totalCount: numberOfResult,
            totalPages: numberOfPage,
            page,
            firstItemIndex: startingLimit,
            lastItemIndex: startingLimit + (data.length - 1),
            data
        })
    } catch (error) {
        next(error)
    }
}

export const postUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await findOne({ email });
        let payload = req.body;

        payload.password = bcrypt.hashSync(password, 10);

        if (user) {
            return next(new AppError(404, 'email already deleted. Please contact admin'))
        }

        const data = await create(payload);

        delete data.password;

        res.status(201).json(data);
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const data = await findById(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req, res, next) => {
    try {
        const payload = req.body;
        const data = await findByIdAndUpdate(req.params.id, payload, { new: true })
        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    try {
        const data = await findByIdAndRemove(req.params.id)
        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
}

export const loginUser = async (req, res, next) => {
    try {

        const { email, password } = req.body;
        const user = await findOne({ email });

        if (!user) {
            return next(new AppError(404, 'email is not exist'))
        }

        const encryptPass = bcrypt.hashSync(password, 10);

        if (bcrypt.compareSync(encryptPass, user.password)) {
            return next(new AppError(401, 'Incorrect password'))
        }

        const payload = { id: user._id, email: user.email }

        const accessToken = await getAccessToken(payload);
        const refreshToken = await getRefreshToken(payload);

        let data = { ...user._doc };

        delete data.password;

        data['accessToken'] = accessToken;
        data['refreshToken'] = refreshToken;

        res.status(200).json(data)

    } catch (error) {
        next(error)
    }
}

export const getToken = async (req, res, next) => {
    try {

        const userId = getId(req.headers['authorization']);

        if (!userId) {
            new AppError(400, `UserId is not found`)
        }

        const user = await findById(userId);

        const payload = { id: user._id, email: user.email }

        const accessToken = getAccessToken(payload);
        const refreshToken = getRefreshToken(payload);

        data['accessToken'] = accessToken;
        data['refreshToken'] = refreshToken;

        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
}