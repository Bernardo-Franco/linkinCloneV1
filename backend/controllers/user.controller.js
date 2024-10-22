import User from '../models/user.model.js';
import cloudinary from '../lib/cloudinary.js';

export const getSuggestedConnections = async (req, res) => {
  try {
    //const currentUser = await User.findById(req.user._id).select('connections'); //- redundant cuz the user is already setted to the req in the login

    //find users who are not already connected and also do not recomment our own profile
    const suggestedUsers = await User.find({
      _id: {
        $ne: req.user._id,
        //$nin: currentUser.connections,
        $nin: req.user.connections,
      },
    })
      .select('name username profilePicture headline')
      .limit(3);
    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log('Error in getSuggestedConnections: ', error);
    res.status(500).json({ message: error.message });
  }
};

export const getPublicProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username }).select(
      '-password'
    );
    if (!user) {
      return res.status(404).json({ message: 'user not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log('Error in getPublicProfile: ', error);
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const allowedFields = [
      'name',
      'username',
      'headline',
      'about',
      'location',
      'profilePicture',
      'bannerImg',
      'skills',
      'experience',
      'education',
    ];
    const updatedData = {};

    for (const field of allowedFields) {
      if (req.body[field]) {
        updatedData[field] = req.body[field];
      }
    }

    if (req.body.profilePicture) {
      const result = await cloudinary.uploader.upload(req.body.profilePicture);
      updatedData.profilePicture = result.secure_url;
    }

    if (req.body.bannerImg) {
      const result = await cloudinary.uploader.upload(req.body.bannerImg);
      updatedData.bannerImg = result.secure_url;
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: updatedData,
      },
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (error) {
    console.error('Error in updateProfile controller: ', error);
    res.status(500).json({ message: 'server error' });
  }
};