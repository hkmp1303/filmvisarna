# Architecture Overview

The application follows a client-server architecture:
- React frontend communicates with a .NET backend via HTTP API
- Backend handles buisness logic and uthentication
- MySQL is used for data persistence

## Components

### Frontend
- Built with React + Vite
- Handles UI and user information
- Commuicates with backend via REST API

### Backend
- ASP.NET Core Web API
- Handles: 
  - Authentication (session-based)
  - Business logic
  - Email sending (Mailkit)

### Database
- MySQL database
- Stores user, sessions and application data

### Authentication
- Session- based authentication using cookies
- Server maintains session state

### External Services
- MailKit used for sending emails (e.g. booking confrimation, contact form to site owner)

## Sitemap

The application structure is based on the following routes:

```
/ (LandingPage)
├── /login
├── /register
├── /profile
├── /booking
├── /confirmbooking/:guid
├── /moviedetails/:filmid
├── /kiosk
├── /themedays
├── /aboutus
├── /contact
├── /passwordrecovery
├── /reset-password
└── /changepassword
```

### Description

* `/` – Landing page with general film information, selection and filtering
* `/login` – User login
* `/register` – User registration
* `/profile` – User profile page
* `/booking` – Booking form
* `/confirmbooking/:guid` – Booking confirmation
* `/moviedetails/:filmid` – Movie details page (dynamic route)
* `/kiosk` – Menu description page
* `/tema-dagar` – Themed days descriptions
* `/about` – Information about the company, links to contact and kiosk pages
* `/contact` – Contact page to send email to site owner
* `/password-recovery` – Request password reset
* `/reset-password` – Reset password via token
* `/change-password` – Change password when logged in

> Note: Some routes require authentication (e.g., profile, password change).




