import Friendship from '../models/Friendship.js';
import User from '../models/User.js';

const userFields = 'name email profileImage helpCount contactInfo';

const buildUserResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  profileImage: user.profileImage,
  helpCount: user.helpCount,
  contactInfo: user.contactInfo
});

const buildRequestResponse = (request) => ({
  id: request._id,
  status: request.status,
  requester: buildUserResponse(request.requester),
  recipient: buildUserResponse(request.recipient),
  createdAt: request.createdAt
});

export const searchUsers = async (req, res) => {
  try {
    const query = (req.query.q || '').trim();

    if (!query) {
      return res.status(200).json({ users: [] });
    }

    const users = await User.find({
      _id: { $ne: req.user._id },
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
      .select(userFields)
      .limit(12);

    const userIds = users.map((user) => user._id);
    const friendships = await Friendship.find({
      $or: [
        { requester: req.user._id, recipient: { $in: userIds } },
        { requester: { $in: userIds }, recipient: req.user._id }
      ]
    });

    const friendshipByUserId = new Map();

    friendships.forEach((friendship) => {
      const otherUserId = friendship.requester.equals(req.user._id)
        ? friendship.recipient.toString()
        : friendship.requester.toString();

      friendshipByUserId.set(otherUserId, {
        id: friendship._id,
        status: friendship.status,
        direction: friendship.requester.equals(req.user._id) ? 'outgoing' : 'incoming'
      });
    });

    return res.status(200).json({
      users: users.map((user) => ({
        ...buildUserResponse(user),
        friendship: friendshipByUserId.get(user._id.toString()) || null
      }))
    });
  } catch (_error) {
    return res.status(500).json({ message: 'Could not search users' });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;

    if (!recipientId) {
      return res.status(400).json({ message: 'Recipient is required' });
    }

    if (recipientId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot send a friend request to yourself' });
    }

    const recipient = await User.findById(recipientId);

    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingFriendship = await Friendship.findOne({
      $or: [
        { requester: req.user._id, recipient: recipientId },
        { requester: recipientId, recipient: req.user._id }
      ]
    });

    if (existingFriendship) {
      return res.status(409).json({ message: 'Friend request or friendship already exists' });
    }

    const friendship = await Friendship.create({
      requester: req.user._id,
      recipient: recipientId
    });

    const populatedFriendship = await friendship.populate([
      { path: 'requester', select: userFields },
      { path: 'recipient', select: userFields }
    ]);

    return res.status(201).json({
      message: 'Friend request sent',
      request: buildRequestResponse(populatedFriendship)
    });
  } catch (_error) {
    return res.status(500).json({ message: 'Could not send friend request' });
  }
};

export const getIncomingFriendRequests = async (req, res) => {
  try {
    const requests = await Friendship.find({
      recipient: req.user._id,
      status: 'pending'
    })
      .populate('requester', userFields)
      .populate('recipient', userFields)
      .sort({ createdAt: -1 });

    return res.status(200).json({
      requests: requests.map(buildRequestResponse)
    });
  } catch (_error) {
    return res.status(500).json({ message: 'Could not load friend requests' });
  }
};

export const respondToFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { action } = req.body;

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Action must be accept or reject' });
    }

    const request = await Friendship.findOne({
      _id: requestId,
      recipient: req.user._id,
      status: 'pending'
    });

    if (!request) {
      return res.status(404).json({ message: 'Pending friend request not found' });
    }

    request.status = action === 'accept' ? 'accepted' : 'rejected';
    await request.save();

    const populatedRequest = await request.populate([
      { path: 'requester', select: userFields },
      { path: 'recipient', select: userFields }
    ]);

    return res.status(200).json({
      message: `Friend request ${request.status}`,
      request: buildRequestResponse(populatedRequest)
    });
  } catch (_error) {
    return res.status(500).json({ message: 'Could not update friend request' });
  }
};

export const getFriends = async (req, res) => {
  try {
    const friendships = await Friendship.find({
      status: 'accepted',
      $or: [
        { requester: req.user._id },
        { recipient: req.user._id }
      ]
    })
      .populate('requester', userFields)
      .populate('recipient', userFields)
      .sort({ updatedAt: -1 });

    const friends = friendships.map((friendship) => {
      const friend = friendship.requester._id.equals(req.user._id)
        ? friendship.recipient
        : friendship.requester;

      return {
        friendshipId: friendship._id,
        ...buildUserResponse(friend)
      };
    });

    return res.status(200).json({ friends });
  } catch (_error) {
    return res.status(500).json({ message: 'Could not load friends list' });
  }
};

