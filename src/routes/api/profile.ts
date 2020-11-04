import dotenv from 'dotenv'
import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import auth, { UserAuthInfo } from '../../middleware/auth';
import { Profile, User } from '../../models'

dotenv.config();
const router = Router();

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get('/me', auth, async (req: UserAuthInfo, res: Response) => {
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

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
router.post(
  '/',
  [
    auth,
    check('status', 'Status is required')
      .not()
      .isEmpty()
  ],
  async (req: UserAuthInfo, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      status,
      username,
      website,
      bio,
      phone,
    } = req.body;

    // Build profile object
    const profileFields: any = {};
    profileFields.user = req.user.id;
    if (name) profileFields.name = name;
    if (status) profileFields.status = status;
    if (username) profileFields.username = username;
    if (website) profileFields.website = website;
    if (bio) profileFields.bio = bio;
    if (phone) profileFields.phone = phone;

    try {
      let profile: any = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      profile = new Profile(profileFields);
      await profile.save()

      res.json(profile)
    } catch (error) {
      res.status(500).send('Server Error')
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get(
  '/',
  async (req: Request, res: Response) => {
    try {
      const profiles = await Profile.find().populate('user', ['name', 'avatar'])
      res.json(profiles);
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get(
  '/user/:user_id',
  async (req: Request, res: Response) => {
    try {
      const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])
      if (!profile) return res.status(400).json({ msg: "Profile not found" })

      res.json(profile);
    } catch (error) {
      if (error.kind === 'ObjectId') return res.status(400).json({ msg: "Profile not found" })
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/profile
// @desc    Delete profile, user & posts
// @access  Private
router.delete(
  '/',
  auth,
  async (req: UserAuthInfo, res: Response) => {
    try {
      await Profile.findOneAndRemove({ user: req.user.id });
      await User.findOneAndRemove({ _id: req.user.id });
      res.json({ msg: 'User deleted' });
    } catch (error) {
      res.status(500).send('Server Error');
    }
  }
);

export default router;
