import axios from 'axios';
import AppError from '../Errors/AppError.js';

export async function damageDetectionApi(payload) {
    try {
        const response = await axios.request({
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://13.61.35.111:8000/api/v1/damage-detection',
            headers: {
                'Content-Type': 'application/json',
            },
            data: payload
        });
        return response.data;
    }
    catch (error) {
        throw new AppError('Demage detection ai is not responding expected', 500);
    }
}
