// Update with your config settings.

const shared = {
  client: 'sqlite3',
  useNullAsDefault: true,
  migrations: { directory: './data/migrations' },
  seeds: { directory: './data/seeds' }
}

module.exports = {

  development: {
    ...shared,
    connection: {
      filename: './data/users.db3'
    }

  },
  testing: {
    ...shared,
    connection: {
      filename: './data/test.db3'
    }
  },
  production: {}

};
