const sql = require('../database');

module.exports = {
  insert: async (data) => (await sql.query(`INSERT INTO users ${sql.insert(data)} RETURNING id, token`))[0],
  update: async (id, data) => (await sql.query(`UPDATE users ${sql.update(data)} WHERE id = $1 RETURNING *`, [id]))[0],
  selectById: async (id) => (await sql.query('SELECT * FROM users WHERE id = $1', [id]))[0],
  selectByEmail: async (email) => (await sql.query('SELECT * FROM users WHERE email = $1', [email]))[0],
};
