import type { NextApiRequest, NextApiResponse } from 'next';
import client from '../../grpc/grpcClient';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { id, name, email, password } = req.body;

        client.updateUser({ id, name, email, password }, (error: any, response: any) => {
            if (error) {
                res.status(500).json({ error: 'Failed to update user' });
            } else {
                res.status(200).json({ user: response });
            }
        });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
