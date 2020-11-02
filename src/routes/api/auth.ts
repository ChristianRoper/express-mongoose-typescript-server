import dotenv from 'dotenv'
import { Router, Request, Response } from 'express';
import User from '../../models/User';
import auth, { UserAuthInfo } from "../../middleware/auth";
import { check, validationResult } from 'express-validator';
import * as jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'

dotenv.config();

const router = Router();

// @route   GET api/auth
// @desc    Test route
// @access  Public
router.get('/', auth, async (req: UserAuthInfo, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).send('Server Error');
  }
});

// @route   POST api/auth
// @desc    Authenticate user & get token
// @access  Public
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password, (user as any).password)

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token })
        }
      );

    } catch (error) {
      res.status(500).send('Server Error')
    }
  });

export default router;
