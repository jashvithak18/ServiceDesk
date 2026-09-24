import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { KnowledgeArticle } from '../models/KnowledgeArticle.js';
import { TicketCategory } from '../models/TicketCategory.js';
import { User } from '../models/User.js';

dotenv.config();

export const seedKbArticles = async () => {
  try {
    const existing = await KnowledgeArticle.countDocuments();
    if (existing > 0) {
      console.log(`[Seed KB] ${existing} articles already exist. Skipping seed.`);
      return;
    }

    const techUser = await User.findOne({ role: 'technician' });
    const categories = await TicketCategory.find();

    if (!techUser || categories.length === 0) {
      console.log('[Seed KB] Required users or categories missing. Skipping KB seed.');
      return;
    }

    const catHardware = categories.find((c) => c.name.includes('Hardware')) || categories[0];
    const catIam = categories.find((c) => c.name.includes('IAM')) || categories[0];
    const catSoftware = categories.find((c) => c.name.includes('Software')) || categories[0];

    const sampleArticles = [
      {
        title: 'Troubleshooting MacBook Pro External Display & HDMI Port Disconnects',
        body: `## Overview
When connecting a MacBook Pro to an external 4K monitor via USB-C or HDMI, display flickering or sudden signal loss may occur due to USB-C Alt Mode power negotiations or graphics driver caching.

## Resolution Steps
1. **Unplug & Reset Display Negotiation**: Unplug the HDMI cable, turn off external monitor power for 10 seconds, then reconnect.
2. **Reset NVRAM / PRAM**:
   - Shutdown the Mac completely.
   - Power on and hold **Option + Command + P + R** for 20 seconds.
3. **Verify Display Settings**:
   - Open *System Settings -> Displays*.
   - Set Refresh Rate to **60Hz** (or **50Hz** if using legacy HDMI 1.4 dongles).
   - Ensure resolution is set to *Default for Display*.

## Escalation Path
If port flickering persists across different certified HDMI 2.1 cables, schedule a hardware diagnostic test with IT Hardware Support.`,
        category: catHardware._id,
        tags: ['hardware', 'macbook', 'hdmi', 'display', 'apple'],
        createdBy: techUser._id,
        upvotes: 42,
        views: 189,
      },
      {
        title: 'Corporate VPN SSL Handshake Timeout & DNS Resolution Guide',
        body: `## Symptom
Users attempting to connect to the corporate WireGuard/OpenVPN tunnel receive error code \`TLS_ERR_HANDSHAKE_TIMEOUT\` or fail to resolve internal \`.internal.acme.com\` domain names.

## Quick Fix Checklist
1. **Flush Local DNS Resolver Cache**:
   - **macOS**: Run \`sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder\`
   - **Windows**: Open Command Prompt as Admin and run \`ipconfig /flushdns\`
2. **Verify UDP Port 4500 & 1194**:
   - Ensure home router or local firewall is not blocking outbound UDP packets.
3. **Re-import VPN Client Config Profile**:
   - Download fresh WireGuard config from \`https://vpn.servicedesk.com/profile\`.`,
        category: catIam._id,
        tags: ['vpn', 'network', 'iam', 'dns', 'security'],
        createdBy: techUser._id,
        upvotes: 68,
        views: 312,
      },
      {
        title: 'IntelliJ IDEA & JetBrains Ultimate License Seat Provisioning',
        body: `## Developer SaaS License Policy
All full-time software engineers and DevOps technicians are eligible for JetBrains All Products Pack licenses managed under our Enterprise Portal.

## How to Request Seat Access
1. Submit a Support Ticket under **Software & Application License**.
2. Provide your work email address and team lead approval ticket link.
3. Once approved, open IntelliJ IDEA, select *Activate License*, and choose *JB Account / SSO Login*.`,
        category: catSoftware._id,
        tags: ['software', 'jetbrains', 'license', 'developer', 'saas'],
        createdBy: techUser._id,
        upvotes: 29,
        views: 145,
      },
    ];

    for (const a of sampleArticles) {
      await KnowledgeArticle.create(a);
      console.log(`[Seed KB] Created article: ${a.title}`);
    }
  } catch (err) {
    console.error('[Seed KB Error]', err.message);
  }
};

// Run directly if invoked from CLI
if (process.argv[2] === '--run') {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/servicedesk_pro')
    .then(async () => {
      console.log('[Seed] Database connected...');
      await seedKbArticles();
      console.log('[Seed] KB seeding complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed Error]', err);
      process.exit(1);
    });
}
