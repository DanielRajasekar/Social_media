const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const User = require('../models/User');
const multer = require('multer');
const verifyToken = require('../verifyToken');
const fs = require('fs');
const path = require('path');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const note = new Note({
      caption: req.body.caption,
      filename: req.file.filename,
      filepath: req.file.path,
      mimetype: req.file.mimetype,
    });
    
    await note.save();
    res.status(201).json({ message: 'Note uploaded successfully', note });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: 'Failed to upload note', error });
  }
});

router.get('/notes/:id', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    res.download(note.filepath, note.filename);
  } catch (error) {
    console.error("Download error:", error);
    res.status(500).json({ message: 'Failed to download note', error });
  }
});

router.get('/notes', async (req, res) => {
  try {
    const notes = await Note.find();
    res.status(200).json(notes);
  } catch (error) {
    console.error("Fetch error:", error);
    res.status(500).json({ message: 'Failed to fetch notes', error });
  }
});

router.put('/notes/:id', upload.single('file'), async (req, res) => {
  try {
    const updateFields = { caption: req.body.caption };

    if (req.file) {
      updateFields.filename = req.file.filename;
      updateFields.filepath = req.file.path;
      updateFields.mimetype = req.file.mimetype;
    }

    const updatedNote = await Note.findByIdAndUpdate(req.params.id, updateFields, { new: true });

    if (!updatedNote) return res.status(404).json({ message: 'Note not found' });

    res.status(200).json({ message: 'Note updated successfully', updatedNote });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: 'Failed to update note', error });
  }
});

router.delete('/notes/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) return res.status(404).json({ message: 'Note not found' });

    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: 'Failed to delete note', error });
  }
});

router.put('/update', verifyToken, upload.single('profilePic'), async (req, res) => {
  try {
    const { username, bio } = req.body;
    const userId = req.user?.id;

    if (!userId) return res.status(401).json({ message: "Unauthorized: No user ID found" });

    const updateData = { username, bio };
    if (req.file) {
      updateData.profilePic = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Profile updated successfully", updatedUser });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
