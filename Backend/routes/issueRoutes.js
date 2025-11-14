import express from 'express';
import {
  createIssue,
  getMyIssues,
  getAllIssues,
  updateIssueStatus,
  assignIssue,
  getIssueStats,
  getIssueById,
  deleteIssue
} from '../controllers/issueController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (protected)
router.post('/', protect, createIssue);
router.get('/my-issues', protect, getMyIssues);

// Admin routes
router.get('/stats', protect, admin, getIssueStats);
router.get('/', protect, admin, getAllIssues);
router.get('/:id', protect, getIssueById);
router.put('/:id/status', protect, admin, updateIssueStatus);
router.put('/:id/assign', protect, admin, assignIssue);
router.delete('/:id', protect, deleteIssue);

export default router;