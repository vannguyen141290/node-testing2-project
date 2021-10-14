const router = require('express').Router()
const Users = require('./users-model')

router.get('/', (req, res, next) => {
    Users.getAll()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(next)
})

async function checkIfUsernameTaken(req, res, next) {
    const { user_name } = req.body
    const isExist = await Users.findBy({ user_name }).first()
    if (isExist) {
        next({
            status: 400,
            message: 'username already taken'
        })
    } else {
        next()
    }
}
async function checkPayload(req, res, next) {
    const { user_name } = req.body
    if (user_name === undefined || typeof user_name !== "string" || user_name.trim() === '') {
        next({
            status: 400,
            message: 'invalid username'
        })
    } else {
        next()
    }

}

router.post('/', checkPayload, checkIfUsernameTaken, (req, res, next) => {
    Users.create(req.body)
        .then(newUser => {
            res.status(201).json(newUser)
        })
        .catch(next)
})

module.exports = router
