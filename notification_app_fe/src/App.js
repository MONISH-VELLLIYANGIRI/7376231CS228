import React, { useState, useEffect } from 'react';
import { Container, Paper, Box, Alert, CircularProgress } from '@mui/material';
import FilterBar from './components/FilterBar';
import PriorityList from './components/PriorityList';
import NotificationList from './components/NotificationList';
import Log from './utils/Log';
import authService from './utils/authService';

const App = () => {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [readNotifications, setReadNotifications] = useState(new Set());
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 10;
  const apiBaseUrl = 'http://localhost:5000/api/notifications';

  // Fetch notifications from API with Bearer token
  const fetchNotifications = async (filterType, pageNum) => {
    setLoading(true);
    setError(null);
    
    try {
      Log('frontend', 'info', 'api', `Fetching notifications - filter: ${filterType}, page: ${pageNum}`);
      
      // Get access token (will fetch if expired)
      const accessToken = await authService.getAccessToken();
      
      if (!accessToken) {
        throw new Error('No access token available. Please check authentication credentials.');
      }

      let url = `${apiBaseUrl}?limit=${itemsPerPage}&page=${pageNum}`;
      if (filterType !== 'All') {
        url += `&notification_type=${filterType}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Normalize notifications structure
      let normalizedNotifications = Array.isArray(data) 
        ? data 
        : (data.notifications || []);

      // Normalize field names (API returns uppercase, frontend expects lowercase)
      normalizedNotifications = normalizedNotifications.map(notif => ({
        id: notif.ID || notif.id,
        type: notif.Type || notif.type,
        message: notif.Message || notif.message,
        timestamp: notif.Timestamp || notif.timestamp,
      }));

      // Validate notification structure
      if (normalizedNotifications.length > 0) {
        const firstNotif = normalizedNotifications[0];
        if (!firstNotif.id || !firstNotif.type || !firstNotif.message || !firstNotif.timestamp) {
          Log('frontend', 'warn', 'api', 'Notification structure may not match expected format');
        }
      }

      setNotifications(normalizedNotifications);
      setTotalPages(data.totalPages || Math.ceil(normalizedNotifications.length / itemsPerPage));
      Log('frontend', 'info', 'api', `Successfully fetched ${normalizedNotifications.length} notifications`);
    } catch (err) {
      Log('frontend', 'error', 'api', `Failed to fetch notifications: ${err.message}`);
      setError(`Failed to load notifications: ${err.message}`);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Load notifications on component mount only
  // Filter/page changes are handled by dedicated handler functions
  useEffect(() => {
    // Initialize authentication with user credentials
    authService.setCredentials({
      email: 'monish.cs23@bitsathy.ac.in',
      name: 'MONISH V',
      rollNo: '7376231CS228',
      accessCode: 'uKaJfm',
      clientID: '28821bec-94df-4617-9104-d2a3ceae3734',
      clientSecret: 'ExFGTBcrXEaneUFG',
    });

    // Fetch notifications after auth is initialized
    fetchNotifications(filter, page);
    // Intentionally empty - we only want to load once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    Log('frontend', 'info', 'component', `Filter changed from '${filter}' to '${newFilter}'`);
    setFilter(newFilter);
    setPage(1);
    fetchNotifications(newFilter, 1);
  };

  // Handle pagination
  const handleNextPage = () => {
    if (page < totalPages) {
      Log('frontend', 'info', 'component', `Moving to next page (${page} -> ${page + 1})`);
      const newPage = page + 1;
      setPage(newPage);
      fetchNotifications(filter, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      Log('frontend', 'info', 'component', `Moving to previous page (${page} -> ${page - 1})`);
      const newPage = page - 1;
      setPage(newPage);
      fetchNotifications(filter, newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  const unreadCount = notifications.length - readNotifications.size;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <h1 style={{ margin: '0 0 8px 0', fontSize: '2.5rem' }}>Campus Notifications</h1>
        <p style={{ margin: 0, color: '#666', fontSize: '0.95rem' }}>
          {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
        </p>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          onClose={() => setError(null)}
          sx={{ mb: 3, cursor: 'pointer' }}
        >
          {error}
        </Alert>
      )}

      <FilterBar
        currentFilter={filter}
        onFilterChange={handleFilterChange}
      />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && notifications.length > 0 && (
        <>
          <Box sx={{ mb: 4 }}>
            <Paper sx={{ p: 3, boxShadow: 2 }}>
              <h2 style={{ marginTop: 0, marginBottom: 16, color: '#333' }}>
                🔥 Priority Inbox (Top 10)
              </h2>
              <PriorityList
                notifications={getPriorityNotifications()}
                readNotifications={readNotifications}
                onMarkAsRead={handleMarkAsRead}
              />
            </Paper>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Paper sx={{ p: 3, boxShadow: 2 }}>
              <h2 style={{ marginTop: 0, marginBottom: 16, color: '#333' }}>
                📬 All Notifications
              </h2>
              <NotificationList
                notifications={notifications}
                readNotifications={readNotifications}
                onMarkAsRead={handleMarkAsRead}
              />
            </Paper>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
            <button
              onClick={handlePrevPage}
              disabled={page === 1}
              style={{
                padding: '10px 20px',
                cursor: page === 1 ? 'not-allowed' : 'pointer',
                opacity: page === 1 ? 0.5 : 1,
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              ← Previous
            </button>
            <span style={{ 
              display: 'flex', 
              alignItems: 'center', 
              padding: '0 12px',
              fontWeight: 600,
              fontSize: '16px',
              minWidth: '120px',
              justifyContent: 'center'
            }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page >= totalPages}
              style={{ 
                padding: '10px 20px', 
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                opacity: page >= totalPages ? 0.5 : 1,
                backgroundColor: '#1976d2',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              Next →
            </button>
          </Box>
        </>
      )}

      {!loading && notifications.length === 0 && !error && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <p style={{ fontSize: '18px', color: '#999' }}>📭 No notifications found.</p>
        </Box>
      )}
    </Container>
  );
};

export default App;
