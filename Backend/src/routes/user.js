import express from 'express';
import User from '../models/User.js';
import CodeSubmission from '../models/CodeSubmission.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user dashboard statistics
router.get('/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user stats from CodeSubmission model
    const stats = await CodeSubmission.getUserStats(userId);

    // Get recent submissions
    const recentSubmissions = await CodeSubmission.find({ user: userId })
      .select('-code')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get language distribution
    const languageStats = await CodeSubmission.aggregate([
      { $match: { user: userId } },
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get score trends (last 10 submissions)
    const scoreTrends = await CodeSubmission.find({
      user: userId,
      'analysis.status': 'completed'
    })
      .select('analysis.score createdAt')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        stats,
        recentSubmissions,
        languageStats,
        scoreTrends: scoreTrends.reverse() // Show oldest to newest for trend
      }
    });

  } catch (error) {
    console.error('❌ Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get dashboard data',
      error: error.message
    });
  }
});

export default router;