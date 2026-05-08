# Campus Notifications System Design

## Overview
A React-based notification management system for campus applications with priority-based inbox, filtering, and pagination capabilities.

## Architecture

### Components
1. **NotificationList** - Displays all notifications with read/unread states
2. **PriorityList** - Shows top 10 prioritized notifications
3. **FilterBar** - Dropdown filter and pagination controls
4. **App** - Main orchestrator with state management

### State Management
- Uses React hooks (useState, useEffect)
- Manages: notifications, page, filter, read/unread states
- No external state libraries

## API Integration
- Base URL: /evaluation-service/notifications
- Query Parameters: limit, page, notification_type
- Triggers: initial load, filter change, pagination change

## Priority Logic
```
Priority Order:
1. Placement > Result > Event
2. Within same type → Sort by latest timestamp first
3. Default limit: 10 notifications
```

## Notification Model
```javascript
{
  id: string,
  message: string,
  type: 'Event' | 'Result' | 'Placement',
  timestamp: ISO8601,
  read: boolean
}
```

## UI Features
- Header with title
- Filter dropdown (All / Event / Result / Placement)
- Priority inbox section (top 10)
- Full notification list
- Pagination controls (Next/Previous)
- Unread notifications highlighted
- Material UI for responsive design

## Logging Integration
- Logs API requests (start/end)
- Logs filter changes
- Logs errors with context
- Stack: "frontend", Levels: debug, info, warn, error, fatal

## Error Handling
- User-friendly error messages
- Graceful API failure handling
- No application crashes
