// middleware/verifyToken.js
const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.header("token");
  if (!token) return res.status(401).send("Access Denied: No Token Provided!");

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified; // Add user payload to request
    next(); // continue to next middleware
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
}

module.exports = verifyToken;
