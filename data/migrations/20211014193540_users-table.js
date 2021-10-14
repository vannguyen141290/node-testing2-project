
exports.up = async function (knex) {
    await knex.schema.createTable('users', tbl => {
        tbl.increments()
        tbl.text('user_name')
    })
};

exports.down = async function (knex) {
    await knex.schema.dropTableIfExists('users')
};
