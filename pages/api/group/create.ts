import type { NextApiRequest, NextApiResponse } from 'next'
import * as yup from 'yup';
import pool, { client } from 'db';
import { Group } from 'types/group';
import { v4 as uuidv4 } from 'uuid';


type Data = {
    message?: string,
    extra?: any
}

const groupSchema = yup.object().shape({
    timeOut: yup.number().required(),
    title: yup.string().required(),
    content: yup.string().required(),
    locations: yup.string().required(),
});



const setInitValue = (value: Group) => {
    value.createdTime = new Date().getTime().toString();
    value.id = uuidv4()

}


export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
    try {
        if (req.method !== 'POST') {
            res.json({ message: 'API notfound' });
        }
        const { uid } = req.headers;
        let value = req.body as Group;
        console.log('value of post : ,', value);
        await groupSchema.validate(req.body);
        const insertQuery = `insert into sgroup (id, "createdBy", "createdTime", "timeOut", title, content, locations) values($1, $2, $3, $4, $5, $6, $7)`;
        setInitValue(value);
        console.log('uid : ', uid);
        if (uid && typeof uid === 'string') value.createdBy = uid;
        const { createdBy = 'tinmg', createdTime = new Date().getTime().toString(), timeOut, title, content, locations, id } = value;
        await pool.connect();
        const result = await pool.query(insertQuery, [id, createdBy, createdTime, timeOut, title, content, locations]);
        if (result.rowCount) {
            return res.json({ message: 'insert success', extra: value })
        }
        res.json({ message: 'insert false' });

    } catch (error) {
        console.log('error here : ', error);
        res.json({ message: error.message + 'hello' });
    }

}