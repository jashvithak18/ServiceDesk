import { Ticket } from '../models/Ticket.js';
import { TicketComment } from '../models/TicketComment.js';
import { WorkLog } from '../models/WorkLog.js';
import { TicketCategory } from '../models/TicketCategory.js';
import { SLAPolicy } from '../models/SLAPolicy.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';
import { calculateTicketDeadlines } from '../services/slaService.js';

// Helper to generate next Ticket Number (e.g. INC-1024)
const generateTicketNumber = async () => {
  const count = await Ticket.countDocuments();
  const nextNum = 1000 + count + 1;
  return `INC-${nextNum}`;
};

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Private (All Roles)
export const createTicket = async (req, res, next) => {
  try {
    const { title, description, categoryId, priorityOverride, departmentId } = req.body;

    if (!title || !description || !categoryId) {
      res.status(400);
      throw new Error('Title, description, and category are required');
    }

    const category = await TicketCategory.findById(categoryId);
    if (!category) {
      res.status(404);
      throw new Error('Selected ticket category does not exist');
    }

    const priority = priorityOverride || category.defaultPriority || 'medium';
    const department = departmentId || category.department || req.user.department || null;

    // Calculate business-hours SLA deadlines
    const { responseDeadline, resolutionDeadline } = await calculateTicketDeadlines(priority);

    const ticketNumber = await generateTicketNumber();

    const ticket = await Ticket.create({
      ticketNumber,
      title,
      description,
      requester: req.user._id,
      category: category._id,
      priority,
      status: 'new',
      department,
      responseDeadline,
      resolutionDeadline,
      statusHistory: [
        {
          fromStatus: 'none',
          toStatus: 'new',
          changedBy: req.user._id,
          reason: 'Ticket logged in system',
        },
      ],
    });

    const populatedTicket = await Ticket.findById(ticket._id)
      .populate('requester', 'name email role avatarColor')
      .populate('category', 'name defaultPriority')
      .populate('department', 'name code');

    res.status(201).json({ success: true, data: populatedTicket });
  } catch (error) {
    next(error);
  }
};

