const usersData = [
  { user_name: "van" },
  { user_name: "sanoo" },
]

exports.seed = async function (knex) {
  await knex('users').insert(usersData)
};
