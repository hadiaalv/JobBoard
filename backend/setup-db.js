require('dotenv').config();
const { Client } = require('pg');

async function setupDatabase() {
  console.log('🔧 Setting up database...');
  
  const config = {
    host: 'localhost',
    port: 5432,
    database: 'jobboard',
    user: 'postgres',
    password: 'postgres'
  };

  let client = null;

  try {
    // Connect to PostgreSQL
    client = new Client(config);
    await client.connect();
    console.log('✅ Connected to PostgreSQL');

    // Check if database exists
    const dbExists = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'jobboard'"
    );

    if (dbExists.rows.length === 0) {
      console.log('📦 Creating database...');
      await client.query('CREATE DATABASE jobboard');
      console.log('✅ Database created');
    } else {
      console.log('✅ Database already exists');
    }

    // Connect to the jobboard database
    await client.end();
    client = new Client({
      ...config,
      database: 'jobboard'
    });
    await client.connect();

    // Create tables if they don't exist
    console.log('📋 Creating tables...');
    
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR UNIQUE NOT NULL,
        password VARCHAR NOT NULL,
        "firstName" VARCHAR NOT NULL,
        "lastName" VARCHAR NOT NULL,
        role VARCHAR NOT NULL DEFAULT 'job_seeker',
        company VARCHAR,
        bio TEXT,
        skills TEXT,
        experience VARCHAR,
        avatar VARCHAR,
        resume VARCHAR,
        location VARCHAR,
        phone VARCHAR,
        website VARCHAR,
        education VARCHAR,
        interests VARCHAR,
        languages VARCHAR,
        certifications VARCHAR,
        projects VARCHAR,
        linkedin VARCHAR,
        github VARCHAR,
        portfolio VARCHAR,
        "yearsOfExperience" INTEGER,
        "preferredWorkType" VARCHAR,
        "salaryExpectation" VARCHAR,
        availability VARCHAR,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS jobs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title VARCHAR NOT NULL,
        description TEXT NOT NULL,
        company VARCHAR NOT NULL,
        location VARCHAR,
        "salaryMin" INTEGER,
        "salaryMax" INTEGER,
        type VARCHAR DEFAULT 'full_time',
        "experienceLevel" VARCHAR DEFAULT 'mid',
        skills TEXT[],
        benefits TEXT[],
        "applicationDeadline" TIMESTAMP,
        "isActive" BOOLEAN DEFAULT true,
        "postedBy" UUID REFERENCES users(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS applications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        "coverLetter" TEXT,
        "resumeFilename" VARCHAR,
        "resumeUrl" VARCHAR,
        status VARCHAR DEFAULT 'pending',
        notes TEXT,
        "applicantId" UUID REFERENCES users(id) ON DELETE CASCADE,
        "jobId" UUID REFERENCES jobs(id) ON DELETE CASCADE,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR NOT NULL,
        email VARCHAR NOT NULL,
        subject VARCHAR NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR DEFAULT 'pending',
        "repliedBy" VARCHAR,
        "repliedAt" TIMESTAMP,
        "createdAt" TIMESTAMP DEFAULT NOW(),
        "updatedAt" TIMESTAMP DEFAULT NOW()
      );
    `);

    console.log('✅ All tables created successfully');

    // Check if we have any users
    const userCount = await client.query('SELECT COUNT(*) FROM users');
    console.log(`📊 Current users in database: ${userCount.rows[0].count}`);

    console.log('🎉 Database setup completed successfully!');

  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    throw error;
  } finally {
    if (client) {
      await client.end();
    }
  }
}

setupDatabase().catch(console.error); 