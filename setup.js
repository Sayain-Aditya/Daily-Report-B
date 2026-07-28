import 'dotenv/config';
import mongoose from 'mongoose';
import Firm from './models/Firm.js';
import User from './models/User.js';
import Entry from './models/Entry.js';

function makeCode(len = 6) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < len; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

async function setup() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB');

  // 1. Create firm
  const inviteCode = makeCode(6);
  const firm = await Firm.create({ name: 'BKT Sales', inviteCode });
  console.log(`\n✅ Firm created: ${firm.name}`);
  console.log(`   Invite code: ${inviteCode}  (share this link: /join/${inviteCode})`);

  // 2. Create owner
  const ownerAccessCode = makeCode(6);
  const owner = await User.create({
    name: 'Aditya',
    firmId: firm._id,
    accessCode: ownerAccessCode,
    isOwner: true,
  });
  console.log(`\n✅ Owner account created`);
  console.log(`   Name: ${owner.name}`);
  console.log(`   Access code: ${ownerAccessCode}  ← SAVE THIS`);

  // 3. Migrate existing entries to a "legacy" user
  const legacyCount = await Entry.countDocuments({ userId: { $exists: false } });
  if (legacyCount > 0) {
    const legacyAccessCode = makeCode(6);
    const legacyUser = await User.create({
      name: 'Legacy Data',
      firmId: firm._id,
      accessCode: legacyAccessCode,
      isOwner: false,
    });
    await Entry.updateMany(
      { userId: { $exists: false } },
      { $set: { userId: legacyUser._id, firmId: firm._id } }
    );
    console.log(`\n✅ Migrated ${legacyCount} existing entries to legacy user`);
  } else {
    console.log('\n   No existing entries to migrate');
  }

  console.log('\n🎉 Setup complete. Add JWT_SECRET to your .env if not already set.\n');
  await mongoose.disconnect();
}

setup().catch((err) => { console.error(err); process.exit(1); });
