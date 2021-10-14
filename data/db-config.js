const knex = require('knex')

const development = process.env.NODE_ENV || 'development'

const config = require('../knexfile')

module.exports = knex(config[development])
