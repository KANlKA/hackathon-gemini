#!/usr/bin/env node

/**
 * Environment Variables Checker
 * Validates that all required environment variables are set
 */

const requiredEnvVars = [
  'MONGODB_URI',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'UPSTASH_REDIS_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'YOUTUBE_API_KEY',
  'GEMINI_API_KEY',
  'AUTH_SECRET',
  'MAILJET_API_KEY',
  'MAILJET_SECRET_KEY',
  'MAILJET_SENDER_EMAIL',
  'NEXT_PUBLIC_APP_URL',
  'CRON_SECRET',
  'UNSUBSCRIBE_SECRET',
];

const optionalEnvVars = [
  'NODE_ENV',
  'AUTH_GOOGLE_ID',
  'AUTH_GOOGLE_SECRET',
];

console.log('🔍 Checking environment variables...\n');

let allSet = true;
let missingVars = [];

// Check required variables
console.log('Required variables:');
requiredEnvVars.forEach((varName) => {
  const isSet = !!process.env[varName];
  const status = isSet ? '✅' : '❌';
  console.log(`  ${status} ${varName}`);

  if (!isSet) {
    allSet = false;
    missingVars.push(varName);
  }
});

// Check optional variables
console.log('\nOptional variables:');
optionalEnvVars.forEach((varName) => {
  const isSet = !!process.env[varName];
  const status = isSet ? '✅' : '⚠️ ';
  console.log(`  ${status} ${varName}`);
});

// Summary
console.log('\n' + '='.repeat(50));
if (allSet) {
  console.log('✅ All required environment variables are set!');
  console.log('You can proceed with deployment.');
  process.exit(0);
} else {
  console.log('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.log(`   - ${varName}`));
  console.log('\nPlease set these variables before deploying.');
  console.log('See .env.example for reference.');
  process.exit(1);
}
