# Development Guide - Campus Notifications Frontend

## Quick Start

### Prerequisites
- Node.js 14+ installed
- npm or yarn package manager

### Setup

```bash
# 1. Navigate to frontend directory
cd notification_app_fe

# 2. Install dependencies
npm install

# 3. Start development server
npm start
```

The application will open at `http://localhost:3000` and automatically reload on code changes.

## API Endpoints

### Notifications API
```
GET http://4.224.186.213/evaluation-service/notifications
```

**Query Parameters:**
- `limit` - Records per page (default: 10)
- `page` - Page number (starts from 1)
- `notification_type` - Filter: "Event", "Result", or "Placement"

**Example Requests:**
```
# Get first 10 notifications
http://4.224.186.213/evaluation-service/notifications?limit=10&page=1

# Get all Event type notifications
http://4.224.186.213/evaluation-service/notifications?limit=10&page=1&notification_type=Event

# Get Results on page 2
http://4.224.186.213/evaluation-service/notifications?limit=10&page=2&notification_type=Result
```

### Logging API
```
POST http://4.224.186.213/evaluation-service/log
```

**Request Body:**
```json
{
  "stack": "frontend",
  "level": "info",
  "package": "api",
  "message": "Fetching notifications for page 1"
}
```

## Project Structure

```
notification_app_fe/
├── src/
│   ├── components/
│   │   ├── FilterBar.js          # Filter dropdown
│   │   ├── PriorityList.js       # Top 10 notifications
│   │   └── NotificationList.js   # Full notification list
│   ├── App.js                    # Main component & state
│   └── index.js                  # React entry point
├── public/
│   └── index.html                # HTML template
├── package.json                  # Dependencies
└── .env.example                  # Configuration template
```

## State Management

All state is managed in `App.js` using React hooks:

```javascript
const [notifications, setNotifications] = useState([]);
const [filter, setFilter] = useState('All');
const [page, setPage] = useState(1);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [readNotifications, setReadNotifications] = useState(new Set());
```

## Key Features

### Priority Inbox Algorithm
```javascript
const priorityOrder = { 'Placement': 3, 'Result': 2, 'Event': 1 };
notifications
  .sort((a, b) => {
    // Sort by priority (descending)
    const diff = (priorityOrder[b.type] || 0) - (priorityOrder[a.type] || 0);
    if (diff !== 0) return diff;
    // Then by timestamp (newest first)
    return new Date(b.timestamp) - new Date(a.timestamp);
  })
  .slice(0, 10); // Take top 10
```

### Read/Unread Tracking
Uses a Set for efficient tracking and visual differentiation:
- **Unread**: Yellow background (#fffbea) + "● NEW" badge
- **Read**: Gray background (#f5f5f5) + "✓ Read" badge

### Responsive Design
- **Desktop** (>600px): Full card layout with comfortable spacing
- **Mobile** (<600px): Compact layout with full-width controls

## Common Development Tasks

### Add a New Filter Type
1. Edit `FilterBar.js` - add to `filterOptions` array
2. Ensure backend API supports `notification_type` parameter
3. Test filtering works correctly

### Modify Card Styling
1. Edit `PriorityList.js` or `NotificationList.js`
2. Update `sx` prop in Box component
3. Test on mobile and desktop

### Change API Endpoint
1. Update `apiBaseUrl` in `App.js`
2. Verify endpoint returns correct format
3. Test API calls in browser DevTools

### Add Notification Action
1. Create handler function in `App.js`
2. Pass as prop to child component
3. Add button/click handler in component

## Logging

The application logs to both console and remote logging service:

```javascript
import Log from '../../logging_middleware/Log';

// Different log levels
Log('frontend', 'info', 'api', 'Starting notification fetch');
Log('frontend', 'debug', 'component', 'Filter changed to: Event');
Log('frontend', 'error', 'api', 'Failed to fetch: Network error');
```

**Log Locations in Code:**
- API request start/end: `App.js` fetchNotifications()
- Filter changes: `App.js` handleFilterChange()
- Page navigation: `App.js` handleNextPage/handlePrevPage()
- Read state: `App.js` handleMarkAsRead()

## Testing Checklist

- [ ] Notifications load on initial mount
- [ ] Filter dropdown works for all types
- [ ] Pagination navigates correctly
- [ ] Clicking notification marks as read
- [ ] Visual changes occur for read/unread
- [ ] Priority inbox shows correct top 10
- [ ] Error message displays on API failure
- [ ] Layout responsive on mobile
- [ ] No console errors
- [ ] Logs appear in console

## Troubleshooting

### API Connection Error
**Problem**: "Failed to load notifications: [error message]"

**Solutions:**
1. Check API endpoint is correct in App.js
2. Verify backend is running
3. Check network tab in DevTools for request details
4. Ensure CORS is enabled if on different domain

### Styling Issues
**Problem**: Components don't look right

**Solutions:**
1. Clear browser cache (Ctrl+Shift+Del)
2. Restart dev server (`npm start`)
3. Verify Material UI is installed (`npm list @mui/material`)

### State Not Updating
**Problem**: Changes don't reflect in UI

**Solutions:**
1. Check dependency arrays in useEffect hooks
2. Verify state setter is being called
3. Check React DevTools for component re-renders
4. Look for console errors

### Performance Issues
**Problem**: App loads slowly or feels sluggish

**Solutions:**
1. Check Network tab for slow API responses
2. Look for unnecessary re-renders (React DevTools)
3. Reduce notification count per page if needed
4. Check browser extensions interfering

## Build for Production

```bash
npm run build
```

Creates optimized production build in `build/` directory.

## Resources

- [React Documentation](https://react.dev)
- [Material UI Documentation](https://mui.com)
- [Fetch API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [JavaScript Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)

## Notes

- Do not store sensitive data in localStorage
- API endpoint is public (pre-authorized)
- Read state is only stored in local memory (not persisted)
- Timestamps are formatted to user's local timezone
- All API calls include error handling and logging
