const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const userRouter = require('./users/users-router')


const server = express()

server.use(helmet())
server.use(express.json())
server.use(cors())

server.use('/api/users', userRouter)

server.get('/', (req, res) => {
    console.log('hello')
})
server.get('*', (req, res, next) => {
    next({
        status: 404,
        message: `endpoint ${req.originalUrl} not built yet!`
    })
})

server.use((err, req, res, next) => {
      res.status(err.status || 500).json({
        message: err.message
    })
})

module.exports = server
