const request = require('supertest')
const server = require('../api/server')
const db = require('../data/db-config')
const User = require('./users/users-model')


////////////////////////////////////////////
////////////////////////////////////////////
////        USERS MODEL            /////////



beforeAll(async () => {
    await db.migrate.rollback()
    await db.migrate.latest()
})

beforeEach(async () => {
    await db.seed.run()
})

afterAll(async () => {
    await db.destroy()
})

describe('sanity check', () => {
    expect(process.env.NODE_ENV).toBe('testing')
})

describe('[1] User.getAll()', () => {
    let actual
    beforeEach(async () => {
        actual = await User.getAll()
    })
    it('returns array of users with correct length', async () => {
        expect(actual).toHaveLength(2)
    })
    it('returns array of users with correct objects', async () => {
        expect(actual[0]).toMatchObject({ user_name: 'van' })
        expect(actual[1]).toMatchObject({ user_name: 'sanoo' })
        expect(actual).toMatchObject([{ id: 1, user_name: 'van' }, { id: 2, user_name: 'sanoo' }])
    })
})

describe('[2] User.getById()', () => {
    let actual
    beforeEach(async () => {
        actual = await User.getById(1)
    })

    it('returns the correct object', async () => {
        expect(actual).toMatchObject({ id: 1, user_name: 'van' })
        expect(actual['user_name']).toBe('van')
        expect(actual['id']).toBe(1)

        actual = await User.getById(2)
        expect(actual).toMatchObject({ id: 2, user_name: 'sanoo' })
        expect(actual['user_name']).toBe('sanoo')
        expect(actual['id']).toBe(2)

    })
})

describe('[3] User.create()', () => {
    let newUser
    let input
    beforeEach(async () => {
        input = { user_name: "kumar" }
        newUser = await User.create(input)
    })

    it('returns newly created user', () => {
        expect(newUser).toMatchObject({ id: 3, user_name: "kumar" })
        expect(newUser).toMatchObject({ user_name: "kumar" })
    })
    it('should have the array of users with correct length', async () => {
        const users = await db('users')
        expect(users).toHaveLength(3)
    })
})

describe('[4] User.remove()', () => {
    let actual
    beforeEach(async () => {
        actual = await User.remove(1)
    })
    it('returns the user just removed', () => {
        expect(actual).toMatchObject({ id: 1, user_name: 'van' })
        expect(actual).toMatchObject({ user_name: 'van' })
    })
    it('users data has the correct length', async () => {
        const users = await db("users")
        expect(users).toHaveLength(1)
    })
})


////////////////////////////////////////////
////////////////////////////////////////////
////        TESTING ENDPOINTS      /////////

describe('[5] GET /api/users', () => {
    let response
    beforeEach(async () => {
        response = await request(server).get('/api/users')
    })
    it('returns status 200 OK', async () => {
        expect(response.status).toBe(200)
    })
    it('returns JSON body with the correct users array', () => {
        expect(response.body).toHaveLength(2)
    })
    it('returns JSON as type of res.body', () => {
        expect(response.type).toBe('application/json')
    })
})
describe('[6] POST /api/users', () => {
    let res
    it('returns status 400 if missing user_name', async () => {
        res = await request(server).post('/api/users').send()
        expect(res.status).toBe(400)
    })
    it('returns message: "invalid username" if missing user_name', async () => {
        res = await request(server).post('/api/users').send()
        expect(res.body).toMatchObject({ "message": "invalid username" })
    })
    it('returns status 400 with message "invalid username" if user_name is not a string', async () => {
        res = await request(server).post('/api/users').send({ user_name: 1234 })
        expect(res.status).toBe(400)
        expect(res.body).toMatchObject({ "message": "invalid username" })
    })
    it('returns status 400 with message "invalid username" if user_name is an empty string', async () => {
        res = await request(server).post('/api/users').send({ user_name: "" })
        expect(res.status).toBe(400)
        expect(res.body).toMatchObject({ "message": "invalid username" })
    })
    it('returns status 400 with message "username already taken" if giving an existing username', async () => {
        res = await request(server).post('/api/users').send({ user_name: "sanoo" })
        expect(res.status).toBe(400)
        expect(res.body).toMatchObject({ "message": "username already taken" })
    })
    it('returns status 201 with a newly created user', async () => {
        res = await request(server).post('/api/users').send({ user_name: "foo" })
        expect(res.status).toBe(201)
        expect(res.body).toMatchObject({ user_name: "foo" })
    })
})
