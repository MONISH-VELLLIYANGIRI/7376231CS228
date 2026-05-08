# Campus Notifications Frontend - 7376231CS228

A React-based notification management system for campus applications with priority-based inbox, filtering, and pagination capabilities.

## Repository Structure

```
7376231CS228/
├── logging_middleware/
│   └── Log.js              # Reusable logging utility
├── notification_system_design.md   # System architecture & design doc
├── notification_app_be/    # Backend (minimal/empty for frontend track)
├── notification_app_fe/    # Main React Frontend Application
│   ├── src/
│   │   ├── components/
│   │   │   ├── NotificationList.js   # Full notification list display
│   │   │   ├── PriorityList.js       # Top 10 prioritized notifications
│   │   │   └── FilterBar.js          # Filter dropdown and controls
│   │   ├── App.js          # Main app component with state management
│   │   ├── index.js        # React DOM render
│   │   └── index.css       # (Optional) Global styles
│   ├── public/
│   │   └── index.html      # HTML entry point
│   └── package.json        # Dependencies
├── .gitignore
└── README.md
```

## Features

### ✅ API Integration
- Base URL: `/evaluation-service/notifications`
- Query Parameters: `limit`, `page`, `notification_type`
- Automatic fetching on:
  - Initial page load
  - Filter changes
  - Pagination changes

### ✅ Notification Display
- Shows: message, type, timestamp
- Sorted by latest first
- Visual distinction:
  - **Unread**: Highlighted with yellow background + orange "● New" badge
  - **Read**: Dimmed with gray background
- Click any notification to mark as read (local state)

### ✅ Priority Inbox (Core Requirement)
- Displays top 10 notifications
- Priority Logic:
  ```
  Placement > Result > Event
  (Within same type → sorted by latest timestamp first)
  ```

### ✅ Filtering & Pagination
- **Filter Options**: All / Event / Result / Placement
- **Pagination**: Previous/Next buttons with page tracking
- Auto-refetch on filter/page changes

### ✅ Material UI Design
- Clean, responsive layout
- Proper spacing and typography
- Color-coded notification types
- Accessible components

### ✅ Logging Integration
- Logs API requests (start/end)
- Logs filter changes
- Logs errors with context
- Format: `[timestamp] [FRONTEND] [level] [package] message`

### ✅ Error Handling
- User-friendly error messages
- Graceful API failure handling
- No application crashes

## Setup & Installation

### Prerequisites
- Node.js 14+ installed
- npm or yarn package manager
- Git configured with user credentials

### Installation Steps

1. **Navigate to frontend directory:**
   ```bash
   cd notification_app_fe
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm start
   ```
   - App will open at `http://localhost:3000`
   - Make sure your backend API is running at `/evaluation-service/notifications`

4. **Build for production:**
   ```bash
   npm run build
   ```

## Usage

### Component Hierarchy
```
App
├── FilterBar
├── PriorityList
├── NotificationList
└── Pagination Controls
```

### State Management
- `notifications`: Array of current notifications
- `filter`: Current filter type (All/Event/Result/Placement)
- `page`: Current page number
- `readNotifications`: Set of read notification IDs
- `loading`: API request state
- `error`: Error message display

### Logging Usage
```javascript
import Log from '../../logging_middleware/Log';

Log('frontend', 'info', 'api', 'Fetching notifications...');
Log('frontend', 'error', 'api', 'Failed to fetch: ' + error);
Log('frontend', 'debug', 'component', 'Filter changed');
```

## API Response Format

Expected notification format:
```javascript
{
  id: "unique-id",
  message: "Notification message",
  type: "Event" | "Result" | "Placement",
  timestamp: "2024-05-08T10:30:00Z",
  read: false (optional)
}
```

## Code Quality Features

✅ **Functional Components Only** - Uses React Hooks (useState, useEffect)  
✅ **No Redux/Complex State** - Pure useState for simplicity  
✅ **Simple Folder Structure** - Easy to navigate  
✅ **Minimal Comments** - Code is self-documenting  
✅ **No Overengineering** - Straightforward implementations  
✅ **Error Handling** - Graceful failure scenarios  
✅ **Clean Commits** - Logical, descriptive commit messages  

## Key Implementation Details

### Priority Inbox Logic
The priority calculation in `App.js`:
```javascript
const priorityOrder = { 'Placement': 3, 'Result': 2, 'Event': 1 };
// Sorts by priority (descending) then by timestamp (newest first)
```

### Read/Unread State
- Managed locally in a Set for performance
- Clicking notification adds its ID to readNotifications
- UI updates immediately without API call

### Pagination
- `itemsPerPage` = 10 (matches API limit)
- API called on page change with current filter
- Previous button disabled on page 1

### Filter Changes
- Resets to page 1 on filter change
- Logs filter change for debugging
- API called immediately with new filter

## Testing

To test the application:

1. **Filter Notifications:**
   - Select different types from dropdown
   - Observe list updates

2. **Pagination:**
   - Click Next/Previous buttons
   - Verify correct data loads

3. **Mark as Read:**
   - Click any notification
   - Observe visual change (gray background)

4. **Error Handling:**
   - Disconnect API or trigger 404
   - Verify error message displays gracefully

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- IE11: ❌ Not supported

## Performance Notes

- Notifications list capped at API response limit
- Priority list limited to top 10
- Read state managed in memory (not persisted)
- No unnecessary re-renders with proper dependency arrays

## File Sizes

- `App.js`: ~2.5 KB
- `NotificationList.js`: ~1.2 KB
- `PriorityList.js`: ~1.2 KB
- `FilterBar.js`: ~0.6 KB
- `Log.js`: ~0.5 KB

## Troubleshooting

**API Connection Error:**
- Ensure backend is running at `/evaluation-service/notifications`
- Check CORS settings if API is on different domain

**Styling Issues:**
- Material UI CSS should auto-inject
- If styling missing, ensure @mui/material is properly installed

**Notifications Not Loading:**
- Check browser console for API errors
- Verify API response format matches expected structure
- Check network tab in DevTools

## Git Commits

All changes tracked with clear commit messages:
```
- Initial commit: Campus Notifications Frontend...
- (Add additional commits here as you develop)
```

## Author
Roll Number: 7376231CS228

## License
Educational Use Only
