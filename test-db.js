const pool = require('./db');

async function testDatabase() {
  try {
    const result = await pool.query('SELECT NOW()');

    console.log('Database Connected Successfully!');
    console.log(result.rows);
  } catch (error) {
    if (error.code === 'ENOTFOUND') {
      console.error(
        'Database Connection Failed: the database host could not be resolved. Check your network access or verify the DATABASE_URL host.'
      );
    } else {
      console.error('Database Connection Failed:', error.message);
    }

    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

testDatabase();
