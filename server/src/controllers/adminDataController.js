import { Department } from '../models/Department.js';
import { TicketCategory } from '../models/TicketCategory.js';
import { SLAPolicy } from '../models/SLAPolicy.js';
import { Organization } from '../models/Organization.js';
import { User } from '../models/User.js';

// --- DEPARTMENTS ---
export const getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().populate('headOfDepartment', 'name email role');
    res.status(200).json({ success: true, count: departments.length, data: departments });
  } catch (error) {
    next(error);
  }
};

export const createDepartment = async (req, res, next) => {
  try {
    const { name, code, description, headOfDepartment } = req.body;
    const department = await Department.create({ name, code, description, headOfDepartment: headOfDepartment || null });
    res.status(201).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

export const updateDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!department) {
      res.status(404);
      throw new Error('Department not found');
    }
    res.status(200).json({ success: true, data: department });
  } catch (error) {
    next(error);
  }
};

export const deleteDepartment = async (req, res, next) => {
  try {
    const department = await Department.findByIdAndDelete(req.params.id);
    if (!department) {
      res.status(404);
      throw new Error('Department not found');
    }
    res.status(200).json({ success: true, message: 'Department deleted' });
  } catch (error) {
    next(error);
  }
};

// --- TICKET CATEGORIES ---
export const getCategories = async (req, res, next) => {
  try {
    const categories = await TicketCategory.find().populate('department', 'name code');
    res.status(200).json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, defaultPriority, department } = req.body;
    const category = await TicketCategory.create({ name, description, defaultPriority, department: department || null });
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await TicketCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }
    res.status(200).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const category = await TicketCategory.findByIdAndDelete(req.params.id);
    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }
    res.status(200).json({ success: true, message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
};

// --- SLA POLICIES ---
export const getSLAPolicies = async (req, res, next) => {
  try {
    const policies = await SLAPolicy.find().populate('escalationChain', 'name email role');
    res.status(200).json({ success: true, count: policies.length, data: policies });
  } catch (error) {
    next(error);
  }
};

export const createSLAPolicy = async (req, res, next) => {
  try {
    const { name, priorityLevel, responseTimeMinutes, resolutionTimeMinutes, businessHoursOnly, escalationChain } = req.body;
    const policy = await SLAPolicy.create({
      name,
      priorityLevel,
      responseTimeMinutes,
      resolutionTimeMinutes,
      businessHoursOnly,
      escalationChain: escalationChain || [],
    });
    res.status(201).json({ success: true, data: policy });
  } catch (error) {
    next(error);
  }
};

export const updateSLAPolicy = async (req, res, next) => {
  try {
    const policy = await SLAPolicy.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!policy) {
      res.status(404);
      throw new Error('SLA Policy not found');
    }
    res.status(200).json({ success: true, data: policy });
  } catch (error) {
    next(error);
  }
};

// --- USERS MANAGEMENT (ADMIN ONLY) ---
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').populate('department', 'name code');
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

export const updateUserRoleAndDept = async (req, res, next) => {
  try {
    const { role, department, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role, department: department || null, isActive },
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system audit log history (ticket status transitions + asset lifecycle logs)
// @route   GET /api/admin/audit-logs
// @access  Private (Admin, IT Manager)
export const getAuditLogs = async (req, res, next) => {
  try {
    const { Ticket } = await import('../models/Ticket.js');
    const { Asset } = await import('../models/Asset.js');

    const tickets = await Ticket.find()
      .populate('statusHistory.changedBy', 'name email role')
      .select('ticketNumber title statusHistory createdAt');

    const assets = await Asset.find()
      .populate('lifecycleHistory.changedBy', 'name email role')
      .select('assetTag name lifecycleHistory createdAt');

    const logs = [];

    // Extract ticket status changes
    for (const t of tickets) {
      if (t.statusHistory && t.statusHistory.length > 0) {
        for (const h of t.statusHistory) {
          logs.push({
            id: `t-${t._id}-${h._id || h.timestamp}`,
            type: 'Ticket Status Change',
            reference: t.ticketNumber,
            title: t.title,
            action: h.fromStatus ? `${h.fromStatus} → ${h.toStatus}` : `Status set to '${h.toStatus}'`,
            notes: h.reason || 'Status update',
            performedBy: h.changedBy?.name || 'System / SLA Engine',
            timestamp: h.timestamp || t.createdAt,
          });
        }
      }
    }

    // Extract asset lifecycle changes
    for (const a of assets) {
      if (a.lifecycleHistory && a.lifecycleHistory.length > 0) {
        for (const h of a.lifecycleHistory) {
          logs.push({
            id: `a-${a._id}-${h._id || h.timestamp}`,
            type: 'Asset Transition',
            reference: a.assetTag,
            title: a.name,
            action: `${h.fromStatus || 'initial'} → ${h.toStatus}`,
            notes: h.notes || 'Hardware status transition',
            performedBy: h.changedBy?.name || 'Asset Manager',
            timestamp: h.timestamp || a.createdAt,
          });
        }
      }
    }

    // Sort descending by timestamp
    logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};
