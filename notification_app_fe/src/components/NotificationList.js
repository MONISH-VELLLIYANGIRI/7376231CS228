import React from 'react';
import { List, ListItem, ListItemText, Chip, Box } from '@mui/material';

const NotificationList = ({ notifications, readNotifications, onMarkAsRead }) => {
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

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  // Sort notifications by latest first
  const sortedNotifications = notifications.slice().sort((a, b) => {
    return new Date(b.timestamp) - new Date(a.timestamp);
  });

  if (sortedNotifications.length === 0) {
    return <p>No notifications to display.</p>;
  }

  return (
    <List>
      {sortedNotifications.map((notification) => (
        <ListItem
          key={notification.id}
          onClick={() => onMarkAsRead(notification.id)}
          sx={{
            cursor: 'pointer',
            backgroundColor: readNotifications.has(notification.id)
              ? '#f5f5f5'
              : '#fffbea',
            mb: 1,
            borderRadius: 1,
            border: '1px solid #e0e0e0',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
        >
          <ListItemText
            primary={
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <span style={{ flex: 1 }}>{notification.message}</span>
                <Chip label={notification.type} color={getTypeColor(notification.type)} size="small" />
              </Box>
            }
            secondary={
              <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                <span>{formatDate(notification.timestamp)}</span>
                {!readNotifications.has(notification.id) && (
                  <span style={{ color: '#ff9800', fontWeight: 'bold' }}>● New</span>
                )}
              </Box>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default NotificationList;
