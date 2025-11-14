import React, { useState, useEffect } from 'react';
import API from '../services/api';

const MyIssues = () => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const fetchMyIssues = async () => {
    try {
      const { data } = await API.get('/issues/my-issues');
      setIssues(data);
    } catch (err) {
      alert('Failed to fetch issues');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-32">
          <div className="text-lg">Loading your issues...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">My Reported Issues</h1>

      {issues.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">You haven't reported any issues yet.</p>
          <a 
            href="/report" 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Report Your First Issue
          </a>
        </div>
      ) : (
        <div className="grid gap-6">
          {issues.map((issue) => (
            <div key={issue._id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800">{issue.title}</h3>
                <div className="flex space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(issue.status)}`}>
                    {issue.status.replace('-', ' ').toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(issue.priority)}`}>
                    {issue.priority.toUpperCase()}
                  </span>
                </div>
              </div>

              <p className="text-gray-600 mb-4">{issue.description}</p>

              <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div>
                  <strong>Category:</strong> {issue.category}
                </div>
                <div>
                  <strong>Ward:</strong> {issue.location?.wardNumber}
                </div>
                <div>
                  <strong>Location:</strong> {issue.location?.address}
                </div>
                <div>
                  <strong>Reported:</strong> {new Date(issue.createdAt).toLocaleDateString()}
                </div>
              </div>

              {issue.assignedTo && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <strong>Assigned To:</strong> {issue.assignedTo.name}
                </div>
              )}

              {issue.resolutionDetails && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <strong>Resolution Notes:</strong> {issue.resolutionDetails.notes}
                  <br />
                  <strong>Resolved On:</strong> {new Date(issue.resolutionDetails.resolvedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyIssues;