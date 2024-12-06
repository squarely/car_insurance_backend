import axios from 'axios';
import AppError from '../Errors/AppError.js';
import dotenv from "dotenv";

dotenv.config();

export async function damageDetectionApi(images) {
    try {
        const response = await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: `${process.env.DAMAGE_DETECTION_URL}/api/v1/damage`,
            headers: {
                'Content-Type': 'application/json',
            },
            data: getDamagePaylod(images)
        });
        return response.data;
    }
    catch (error) {
        throw new AppError('Demage detection ai is not responding expected', 500);
    }
}

function getDamagePaylod(images) {
    const { parts, signedUrls } = images;
    let damgeParts = [];

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const singed = signedUrls[i];
        damgeParts.push({
            image_url: part,
            pre_signed_url: singed
        })
    }

    return damgeParts;
}
