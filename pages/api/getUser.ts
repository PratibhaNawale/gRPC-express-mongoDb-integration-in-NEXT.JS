import type { NextApiRequest, NextApiResponse } from 'next';
import client from '../../grpc/grpcClient';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const query = req.query.query ? String(req.query.query) : '';

        client.GetUser({ query }, (error: any, response: any) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            return res.status(200).json({ users: response.users });
        });
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
}
