import ParcelActivity from '../models/ParcelActivity.js';

const buildParcelActivityResponse = (activity) => ({
  id: activity._id,
  fromLocation: activity.fromLocation,
  toLocation: activity.toLocation,
  isActive: activity.isActive,
  createdAt: activity.createdAt,
  helper: {
    id: activity.helper._id,
    name: activity.helper.name,
    email: activity.helper.email,
    profileImage: activity.helper.profileImage,
    helpCount: activity.helper.helpCount
  }
});

export const createParcelActivity = async (req, res) => {
  try {
    const { fromLocation, toLocation } = req.body;

    if (!fromLocation || !toLocation) {
      return res.status(400).json({ message: 'From location and to location are required' });
    }

    const activity = await ParcelActivity.create({
      helper: req.user._id,
      fromLocation,
      toLocation
    });

    const populatedActivity = await activity.populate('helper', 'name email profileImage helpCount');

    return res.status(201).json({
      message: 'Parcel helper activity created',
      activity: buildParcelActivityResponse(populatedActivity)
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({ message: 'Could not create parcel helper activity' });
  }
};

export const getActiveParcelHelpers = async (_req, res) => {
  try {
    const activities = await ParcelActivity.find({ isActive: true })
      .populate('helper', 'name email profileImage helpCount')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      activities: activities.map(buildParcelActivityResponse)
    });
  } catch (_error) {
    return res.status(500).json({ message: 'Could not load active parcel helpers' });
  }
};

