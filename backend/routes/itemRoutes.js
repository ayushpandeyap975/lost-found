const express  = require('express');
const router   = express.Router();
const Item     = require('../models/Item');
const { protect } = require('../middleware/authMiddleware');

// POST /api/items — Add item (protected)
router.post('/items', protect, async (req, res) => {
  const { itemName, description, type, location, date, contactInfo } = req.body;
  try {
    const item = await Item.create({
      user: req.user._id,
      itemName, description, type, location, date, contactInfo
    });
    res.status(201).json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/items — Get all items (protected)
router.get('/items', protect, async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/items/search?name=xyz — Search items
router.get('/items/search', protect, async (req, res) => {
  const { name } = req.query;
  try {
    const items = await Item.find({
      itemName: { $regex: name, $options: 'i' }
    });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// GET /api/items/:id — Get item by ID (protected)
router.get('/items/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json(item);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// PUT /api/items/:id — Update item (protected, own items only)
router.put('/items/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized to update this item' });

    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

// DELETE /api/items/:id — Delete item (protected, own items only)
router.delete('/items/:id', protect, async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: 'Not authorized to delete this item' });

    await item.deleteOne();
    res.json({ message: 'Item deleted successfully' });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;