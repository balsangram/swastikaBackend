import Message from '../../models/chart/Message.js';
import Chat from '../../models/chart/chat.model.js';
import User from '../../models/user.model.js'; // Adjust path to your User model

// Fetch latest messages
export const getMessages = async (req, res) => {
  console.log('Received request for /api/swastic/chat/messages', req.query);
  const limit = parseInt(req.query.limit) || 50;
  try {
    if (limit < 1) {
      return res.status(400).json({ error: 'Invalid limit parameter' });
    }

    const messages = await Message.find()
      // .sort({ createdAt: -1 }) // Newest first
      .limit(limit)
      .lean();
    console.log('Fetched messages:', messages.length);

    res.status(200).json({
      messages,
      total: messages.length,
    });
  } catch (err) {
    console.error('Failed to fetch messages:', err.message, err.stack);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Other routes
const displayFriends = async (req, res) => {
  res.send("📋 Displaying friends list");
};

export const followFriend = async (req, res) => {
  try {
    const userId = req.user.id; // Logged-in user's ID
    const friendId = req.body.friendId; // ID of the friend to follow (from request body)

    if (!friendId) {
      return res.status(400).json({ error: 'Friend ID is required' });
    }

    if (userId === friendId) {
      return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    // Check if the friend exists
    const friend = await User.findById(friendId);
    if (!friend) {
      return res.status(404).json({ error: 'Friend not found' });
    }

    // Check if a 1-to-1 chat already exists
    let chat = await Chat.findOne({
      isGroupChat: false,
      participants: { $all: [userId, friendId], $size: 2 },
    });

    // If no chat exists, create a new 1-to-1 chat
    if (!chat) {
      chat = await Chat.create({
        isGroupChat: false,
        participants: [userId, friendId],
        lastUpdatedBy: userId,
      });
    }

    // Optionally, update User's friend list (if you have a friends array in User model)
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { friends: friendId } }, // Assuming User model has a friends array
      { new: true }
    );

    return res.status(200).json({ message: '➕ Followed friend successfully', chatId: chat._id });
  } catch (error) {
    console.error('Error following friend:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
const unfollowFriend = async (req, res) => {
  res.send("➖ Unfollowed friend");
};
const createGroup = async (req, res) => {
  res.send("👥 Group created");
};
const deleteGroup = async (req, res) => {
  res.send("🗑️ Group deleted");
};
const addGroupMember = async (req, res) => {
  res.send("✅ Member added to group");
};
const removeGroupMember = async (req, res) => {
  res.send("❌ Member removed from group");
};
const changeAdminToUser = async (req, res) => {
  res.send("🔁 Admin rights transferred");
};
const createRoom = async (req, res) => {
  res.send("📦 Room created");
};
const enterRoom = async (req, res) => {
  res.send("🚪 Entered room");
};

export const sendMessage = async (req, res) => {
  try {
    const userId = req.user.id; // Logged-in user's ID
    const { chatId, content, messageType, mediaUrl } = req.body; // Input from request body

    // Validate input
    if (!chatId || (!content && !mediaUrl)) {
      return res.status(400).json({ error: 'Chat ID and content or media URL are required' });
    }

    // Validate messageType if provided
    const validMessageTypes = ['text', 'image', 'video', 'audio', 'file'];
    if (messageType && !validMessageTypes.includes(messageType)) {
      return res.status(400).json({ error: 'Invalid message type' });
    }

    // Check if the chat exists and the user is a participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: userId,
    });

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found or user not a participant' });
    }

    // Create the message
    const message = await Message.create({
      chatId,
      sender: userId,
      content: content || '',
      messageType: messageType || 'text',
      mediaUrl: mediaUrl || '',
      isReadBy: [userId], // Sender has read their own message
      deletedFor: [],
    });

    // Update the chat's latestMessage and lastUpdatedBy
    chat.latestMessage = message._id;
    chat.lastUpdatedBy = userId;
    await chat.save();

    // Populate sender details for the response
    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username') // Adjust fields as per your User model
      .populate('chatId', 'chatName participants');

    return res.status(200).json({ message: '✉️ Message sent successfully', data: populatedMessage });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};
const globalChat = async (req, res) => {
  res.send("🌐 Global chat data");
};
