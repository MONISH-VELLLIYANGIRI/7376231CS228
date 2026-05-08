import React, { useState, useEffect } from 'react';
import { Container, Paper, Box, Alert, CircularProgress } from '@mui/material';
import FilterBar from './components/FilterBar';
import PriorityList from './components/PriorityList';
import NotificationList from './components/NotificationList';
import Log from '../../logging_middleware/Log';

const App = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [readNotifications, setReadNotifications] = useState(new Set());

  const itemsPerPage = 10;
  const apiBaseUrl = '/evaluation-service/notifications';

  // Fetch notifications from API
  const fetchNotifications = async (filterType, pageNum) => {
    setLoading(true);
    setError(null);
    
    try {
      Log('frontend', 'info', 'api', `Fetching notifications - filter: ${filterType}, page: ${pageNum}`);
      
      let url = `${apiBaseUrl}?limit=${itemsPerPage}&page=${pageNum}`;
      if (filterType !== 'All') {
        url += `&notification_type=${filterType}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Normalize notifications structure
      const normalizedNotifications = Array.isArray(data) 
        ? data 
        : (data.notifications || []);

      setNotifications(normalizedNotifications);
      Log('frontend', 'info', 'api', `Successfully fetched ${normalizedNotifications.length} notifications`);
    } catch (err) {
      Log('frontend', 'error', 'api', `Failed to fetch notifications: ${err.message}`);
      setError('Failed to load notifications. Please try again.');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchNotifications(filter, page);
  }, []);

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    Log('frontend', 'info', 'component', `Filter changed to: ${newFilter}`);
    setFilter(newFilter);
    setPage(1);
    fetchNotifications(newFilter, 1);
  };

  // Handle pagination
  const handleNextPage = () => {
    Log('frontend', 'info', 'component', `Moving to next page`);
    const newPage = page + 1;
    setPage(newPage);
    fetchNotifications(filter, newPage);
  };

  const handlePrevPage = () => {
    if (page > 1) {
      Log('frontend', 'info', 'component', `Moving to previous page`);
      const newPage = page - 1;
      setPage(newPage);
      fetchNotifications(filter, newPage);
    }
  };

  // Handle marking notification as read
  const handleMarkAsRead = (notificationId) => {
    setReadNotifications(prev => new Set(prev).add(notificationId));
    Log('frontend', 'debug', 'component', `Notification ${notificationId} marked as read`);
  };

  // Get priority-sorted notifications (top 10)
  const getPriorityNotifications = () => {
    const priorityOrder = { 'Placement': 3, 'Result': 2, 'Event': 1 };
    
    return notifications
      .slice()
      .sort((a, b) => {
        const priorityDiff = (priorityOrder[b.type] || 0) - (priorityOrder[a.type] || 0);
        if (priorityDiff !== 0) return priorityDiff;
        
        return new Date(b.timestamp) - new Date(a.timestamp);
      })
      .slice(0, 10);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <h1 style={{ margin: '0 0 24px 0' }}>Campus Notifications</h1>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <FilterBar
        currentFilter={filter}
        onFilterChange={handleFilterChange}
      />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && notifications.length > 0 && (
        <>
          <Box sx={{ mb: 4 }}>
            <Paper sx={{ p: 3 }}>
              <h2 style={{ marginTop: 0 }}>Priority Inbox</h2>
              <PriorityList
                notifications={getPriorityNotifications()}
                readNotifications={readNotifications}
                onMarkAsRead={handleMarkAsRead}
              />
            </Paper>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Paper sx={{ p: 3 }}>
              <h2 style={{ marginTop: 0 }}>All Notifications</h2>
              <NotificationList
                notifications={notifications}
                readNotifications={readNotifications}
                onMarkAsRead={handleMarkAsRead}
              />
            </Paper>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              style={{
                padding: '8px 16px',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                opacity: page === 1 ? 0.5 : 1,
              }}
            >
              Previous
            </button>
            <span style={{ display: 'flex', alignItems: 'center', padding: '0 8px' }}>
              Page {page}
            </span>
            <button
              onClick={handleNextPage}
              style={{ padding: '8px 16px', cursor: 'pointer' }}
            >
              Next
            </button>
          </Box>
        </>
      )}

      {!loading && notifications.length === 0 && !error && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <p>No notifications found.</p>
        </Box>
      )}
    </Container>
  );
};

export default App;
