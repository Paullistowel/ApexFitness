const { readDb, writeDb } = require("../data/mockDb");

// SAVE BODY METRICS
const saveBodyMetrics = (req, res) => {
  try {
    const { height, weight, age, gender } = req.body;

    if (!height || !weight || !age || !gender) {
      return res.status(400).json({ error: "Height, weight, age and gender are required" });
    }

    const db = readDb();
    const userIndex = db.users.findIndex((u) => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    db.users[userIndex].onboarding.bodyMetrics = {
      height,
      weight,
      age,
      gender,
      savedAt: new Date().toISOString(),
    };

    writeDb(db);

    res.status(200).json({
      message: "Body metrics saved successfully",
      bodyMetrics: db.users[userIndex].onboarding.bodyMetrics,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// SAVE FITNESS GOALS
const saveFitnessGoals = (req, res) => {
  try {
    const { goal, targetWeight, timeframe } = req.body;

    if (!goal) {
      return res.status(400).json({ error: "Goal is required" });
    }

    const db = readDb();
    const userIndex = db.users.findIndex((u) => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    db.users[userIndex].onboarding.fitnessGoals = {
      goal,
      targetWeight: targetWeight || null,
      timeframe: timeframe || null,
      savedAt: new Date().toISOString(),
    };

    writeDb(db);

    res.status(200).json({
      message: "Fitness goals saved successfully",
      fitnessGoals: db.users[userIndex].onboarding.fitnessGoals,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// SAVE ACTIVITY LEVEL
const saveActivityLevel = (req, res) => {
  try {
    const { activityLevel } = req.body;

    const validLevels = ["sedentary", "lightly active", "moderately active", "very active", "extra active"];

    if (!activityLevel || !validLevels.includes(activityLevel.toLowerCase())) {
      return res.status(400).json({ 
        error: "Valid activity level is required", 
        validOptions: validLevels 
      });
    }

    const db = readDb();
    const userIndex = db.users.findIndex((u) => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    db.users[userIndex].onboarding.activityLevel = {
      level: activityLevel.toLowerCase(),
      savedAt: new Date().toISOString(),
    };

    writeDb(db);

    res.status(200).json({
      message: "Activity level saved successfully",
      activityLevel: db.users[userIndex].onboarding.activityLevel,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

// SAVE DIETARY PREFERENCE
const saveDietaryPreference = (req, res) => {
  try {
    const { preference, allergies, mealsPerDay } = req.body;

    if (!preference) {
      return res.status(400).json({ error: "Dietary preference is required" });
    }

    const db = readDb();
    const userIndex = db.users.findIndex((u) => u.id === req.user.id);

    if (userIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    db.users[userIndex].onboarding.dietaryPreference = {
      preference,
      allergies: allergies || [],
      mealsPerDay: mealsPerDay || 3,
      savedAt: new Date().toISOString(),
    };

    // Mark onboarding as complete
    db.users[userIndex].onboarding.complete = true;

    writeDb(db);

    res.status(200).json({
      message: "Dietary preference saved successfully. Onboarding complete!",
      dietaryPreference: db.users[userIndex].onboarding.dietaryPreference,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error", details: err.message });
  }
};

module.exports = {
  saveBodyMetrics,
  saveFitnessGoals,
  saveActivityLevel,
  saveDietaryPreference,
};