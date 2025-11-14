import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    priority: ''
  });

  useEffect(() => {
    fetchIssues();
    fetchStats();
  }, [filters]);

  const fetchIssues = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status) params.append('status', filters.status);
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);

      const { data } = await API.get(`/issues?${params}`);
      setIssues(data.issues);
    } catch (err) {
      alert('Failed to fetch issues');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await API.get('/issues/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const updateIssueStatus = async (issueId, status, resolutionNotes = '') => {
    try {
      await API.put(`/issues/${issueId}/status`, { 
        status, 
        resolutionNotes 
      });
      alert('Status updated successfully!');
      setSelectedIssue(null);
      fetchIssues();
      fetchStats();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const deleteIssue = async (issueId) => {
    try {
      await API.delete(`/issues/${issueId}`);
      alert('Issue deleted successfully!');
      setDeleteConfirm(null);
      fetchIssues();
      fetchStats();
    } catch (err) {
      alert('Failed to delete issue');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'reported': 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'resolved': 'bg-green-100 text-green-800',
      'closed': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'critical': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Road': 'fas fa-road',
      'Water': 'fas fa-tint',
      'Electricity': 'fas fa-bolt',
      'Garbage': 'fas fa-trash',
      'Sanitation': 'fas fa-soap',
      'Other': 'fas fa-question-circle'
    };
    return icons[category] || 'fas fa-question-circle';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-32">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage and monitor all reported issues</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-lg">
          <i className="fas fa-shield-alt text-blue-500"></i>
          <span className="text-blue-700 font-semibold">Administrator Access</span>
        </div>
      </div>

      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md text-center border-l-4 border-blue-500">
            <div className="text-2xl font-bold text-blue-600">{stats.totalIssues}</div>
            <div className="text-gray-600 font-medium">Total Issues</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center border-l-4 border-yellow-500">
            <div className="text-2xl font-bold text-yellow-600">{stats.reportedIssues}</div>
            <div className="text-gray-600 font-medium">Reported</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center border-l-4 border-blue-400">
            <div className="text-2xl font-bold text-blue-600">{stats.inProgressIssues}</div>
            <div className="text-gray-600 font-medium">In Progress</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-md text-center border-l-4 border-green-500">
            <div className="text-2xl font-bold text-green-600">{stats.resolvedIssues + stats.closedIssues}</div>
            <div className="text-gray-600 font-medium">Resolved</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="reported">Reported</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          <select
            value={filters.category}
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            <option value="Road">Road</option>
            <option value="Water">Water</option>
            <option value="Electricity">Electricity</option>
            <option value="Garbage">Garbage</option>
            <option value="Sanitation">Sanitation</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      {/* Issues List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            All Reported Issues ({issues.length})
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Issue Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ward
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {issues.map((issue) => (
                <tr key={issue._id} className="hover:bg-gray-50 transition duration-150">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {issue.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        by {issue.reportedBy?.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(issue.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <i className={`${getCategoryIcon(issue.category)} mr-2 text-blue-500`}></i>
                      <span className="text-sm text-gray-900">{issue.category}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {issue.location?.wardNumber || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(issue.status)}`}>
                      {issue.status.replace('-', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(issue.priority)}`}>
                      {issue.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedIssue(issue)}
                        className="text-blue-600 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-lg transition duration-200"
                        title="Update Status"
                      >
                        <i className="fas fa-edit mr-1"></i>
                        Status
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(issue)}
                        className="text-red-600 hover:text-red-900 bg-red-50 hover:bg-red-100 px-3 py-1 rounded-lg transition duration-200"
                        title="Delete Issue"
                      >
                        <i className="fas fa-trash mr-1"></i>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {issues.length === 0 && (
          <div className="text-center py-12">
            <i className="fas fa-inbox text-4xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-500">No issues found</h3>
            <p className="text-gray-400 mt-1">No issues match your current filters</p>
          </div>
        )}
      </div>

      {/* Update Status Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              Update Issue Status
            </h3>
            <p className="text-gray-600 mb-4">{selectedIssue.title}</p>
            
            <div className="space-y-3">
              <button
                onClick={() => updateIssueStatus(selectedIssue._id, 'in-progress')}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
              >
                <i className="fas fa-play-circle mr-2"></i>
                Mark as In Progress
              </button>
              
              <button
                onClick={() => {
                  const notes = prompt('Enter resolution notes:');
                  if (notes) {
                    updateIssueStatus(selectedIssue._id, 'resolved', notes);
                  }
                }}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition duration-200 font-semibold"
              >
                <i className="fas fa-check-circle mr-2"></i>
                Mark as Resolved
              </button>
              
              <button
                onClick={() => updateIssueStatus(selectedIssue._id, 'closed')}
                className="w-full bg-gray-600 text-white py-3 rounded-lg hover:bg-gray-700 transition duration-200 font-semibold"
              >
                <i className="fas fa-times-circle mr-2"></i>
                Mark as Closed
              </button>
            </div>
            
            <button
              onClick={() => setSelectedIssue(null)}
              className="w-full mt-4 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-200 font-semibold"
            >
              <i className="fas fa-times mr-2"></i>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="text-center">
              <i className="fas fa-exclamation-triangle text-3xl text-red-500 mb-4"></i>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                Confirm Deletion
              </h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete the issue "{deleteConfirm.title}"? 
                This action cannot be undone.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition duration-200 font-semibold"
                >
                  <i className="fas fa-times mr-2"></i>
                  Cancel
                </button>
                <button
                  onClick={() => deleteIssue(deleteConfirm._id)}
                  className="bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition duration-200 font-semibold"
                >
                  <i className="fas fa-trash mr-2"></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;