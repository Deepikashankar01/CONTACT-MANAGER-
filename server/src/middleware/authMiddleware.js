import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authentication = async (req, res, next) => {
  let token;

  // header la token iruka check
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {

      // token eduthuka
      token = req.headers.authorization.split(' ')[1];

      // token verify
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // user find pannum
      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'User not found' });
      }

      next();

    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export default authentication;