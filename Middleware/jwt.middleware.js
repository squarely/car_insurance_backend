import dotenv from 'dotenv';
import { expressjwt as expjwt } from 'express-jwt';
dotenv.config()

const globalAuthentication = () => {
    const APIV1 = process.env.APIV1;
    return expjwt({
        secret: process.env.JWT_ACCESS_SECRET,
        algorithms: ['HS256'],
    }).unless({
        path: [
            {
                url: `${APIV1}/user/login`,
                methods: ['POST']
            },
            {
                url: `${APIV1}/user`,
                methods: ['POST']
            },
            {
                url: `${APIV1}/user/token`,
                methods: ['POST']
            }
        ]
    })
}

export default globalAuthentication;