# Campus Notifications Frontend - 7376231CS228

This submission is a React notification dashboard built around a live campus API. It is designed to show the actual notification flow end-to-end: authentication, fetch, filtering, prioritisation, read-state updates, and responsive rendering.

## What this project does

- Pulls notifications from the evaluation service through a local Express proxy
- Requests a bearer token before loading protected data
- Normalises the API response so the UI can render it consistently
- Sorts notifications into a priority inbox with the rule Placement > Result > Event
- Shows the full list with pagination and read/unread styling
- Supports four views: All, Event, Result, and Placement
- Runs on `http://localhost:3000` for the frontend and `http://localhost:5000` for the proxy

## Folder Map

```text
7376231CS228/
├── notification_app_be/
│   └── server.js
├── notification_app_fe/
│   └── src/
│       ├── App.js
│       ├── components/
│       │   ├── FilterBar.js
│       │   ├── PriorityList.js
│       │   └── NotificationList.js
│       └── utils/
│           ├── authService.js
│           └── Log.js
├── output_picture/
├── register.js
└── README.md
```

## How to run it

Open two terminals.

Terminal 1:
```bash
cd notification_app_be
npm install
npm start
```

Terminal 2:
```bash
cd notification_app_fe
npm install
npm start
```

Then open `http://localhost:3000`.

## Main behavior

### Priority Inbox
- Shows the top 10 notifications after priority sorting
- Keeps the newest item first within each type
- Uses small visual cues so the important items stand out quickly

### Full List View
- Displays the current page of notifications
- Pagination is set to 10 items per page
- Clicking a card marks it as read in local state

### Filter Bar
- Switches between All, Event, Result, and Placement
- Resets to page 1 after each filter change
- Fetches data again immediately so the screen stays in sync

### Authentication and Data Flow
1. The app asks the proxy for a token.
2. The proxy forwards the request to the evaluation service.
3. The token is cached until it expires.
4. Notification requests include the bearer token automatically.

### Response Handling
- The API returns uppercase field names, so the frontend maps them into the shape used by the React components.
- This avoids rendering bugs and keeps the list logic simple.

## Visual design choices

- Material UI is used for layout, spacing, chips, buttons, and selects
- The interface adapts to mobile and desktop widths
- Read and unread items are visually different
- The lists stay compact so the important content remains visible on screen

## Evidence folder

The `output_picture/` folder is reserved for screenshots of the running app, including the desktop layout, responsive layout, filters, pagination, and priority inbox.

## Files worth checking

- `notification_app_fe/src/App.js` for data loading and page/filter state
- `notification_app_fe/src/utils/authService.js` for token handling
- `notification_app_be/server.js` for the proxy and CORS handling
- `notification_app_fe/src/components/PriorityList.js` for the priority inbox
- `notification_app_fe/src/components/NotificationList.js` for pagination and read-state display

## Validation checklist

- [x] App opens on `http://localhost:3000`
- [x] Proxy responds on `http://localhost:5000`
- [x] Real notifications load from the live service
- [x] Priority ordering works as intended
- [x] Filters update the view correctly
- [x] Pagination works across pages
- [x] Read/unread styling updates on click
- [x] Responsive layout works on smaller screens

## Submission note

The wording in this README now reflects the actual behavior implemented in the app.
