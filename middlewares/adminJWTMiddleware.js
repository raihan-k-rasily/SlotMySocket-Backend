const jwt = require('jsonwebtoken')

const adminJwtMiddleware = (req, res, next) => {
  console.log("Inside Admin JWT Middleware");

  try {
    // 1. Safety check: Check if Authorization header exists
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json("Access Denied. No token provided.");
    }

    // 2. Extract token
    const token = authHeader.slice(7);
    
    // 3. Verify token
    const jwtVerification = jwt.verify(token, process.env.jwtKey);
    console.log("Verified:", jwtVerification);

    // 4. Attach data to request object
    req.userId = jwtVerification.userId; // Use userId or usermail based on your login logic
    req.role = jwtVerification.role;

    // 5. Role Check - Ensure this matches EXACTLY what you store during login
    if (jwtVerification.role === "Admin") {
      next();
    } else {
      res.status(403).json("Access Denied: You are not an Admin");
    }

  } catch (err) {
    console.log("JWT Error:", err.message);
    // 💡 Changed 402 to 401 for standard authentication failure
    res.status(401).json({ message: "Invalid or Expired Token", error: err.message });
  }
}

module.exports = adminJwtMiddleware;