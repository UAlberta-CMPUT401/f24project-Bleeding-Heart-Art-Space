# Project Requirements

## Executive Summary

The Volunteer Management Platform for Bleeding Heart Art Space aims to solve the challenges the organization faces with its current scheduling tool, which doesn’t quite fit their needs. This custom platform will streamline the process of organizing volunteer events and shifts, enabling administrators to create and manage events, track volunteer attendance, and send timely notifications. Volunteers will benefit from a simple user-friendly way to easily sign up for shifts, view upcoming events, and receive reminders. The primary users of this system will be the administrators and volunteers of Bleeding Heart Art Space. The platform will be used to simplify volunteer coordination, improve communication, and optimize event management, contributing to the smooth operation of the community art space.

## Project Glossary

- **Admin**: A user with elevated permissions responsible for managing events, assigning roles, and organizing schedules. Admins can create, edit, and delete events, assign volunteers to shifts, and oversee overall operations. They also have the ability to sign up for volunteer shifts themselves.

- **Volunteer**: A general user who participates in events and activities organized by admins. Volunteers can view available events, sign up for shifts, check in and out of events, and receive notifications and reminders. 

- **Artist**: A user responsible for requesting events that have to be approved by the admins. In some cases, the artist might also participate in events or activities organized by the volunteers and admins, especially if the event centers around an art exhibit or installation.

- **Event**: A scheduled activity that requires volunteers. Events are created and managed by admins and can have specific times, dates, locations, and roles. Volunteers sign up for these events.

- **Shift**: A designated time slot within an event during which volunteers are expected to participate. Shifts may have specific start and end times.

- **Calendar**: A calendar meant to organize volunteers for an event. It may include multiple shifts and volunteers may use it to sign up for different time slots.

- **Notifications**: Alerts sent to users via email or app to remind them of upcoming events or other important information. Volunteers and admins can subscribe or unsubscribe from notifications.

- **Permissions**: Access rights assigned by an admin to other users. Permissions determine what actions a user can perform, such as creating events or managing schedules.

- **Roles**: Specific functions or duties that volunteers might be assigned within an event (e.g., setup, registration, crowd control). Admins can assign roles when creating events.

- **Dashboard**: A centralized page where admins can monitor events, volunteer sign-ups, attendance, and manage schedules. Volunteers may also have a dashboard to view upcoming events they are signed up for.

## User Stories

### Admin User Stories
#### US 1.01 - Admin Sign up
> As an Admin, I want to sign up securely through a code/link so that I can gain admin privileges.
>
> Acceptance Criteria:
>
> 1. Admin can sign up one time using a link/code

#### US 1.02 - Login and logout Securely
> As an Admin, I want to log in and log out securely so that I can manage the volunteer events and schedules.
>
> Acceptance Criteria:
>
> 1. Admin can log in using email and password or social login.
> 2. Admin can log out securely
> 3. Secure password recovery and multi-factor authentication.

#### US 1.03 - Create and Manage Events
> As an Admin, I want to create and manage events so that I can schedule volunteer opportunities.
>
> Acceptance Criteria:
>
> 1. Admin can create, edit, or delete events.
> 2. Admin can specify event details like date, time, location, number of volunteers needed, and any specific roles or skills required.
> 3. Admin can set recurring events.

#### US 1.04 - Assign Permissions to Other Users
> As an Admin, I want to assign permissions to other users so that I can delegate event management tasks.
>
> Acceptance Criteria:
>
> 1. Admin can assign specific permissions (event creation, scheduling, etc.) to other users.
> 2. Admin can revoke permissions at any time.

#### US 1.05 - Create and Manage Volunteer Schedules/Calendar
> As an Admin, I want to create volunteer schedules/calendars so that shifts are organized and resources are optimized.
>
> Acceptance Criteria:
>
> 1. Admin can create and edit schedules for each event.
> 2. Admin can assign specific volunteers to shifts or allow volunteers to self-select shifts.

#### US 1.06 - Manage Volunteer Attendance
> As an Admin, I want to view and manage volunteer attendance so that I can ensure accurate record-keeping.
>
> Acceptance Criteria:
>
> 1. Admin can see check-ins and check-outs for each event.
> 2. Admin can override check-in/out statuses if necessary.

#### US 1.07 - Send Communication emails
> As an Admin, I want to send emails to all volunteers at once so that they are informed of upcoming shifts.
>
> Acceptance Criteria:
>
> 1. Admin can send emails to the volunteers via the email app but can get the email IDs of the volunteers automatically from the platform.

#### US 1.08 - Sign Up to Volunteer for an Event
> As an Admin, I want to sign up to volunteer for an event, so that I can participate in the event just like a regular volunteer.
>
> Acceptance Criteria:
>
> 1. Admin can see the same calendar of available events as volunteers.
> 2. Admin can sign up for available shifts in events they create or manage.
> 3. Admin receives confirmation of sign-up via email or app notification.
> 4. Admin can check in and check out of events like regular volunteers.
> 5. Admin receives reminders and event notifications based on their preferences.
> 6. Admin’s participation is recorded alongside other volunteers, but they retain their admin privileges during the event.

