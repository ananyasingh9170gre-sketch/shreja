import Task from "../models/Task.js";
import Note from "../models/Note.js";
import Placement from "../models/Placement.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAnalytics = asyncHandler(async (req, res) => {
  const [tasks, notesCount, placement] = await Promise.all([
    Task.find({ user: req.user._id }),
    Note.countDocuments({ uploadedBy: req.user._id }),
    Placement.findOne({ user: req.user._id })
  ]);

  const completedTopics = tasks.filter((t) => t.category === "topic" && t.completed).length;
  const totalTopics = tasks.filter((t) => t.category === "topic").length;
  const studySessions = tasks.filter((t) => t.category === "study");
  const totalStudyMinutes = studySessions.reduce((acc, item) => acc + (item.studyMinutes || 0), 0);

  const now = new Date();
  const monthAgo = new Date(now);
  monthAgo.setDate(now.getDate() - 30);

  const weeklyStudy = [0, 0, 0, 0, 0, 0, 0];
  studySessions.forEach((session) => {
    const sessionDate = new Date(session.studyDate || session.createdAt);
    const daysDiff = Math.floor((now - sessionDate) / (1000 * 60 * 60 * 24));
    if (daysDiff >= 0 && daysDiff < 7) {
      weeklyStudy[6 - daysDiff] += session.studyMinutes || 0;
    }
  });

  const monthlyPerformance = {
    tasksCompleted: tasks.filter((t) => t.completed && new Date(t.updatedAt) >= monthAgo).length,
    studyMinutes: studySessions
      .filter((s) => new Date(s.studyDate || s.createdAt) >= monthAgo)
      .reduce((acc, s) => acc + (s.studyMinutes || 0), 0)
  };

  res.json({
    notesCount,
    topicsProgress: {
      completed: completedTopics,
      total: totalTopics,
      percentage: totalTopics ? Math.round((completedTopics / totalTopics) * 100) : 0
    },
    study: {
      totalMinutes: totalStudyMinutes,
      weeklyData: weeklyStudy
    },
    monthlyPerformance,
    placement: {
      dsaSolved: placement?.dsaSolved || 0,
      dsaTarget: placement?.dsaTarget || 300,
      companiesTracked: placement?.companies.length || 0
    }
  });
});
