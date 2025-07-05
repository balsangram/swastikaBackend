// Create or update a time table activity (e.g., "breakfast", "sleep")
export const createOrUpdateActivity = async (req, res) => {
  // req.body = { activity: "breakfast", plannedTime: "07:30 AM" }
  res.status(200).json({ message: "📌 Activity created or updated successfully" });
};

// Record time when user clicks on an activity
export const recordActivityClick = async (req, res) => {
  // req.body = { activity: "breakfast" }
  // Save current timestamp as performedTime in DB
  res.status(200).json({ message: "🕒 Activity click recorded with current time" });
};

// Get today's timetable for the logged-in user
export const getTodayTimetable = async (req, res) => {
  // Fetch all activities for today from DB using req.user._id
  res.status(200).json({ message: "📅 Today’s timetable retrieved" });
};

// Get all timetable activity logs for the user
export const getUserActivityHistory = async (req, res) => {
  // Fetch all historical activities grouped by date
  res.status(200).json({ message: "📜 Full activity history retrieved" });
};
