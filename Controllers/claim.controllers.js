import dotenv from 'dotenv'
import { create, findByIdAndUpdate, find, findById, count, aggregate, findByIdAndDelete } from '..//Repositories/claim.repository.js';
import { emptyRespose } from '../Utils/utils.js';
import { getFileUrl, generatePresignedUrl, generatePresignedUrls } from '../Utils/storage/aws-storage.js';
import { v4 as uuidv4 } from 'uuid';
import { damageDetectionApi } from '../Utils/damageDetectionApi.js';

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

        const data = await find(req.query)
            .sort({ createdAt: -1 })
            .skip(startingLimit)
            .limit(resultPerPage);

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
        const data = await findByIdAndDelete(req.params.id)
        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
}

export const getClaimCount = async (req, res, next) => {
    try {
        const counts = await aggregate([
            {
                $group: {
                    _id: null,
                    pendingCount: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
                    completedCount: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
                    totalCount: { $sum: 1 },
                }
            }
        ]);

        return res.status(200).json({
            pending: counts[0].pendingCount,
            completed: counts[0].completedCount,
            total: counts[0].totalCount,
        });

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

        let subUrl = `carinsurance/claim/input/${claim._id}/${uuidv4()}`

        const imageUrl = getFileUrl(subUrl)

        const preSignedUrl = await generatePresignedUrl(subUrl)

        await findByIdAndUpdate(req.params.id, { $push: { damagedPartImages: imageUrl } }, { new: true })

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

        if (claim.status == 'completed') {
            return res.status(400).json({ message: 'Claim is already completed' })
        }

        let base = `carinsurance/claim/output/${claim._id}`

        const { signedUrls, attachmentUrls } = await generatePresignedUrls(claim.damagedPartImages.length, base)

        const damageResponse = await damageDetectionApi({ parts: claim.damagedPartImages, signedUrls })

        const payload = {
            status: 'completed',
            priceCalculation: damageResponse.data,
            aiRepairEstimationCost: damageResponse.data.totalAmount,
            damagedParts: damageResponse.detected_parts,
            suggestedSettlementCost: damageResponse.data.totalAmount != 0 ? damageResponse.data.totalAmount - 200 : 0,
            aiAnalisysImages: attachmentUrls,
            aiGeneratedReportDate: new Date(),
        }

        const data = await findByIdAndUpdate(req.params.id, payload, { new: true })

        res.status(200).json(data)
    } catch (error) {
        next(error)
    }
}
