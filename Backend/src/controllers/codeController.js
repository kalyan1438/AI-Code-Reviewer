import CodeSubmission from "../models/CodeSubmission.js";
import { reviewCode } from "../services/aiService.js";

export const submitCode = async (req, res) => {
  const { code } = req.body;
  const userId = req.user._id;

  try {
    const review = await reviewCode(code);

    const submission = await CodeSubmission.create({
      user: userId,
      code,
      review,
    });

    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getHistory = async (req, res) => {
  const userId = req.user._id;
  try {
    const submissions = await CodeSubmission.find({ user: userId }).sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
