'use client'

import { Request, Response, NextFunction } from 'express';
import express from 'express';
import User from '../types/user';
import { encodeAuthToken, decodeAuthToken } from '../helpers/token';
import {comparePassword} from '../helpers/authUtils'
import { authenticate } from './middleware';

const router = express.Router();

interface LoginInfo {
  username: string;
  password: string;
}

interface RequestBody {
  username: string;
  password: string;
}

router.post('/login',
    async (req: Request<{}, {}, RequestBody>, res: Response) => {
      
    try {      
      const { username, password } = req.body;
  
      // Finding user by username since it is unique
      
      const user = await User.findOne({ username });
      console.log("user" + user);
  
      if (!user) {
        res.status(400).json({ message: 'Invalid credentials' });
        return
      }
  
      // Comparing the provided password with the stored password
      const isMatch = await comparePassword(password, user.password);
  
      if (!isMatch) {
        res.status(400).json({ message: 'Invalid credentials' });
        return
      }
  
      // Generate JWT token
      const token = await encodeAuthToken(user.userId);
      console.log("token" + token);
  
      res.json({ token });
    } catch (err) {
      res.status(500).json({ message: 'Server error' });
      console.log(err);
    }
});

router.get('/me', authenticate, async (req: Request<{}, string>, res: Response) => {
  try {
    const userId = (req as any).userId;
    const user = await User.findOne({ userId }).select('-password');
    console.log(user);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
