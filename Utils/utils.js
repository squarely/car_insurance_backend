import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

dotenv.config()

export const getToken = (token) => {
    return token.split(' ')[1]
}

export const isAuthorization = (token) => {
    const bearer = token.split(' ')
    return (token.startsWith("Bearer ") && bearer[1] != null) ? true : false
}

export const getAccessToken = async (payload) => {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRATION })
}

export const getRefreshToken = async (payload) => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: '365d' })
}

export const generateOTP = async () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

export const getOTPHash = async (phoneNumber) => {
    let otp = await generateOTP();

    if (phoneNumber != null && phoneNumber == process.env.PHONE) {
        otp = 545454
    }
    const otpHash = await getHash(`${otp}`)

    return {
        otp,
        otpHash
    }
}

export const getHash = async (data) => {
    return bcrypt.hashSync(data, bcrypt.genSaltSync(13))
}

export const getId = (token) => {
    const id = jwt.decode(token).id;
    return new mongoose.Types.ObjectId(id);
}

export const emptyRespose = () => {
    return {
        count: 0,
        totalCount: 0,
        totalPages: 0,
        page: 0,
        firstItemIndex: 0,
        lastItemIndex: 0,
        data: []
    }
}