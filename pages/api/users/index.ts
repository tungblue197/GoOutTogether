import type { NextApiRequest, NextApiResponse } from 'next'
import { User } from 'types/user';
import { pool } from 'db';
import * as yup from 'yup';
import { v4 as uuidv4 } from 'uuid';
type Data = {
    message: string,
    extra?: any,
    success: boolean
}


const userSchema = yup.object().shape({
    name: yup.string().required(),
    location: yup.string().required()
});


const setInitUserValue = (value: User) => {
    value.id = uuidv4();
}

export default async function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        if (req.method === 'POST') {
            const user = req.body as User;
            await userSchema.validate(user);
            const query = `insert into users(id, name, location) values($1, $2, $3)`;
            setInitUserValue(user);
            const { name, location, id } = user;
            await pool.connect();
            var result = await pool.query(query, [id, name, location]);
            if(result.rowCount) return res.json({ message: 'insert user success', extra: user,success: true });
            return res.json({ message: 'insert user false', success: false });
        } else if (req.method === 'GET') {
            
        } else if (req.method === 'DELETE') {
    
        } else if (req.method === 'PUT') {
    
        }
    } catch (error) {
        res.json({ message: error.message, success: false });
    }
    
}