/**
 * Debug Hash Verification
 * 
 * This script helps debug hash generation and verification issues.
 * It will test the hash from your .env file against a provided passphrase.
 */

const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env');
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    const env = {};
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key && valueParts.length > 0) {
          env[key] = valueParts.join('=');
        }
      }
    }
    
    return env;
  } catch (error) {
    console.error('Error reading .env file:', error);
    return {};
  }
}

async function debugHash() {
  console.log('🔍 Hash Verification Debug Tool');
  console.log('================================');
  
  // Load environment
  const env = loadEnvFile();
  const storedHash = env.PASSWORD_HASH;
  
  console.log('Environment file loaded from: .env');
  console.log('Stored hash:', storedHash || 'NOT FOUND');
  console.log();
  
  if (!storedHash) {
    console.error('❌ No PASSWORD_HASH found in .env file');
    return;
  }
  
  // Get passphrase from command line
  const testPassphrase = process.argv[2];
  if (!testPassphrase) {
    console.error('❌ Please provide a passphrase to test');
    console.log('Usage: node scripts/debug-hash.cjs "your-passphrase"');
    return;
  }
  
  console.log(`Testing passphrase: "${testPassphrase}"`);
  console.log();
  
  try {
    // Test the comparison
    const isValid = await bcrypt.compare(testPassphrase, storedHash);
    
    console.log('🔍 Hash Details:');
    console.log(`Algorithm: ${storedHash.substring(0, 4)}`);
    console.log(`Salt rounds: ${storedHash.split('$')[2]}`);
    console.log();
    
    console.log('🧪 Verification Result:');
    console.log(`Passphrase: "${testPassphrase}"`);
    console.log(`Valid: ${isValid ? '✅ YES' : '❌ NO'}`);
    
    if (!isValid) {
      console.log();
      console.log('🔧 Troubleshooting:');
      console.log('1. Make sure you\'re testing the exact passphrase used to generate the hash');
      console.log('2. Check for extra spaces or special characters');
      console.log('3. Verify the hash was copied correctly to .env');
      console.log('4. Try generating a new hash with: npm run hash "your-passphrase"');
    }
    
  } catch (error) {
    console.error('❌ Error during verification:', error);
  }
}

async function generateNewHash() {
  const passphrase = process.argv[3];
  if (!passphrase) {
    console.log('No passphrase provided for new hash generation');
    return;
  }
  
  console.log();
  console.log('🔄 Generating fresh hash for comparison...');
  
  try {
    const newHash = await bcrypt.hash(passphrase, 12);
    console.log(`New hash: ${newHash}`);
    
    const verification = await bcrypt.compare(passphrase, newHash);
    console.log(`New hash verification: ${verification ? '✅ WORKS' : '❌ FAILED'}`);
  } catch (error) {
    console.error('Error generating new hash:', error);
  }
}

// Run debug
debugHash().then(() => {
  if (process.argv[3]) {
    generateNewHash();
  }
});