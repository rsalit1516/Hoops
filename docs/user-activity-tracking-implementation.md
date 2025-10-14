# User Activity Tracking and Session Persistence Implementation

## Overview

This implementation adds automatic user session persistence to the Angular application, allowing users to stay logged in for up to 20 minutes after their last activity, even if they refresh the browser.

## Key Features

### 1. **Automatic Session Persistence**

- User sessions are automatically saved to localStorage when a user logs in
- Sessions persist through browser refreshes for up to 20 minutes of inactivity
- Session data includes user information, login time, and last activity timestamp

### 2. **Activity Tracking**

- Comprehensive activity tracking monitors:
  - Mouse movements, clicks, and scrolls
  - Keyboard input
  - Touch events (mobile support)
  - Router navigation
  - API calls (via HTTP interceptor)
  - Browser tab visibility changes

### 3. **Automatic Session Expiration**

- Sessions automatically expire after 20 minutes of inactivity
- Clean localStorage cleanup on expiration
- Optional session timer display for debugging (development only)

## Implementation Details

### New Services

#### `UserActivityService`

- **Location**: `src/app/services/user-activity.service.ts`
- **Purpose**: Tracks user activity and manages localStorage session data
- **Key Methods**:
  - `recordActivity()`: Updates last activity timestamp
  - `saveUserSession(user)`: Saves user data to localStorage
  - `loadUserSession()`: Retrieves and validates session from localStorage
  - `clearUserSession()`: Removes session data
  - `getSessionInfo()`: Returns session timing information

#### `ActivityTrackingInterceptor`

- **Location**: `src/app/services/activity-tracking.interceptor.ts`
- **Purpose**: Automatically tracks API calls as user activity
- **Functionality**: Records activity for all non-auth API requests

### Enhanced Services

#### `AuthService` Updates

- **Enhanced Constructor**: Now checks localStorage first, then falls back to server authentication
- **Activity Integration**: Records activity on login and saves sessions automatically
- **New Methods**:
  - `recordActivity()`: Manual activity recording
  - `getSessionInfo()`: Session timing information
  - `hasValidSession()`: Session validation check
  - `logoutDueToInactivity()`: Inactivity-based logout

### UI Components

#### `SessionTimerComponent`

- **Location**: `src/app/shared/components/session-timer/session-timer.component.ts`
- **Purpose**: Optional visual session timer (development only)
- **Features**:
  - Real-time countdown display
  - Visual warning when session is expiring (< 5 minutes)
  - Tooltip with session information

#### `TopNav` Component Updates

- **Enhancement**: Integrated session timer for development debugging
- **Display**: Only shows session timer in non-production environments

## Configuration

### Session Settings

```typescript
// In UserActivityService
private readonly SESSION_TIMEOUT = 20 * 60 * 1000; // 20 minutes
private readonly STORAGE_KEY = 'hoops_user_session';
```

### Activity Events Tracked

```typescript
const events = [
  "mousedown",
  "mousemove",
  "keypress",
  "scroll",
  "touchstart",
  "click",
];
```

## Data Structure

### Session Data Format

```typescript
interface UserSessionData {
  user: User; // Complete user object
  lastActivity: number; // Timestamp of last activity
  loginTime: number; // Timestamp of login
}
```

## User Experience Flow

### 1. **Initial Login**

1. User logs in successfully
2. Session data saved to localStorage
3. Activity tracking begins
4. 20-minute countdown starts

### 2. **Activity Tracking**

1. Any user interaction resets the 20-minute timer
2. API calls automatically extend the session
3. Navigation between pages extends the session

### 3. **Browser Refresh**

1. App checks localStorage for valid session
2. If session exists and is within 20 minutes, user is automatically logged in
3. If session expired, user must log in again
4. Server authentication is used as fallback if no localStorage session

### 4. **Session Expiration**

1. After 20 minutes of inactivity, session expires
2. User is automatically logged out
3. localStorage is cleaned up
4. User must log in again

## Development Features

### Session Timer Display

- Visible only in development/local environments
- Shows remaining session time in MM:SS format
- Yellow warning when < 5 minutes remaining
- Pulsing animation for expiring sessions

### Enhanced Logging

- Detailed activity tracking logs (development only)
- Session save/load logging
- Authentication flow logging
- Error handling with meaningful messages

## Security Considerations

### Data Storage

- User data stored in localStorage (client-side only)
- Sessions automatically expire and cleanup
- No sensitive data (passwords) stored in localStorage

### Activity Validation

- Server-side authentication still validates all requests
- localStorage session is convenience only, not security
- Cookie-based authentication remains primary security mechanism

## Browser Compatibility

### Supported Features

- localStorage support (all modern browsers)
- Document event listeners
- Visibility API for tab focus detection
- Touch events for mobile devices

### Fallback Behavior

- If localStorage unavailable, falls back to server authentication
- If activity tracking fails, session still expires after 20 minutes

## Configuration Options

### Environment-Based Settings

```typescript
// Show session timer only in development
<csbc-session-timer *ngIf="!env?.production"></csbc-session-timer>

// Logging levels based on environment
enableDebug: !environment.production && environment.environment === 'local'
```

## Implementation Files Changed

### New Files

- `src/app/services/user-activity.service.ts`
- `src/app/services/activity-tracking.interceptor.ts`
- `src/app/shared/components/session-timer/session-timer.component.ts`

### Modified Files

- `src/app/services/auth.service.ts` - Added session persistence and activity integration
- `src/app/app.config.ts` - Added HTTP interceptor registration
- `src/app/shared/components/top-nav/top-nav.ts` - Added session timer integration
- `src/app/shared/components/top-nav/top-nav.html` - Added session timer display

## Testing Recommendations

### Manual Testing

1. **Login and Refresh**: Login, refresh browser, verify auto-login
2. **Activity Extension**: Login, interact with app, verify session extends
3. **Inactivity Expiration**: Login, wait 20 minutes, verify auto-logout
4. **API Activity**: Login, make API calls, verify session extends
5. **Navigation Activity**: Login, navigate between pages, verify session extends

### Development Monitoring

- Enable session timer display in development
- Monitor browser console for activity logging
- Check localStorage for session data
- Verify automatic cleanup on expiration

## Future Enhancements

### Potential Improvements

1. **Session Warning Dialog**: Show warning before expiration
2. **Configurable Timeout**: Make 20-minute timeout configurable
3. **Multiple Device Support**: Handle sessions across devices
4. **Session Analytics**: Track session usage patterns
5. **Progressive Session Extension**: Extend timeout based on usage patterns

This implementation provides a seamless user experience while maintaining security and performance standards.
