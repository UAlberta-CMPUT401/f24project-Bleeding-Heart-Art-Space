# Requirements Traceability Matrix

This page outlines the tests that are being carried to verify that all requirements are met.

## Tests

| ID  | Requirement Description                                        | Justification                                       | User Story | Test Name                          | Test Result | Notes    |
| --- | -------------------------------------------------------------- | -------------------------------------------------- | ---------- | ---------------------------------- | ----------- | -------- |
| 1   | Manage Events                                                  | Admins can create, delete and edit events           | 1.03       | createEventTest, deleteEventTest, editEventTest | Pass       | UI Test  |
| 2   | Calendar Events                                                | Events can be seen on the calendar and admins can create the events from the calendar | 2.03       | clickCalendar                      | Pass       | UI Test  |
| 3   | Calendar View                                                  | Admins, volunteers, and artists can view an interactive calendar | 4.02       | viewCalendar                       | Pass       | UI Test  |
| 4   | Volunteer Roles                                                | Admins can create and delete volunteer roles | Feature       | createRoleTest, deleteRoleTest                       | Pass       | UI Test  |
| 5   | Shifts                                                | Admin can create shifts on events | 1.05       | createShiftTest                       | Pass       | UI Test  |
| 6   | Sign Up to Shift                                                | Volunteers can sign up to shifts | 2.04       | shiftSignupTest                       | Pass       | UI Test  |