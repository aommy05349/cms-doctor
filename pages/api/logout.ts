import type { NextApiRequest, NextApiResponse } from 'next';
import { removeCookies } from 'cookies-next';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    removeCookies('cms-doctor-cookie', { req, res });
    return res.status(200).json({
        status: 'success',
    });
}
