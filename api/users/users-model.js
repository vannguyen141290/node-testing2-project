const db = require('../../data/db-config')

function getAll() {
    return db('users')
}
function getById(id) {
    return db('users').where('id', id).first()
}

function findBy(filter) {
    return db('users').where(filter)

}

async function create(user) {
    const [id] = await db('users').insert(user)
    return await getById(id)
}


async function remove(id) {
    const removed = await getById(id)
    await db('users').where('id', id).del()
    return removed
}


module.exports = {
    getAll,
    getById,
    create,
    remove, findBy
}
