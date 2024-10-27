import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./Overview.module.css";

const apiUrl = import.meta.env.VITE_API_URL;

interface Event {
  id: number;
  name: string;
  date: string; // Consider using Date if parsing is needed
}

interface Shift {
  id: number;
  event_name: string;
  role: string;
  start: string; // Consider using Date if parsing is needed
  end: string; // Consider using Date if parsing is needed
}

const Overview: React.FC = () => {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [userShifts, setUserShifts] = useState<Shift[]>([]);
  const [userId, setUserId] = useState<number | null>(null); // Store user ID

  useEffect(() => {
    const uid = localStorage.getItem("user.id"); // Adjust this based on how you're storing user UID
    if (uid) {
      fetchUserId(uid);
    }
    fetchUpcomingEvents();
  }, []);

  const fetchUserId = async (uid: string) => {
    try {
      const response = await axios.get(`${apiUrl}/users/${uid}`); // Ensure this endpoint exists
      const user = response.data;
      setUserId(user?.id || null); // Set user ID if found
      if (user?.id) {
        fetchUserShifts(user.id); // Fetch shifts if user ID is available
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  const fetchUpcomingEvents = async () => {
    try {
      const response = await axios.get(`${apiUrl}/events`);
      const events = response.data;

      // Filter events to those in the next two weeks
      const now = new Date();
      const twoWeeksLater = new Date();
      twoWeeksLater.setDate(now.getDate() + 14);
      const upcoming = events.filter((event: any) => {
        const eventDate = new Date(event.date); // Assuming `date` holds the event date
        return eventDate >= now && eventDate <= twoWeeksLater;
      });

      setUpcomingEvents(upcoming);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchUserShifts = async (userId: number) => {
    try {
      const response = await axios.get(`${apiUrl}/volunteer-shifts/${userId}`); // Adjust endpoint to include userId
      setUserShifts(response.data);
    } catch (error) {
      console.error("Error fetching user shifts:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftColumn}>
        <h2>Upcoming Events (Next 2 Weeks)</h2>
        <ul>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <li key={event.id}>
                {event.name} - {new Date(event.date).toLocaleDateString()}
              </li>
            ))
          ) : (
            <p>No events in the next two weeks.</p>
          )}
        </ul>
      </div>

      <div className={styles.middleColumn}>
        {/* Placeholder for future content */}
      </div>

      <div className={styles.rightColumn}>
        <h2>Your Shifts</h2>
        <ul>
          {userShifts.length > 0 ? (
            userShifts.map((shift) => (
              <li key={shift.id}>
                {shift.event_name}: {shift.role} on{" "}
                {new Date(shift.start).toLocaleDateString()} from{" "}
                {new Date(shift.start).toLocaleTimeString()} to{" "}
                {new Date(shift.end).toLocaleTimeString()}
              </li>
            ))
          ) : (
            <p>You have no shifts scheduled.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Overview;
