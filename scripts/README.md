# Hash Generator Scripts

This directory contains utilities for generating bcrypt password hashes compatible with the Say Grace and Cheese application.

## Usage

### Method 1: Simple Hash Generator (Recommended)
```bash
npm run hash "your-passphrase-here"
```

### Method 2: Interactive Hash Generator
```bash
npm run generate-hash
# You'll be prompted to enter the passphrase
```

### Method 3: Direct Node.js execution
```bash
node scripts/hash-generator.cjs "your-passphrase-here"
```

## Features

- **Compatible salt rounds**: Uses 12 salt rounds to match your existing hash format (`$2b$12$...`)
- **Automatic verification**: Tests the generated hash to ensure it works
- **Ready-to-use output**: Provides the exact line to add to your `.env` file
- **Security**: Uses the same bcryptjs library as your application

## Example Output

```
🔐 Generating bcrypt hash...
Input: mypassword
Salt rounds: 12

✅ Hash generated successfully!
================================
Add this to your .env file:
PASSWORD_HASH=$2b$12$newHashWillAppearHere...
================================

🔍 Verification test: ✅ PASSED
```

## Next Steps

1. Copy the `PASSWORD_HASH=...` line from the output
2. Update your `.env` or `.env.local` file
3. Restart your development server
4. Test the new passphrase in your application

## Security Notes

- The hash generator uses the same parameters as your existing system
- Generated hashes are immediately tested for compatibility
- Keep your `.env` files secure and never commit them to version control