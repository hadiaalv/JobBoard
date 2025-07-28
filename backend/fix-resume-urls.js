const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function fixResumeUrls() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    // Get all applications with resumeUrl
    const result = await client.query(
      'SELECT id, "resumeUrl" FROM applications WHERE "resumeUrl" IS NOT NULL'
    );
    
    console.log(`Found ${result.rows.length} applications with resume URLs`);
    
    for (const row of result.rows) {
      let newUrl = row.resumeUrl;
      
      // Fix paths that start with ./uploads/
      if (newUrl.startsWith('./uploads/')) {
        newUrl = newUrl.replace('./', '/');
        console.log(`Fixing ${row.id}: ${row.resumeUrl} -> ${newUrl}`);
        
        await client.query(
          'UPDATE applications SET "resumeUrl" = $1 WHERE id = $2',
          [newUrl, row.id]
        );
      }
    }
    
    console.log('Resume URL fix completed!');
    client.release();
  } catch (error) {
    console.error('Error fixing resume URLs:', error);
  } finally {
    await pool.end();
  }
}

fixResumeUrls(); 