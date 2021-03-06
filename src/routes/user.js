import express from 'express';

import multer from 'multer';

import {
  getUser,
  setAvatar,
  updateUser,
  getUserByID,
  getUserList
} from '../controllers/user';

import {
  verifyAgainstDB
} from '../middlewares/authentication';

import { avatarUpload } from '../config/upload';

const userRoutes = express.Router();

/**
 * route to get current user info
 * This imp since token might does not have latest user info
 * GET /user/me
 */
userRoutes.get('/me', verifyAgainstDB, getUser);

/**
 * route to get specific user's info
 * GET /user/:id
 */
userRoutes.get('/:id', getUserByID);

/**
 * route to get list of users
 * GET /user/list/:status [all, pending, active]
 */
userRoutes.get('/list/:status', getUserList);

/**
 * route to update specific user
 * PUT /user/:id
 */
userRoutes.put('/:id', updateUser);

/**
 * route to set user avatar
 * POST /user/avatar
 */
userRoutes.post('/avatar', avatarUpload, setAvatar);

export default userRoutes;