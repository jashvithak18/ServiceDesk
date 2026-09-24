import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { Organization } from '../models/Organization.js';
import { Department } from '../models/Department.js';
import { TicketCategory } from '../models/TicketCategory.js';
import { SLAPolicy } from '../models/SLAPolicy.js';

dotenv.config();

export const seedAdminData = async () => {
  try {
    // 1. Organization
    let org = await Organization.findOne({ domain: 'servicedesk.com' });
    if (!org) {
      org = await Organization.create({
        name: 'Acme Enterprise Operations',
        domain: 'servicedesk.com',
        settings: {
          businessHours: { start: '09:00', end: '18:00', timezone: 'UTC' },
          workDays: [1, 2, 3, 4, 5],
        },
      });
      console.log('[Seed] Organization created:', org.name);
    }

    // 2. Departments
    const deptsToSeed = [
      { name: 'IT Infrastructure & Support', code: 'IT', description: 'Hardware, helpdesk support, network & cloud infrastructure' },
      { name: 'Human Resources & Talent', code: 'HR', description: 'Employee onboarding, payroll, benefits, and HR requests' },
      { name: 'Finance & Procurement', code: 'FIN', description: 'Financial software, software licenses, vendor billing' },
      { name: 'Engineering & DevOps', code: 'DEV', description: 'Developer tools, CI/CD pipelines, production infrastructure' },
    ];

    const deptMap = {};
    for (const d of deptsToSeed) {
      let dept = await Department.findOne({ code: d.code });
      if (!dept) {
        dept = await Department.create(d);
        console.log(`[Seed] Department created: ${dept.name} (${dept.code})`);
      }
      deptMap[d.code] = dept._id;
    }

    // 3. Categories
    const categoriesToSeed = [
      { name: 'Hardware & Laptop Provisioning', description: 'Laptop repairs, monitors, peripherals & upgrades', defaultPriority: 'high', departmentCode: 'IT' },
      { name: 'Identity & Access Management (IAM)', description: 'Password resets, SSO, VPN access, multi-factor auth', defaultPriority: 'critical', departmentCode: 'IT' },
      { name: 'Software & Application License', description: 'SaaS seats, IDE licenses, local software installation', defaultPriority: 'medium', departmentCode: 'IT' },
      { name: 'Payroll & Benefits Support', description: 'Direct deposit updates, salary queries, health benefits', defaultPriority: 'medium', departmentCode: 'HR' },
      { name: 'Network & Cloud Outage', description: 'WiFi disconnects, production server downtime, VPN outage', defaultPriority: 'critical', departmentCode: 'DEV' },
    ];

    for (const cat of categoriesToSeed) {
      const exists = await TicketCategory.findOne({ name: cat.name });
      if (!exists) {
        await TicketCategory.create({
          name: cat.name,
          description: cat.description,
          defaultPriority: cat.defaultPriority,
          department: deptMap[cat.departmentCode] || null,
        });
        console.log(`[Seed] Category created: ${cat.name}`);
      }
    }

    // 4. SLA Policies
    const slaToSeed = [
      { name: 'Critical Severity SLA', priorityLevel: 'critical', responseTimeMinutes: 15, resolutionTimeMinutes: 120, businessHoursOnly: false },
      { name: 'High Severity SLA', priorityLevel: 'high', responseTimeMinutes: 60, resolutionTimeMinutes: 240, businessHoursOnly: true },
      { name: 'Medium Severity SLA', priorityLevel: 'medium', responseTimeMinutes: 240, resolutionTimeMinutes: 1440, businessHoursOnly: true },
      { name: 'Low Severity SLA', priorityLevel: 'low', responseTimeMinutes: 480, resolutionTimeMinutes: 2880, businessHoursOnly: true },
    ];

    for (const sla of slaToSeed) {
      const exists = await SLAPolicy.findOne({ priorityLevel: sla.priorityLevel });
      if (!exists) {
        await SLAPolicy.create(sla);
        console.log(`[Seed] SLA Policy created: ${sla.name}`);
      }
    }
  } catch (err) {
    console.error('[Seed Admin Data Error]', err.message);
  }
};

// Run directly if invoked from CLI
if (process.argv[2] === '--run') {
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/servicedesk_pro')
    .then(async () => {
      console.log('[Seed] Database connected...');
      await seedAdminData();
      console.log('[Seed] Admin data seeding complete.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('[Seed Error]', err);
      process.exit(1);
    });
}
