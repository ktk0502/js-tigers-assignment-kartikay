const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Database connection configuration
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'vendor_management',
  password: process.env.DB_PASSWORD || '',
  port: parseInt(process.env.DB_PORT || '5432'),
});

async function setupDatabase() {
  try {
    console.log('Setting up PostgreSQL database...');
    
    // Read the schema file
    const schemaPath = path.join(process.cwd(), 'src/lib/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute the schema
    await pool.query(schema);
    
    console.log('✅ Database setup completed successfully!');
    console.log('📊 Tables created:');
    console.log('   - users (for authentication)');
    console.log('   - vendors (for vendor data)');
    console.log('   - Indexes and triggers');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase; 