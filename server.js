const express = require('express')
const server = express()

server.all('/', (req, res) => {
    res.send('бот запускается')
});

function keepAlive() {
    server.listen(3001, () => {
        console.log('сервер готов')
    })
}

module.exports = keepAlive