#!/usr/bin/env node

/**
 * Passphrase Hash Generator Utility
 * 
 * This utility generates bcrypt hashes that are compatible with the 
 * verification system used in the Say Grace and Cheese application.
 * 
 * Usage:
 *   node scripts/generate-hash.js [passphrase]
 *   npm run generate-hash [passphrase]
 * 
 * If no passphrase is provided, you'll be prompted to enter one.
 */

import bcrypt from 'bcryptjs';
import readline from 'readline';

// Salt rounds - matches the existing hash format ($2b$12$...)
const SALT_ROUNDS = 12;

/**
 * Generate a bcrypt hash for the given passphrase
 * @param {string} passphrase - The passphrase to hash
 * @returns {Promise<string>} The bcrypt hash
 */
async function generateHash(passphrase) {
  try {
    const hash = await bcrypt.hash(passphrase, SALT_ROUNDS);
    return hash;
  } catch (error) {
    console.error('Error generating hash:', error);
    process.exit(1);
  }
}

/**
 * Verify that the generated hash works with bcrypt.compare
 * @param {string} passphrase - Original passphrase
 * @param {string} hash - Generated hash
 * @returns {Promise<boolean>} Whether verification succeeds
 */
async function verifyHash(passphrase, hash) {
  try {
    return await bcrypt.compare(passphrase, hash);
  } catch (error) {
    console.error('Error verifying hash:', error);
    return false;
  }
}

/**
 * Prompt user for passphrase input (hidden)
 * @returns {Promise<string>} The entered passphrase
 */
function promptForPassphrase() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Hide input for security
    rl.stdoutMuted = true;
    
    rl._writeToOutput = function _writeToOutput(stringToWrite) {
      if (rl.stdoutMuted) {
        rl.output.write('*');
      } else {
        rl.output.write(stringToWrite);
      }
    };

    rl.question('Enter passphrase: ', (passphrase) => {
      rl.close();
      console.log(); // New line after hidden input
      resolve(passphrase);
    });
  });
}

/**
 * Main function
 */
async function main() {
  console.log('🔐 Passphrase Hash Generator');
  console.log('================================');
  console.log(`Salt rounds: ${SALT_ROUNDS}`);
  console.log('Hash format: bcrypt ($2b$)\n');

  let passphrase = process.argv[2];

  if (!passphrase) {
    passphrase = await promptForPassphrase();
  }

  if (!passphrase || passphrase.trim() === '') {
    console.error('❌ Error: Passphrase cannot be empty');
    process.exit(1);
  }

  console.log('⏳ Generating hash...\n');

  const hash = await generateHash(passphrase);
  
  console.log('✅ Hash generated successfully!');
  console.log('================================');
  console.log('Add this to your .env file:');
  console.log(`PASSWORD_HASH=${hash}`);
  console.log('================================\n');

  // Verify the hash works
  console.log('🔍 Verifying hash...');
  const isValid = await verifyHash(passphrase, hash);
  
  if (isValid) {
    console.log('✅ Hash verification successful!');
    console.log('This hash is compatible with your application.\n');
  } else {
    console.error('❌ Hash verification failed!');
    console.error('Something went wrong during generation.\n');
    process.exit(1);
  }

  console.log('📝 Instructions:');
  console.log('1. Copy the PASSWORD_HASH line above');
  console.log('2. Replace the existing hash in your .env or .env.local file');
  console.log('3. Restart your development server');
  console.log('4. Test the new passphrase in your application\n');
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled error:', error);
  process.exit(1);
});

// Run the script
main().catch((error) => {
  console.error('❌ Script error:', error);
  process.exit(1);
});