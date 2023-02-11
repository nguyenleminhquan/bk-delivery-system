import User from '../models/User.js';
import createError from 'http-errors';

export const isSender = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.email });
    if (user.typeUser === 'sender') {
      next();
      return
    }
    return next(createError(401, 'Unauthorized'))
  } catch(err) {
    console.log(err)
    return next(createError(500, err))
  }
}

export const isDriver = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.email });
    if (user.typeUser === 'driver') {
      next();
      return
    }
    return next(createError(401, 'Unauthorized'))
  } catch(err) {
    console.log(err)
    return next(createError(500, err))
  }
}

export const isStocker = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.email });
    if (user.typeUser === 'stocker') {
      next();
      return
    }
    return next(createError(401, 'Unauthorized'))
  } catch(err) {
    console.log(err)
    return next(createError(500, err))
  }
}

export const isAdmin = (req, res, next) => {
  try {
    const user = User.findOne({ email: req.email });
    console.log(user);
    if (user.typeUser === 'admin') {
      next();
      return
    }
    return next(createError(401, 'Unauthorized'))
  } catch(err) {
    console.log(err)
    return next(createError(500, err))
  }
};