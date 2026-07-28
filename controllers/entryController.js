const isStatic = (id) => id === 'static_firm';

export async function getEntries(req, res) {
  try {
    const filter = req.isOwner
      ? (isStatic(req.firmId) ? {} : { firmId: req.firmId })
      : { userId: req.userId };
    const entries = await Entry.find(filter).sort({ createdAt: -1 }).lean();
    res.json(entries);
  } catch {
    res.status(500).json({ error: 'Unable to load entries' });
  }
}

export async function createEntry(req, res) {
  try {
    const entry = new Entry({ ...req.body, userId: req.userId, firmId: req.firmId, createdAt: Date.now() });
    await entry.save();
    res.json(entry);
  } catch {
    res.status(500).json({ error: 'Unable to save entry' });
  }
}

export async function updateEntry(req, res) {
  try {
    const filter = req.isOwner
      ? (isStatic(req.firmId) ? { _id: req.params.id } : { _id: req.params.id, firmId: req.firmId })
      : { _id: req.params.id, userId: req.userId };
    const entry = await Entry.findOneAndUpdate(filter, req.body, { new: true, runValidators: true });
    if (!entry) return res.status(404).json({ error: 'Entry not found' });
    res.json(entry);
  } catch {
    res.status(500).json({ error: 'Unable to update entry' });
  }
}

export async function deleteEntry(req, res) {
  try {
    const filter = req.isOwner
      ? (isStatic(req.firmId) ? { _id: req.params.id } : { _id: req.params.id, firmId: req.firmId })
      : { _id: req.params.id, userId: req.userId };
    const result = await Entry.findOneAndDelete(filter);
    if (!result) return res.status(404).json({ error: 'Entry not found' });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: 'Unable to delete entry' });
  }
}
