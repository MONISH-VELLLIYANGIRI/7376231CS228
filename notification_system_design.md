# Campus Notifications System Design - Stage 2 (Frontend)

## Overview
A React-based notification management system for campus applications with priority-based inbox, filtering, and pagination capabilities. Stage 2 focuses on building a responsive frontend application that consumes the Notification API.

## System Architecture

### Backend API Integration
**Endpoint**: `http://4.224.186.213/evaluation-service/notifications`  
**Method**: GET  
**Protection**: Route is protected (authorization assumed pre-authenticated)

### Query Parameters
- `limit` - Number of notifications per page (default: 10)
- `page` - Page number for pagination (starts from 1)
- `notification_type` - Filter by type: "Event", "Result", or "Placement"

### Notification Data Model
```javascript
{
  "ID": "unique-identifier",
  "Type": "Event" | "Result" | "Placement",
  "Message": "notification message text",
  "Timestamp": "2026-04-22 17:51:30"
}
```

## Frontend Components

### 1. **App.js** (Main Container)
- State management using React hooks (useState, useEffect)
- Fetches notifications from API on mount and on filter/page changes
- Manages: notifications, filter, page, loading, error, readNotifications
- Logs all API interactions and state changes

### 2. **FilterBar.js** (Filter Controls)
- Dropdown selection: All / Event / Result / Placement
- Visual labels with emojis for better UX
- Responsive design for mobile
- Triggers refetch on filter change

### 3. **PriorityList.js** (Top 10 Prioritized)
- Displays top 10 notifications with priority sorting
- Priority Logic:
  ```
  Placement (priority: 3)
  Result (priority: 2)
  Event (priority: 1)
  Within same type → Sort by timestamp (newest first)
  ```
- Click to mark as read
- Visual distinction: unread (yellow border) vs read (gray)

### 4. **NotificationList.js** (Full List)
- Displays all notifications from current page
- Always sorted by latest timestamp first
- Click to mark as read
- Color-coded by type with emoji indicators
- Different background for read/unread

## State Management Pattern

```javascript
const [notifications, setNotifications] = useState([]);      // Current page data
const [filter, setFilter] = useState('All');                 // Active filter
const [page, setPage] = useState(1);                         // Current page
const [loading, setLoading] = useState(false);               // API loading state
const [error, setError] = useState(null);                    // Error message
const [readNotifications, setReadNotifications] = useState(new Set()); // Read notification IDs
const [totalPages, setTotalPages] = useState(1);             // Total pages available
```

## API Call Flow

```
Initial Load
    ↓
Fetch notifications (page 1, All filter)
    ↓
Update state with data
    ↓
Render UI

User Changes Filter
    ↓
Reset to page 1
    ↓
Fetch with new filter
    ↓
Update state and UI

User Changes Page
    ↓
Fetch with new page number
    ↓
Update state and UI
    ↓
Scroll to top
```

## Logging Integration

### Log Service Endpoint
**URL**: `http://4.224.186.213/evaluation-service/log`  
**Method**: POST  
**Body Format**:
```javascript
{
  "stack": "frontend",
  "level": "info|debug|warn|error|fatal",
  "package": "api|component|state|page",
  "message": "descriptive message"
}
```

### Logging Locations
1. **API Calls**
   - `info`: Fetch start with filter/page params
   - `info`: Fetch success with record count
   - `error`: Fetch failure with error message

2. **User Actions**
   - `info`: Filter changed (from → to)
   - `info`: Pagination (current → next/prev page)
   - `debug`: Notification marked as read

3. **Error Scenarios**
   - `error`: Network errors
   - `error`: Invalid API response
   - `warn`: Unexpected data structure

## UI Features

### Header Section
- Title: "Campus Notifications"
- Subtitle showing unread count
- Responsive typography

### Filter Section
- Dropdown with emoji labels
- Current selection display
- Full-width on mobile

### Priority Inbox Section
- Labeled "🔥 Priority Inbox (Top 10)"
- Card-based layout with borders
- Orange border for unread, gray for read
- Emoji indicators per type
- Hover effects for interactivity

### Notification List Section
- Labeled "📬 All Notifications"
- Same card layout as priority inbox
- Latest timestamp at top
- Status indicators (● NEW / ✓ Read)

### Pagination Section
- Previous button (disabled on page 1)
- Current page indicator
- Next button
- Styled with Material UI

## Responsive Design

### Desktop (> 600px)
- Full-width container (max 1200px)
- 2.5rem padding on cards
- 16px font for messages
- Full filter control width (220px)

### Mobile (< 600px)
- Full-width layout
- 2rem padding on cards
- 14px font for messages
- Full-width (100%) filter control
- Touch-friendly button sizes

## Error Handling

### Network Errors
- Display user-friendly message
- Show error in Alert component
- Allow retry via refresh/filter change
- Log error details to service

### API Response Errors
- Handle non-200 status codes
- Parse error messages
- Prevent app crash
- Keep UI interactive

### Data Validation
- Validate notification structure
- Handle missing fields gracefully
- Log warnings for unexpected formats
- Fallback to default values

## Material UI Integration

### Required Packages
- `@mui/material` - Component library
- `@mui/icons-material` - Icon library
- `@emotion/react` - CSS-in-JS engine
- `@emotion/styled` - Styled components

### Components Used
- `Container` - Layout wrapper
- `Box` - Flexible layout component
- `Paper` - Elevated surface
- `Alert` - Error messages
- `CircularProgress` - Loading indicator
- `Chip` - Tag/badge display
- `Select/MenuItem` - Dropdown filter
- `FormControl/InputLabel` - Form elements

## Performance Optimizations

1. **Lazy State Updates** - Only update UI when data changes
2. **Dependency Arrays** - useEffect only runs on relevant changes
3. **Set for Read State** - O(1) lookup instead of array includes()
4. **String Formatting** - Format dates once during render
5. **Scroll Performance** - Smooth scroll to top on pagination

## Code Quality Standards

✅ **Functional Components** - React hooks only, no class components  
✅ **Simple Architecture** - Single source of truth (state in App)  
✅ **No Redux** - useState/useEffect sufficient for requirements  
✅ **Minimal Comments** - Code is self-documenting  
✅ **Error Resilience** - Graceful degradation on failures  
✅ **Accessibility** - Semantic HTML, keyboard navigation  
✅ **Mobile First** - Responsive by design  

## Testing Scenarios

1. **Load Test**: Verify API call on page mount
2. **Filter Test**: Change filter and verify refetch
3. **Pagination Test**: Navigate between pages
4. **Read State Test**: Click notification, verify visual change
5. **Error Test**: Disconnect and verify error display
6. **Mobile Test**: Resize browser and verify responsive layout

## Deployment Checklist

- [ ] All API endpoints updated to production URL
- [ ] Logging service configured
- [ ] Error handling covers all scenarios
- [ ] Responsive design tested on multiple devices
- [ ] No console errors or warnings
- [ ] Performance optimized (< 3s initial load)
- [ ] Accessibility audit passed
- [ ] Code review completed
- [ ] Git history clean with meaningful commits

