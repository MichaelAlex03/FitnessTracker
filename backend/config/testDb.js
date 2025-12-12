const { Pool } = require('pg')

const testPool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'testdb',
    user: 'testuser',
    password: 'testpass'
})

module.exports = testPool