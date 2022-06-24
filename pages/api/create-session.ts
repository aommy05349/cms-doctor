import type { NextApiRequest, NextApiResponse } from 'next';
import { setCookies } from 'cookies-next';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    try {
        const token = req.body.token;
        const options = {
            req,
            res,
            maxAge: 60 * 6 * 24,
        };
        setCookies('cms-doctor-cookie', token, options);
        return res.status(200).json({
            status: 'success',
        });
    } catch (error) {
        console.error(error);
        return res
            .status(403)
            .json({ status: 'error', message: 'unauthorize' });
    }
}
