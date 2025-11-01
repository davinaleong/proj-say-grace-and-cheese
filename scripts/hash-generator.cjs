/**
 * Simple Passphrase Hash Generator
 * 
 * Usage: node scripts/hash-generator.cjs [passphrase]
 * 
 * This script generates bcrypt hashes compatible with your application.
 * Uses 12 salt rounds to match your existing hash format.
 */

const bcrypt = require('bcryptjs');

async function generateHash(passphrase) {
  if (!passphrase) {
    console.error('❌ Error: Please provide a passphrase');
    console.log('Usage: node scripts/hash-generator.cjs "your-passphrase"');
    process.exit(1);
  }

  console.log('🔐 Generating bcrypt hash...');
  console.log(`Input: ${passphrase}`);
  console.log('Salt rounds: 12\n');

  try {
    // Generate hash with 12 salt rounds (same as your existing hash)
    const hash = await bcrypt.hash(passphrase, 12);
    
    console.log('✅ Hash generated successfully!');
    console.log('================================');
    console.log('Add this to your .env file:');
    console.log(`PASSWORD_HASH=${hash}`);
    console.log('================================\n');

    // Verify the hash works
    const isValid = await bcrypt.compare(passphrase, hash);
    console.log('🔍 Verification test:', isValid ? '✅ PASSED' : '❌ FAILED');
    
    if (isValid) {
      console.log('\n📝 Next steps:');
      console.log('1. Copy the PASSWORD_HASH line above');
      console.log('2. Update your .env or .env.local file');
      console.log('3. Restart your server');
    }

  } catch (error) {
    console.error('❌ Error generating hash:', error);
    process.exit(1);
  }
}

// Get passphrase from command line argument
const passphrase = process.argv[2];
generateHash(passphrase);