// @desc    Get tickets list (Role-aware & search/filtered)
// @route   GET /api/tickets
// @access  Private
export const getTickets = async (req, res, next) => {
  try {
    const { status, priority, category, search, queue, page = 1, limit = 20 } = req.query;

    const query = {};

    // Role-based visibility
    if (req.user.role === 'employee') {
      query.requester = req.user._id;
    } else if (queue === 'my_queue') {
      query.assignee = req.user._id;
    } else if (req.user.role !== 'admin' && req.user.department) {
      query.department = req.user.department;
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    if (search) {
      query.$text = { $search: search };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const tickets = await Ticket.find(query)
      .populate('requester', 'name email role avatarColor')
      .populate('assignee', 'name email role avatarColor')
      .populate('category', 'name defaultPriority')
      .populate('department', 'name code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Ticket.countDocuments(query);

    res.status(200).json({
      success: true,
      count: tickets.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: tickets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get ticket by ID with comments & work logs
// @route   GET /api/tickets/:id
// @access  Private
export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('requester', 'name email role avatarColor department')
      .populate('assignee', 'name email role avatarColor')
      .populate('category', 'name defaultPriority')
      .populate('department', 'name code')
      .populate('statusHistory.changedBy', 'name email role');

    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    // Access check: Employees can only view their own tickets
    if (req.user.role === 'employee' && ticket.requester._id.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Access denied to this ticket');
    }

    // Comments query: filter out internal notes for employee role
    const commentQuery = { ticket: ticket._id };
    if (req.user.role === 'employee') {
      commentQuery.isInternalNote = false;
    }

    const comments = await TicketComment.find(commentQuery)
      .populate('author', 'name email role avatarColor')
      .sort({ createdAt: 1 });

    const workLogs = await WorkLog.find({ ticket: ticket._id })
      .populate('technician', 'name email role')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        ticket,
        comments,
        workLogs,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update ticket status (Lifecycle transition)
// @route   PUT /api/tickets/:id/status
// @access  Private (Technician, IT Manager, Admin)
export const updateTicketStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    const allowedStatuses = ['new', 'assigned', 'in_progress', 'on_hold', 'resolved', 'closed'];

    if (!allowedStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Invalid status '${status}'`);
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    const prevStatus = ticket.status;
    ticket.status = status;

    if (status === 'resolved') {
      ticket.resolvedAt = new Date();
    }

    ticket.statusHistory.push({
      fromStatus: prevStatus,
      toStatus: status,
      changedBy: req.user._id,
      reason: reason || `Status changed to ${status}`,
    });

    await ticket.save();

    const updatedTicket = await Ticket.findById(ticket._id)
      .populate('requester', 'name email role avatarColor')
      .populate('assignee', 'name email role avatarColor')
      .populate('category', 'name defaultPriority')
      .populate('department', 'name code');

    res.status(200).json({ success: true, data: updatedTicket });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign ticket to technician
// @route   PUT /api/tickets/:id/assign
// @access  Private (IT Manager, Admin, Technician self-assign)
export const assignTicket = async (req, res, next) => {
  try {
    const { assigneeId } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    const prevAssignee = ticket.assignee;
    ticket.assignee = assigneeId || req.user._id;

    if (ticket.status === 'new') {
      ticket.statusHistory.push({
        fromStatus: ticket.status,
        toStatus: 'assigned',
        changedBy: req.user._id,
        reason: 'Technician assigned to ticket',
      });
      ticket.status = 'assigned';
    }

    await ticket.save();

    const updated = await Ticket.findById(ticket._id)
      .populate('requester', 'name email role avatarColor')
      .populate('assignee', 'name email role avatarColor')
      .populate('category', 'name defaultPriority')
      .populate('department', 'name code');

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Reopen a resolved/closed ticket
// @route   POST /api/tickets/:id/reopen
// @access  Private
export const reopenTicket = async (req, res, next) => {
  try {
    const { reason } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    if (!['resolved', 'closed'].includes(ticket.status)) {
      res.status(400);
      throw new Error('Only resolved or closed tickets can be reopened');
    }

    const prevStatus = ticket.status;
    ticket.status = 'in_progress';
    ticket.reopenCount += 1;
    ticket.resolvedAt = null;

    ticket.statusHistory.push({
      fromStatus: prevStatus,
      toStatus: 'in_progress',
      changedBy: req.user._id,
      reason: reason || 'Requester reopened ticket',
    });

    await ticket.save();

    res.status(200).json({ success: true, data: ticket });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to ticket
// @route   POST /api/tickets/:id/comments
// @access  Private
export const addComment = async (req, res, next) => {
  try {
    const { body, isInternalNote } = req.body;

    if (!body || !body.trim()) {
      res.status(400);
      throw new Error('Comment body is required');
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    // Only non-employees can post internal notes
    const isInternal = isInternalNote && req.user.role !== 'employee';

    const comment = await TicketComment.create({
      ticket: ticket._id,
      author: req.user._id,
      body: body.trim(),
      isInternalNote: isInternalNote || false,
    });

    // Notify ticket recipient / assignee
    const targetRecipient = req.user._id.toString() === ticket.requester.toString()
      ? ticket.assignee
      : ticket.requester;

    if (targetRecipient && !isInternalNote) {
      await Notification.create({
        recipient: targetRecipient,
        sender: req.user._id,
        type: 'comment_added',
        ticket: ticket._id,
        title: `New Comment on ${ticket.ticketNumber}`,
        message: `${req.user.name} added a comment to '${ticket.title}'`,
      });
    }

    const populatedComment = await TicketComment.findById(comment._id).populate(
      'author',
      'name email role avatarColor'
    );

    res.status(201).json({ success: true, data: populatedComment });
  } catch (error) {
    next(error);
  }
};

// @desc    Add work log entry
// @route   POST /api/tickets/:id/worklogs
// @access  Private (Technician, IT Manager, Admin)
export const addWorkLog = async (req, res, next) => {
  try {
    const { description, timeSpentMinutes } = req.body;

    if (!description || !timeSpentMinutes) {
      res.status(400);
      throw new Error('Description and time spent in minutes are required');
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      res.status(404);
      throw new Error('Ticket not found');
    }

    const workLog = await WorkLog.create({
      ticket: ticket._id,
      technician: req.user._id,
      description: description.trim(),
      timeSpentMinutes: Number(timeSpentMinutes),
    });

    const populatedWorkLog = await WorkLog.findById(workLog._id).populate(
      'technician',
      'name email role'
    );

    res.status(201).json({ success: true, data: populatedWorkLog });
  } catch (error) {
    next(error);
  }
};
