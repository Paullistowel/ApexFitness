const { readDb, writeDb } = require("../data/mockDb");

// GET USER PROFILE
const getProfile = (req, res) => {
  try {
    const db = readDb();
    const user = db.users.find((u) => u.id === req.user.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({
      message: "Profile fetched successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
        onboarding: user.onboarding,
        createdAt: user.createdAt,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// UPDATE USER PROFILE
const updateProfile = (req, res) => {
  try {
    const { name, bio, avatarUrl } = req.body;

    const db = readDb();
    const userIndex = db.users.findIndex((u) => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    // Only update fields that were sent
    if (name) {
      db.users[userIndex].name = name;
      db.users[userIndex].profile.name = name;
    }
    if (bio) db.users[userIndex].profile.bio = bio;
    if (avatarUrl) db.users[userIndex].profile.avatarUrl = avatarUrl;

    writeDb(db);

    res.status(200).json({
      message: "Profile updated successfully",
      profile: db.users[userIndex].profile,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// DELETE ACCOUNT
const deleteAccount = (req, res) => {
  try {
    const db = readDb();
    const userIndex = db.users.findIndex((u) => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    db.users.splice(userIndex, 1);
    writeDb(db);

    res.status(200).json({ message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

module.exports = { getProfile, updateProfile, deleteAccount };