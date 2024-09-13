import type { NextApiRequest, NextApiResponse } from 'next';
import client from '../../grpc/grpcClient';

export default function createUser(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'All fields are required.' });
      return;
    }

    client.createUser({ name, email, password }, (error: any, response: any) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(200).json({ user: response.user });
      }
    });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
