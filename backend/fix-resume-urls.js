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
      let needsUpdate = false;
      
      // Normalize backslashes to forward slashes
      if (newUrl.includes('\\')) {
        newUrl = newUrl.replace(/\\/g, '/');
        needsUpdate = true;
        console.log(`Normalizing backslashes for ${row.id}: ${row.resumeUrl} -> ${newUrl}`);
      }
      
      // Fix paths that start with ./uploads/
      if (newUrl.startsWith('./uploads/')) {
        newUrl = newUrl.replace('./', '/');
        needsUpdate = true;
        console.log(`Fixing relative path for ${row.id}: ${row.resumeUrl} -> ${newUrl}`);
      }
      
      // Fix double path issues (uploads/resumes/uploads/resumes/...)
      if (newUrl.includes('uploads/resumes/uploads/resumes/')) {
        const filename = newUrl.split('/').pop();
        newUrl = `/uploads/resumes/${filename}`;
        needsUpdate = true;
        console.log(`Fixing double path for ${row.id}: ${row.resumeUrl} -> ${newUrl}`);
      }
      
      // Fix paths that contain uploads/resumes but should be just filename
      if (newUrl.includes('uploads/resumes/') && newUrl.split('/').length > 3) {
        const filename = newUrl.split('/').pop();
        newUrl = `/uploads/resumes/${filename}`;
        needsUpdate = true;
        console.log(`Fixing path structure for ${row.id}: ${row.resumeUrl} -> ${newUrl}`);
      }
      
      if (needsUpdate) {
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