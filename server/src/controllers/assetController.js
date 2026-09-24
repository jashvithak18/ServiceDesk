import { Asset } from '../models/Asset.js';
import { Vendor } from '../models/Vendor.js';

// Auto generate asset tag (e.g. AST-4001)
const generateAssetTag = async () => {
  const count = await Asset.countDocuments();
  const nextNum = 4000 + count + 1;
  return `AST-${nextNum}`;
};

// --- VENDORS ---
export const getVendors = async (req, res, next) => {
  try {
    const vendors = await Vendor.find().sort({ name: 1 });
    res.status(200).json({ success: true, count: vendors.length, data: vendors });
  } catch (error) {
    next(error);
  }
};

export const createVendor = async (req, res, next) => {
  try {
    const { name, contactPerson, email, phone, website } = req.body;
    const vendor = await Vendor.create({ name, contactPerson, email, phone, website });
    res.status(201).json({ success: true, data: vendor });
  } catch (error) {
    next(error);
  }
};

export const deleteVendor = async (req, res, next) => {
  try {
    await Vendor.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Vendor removed' });
  } catch (error) {
    next(error);
  }
};

// --- ASSETS ---
export const getAssets = async (req, res, next) => {
  try {
    const { status, type, department, search, warrantyExpiring } = req.query;

    const query = {};

    if (status) query.status = status;
    if (type) query.type = type;
    if (department) query.department = department;

    if (search) {
      query.$or = [
        { assetTag: { $regex: search, $options: 'i' } },
        { serialNumber: { $regex: search, $options: 'i' } },
        { name: { $regex: search, $options: 'i' } },
      ];
    }

    // Warranty expiring within 30 days
    if (warrantyExpiring === 'true') {
      const now = new Date();
      const in30Days = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      query.warrantyExpiry = { $gte: now, $lte: in30Days };
    }

    const assets = await Asset.find(query)
      .populate('vendor', 'name')
      .populate('assignedTo', 'name email role avatarColor')
      .populate('department', 'name code')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: assets.length, data: assets });
  } catch (error) {
    next(error);
  }
};

export const getAssetById = async (req, res, next) => {
  try {
    const asset = await Asset.findById(req.params.id)
      .populate('vendor', 'name contactPerson email phone')
      .populate('assignedTo', 'name email role avatarColor department')
      .populate('department', 'name code')
      .populate('lifecycleHistory.assignedTo', 'name email')
      .populate('lifecycleHistory.changedBy', 'name email role');

    if (!asset) {
      res.status(404);
      throw new Error('Asset not found');
    }

    res.status(200).json({ success: true, data: asset });
  } catch (error) {
    next(error);
  }
};

export const createAsset = async (req, res, next) => {
  try {
    const { serialNumber, name, type, vendor, purchaseDate, purchaseCost, warrantyExpiry, department, assignedTo } = req.body;

    if (!serialNumber || !name) {
      res.status(400);
      throw new Error('Serial number and name are required');
    }

    const exists = await Asset.findOne({ serialNumber: serialNumber.trim() });
    if (exists) {
      res.status(400);
      throw new Error(`Asset with serial number '${serialNumber}' already exists`);
    }

    const assetTag = await generateAssetTag();
    const initialStatus = assignedTo ? 'assigned' : 'in_stock';

    const asset = await Asset.create({
      assetTag,
      serialNumber: serialNumber.trim(),
      name: name.trim(),
      type: type || 'Laptop',
      vendor: vendor || null,
      purchaseDate: purchaseDate || new Date(),
      purchaseCost: purchaseCost || 0,
      warrantyExpiry: warrantyExpiry || null,
      department: department || null,
      assignedTo: assignedTo || null,
      status: initialStatus,
      lifecycleHistory: [
        {
          fromStatus: 'none',
          toStatus: initialStatus,
          assignedTo: assignedTo || null,
          changedBy: req.user._id,
          notes: 'Asset registered in system inventory',
        },
      ],
    });

    const populated = await Asset.findById(asset._id)
      .populate('vendor', 'name')
      .populate('assignedTo', 'name email role')
      .populate('department', 'name code');

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    next(error);
  }
};

export const updateAssetStatus = async (req, res, next) => {
  try {
    const { status, assignedTo, notes } = req.body;
    const allowedStatuses = ['in_stock', 'assigned', 'in_repair', 'retired'];

    if (status && !allowedStatuses.includes(status)) {
      res.status(400);
      throw new Error(`Invalid asset status '${status}'`);
    }

    const asset = await Asset.findById(req.params.id);
    if (!asset) {
      res.status(404);
      throw new Error('Asset not found');
    }

    // Validation: Cannot assign a retired asset
    if (asset.status === 'retired' && status !== 'retired') {
      res.status(400);
      throw new Error('Retired assets cannot be reactivated or assigned. They must remain in retired state.');
    }

    const prevStatus = asset.status;
    const targetStatus = status || asset.status;
    const targetAssignedTo = status === 'assigned' ? (assignedTo || asset.assignedTo) : (status === 'in_stock' ? null : asset.assignedTo);

    asset.status = targetStatus;
    asset.assignedTo = targetAssignedTo;

    asset.lifecycleHistory.push({
      fromStatus: prevStatus,
      toStatus: targetStatus,
      assignedTo: targetAssignedTo,
      changedBy: req.user._id,
      notes: notes || `Asset transition to ${targetStatus}`,
    });

    await asset.save();

    const updated = await Asset.findById(asset._id)
      .populate('vendor', 'name')
      .populate('assignedTo', 'name email role')
      .populate('department', 'name code');

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    next(error);
  }
};
