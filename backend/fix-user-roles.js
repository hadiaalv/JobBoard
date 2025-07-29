const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function fixUserRoles() {
  try {
    console.log('Fixing user roles...\n');
    const client = await pool.connect();
    
    // List of emails that should be employers
    const employerEmails = [
      'hadiaalvi18@gmail.com',
      'hadia@proton.me', 
      'hadiaalvi18@proton.me'
      // Add any other emails that should be employers
    ];
    
    console.log('Updating the following emails to employer role:');
    employerEmails.forEach(email => console.log(`- ${email}`));
    
    // Update each email to employer role
    for (const email of employerEmails) {
      const result = await client.query(
        'UPDATE users SET role = $1 WHERE email = $2 RETURNING id, email, "firstName", "lastName", role',
        ['employer', email]
      );
      
      if (result.rows.length > 0) {
        const user = result.rows[0];
        console.log(`✅ Updated: ${user.firstName} ${user.lastName} (${user.email}) -> ${user.role}`);
      } else {
        console.log(`❌ User not found: ${email}`);
      }
    }
    
    // Show final state
    console.log('\nFinal user list:');
    const users = await client.query(`
      SELECT id, email, "firstName", "lastName", role, "createdAt" 
      FROM users 
      ORDER BY "createdAt" DESC
    `);
    
    users.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role}`);
    });
    
    client.release();
  } catch (error) {
    console.error('Error fixing user roles:', error);
  } finally {
    await pool.end();
  }
}

fixUserRoles();