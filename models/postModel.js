const db = require('../database');

module.exports = {
  insert: async (data) => (await db.query(`INSERT INTO posts ${db.insert(data)} RETURNING *`))[0],
  update: async (id, data) => (await db.query(`UPDATE posts ${db.update(data)} WHERE id = $1 RETURNING *`, [id]))[0],
  delete: async (id) => (await db.query('DELETE FROM posts WHERE id = $1 RETURNING id', [id]))[0],
  selectById: async (id) => (await db.query('SELECT * FROM posts WHERE id = $1', [id]))[0],
  selectAll: (page = 1) => {
    const limit = Number(100);
    const offset = Number(page - 1) * limit;
    return db.query(`SELECT * FROM posts LIMIT ${limit} OFFSET ${offset}`);
  },
};
