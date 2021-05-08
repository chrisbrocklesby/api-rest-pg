const { Pool } = require('pg');
const config = require('./config');

const pool = new Pool({
  host: config.database.host || 'localhost',
  database: config.database.name,
  user: config.database.user,
  password: config.database.password,
  port: config.database.port || 5432,
});

module.exports = {
  query: async (text = '', values = []) => (await pool.query(text, values)).rows,
  insert: (data = {}) => {
    const columns = Object.keys(data).toString();
    const values = Object.values(data).map((item) => `'${item.toString().replace(/'/g, "''")}'`);
    return `(${columns}) VALUES (${values})`;
  },
  update: (data = {}) => {
    let sql = 'SET ';
    const columns = Object.keys(data);
    const values = Object.values(data);
    columns.forEach((column, index) => {
      sql += `"${column}"=${
        (typeof values[index] === 'string')
          ? `'${values[index].toString().replace(/'/g, "''")}'`
          : values[index]},`;
    });
    return sql.slice(0, -1);
  },
};
