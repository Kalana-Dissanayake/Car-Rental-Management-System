/**
 * Admin User Seeder Script
 *
 * Creates the initial admin user from environment variables.
 * Run once with:  npx ts-node --project tsconfig.json scripts/seed.ts
 *
 * Requires: MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD in .env.local
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error('❌  Missing required environment variables.');
  console.error('    Ensure MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD are set in .env.local');
  process.exit(1);
}

const AdminUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
}, { timestamps: true });

async function seed() {
  console.log('🌱  Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI!);

  const AdminUser = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);

  const existing = await AdminUser.findOne({ email: ADMIN_EMAIL!.toLowerCase() });
  if (existing) {
    console.log(`✅  Admin user "${ADMIN_EMAIL}" already exists. No action taken.`);
    await mongoose.disconnect();
    return;
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD!, salt);

  await AdminUser.create({
    email: ADMIN_EMAIL!.toLowerCase(),
    password: hashedPassword,
  });

  console.log(`✅  Admin user "${ADMIN_EMAIL}" created successfully!`);
  console.log('🔒  Password stored with bcrypt (12 salt rounds)');
  await mongoose.disconnect();
  console.log('👋  Done. Disconnected from MongoDB.');
}

seed().catch((err) => {
  console.error('❌  Seeding failed:', err);
  process.exit(1);
});
