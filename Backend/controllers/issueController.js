import Issue from '../models/Issue.js';

export const createIssue = async (req, res) => {
  try {
    const { images, ...issueData } = req.body;
    
    const issue = new Issue({
      ...issueData,
      reportedBy: req.user._id,
      location: {
        ...issueData.location,
        wardNumber: req.user.wardNumber
      },
      images: images || []
    });

    const createdIssue = await issue.save();
    const populatedIssue = await Issue.findById(createdIssue._id)
      .populate('reportedBy', 'name email wardNumber avatar')
      .populate('assignedTo', 'name email');

    res.status(201).json(populatedIssue);
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({ reportedBy: req.user._id })
      .populate('reportedBy', 'name email avatar')
      .populate('assignedTo', 'name email')
      .populate('resolutionDetails.resolvedBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllIssues = async (req, res) => {
  try {
    const { status, category, priority, page = 1, limit = 10 } = req.query;
    
    let filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const issues = await Issue.find(filter)
      .populate('reportedBy', 'name email wardNumber avatar')
      .populate('assignedTo', 'name email')
      .populate('resolutionDetails.resolvedBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Issue.countDocuments(filter);

    res.json({
      issues,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateIssueStatus = async (req, res) => {
  try {
    const { status, resolutionNotes, afterImage } = req.body;
    
    const updateData = { status };
    
    if (status === 'resolved' || status === 'closed') {
      updateData.resolutionDetails = {
        resolvedBy: req.user._id,
        resolvedAt: new Date(),
        notes: resolutionNotes,
        afterImage: afterImage
      };
    }

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
    .populate('reportedBy', 'name email avatar')
    .populate('assignedTo', 'name email')
    .populate('resolutionDetails.resolvedBy', 'name email');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json(issue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const assignIssue = async (req, res) => {
  try {
    const { assignedTo } = req.body;
    
    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      { new: true, runValidators: true }
    )
    .populate('reportedBy', 'name email avatar')
    .populate('assignedTo', 'name email');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json(issue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getIssueStats = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const reportedIssues = await Issue.countDocuments({ status: 'reported' });
    const inProgressIssues = await Issue.countDocuments({ status: 'in-progress' });
    const resolvedIssues = await Issue.countDocuments({ status: 'resolved' });
    const closedIssues = await Issue.countDocuments({ status: 'closed' });
    
    const issuesByCategory = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const issuesByWard = await Issue.aggregate([
      {
        $group: {
          _id: '$location.wardNumber',
          count: { $sum: 1 }
        }
      }
    ]);

    const issuesByStatus = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalIssues,
      reportedIssues,
      inProgressIssues,
      resolvedIssues,
      closedIssues,
      issuesByCategory,
      issuesByWard,
      issuesByStatus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('reportedBy', 'name email wardNumber avatar')
      .populate('assignedTo', 'name email')
      .populate('resolutionDetails.resolvedBy', 'name email');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    // Check if user owns the issue or is admin
    if (issue.reportedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this issue' });
    }

    await Issue.findByIdAndDelete(req.params.id);
    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};