// /routes/playlistRoutes.js
const express = require("express");
const router = express.Router();
const Playlist = require("../models/Playlist");
const User = require("../models/User");

// Middleware to verify authentication (if not already implemented)
const authenticateUser = async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

// Create a new playlist
router.post("/create", authenticateUser, async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user._id;

    const newPlaylist = new Playlist({
      name,
      songs: [],
      user: userId,
    });
    await newPlaylist.save();

    const user = await User.findById(userId);
    user.playlists.push(newPlaylist._id);
    await user.save();

    res.status(201).json(newPlaylist);
  } catch (error) {
    res.status(500).json({ message: "Error creating playlist" });
  }
});

// Add a song to a playlist
router.post("/:playlistId/add", authenticateUser, async (req, res) => {
  try {
    const { playlistId } = req.params;
    const { songId } = req.body;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }

    res.status(200).json(playlist);
  } catch (error) {
    res.status(500).json({ message: "Error adding song to playlist" });
  }
});

// Delete a playlist
router.delete("/:playlistId/delete", authenticateUser, async (req, res) => {
  try {
    const { playlistId } = req.params;

    await Playlist.findByIdAndDelete(playlistId);

    const user = await User.findOne({ playlists: playlistId });
    user.playlists.pull(playlistId);
    await user.save();

    res.status(200).json({ message: "Playlist deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting playlist" });
  }
});

module.exports = router;