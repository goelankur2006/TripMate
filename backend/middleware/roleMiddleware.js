// backend/middleware/roleMiddleware.js

const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    // role comes from JWT (we will add it there)
    if (!allowedRoles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: insufficient permissions",
      });
    }
    next();
  };
};

export default roleMiddleware;