import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies['jwt-linkin'];
    if (!token) {
      return res
        .status(401)
        .json({ message: 'Unauthorized - no session token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized - Invalid token' });
    }
    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('Error in protectRoute middleware: ' + error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export default protectRoute;
