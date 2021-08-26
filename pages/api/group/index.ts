import type { NextApiRequest, NextApiResponse } from 'next'
import { pool } from 'db';
type Data = {
    success: boolean,
    message?: string,
    extra?: any
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    try{
        if(req.method !== 'GET'){
            return res.status(404).json({ success: false, message: 'API notfound' });
        }
        const query = 'select * from sgroup';
        await pool.connect();
        const result = await pool.query(query);
        return res.status(200).json({ success: true, message:'get data success', extra: result.rows});
    }catch(error){
        return res.status(500).json({message: error.message, success: false})
    }
    
}