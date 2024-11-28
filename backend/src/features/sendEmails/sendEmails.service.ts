import { singleton } from 'tsyringe';
import sgMail from '@sendgrid/mail';
import { db } from '@database/database';

@singleton()
export class SendEmailsService {
  constructor() {
    // Initialize SendGrid with API Key
    const apiKey = 'SG.'+'w1BsZj_wSFuY3O56_HTBtg.tUQVoM-cxKHnUq3DuvEgasXSg22jUdonQlLEwgp5hqE';
    if (!apiKey || !apiKey.startsWith('SG.')) {
      throw new Error('Invalid SendGrid API Key. Ensure it starts with "SG."');
    }
    sgMail.setApiKey(apiKey);
  }

  /**
   * Send emails to volunteers with today's shifts
   */
  public async sendTodayShiftEmails(): Promise<void> {
    // Get today's date
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    // Fetch shift details for today
    const shifts = await db
    .selectFrom('volunteer_shifts')
    .innerJoin('events', 'volunteer_shifts.event_id', 'events.id')
    .innerJoin('volunteer_roles', 'volunteer_shifts.volunteer_role', 'volunteer_roles.id')
    .select([
        'volunteer_shifts.start',
        'volunteer_shifts.end',
        'events.title as event_title',
        'volunteer_roles.name as role_name',
    ])
    .where('volunteer_shifts.start', '>=', startOfDay)
    .where('volunteer_shifts.start', '<=', endOfDay)
    .execute();


    console.log('Fetched shifts from database:', shifts);



    if (!shifts || shifts.length === 0) {
      console.log('No shifts found for today. No emails sent.');
      return;
    }

    // Fetch all volunteer email addresses
    const USER_ROLE_ID = 2; // Replace this with the actual ID for the volunteer role in your database
    const volunteers = await db
    .selectFrom('users')
    .select(['email'])
    .where('role', '=', USER_ROLE_ID)
    .execute();


    const volunteerEmails = volunteers.map((volunteer) => volunteer.email);

    if (!volunteerEmails.length) {
      console.log('No volunteers found to send emails to.');
      return;
    }

    // Format shift details for the email
    const emailContent = shifts
  .map(
    (shift) =>
      `Event: ${shift.event_title}\nRole: ${shift.role_name}\nStart: ${new Date(shift.start).toLocaleString()}\nEnd: ${new Date(
        shift.end,
      ).toLocaleString()}\n\n`
  )
  .join('');


    // Construct email message
    const msg = {
      to: volunteerEmails, // List of volunteer emails
      from: 'anhadpre@ualberta.ca', // Replace with your verified sender email
      subject: 'Today’s Newly added Volunteer Shifts',
      text: `Hello Volunteers,\n\nHere are the details of today's shifts:\n\n${emailContent}\nPlease log in to the platform for more information.\n\nThank you!`,
    };
    console.log('Sending emails to volunteers:', msg);

    // Send the email
    try {
      await sgMail.send(msg);
      console.log('Emails sent successfully!');
    } catch (error) {
      console.error('Error sending emails:', error);
      throw new Error('Failed to send emails. Please check the SendGrid configuration.');
    }
  }
  public async sendCustomEmailForEvent(eventId: number, subject: string, message: string): Promise<void> {
    // Fetch the emails of volunteers who signed up for shifts for the given event
    const volunteers = await db
    .selectFrom('shift_signup')
    .innerJoin('volunteer_shifts', 'shift_signup.shift_id', 'volunteer_shifts.id')
    .innerJoin('users', 'shift_signup.user_id', 'users.id')
    .select(['users.email'])
    .where('volunteer_shifts.event_id', '=', eventId)
    .where('users.role', '=', 2) // Filter users with role = 2 (volunteers)
    .execute();


    const volunteerEmails = volunteers.map((volunteer) => volunteer.email);
    console.log('Fetched volunteer emails:', volunteerEmails);

    if (!volunteerEmails.length) {
      console.log(`No volunteers found for event ID ${eventId}.`);
      return;
    }

    // Construct the email
    const msg = {
      to: volunteerEmails, // List of volunteer emails
      from: 'anhadpre@ualberta.ca', // Replace with your verified sender email
      subject: subject,
      text: message,
    };

    try {
      await sgMail.send(msg);
      console.log(`Custom email sent successfully for event ID ${eventId}!`);
    } catch (error) {
      console.error('Error sending custom email:', error);
      throw new Error('Failed to send custom email. Please check the SendGrid configuration.');
    }
  }
}