#### US 1.09 - Assign one-time volunteers
> As an Admin, I want to be able to assign one-time volunteers so that I can fill specific roles for events without requiring ongoing commitment from the volunteers.
>
> Acceptance Criteria:
>
> 1. Admin can assign volunteers for a specific shift or event.
> 2. Assigned volunteers receive a notification of their assigned shift or role.
> 3. Admin can view and modify these assignments at any time before the event begins.

#### US 1.10 - Approve Artist Event Requests
> As an Admin, I want to be able to approve artist event requests so that I can review and authorize events that align with organizational goals.
>
> Acceptance Criteria:
>
> 1. Admin can view a list of event requests submitted by artists.
> 2. Admin can approve or reject event requests.
> 3. Approved events become visible in the event calendar for volunteers to sign up.
> 4. Artists receive notifications once their event is approved or rejected.

### Volunteer User Stories:
#### US 2.01 - Sign up to be a Volunteer
> As a Volunteer, I want to sign up securely so that I can re-use my account to volunteer in the future.
>
> Acceptance Criteria:
>
> 1. Volunteers can sign up using email and password or social login.
> 2. Secure password recovery and multi-factor authentication.

#### US 2.02 - Log in Securely
> As a Volunteer, I want to log in securely so that I can access my volunteer schedule and events.
>
> Acceptance Criteria:
>
> 1. Volunteers can log in using email and password or social login.
> 2. Secure password recovery and multi-factor authentication.

#### US 2.03 - View Available Events on a Calendar
> As a Volunteer, I want to view available events on a calendar so that I can choose which events to sign up for.
>
> Acceptance Criteria:
>
> 1. Volunteers can see a calendar view of all upcoming events.
> 2. Volunteers can filter events by date, location, or event type.

#### US 2.04 - Sign up for Events
> As a Volunteer, I want to sign up for events so that I can participate in volunteer activities.
>
> Acceptance Criteria:
>
> 1. Volunteers can sign up for available shifts in events.
> 2. Volunteers receive confirmation of sign-up via email or app notification.

#### US 2.05 - Manage Notifications Preferences
> As a Volunteer, I want to manage my notifications so that I can receive or opt out of reminders.
>
> Acceptance Criteria:
>
> 1. Volunteers can subscribe or unsubscribe to email or app notifications.
> 2. Volunteers receive event reminders based on their preferences.

#### US 2.06 - Check into Events
> As a Volunteer, I want to check into events when my shift starts so that my attendance is recorded.
>
> Acceptance Criteria:
>
> 1. Volunteers can check into the event once the shift begins (via the app or web).
> 2. A notification or prompt is sent to the volunteer when the shift start time approaches.

#### US 2.07 - Check out of Events
> As a Volunteer, I want to check out of events when my shift ends so that I can log my volunteer hours.
>
> Acceptance Criteria:
>
> 1. Volunteers can check out of the event manually once their shift is over.
> 2. A notification is sent if the volunteer forgets to check out.

#### US 2.08 - Automatic Check-out When Event Ends
> As a Volunteer, I want to be automatically checked out when the event ends so that I don't have to worry if I forget to check out.
>
> Acceptance Criteria:
>
> 1. Volunteers are automatically checked out if they haven't manually checked out when the event ends.

#### US 2.09 - Receive Summary of Volunteer Hours	
> As a Volunteer, I want to receive a summary of my volunteer hours after the event so that I can track my contributions.
>
> Acceptance Criteria:
>
> 1. Volunteers receive an email or notification summarizing their total hours after each event.
> 2. Volunteers can view a history of their hours in their profile.

#### US 2.10 - Inter-Communication of volunteers on the platform
> As a Volunteer, I want to reach out to fellow volunteers attending an exhibit/event.
>
> Acceptance Criteria:
>
> 1. Volunteers have the option to chat with fellow volunteers.

#### US 2.11 - View other volunteer status
> As a volunteer, I want to be able to see the different volunteers that I are signed up for different events
>
> Acceptance Criteria:
>
> 1. Volunteers can check who is signed up on events made in the calendar

### Artist User Stories:
#### US 3.01 - Request Events
> As an Artist, I want to be able to request events so that I can showcase my work or host activities that involve volunteers.
>
> Acceptance Criteria:
>
> 1. Artists can fill out a form to request a new event, specifying the event details (date, time, location, description).
> 2. Event requests must be approved by an admin before they are confirmed.

#### US 3.02 - Sign Up to Oversee an Event
> As an Artist, I want to be able to sign up to oversee an event so that I can manage it personally and ensure everything runs smoothly.
>
> Acceptance Criteria:
>
> 1. Artists can sign up as the primary overseer of the event.
> 2. Artists receive reminders and notifications for the event.
> 3. Artists can manage volunteers during the event.

#### US 3.03 - Create Shifts for the Event
> As an Artist, I want to be able to create any number and duration of shifts for the event so that volunteers can work at different times and the event runs efficiently.
>
> Acceptance Criteria:
>
> 1. Artists can create multiple shifts, each with a start time, end time, and number of required volunteers.
> 2. Shifts can be edited or deleted by the artist at any time before the event begins.

