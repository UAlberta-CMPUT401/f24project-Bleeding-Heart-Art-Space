import React from "react";


const HomePage: React.FC = () => {
  return (
<>
<div>
  <h1>Welcome back, Admin!</h1>
  <div>
    <h2>Upcoming Events</h2>
    <ul>
      <li>Event 1 - Date</li>
      <li>Event 2 - Date</li>
      <li>Event 3 - Date</li>
    </ul>
  </div>
  <div>
    <h2>Reminders</h2>
    <ul>
      <li>Reminder 1</li>
      <li>Reminder 2</li>
      <li>Reminder 3</li>
    </ul>
  </div>
</div>
</>

);
}

export default HomePage;