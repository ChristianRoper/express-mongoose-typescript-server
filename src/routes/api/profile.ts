import dotenv from 'dotenv'
import { Router, Request, Response } from 'express';
import auth, { UserAuthInfo } from '../../middleware/auth';
import { Profile, User } from '../../models'

dotenv.config();

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
export default Router().get('/me', auth, async (req: UserAuthInfo, res: Response) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' })
    }

    res.json(profile);
  } catch (error) {
    res.status(500).send('Server Error')
  }
});