#### US 3.04 - Assign one-time volunteers
> As an Artist, I want to be able to assign one-time volunteers so that I can get help from specific people for a particular event.
>
> Acceptance Criteria:
>
> 1. Artists can assign volunteers for a specific shift or event.
> 2. Assigned volunteers receive an email or app notification of their assigned role and shift.

#### US 3.05 - Manage Events
> As an Artist, I want to be able to edit the events I made so that I can update event details or make changes as needed.
>
> Acceptance Criteria:
>
> 1. Artists can edit event details such as time, location, description, and number of required volunteers.
> 2. Changes to the event trigger notifications to volunteers who have signed up for affected shifts.

### General User Stories:
#### US 4.01 - Receive Event Notifications
> As a User, I want to receive notifications for upcoming events so that I am reminded of my commitments.
>
> Acceptance Criteria:
>
> 1. Users can opt in to receive notifications via email or app.
> 2. Reminders are sent at customizable intervals (e.g., a day before, an hour before the event).

#### US 4.02 - View Calendar
> As a user, I want to see a calendar view of events for ease of visuality.
>
> Acceptance Criteria:
>
> 1. Users can always view a calendar of events on their dashboard.

## MoSCoW
### Must have:
- US 1.01 (Sign up Securely)
- US 1.02 (Login and logout securely)
- US 1.03 (Create and Manage Events)
- US 1.04 (Assign Permissions to Other Users)
- US 1.05 (Create Volunteer Schedules)
- US 2.01 (Sign up Securely)
- US 2.02 (Login and logout securely)
- US 2.03 (View Available Events on a Calendar)
- US 2.04 (Sign up for Events)
- US 4.02 (View Calendar)

### Should have:
- US 1.07 (Send Notifications or Reminders)
- US 1.10 (Approve Artist Event Requests)
- US 2.05 (Manage Notifications Preferences)
- US 2.06 (Check into Events)
- US 2.07 (Check out of Events)
- US 2.08 (Automatic Check-out When Event Ends)
- US 3.01 (Request Events)
- US 3.02 (Sign Up to Oversee an Event)
- US 3.03 (Create Shifts for the Event)
- US 3.04 (Assign One-Time Volunteers)
- US 3.05 (Edit Events)
- US 4.01 (Receive Event Notifications)

### Could have:
- US 1.06 (Manage Volunteer Attendance)
- US 1.08 (Sign Up to Volunteer for an Event)
- US 1.09 (Assign one-time volunteers)
- US 2.09 (Receive Summary of Volunteer Hours)
- US 2.11 (View other Volunteer status)

### Would Like But Won't Get:
- US 2.10 (Inter-Communication of volunteers on the platform)

## Similar Products

  - [SignUpGenius - Football SignUps](https://www.signupgenius.com/go/5080d45aaa928a6fd0-soccer2#/)
    - Volunteer Management System Host (SignUpGenius).
    - Calendar format can be used as inspiration for scheduling tasks.
 
  - [Timecounts - Bleeding Heart](https://timecounts.app/bleedingheart)
    - Volunteer Management System Host (Timecounts).
    - This is our client’s previous system.
    - The color palette can be used as inspiration for our system.

## Open-source Projects

  - [OpenVolunteerPlatform](https://github.com/aerogear/OpenVolunteerPlatform)
    - Automate and optimize work of volunteers for organization or charity.
    - Some of their functionalities include: reports and statistics for admins, management panel, automatic scheduling, producing reports and collecting feedback from the field.
    - The automatic scheduling and management panel can be used as inspiration for our system.
 
  - [Engles System](https://github.com/engelsystem/engelsystem)
    - System to coordinate large amount of helpers and shifts for big events.
    - Some of their functionalities include: shifts that are organized through filters, multi language coverage, exports shifts to ical, reward system, Q and A section, 2 factor authentication.
    - Perhaps the filtering and exporting functionalities of the shifts can be used as inpiration to our project.

## Technical Resources

### Frontend: React (Vite with Typescript)

  - [React Documentation](https://react.dev/learn)
  - [Bulletproof React](https://github.com/alan2207/bulletproof-react) (React project structure guide)
  - [Vite](https://vitejs.dev/guide/)

### Backend: Node (Express with Typescript) + PostgreSQL

  - [Node Documentation](https://nodejs.org/docs/latest/api/)
  - [Express.js](https://expressjs.com/en/starter/installing.html)
  - [Kysely](https://kysely.dev/docs/getting-started) (SQL query builder in node)
  - [Setting up Postgres](https://help.scalegrid.io/docs/postgresql-connecting-to-nodejs-driver)
  - [Firebase Authentication](https://firebase.google.com/docs/auth)
  - [Sendgrid](https://www.twilio.com/docs/sendgrid/for-developers)

### Deployment: Cybera

  - [Deploy on Cybera - Documentation](https://www.cybera.ca/hosting-a-website-on-the-rapid-access-cloud/)
