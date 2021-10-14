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

