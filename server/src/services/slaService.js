import cron from 'node-cron';
import { SLAPolicy } from '../models/SLAPolicy.js';
import { Organization } from '../models/Organization.js';
import { Ticket } from '../models/Ticket.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';
import { addBusinessMinutes } from '../utils/businessHours.js';

// Calculate response & resolution deadlines based on SLA policy and business hours
export const calculateTicketDeadlines = async (priorityLevel, startTime = new Date()) => {
  try {
    const policy = await SLAPolicy.findOne({ priorityLevel });
    const org = await Organization.findOne();

    const responseMins = policy?.responseTimeMinutes || 60;
    const resolutionMins = policy?.resolutionTimeMinutes || 480;
    const isBusinessOnly = policy ? policy.businessHoursOnly : true;

    let responseDeadline;
    let resolutionDeadline;

    if (isBusinessOnly) {
      const config = {
        startHour: parseInt(org?.settings?.businessHours?.start?.split(':')[0] || '9', 10),
        endHour: parseInt(org?.settings?.businessHours?.end?.split(':')[0] || '18', 10),
        workDays: org?.settings?.workDays || [1, 2, 3, 4, 5],
      };

      responseDeadline = addBusinessMinutes(startTime, responseMins, config);
      resolutionDeadline = addBusinessMinutes(startTime, resolutionMins, config);
    } else {
      // 24/7 continuous calculation
      responseDeadline = new Date(startTime.getTime() + responseMins * 60000);
      resolutionDeadline = new Date(startTime.getTime() + resolutionMins * 60000);
    }

    return { responseDeadline, resolutionDeadline };
  } catch (err) {
    console.error('[SLA Service Error] Failed to calculate deadlines:', err.message);
    const fallback = new Date(startTime.getTime() + 24 * 60 * 60000);
    return { responseDeadline: fallback, resolutionDeadline: fallback };
  }
};

// Background SLA Scanner — checks open tickets for breaches and triggers auto-escalation
export const runSlaCheck = async () => {
  try {
    const now = new Date();

    // Query open tickets (not resolved / closed)
    const openTickets = await Ticket.find({
      status: { $nin: ['resolved', 'closed'] },
    });

    let breachedCount = 0;
    let escalatedCount = 0;

    const manager = await User.findOne({ role: 'it_manager' });

    for (const ticket of openTickets) {
      let isModified = false;

      // Check resolution deadline breach
      if (ticket.resolutionDeadline && now > ticket.resolutionDeadline && !ticket.isSlaBreached) {
        ticket.isSlaBreached = true;
        isModified = true;
        breachedCount++;
      }

      // Check auto-escalation (if breached and level is 0)
      if (ticket.isSlaBreached && ticket.escalationLevel === 0) {
        ticket.escalationLevel = 1;
        if (manager && (!ticket.assignee || ticket.assignee.toString() !== manager._id.toString())) {
          ticket.assignee = manager._id;
        }

        ticket.statusHistory.push({
          fromStatus: ticket.status,
          toStatus: ticket.status,
          changedBy: manager?._id || ticket.requester,
          reason: '[AUTO-ESCALATION] Resolution SLA deadline breached. Reassigned to IT Manager.',
        });

        isModified = true;
        escalatedCount++;
      }

      if (isModified) {
        await ticket.save();
      }
    }

    if (breachedCount > 0 || escalatedCount > 0) {
      console.log(`[SLA Background Job] Processed ${openTickets.length} tickets: ${breachedCount} newly breached, ${escalatedCount} auto-escalated.`);
    }
  } catch (err) {
    console.error('[SLA Background Job Error]', err.message);
  }
};

// Initialize Cron Schedule (Runs every 5 minutes)
export const initSlaCron = () => {
  console.log('[SLA Engine] Initializing background SLA monitoring job (cron every 5m)...');
  
  // Run once immediately on server startup
  runSlaCheck();

  // Schedule recurring cron every 5 minutes
  cron.schedule('*/5 * * * *', () => {
    console.log('[SLA Engine] Running scheduled background SLA check...');
    runSlaCheck();
  });
};
