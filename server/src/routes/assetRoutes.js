import express from 'express';
import {
  getAssets,
  getAssetById,
  createAsset,
  updateAssetStatus,
  getVendors,
  createVendor,
  deleteVendor,
} from '../controllers/assetController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

// Vendors
router.route('/vendors')
  .get(getVendors)
  .post(requireRole('admin', 'asset_manager', 'it_manager'), createVendor);

router.route('/vendors/:id')
  .delete(requireRole('admin', 'asset_manager', 'it_manager'), deleteVendor);

// Assets
router.route('/assets')
  .get(getAssets)
  .post(requireRole('admin', 'asset_manager', 'it_manager', 'technician'), createAsset);

router.route('/assets/:id')
  .get(getAssetById);

router.route('/assets/:id/status')
  .put(requireRole('admin', 'asset_manager', 'it_manager', 'technician'), updateAssetStatus);

export default router;
