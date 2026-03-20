const jwt = require("jsonwebtoken");

// Verify JWT token
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized - Invalid token" });
  }
};

// Check role
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized - Not logged in" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `Forbidden - Required role: ${roles.join(" or ")}` 
      });
    }

    next();
  };
};

module.exports = { requireAuth, requireRole };