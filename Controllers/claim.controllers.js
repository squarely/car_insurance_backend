import dotenv from 'dotenv'
import { create, findByIdAndUpdate, find, findById, count } from '..//Repositories/claim.repository.js';
import { emptyRespose } from '../Utils/utils.js';
import { getFileUrl, generatePresignedUrl } from '../Utils/storage/aws-storage.js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config()

export const getClaims = async (req, res, next) => {
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

        const data = await find(req.query).skip(startingLimit).limit(resultPerPage);

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

export const postClaim = async (req, res, next) => {
    try {
        const payload = req.body;

        const data = await create(payload);
        res.status(201).json(data);
    } catch (error) {
        next(error)
    }
}

export const getClaim = async (req, res, next) => {
    try {
        const data = await findById(req.params.id);
        res.status(200).json(data);
    } catch (error) {
        next(error)
    }
}

export const updateClaim = async (req, res, next) => {
    try {
        const payload = req.body;
        const data = await findByIdAndUpdate(req.params.id, payload, { new: true })
        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
}

export const deleteClaim = async (req, res, next) => {
    try {
        const data = await findByIdAndRemove(req.params.id)
        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
}

export const getClaimImage = async (req, res, next) => {
    try {
        const claim = await findById(req.params.id);

        if (!claim) {
            return res.status(404).json({ message: 'Claim not found' })
        }

        let subUrl = `carinsurance/claim/input/${uuidv4()}`

        const imageUrl = getFileUrl(subUrl)

        const preSignedUrl = await generatePresignedUrl(subUrl)

        await findByIdAndUpdate(req.params.id, { damagedPartImage: imageUrl }, { new: true })

        res.status(200).json({ preSignedUrl, imageUrl })
    } catch (error) {
        next(error)
    }
}


export const updateRepairCost = async (req, res, next) => {
    try {
        const claim = await findById(req.params.id);

        if (!claim) {
            return res.status(404).json({ message: 'Claim not found' })
        }

        const payload = {
            status:'completed',
            aiRepairEstimationCost: 2000,
            suggestedSettlementCost: 2500,
            aiAnalisysImage: 'https://my-structure-storage.s3.eu-north-1.amazonaws.com/carinsurance/claim/input/f699a3c9-7f87-4662-841b-e7a6df430327',
            aiGeneratedReportDate: new Date(),
        }

        const data = await findByIdAndUpdate(req.params.id, payload, { new: true })

        res.status(200).json(data)

    } catch (error) {
        next(error)
    }
}
