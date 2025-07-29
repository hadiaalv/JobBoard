const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function debugUserRoles() {
  try {
    console.log('Debugging user roles in database...\n');
    const client = await pool.connect();
    
    // Get all users with their roles
    const users = await client.query(`
      SELECT id, email, "firstName", "lastName", role, "createdAt" 
      FROM users 
      ORDER BY "createdAt" DESC
    `);
    
    console.log('All users in database:');
    console.log('======================');
    users.rows.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName} (${user.email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Created: ${user.createdAt}`);
      console.log(`   ID: ${user.id}`);
      console.log('');
    });
    
    // Check role distribution
    const roleCounts = await client.query(`
      SELECT role, COUNT(*) as count 
      FROM users 
      GROUP BY role
    `);
    
    console.log('Role distribution:');
    console.log('==================');
    roleCounts.rows.forEach(row => {
      console.log(`${row.role}: ${row.count} users`);
    });
    
    // Check if there are any users with null or empty roles
    const nullRoles = await client.query(`
      SELECT id, email, "firstName", "lastName", role 
      FROM users 
      WHERE role IS NULL OR role = ''
    `);
    
    if (nullRoles.rows.length > 0) {
      console.log('\nUsers with null/empty roles:');
      console.log('============================');
      nullRoles.rows.forEach(user => {
        console.log(`${user.firstName} ${user.lastName} (${user.email}) - Role: "${user.role}"`);
      });
    }
    
    client.release();
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await pool.end();
  }
}

debugUserRoles();