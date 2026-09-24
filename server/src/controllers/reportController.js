import { Ticket } from '../models/Ticket.js';
import { WorkLog } from '../models/WorkLog.js';
import { Asset } from '../models/Asset.js';
import { User } from '../models/User.js';
import { TicketCategory } from '../models/TicketCategory.js';

// @desc    Get live computed dashboard analytics from MongoDB
// @route   GET /api/reports/analytics
// @access  Private (IT Manager, Admin)
export const getDashboardAnalytics = async (req, res, next) => {
  try {
    const totalTickets = await Ticket.countDocuments();
    const newTickets = await Ticket.countDocuments({ status: 'new' });
    const inProgressTickets = await Ticket.countDocuments({ status: 'in_progress' });
    const resolvedTickets = await Ticket.countDocuments({ status: { $in: ['resolved', 'closed'] } });
    const breachedTickets = await Ticket.countDocuments({ isSlaBreached: true });

    const slaComplianceRate = totalTickets > 0
      ? Number((((totalTickets - breachedTickets) / totalTickets) * 100).toFixed(1))
      : 100;

    // Aggregation: Priority distribution
    const priorityAgg = await Ticket.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Aggregation: Category distribution
    const categoryAgg = await Ticket.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    // Populate category names
    const categories = await TicketCategory.find();
    const catMap = new Map(categories.map(c => [c._id.toString(), c.name]));

    const byCategory = categoryAgg.map(item => ({
      name: catMap.get(item._id?.toString()) || 'General Support',
      count: item.count,
    }));

    const byPriority = priorityAgg.map(item => ({
      priority: item._id,
      count: item.count,
    }));

    // Aggregation: Technician Workload Metrics
    const technicians = await User.find({ role: { $in: ['technician', 'it_manager', 'admin'] } });
    const workload = [];

    for (const tech of technicians) {
      const assignedCount = await Ticket.countDocuments({ assignee: tech._id, status: { $nin: ['resolved', 'closed'] } });
      const resolvedCount = await Ticket.countDocuments({ assignee: tech._id, status: { $in: ['resolved', 'closed'] } });
      
      const workLogs = await WorkLog.aggregate([
        { $match: { technician: tech._id } },
        { $group: { _id: null, totalMins: { $sum: '$timeSpentMinutes' } } }
      ]);

      const totalMins = workLogs[0]?.totalMins || 0;

      workload.push({
        _id: tech._id,
        name: tech.name,
        email: tech.email,
        role: tech.role,
        avatarColor: tech.avatarColor,
        assignedCount,
        resolvedCount,
        totalHoursLogged: Number((totalMins / 60).toFixed(1)),
      });
    }

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalTickets,
          newTickets,
          inProgressTickets,
          resolvedTickets,
          breachedTickets,
          slaComplianceRate,
        },
        byPriority,
        byCategory,
        workload,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Export tickets list as CSV (Server-side stream)
// @route   GET /api/reports/tickets/csv
// @access  Private (All Roles)
export const exportTicketsCSV = async (req, res, next) => {
  try {
    const tickets = await Ticket.find()
      .populate('requester', 'name email')
      .populate('assignee', 'name email')
      .populate('category', 'name')
      .populate('department', 'name code')
      .sort({ createdAt: -1 });

    const headers = ['Ticket Number', 'Title', 'Requester', 'Assignee', 'Category', 'Priority', 'Status', 'SLA Breached', 'Created At'];
    
    const rows = tickets.map(t => [
      t.ticketNumber,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      `"${(t.requester?.name || 'Unknown').replace(/"/g, '""')}"`,
      `"${(t.assignee?.name || 'Unassigned').replace(/"/g, '""')}"`,
      `"${(t.category?.name || 'General').replace(/"/g, '""')}"`,
      t.priority,
      t.status,
      t.isSlaBreached ? 'YES' : 'NO',
      new Date(t.createdAt).toISOString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="servicedesk_tickets.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

// @desc    Export hardware assets list as CSV
// @route   GET /api/reports/assets/csv
// @access  Private
export const exportAssetsCSV = async (req, res, next) => {
  try {
    const assets = await Asset.find()
      .populate('vendor', 'name')
      .populate('assignedTo', 'name email')
      .populate('department', 'name code')
      .sort({ createdAt: -1 });

    const headers = ['Asset Tag', 'Serial Number', 'Device Name', 'Type', 'Status', 'Assigned To', 'Purchase Cost', 'Warranty Expiry'];

    const rows = assets.map(a => [
      a.assetTag,
      a.serialNumber,
      `"${(a.name || '').replace(/"/g, '""')}"`,
      a.type,
      a.status,
      `"${(a.assignedTo?.name || 'Unassigned').replace(/"/g, '""')}"`,
      a.purchaseCost || 0,
      a.warrantyExpiry ? new Date(a.warrantyExpiry).toISOString().split('T')[0] : 'N/A',
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="servicedesk_assets.csv"');
    res.status(200).send(csvContent);
  } catch (error) {
    next(error);
  }
};

// @desc    Export SLA Summary Report PDF / Document
// @route   GET /api/reports/pdf
// @access  Private (IT Manager, Admin)
export const exportSlaReportPDF = async (req, res, next) => {
  try {
    const total = await Ticket.countDocuments();
    const breached = await Ticket.countDocuments({ isSlaBreached: true });
    const compliance = total > 0 ? (((total - breached) / total) * 100).toFixed(1) : 100;

    const textReport = `
===================================================================
                  SERVICEDESK PRO - SLA EXECUTIVE REPORT
===================================================================
Generated: ${new Date().toLocaleString()}
Scope: Full System SLA & Service Level Compliance

1. EXECUTIVE METRICS SUMMARY
-------------------------------------------------------------------
Total Tickets Processed:        ${total}
SLA Compliance Rate:            ${compliance}%
SLA Breached Tickets:           ${breached}
Operating Business Hours:       Mon-Fri 09:00 - 18:00 UTC

2. SLA COMPLIANCE POLICY TARGETS
-------------------------------------------------------------------
- Critical Priority:  Response <= 15m | Resolution <= 2h (24/7)
- High Priority:      Response <= 1h  | Resolution <= 4h (Business Hrs)
- Medium Priority:    Response <= 4h  | Resolution <= 24h (Business Hrs)
- Low Priority:       Response <= 8h  | Resolution <= 48h (Business Hrs)

===================================================================
End of Executive Report
===================================================================
`;

    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="servicedesk_sla_report.txt"');
    res.status(200).send(textReport);
  } catch (error) {
    next(error);
  }
};
