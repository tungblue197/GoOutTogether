const express = require('express');
const next = require('next');
const { Server } = require('socket.io');
const http = require('http');

const port = 3000;
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()


const { Pool } = require('pg');
const pool = new Pool({
    host: 'ec2-35-153-114-74.compute-1.amazonaws.com',
    database: 'ddkbvpgj5n8mt0',
    port: 5432,
    user: 'rwjnldekephezm',
    password: '210a329c5e9561aa1b8319962101d3604790e515243164f719b5337858328bf1',
    ssl: { rejectUnauthorized: false }
});


app.prepare().then(() => {
    const expresApp = express();
    expresApp.all('*', (req, res) => {
        return handle(req, res)
    });
    let groups = {};
    let votes = {

    }
    const server = http.createServer(expresApp);

    const io = new Server(server);
    io.on('connection', socket => {
        socket.on('join-vote', async ({ uId, groupId }) => {
            let result = null;
            if (!groups[groupId] || !groups[groupId].some(user => user.id === uId)) {
                result = await pool.query('select * from users where id = $1 limit 1', [uId]);
            }
            if (result && result.rowCount > 0) {
                if (!groups[groupId] || !groups[groupId].length) groups[groupId] = result.rows;
                if (!groups[groupId].some(user => user.id === uId)) groups[groupId].push(result.rows[0]);
            }
            io.sockets.emit('join-vote-success', { group: groups[groupId] });

        });


        socket.on('user-disconect', ({ uId, groupId }) => {
            if (!groups[groupId]) return;
            const usersRemaing = groups[groupId].filter(user => user.id !== uId);
            groups[groupId] = usersRemaing;
            io.sockets.emit('user-disconected', { usersRemaing });
        })
        //votes
        socket.on('vote', ({ uId, groupId, idPlace }) => {
            console.log('vote ', uId, groupId, idPlace);
            if (!votes[groupId]) votes[groupId] = [{ userId: uId, votePlace: idPlace }];
            const isVoted = votes[groupId].some(item => item.userId === uId);
            if (isVoted) {
                votes[groupId] = votes[groupId].map(item => {
                    if (item.userId === uId) return { ...item, votePlace: idPlace }
                    return item;
                })
            }else{
                votes[groupId].push({ userId: uId, votePlace: idPlace });
            }
            console.log('votes[groupId] : ', votes[groupId]);
            io.sockets.emit('voted', { votes: votes[groupId] });
        })
    });


    server.listen(port, () => {
        console.log('server ready with port ', port)

    })
})