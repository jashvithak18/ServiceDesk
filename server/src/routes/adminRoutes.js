import express from 'express';
import {
  getDepartments, createDepartment, updateDepartment, deleteDepartment,
  getCategories, createCategory, updateCategory, deleteCategory,
  getSLAPolicies, createSLAPolicy, updateSLAPolicy,
  getUsers, updateUserRoleAndDept, getAuditLogs
} from '../controllers/adminDataController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth protection & role check for admin/it_manager
router.use(protect);
router.use(requireRole('admin', 'it_manager'));

// Audit Logs
router.get('/audit-logs', getAuditLogs);

// Departments
router.route('/departments')
  .get(getDepartments)
  .post(createDepartment);

router.route('/departments/:id')
  .put(updateDepartment)
  .delete(deleteDepartment);

// Categories
router.route('/categories')
  .get(getCategories)
  .post(createCategory);

router.route('/categories/:id')
  .put(updateCategory)
  .delete(deleteCategory);

// SLA Policies
router.route('/sla-policies')
  .get(getSLAPolicies)
  .post(createSLAPolicy);

router.route('/sla-policies/:id')
  .put(updateSLAPolicy);

// User Directory Management
router.route('/users')
  .get(getUsers);

router.route('/users/:id')
  .put(updateUserRoleAndDept);

export default router;
