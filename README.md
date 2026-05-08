# Campus Notifications Frontend - 7376231CS228

Complete React-based campus notification system with real API integration, priority inbox, filtering, and pagination.

## 🚀 Quick Start

### Prerequisites
- Node.js 14+
- npm or yarn

### Setup (3 Steps)

**Step 1: Backend Proxy** (handles CORS)
```bash
cd notification_app_be
npm install
npm start
```

**Step 2: Frontend** (new terminal)
```bash
cd notification_app_fe
npm install
npm start
```

**Step 3: View**
- Open http://localhost:3000
- See `output_picture/` for screenshots

---

## 📁 Repository Structure

```
7376231CS228/
├── notification_app_be/              # Express proxy server
│   ├── server.js                     # CORS proxy routes
│   └── package.json
│
├── notification_app_fe/              # React Frontend
│   ├── src/
│   │   ├── App.js                    # State management & API
│   │   ├── components/
│   │   │   ├── FilterBar.js          # Filter dropdown
│   │   │   ├── PriorityList.js       # Top 10 notifications
│   │   │   └── NotificationList.js   # All notifications
│   │   └── utils/
│   │       ├── authService.js        # Bearer token auth
│   │       └── Log.js                # Logging middleware
│   └── package.json
│
├── output_picture/                   # Screenshots & outputs
│   └── (app screenshots here)
│
├── register.js                       # Registration script
└── README.md                         # This file
```

---

## ✨ Features

### ✅ Real API Integration
- Proxy server on `localhost:5000`
- Connects to `http://4.224.186.213/evaluation-service`
- Bearer token authentication
- Field name normalization (uppercase → lowercase)

### ✅ Priority Inbox
- **Top 10** most relevant notifications
- **Priority Order**: Placement > Result > Event
- **Sorting**: Latest first
- **Visual Indicators**: Color-coded chips + emoji badges

### ✅ Notifications List
- **All notifications** paginated (10 per page)
- **Latest first** sorting
- **Read/Unread state**: Yellow border = unread, gray = read
- **Click to mark as read**

### ✅ Filtering
- **4 Options**: All / Event / Result / Placement
- **Real-time**: Auto-fetches filtered data
- **Material UI**: Clean dropdown component

### ✅ Pagination
- **Previous/Next** navigation buttons
- **Page counter**: Shows current/total pages
- **Auto-reset**: Page 1 on filter change

### ✅ Responsive Design
- **Mobile** (<600px): Compact layout
- **Desktop** (>600px): Full layout
- **All devices**: Flex-based responsive UI

### ✅ Comprehensive Logging
- Console logs (all operations)
- Backend logs (POST to /api/log)
- Log levels: debug, info, warn, error, fatal
- Timestamps on all entries

---

## 🔐 Authentication

**Credentials:**
- Email: monish.cs23@bitsathy.ac.in
- Name: MONISH V
- Roll No: 7376231CS228
- Access Code: uKaJfm
- Client ID: 28821bec-94df-4617-9104-d2a3ceae3734
- Client Secret: ExFGTBcrXEaneUFG

**Flow:**
1. Frontend requests token via `/api/auth`
2. Proxy forwards to external API
3. Token cached for 30+ minutes
4. Bearer token used in all protected requests

---

## 🏗️ System Architecture

```
Frontend (React)          Proxy (Express)        External API
localhost:3000      →     localhost:5000    →    4.224.186.213
                    
- App.js                - CORS handling         - /auth
- Components            - Route forwarding      - /notifications
- authService           - Error handling        - /logs
```

---

## 📊 Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18.2.0 + Material UI 5.14.0 |
| Backend Proxy | Express.js + CORS + Axios |
| State | React Hooks (useState/useEffect only) |
| HTTP | Fetch API + Axios |
| Styling | Material UI components |

---

## 📸 Output Screenshots

See **`output_picture/`** folder for:
- App screenshots (desktop view)
- Mobile responsive view (< 600px)
- Filter demonstrations
- Pagination examples
- All UI components

---

## ✅ Verification Checklist

- [x] App runs on http://localhost:3000
- [x] Proxy runs on http://localhost:5000
- [x] Real API data loading
- [x] Bearer token auth working
- [x] Priority inbox sorted correctly
- [x] Filters working (4 types)
- [x] Pagination working
- [x] Read/unread tracking
- [x] Responsive design
- [x] Error handling
- [x] Logging integrated
- [x] Material UI styling
- [x] React hooks only
- [x] Git commits complete

---

## 🐛 Troubleshooting

| Issue | Fix |
|-------|-----|
| "Port already in use" | `taskkill /PID <PID> /F` |
| "No access token" | Check proxy running on 5000 |
| CORS errors | Ensure proxy server started |
| Invalid dates | Already fixed in field normalization |
| API 401 errors | Verify credentials in App.js |

---

## 📝 Development Notes

### Key Files
- **App.js**: State management, API orchestration
- **authService.js**: Token management & auth logic
- **server.js**: Express proxy routes
- **Log.js**: Logging middleware

### Code Quality
- ✅ Functional components only
- ✅ Hooks-based state (no Redux)
- ✅ Clean error handling
- ✅ Comprehensive logging
- ✅ Responsive Material UI

### Git History
```
a2b8258 - Add npm start script & documentation
43b0a15 - Implement CORS proxy & field normalization
dace602 - Add registration script
d37a26d - Implement authentication service
```

---

## 🚀 Production Deployment

1. Update proxy `origin` in server.js
2. Set environment variables for credentials
3. Use PM2 for process management
4. Configure logging persistence
5. Add rate limiting & security headers

---

## 📞 Support & Questions

1. Check browser console (F12) for errors
2. Check proxy terminal for API logs
3. Verify both frontend & proxy running
4. Check authService.js credentials

---

**Status**: Ready for submission ✅
