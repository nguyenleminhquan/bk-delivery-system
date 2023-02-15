import User from '../models/User.js';
import createError from 'http-errors';

const verifyRoles = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.email });
      if (roles.includes(user.typeUser)) {
        next();
        return
      }
      return next(createError(401, 'Unauthorized'))
    } catch(err) {
      console.log(err)
      return next(createError(500, err))
    }
  }
}


export default verifyRoles