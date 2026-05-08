import React from 'react';
import { Box, Chip, useMediaQuery, useTheme } from '@mui/material';

const NotificationList = ({ notifications, readNotifications, onMarkAsRead }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const getTypeColor = (type) => {
    switch (type) {
      case 'Placement':
        return 'error';
      case 'Result':
        return 'warning';
      case 'Event':
        return 'info';
      default:
        return 'default';
    }
  };

  const getTypeEmoji = (type) => {
    switch (type) {
      case 'Placement':
        return '💼';
      case 'Result':
        return '📊';
      case 'Event':
        return '📅';
      default:
        return '📌';
    }
  };

  const formatDate = (timestamp) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (err) {
      return 'Invalid date';
    }
  };

  // Sort notifications by latest first
  const sortedNotifications = notifications.slice().sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  if (sortedNotifications.length === 0) {
    return <p style={{ color: '#999' }}>📭 No notifications to display.</p>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      {sortedNotifications.map((notification) => (
        <Box
          key={notification.id}
          onClick={() => onMarkAsRead(notification.id)}
          sx={{
            cursor: 'pointer',
            backgroundColor: readNotifications.has(notification.id)
              ? '#f5f5f5'
              : '#e8f5e9',
            border: '1px solid',
            borderColor: readNotifications.has(notification.id)
              ? '#e0e0e0'
              : '#81c784',
            borderRadius: '8px',
            p: isMobile ? 2 : 2.5,
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: '#f0f0f0',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            },
          }}
        >
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
            <Box sx={{ fontSize: '20px', flexShrink: 0 }}>
              {getTypeEmoji(notification.type)}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{
                  flex: 1,
                  fontWeight: 500,
                  color: readNotifications.has(notification.id) ? '#999' : '#333',
                  wordBreak: 'break-word',
                  fontSize: isMobile ? '13px' : '15px',
                }}>
                  {notification.message}
                </span>
                <Chip
                  label={notification.type}
                  color={getTypeColor(notification.type)}
                  size="small"
                  variant={readNotifications.has(notification.id) ? 'outlined' : 'filled'}
                  sx={{ flexShrink: 0 }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                <span style={{
                  fontSize: isMobile ? '11px' : '12px',
                  color: '#666',
                }}>
                  {formatDate(notification.timestamp)}
                </span>
                {!readNotifications.has(notification.id) && (
                  <span style={{
                    color: '#ff9800',
                    fontWeight: 'bold',
                    fontSize: '11px',
                  }}>
                    ● UNREAD
                  </span>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default NotificationList;
