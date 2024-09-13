import type { NextApiRequest, NextApiResponse } from 'next';
import client from '../../grpc/grpcClient';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const { id } = req.body;
        client.deleteUser({ id }, (error: any, response: any) => {
            if (error) {
                res.status(500).json({ error: 'Failed to delete customer' });
            } else {
                res.status(200).json({ message: 'Customer deleted successfully' });
            }
        });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}
