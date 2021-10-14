const router = require('express').Router()
const Users = require('./users-model')

router.get('/', (req, res, next) => {
    Users.getAll()
        .then(res => console.log(res))
        .catch(next)
})

module.exports = router
