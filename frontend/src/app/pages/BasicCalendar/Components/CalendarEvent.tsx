
import React, { useEffect } from 'react';
import { Calendar, momentLocalizer, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEventStore } from '@stores/useEventStore';

/**
 * EventCalendar component renders a calendar using react-big-calendar library.
 * It displays events and allows interaction with them.
 *
 * @component
 * @example
 * const handleEventClick = (eventId) => { console.log(eventId); };
 * const handleSlotSelect = (slotInfo) => { console.log(slotInfo); };
 * return (
 *   <EventCalendar onEventClick={handleEventClick} onSlotSelect={handleSlotSelect} />
 * );
 *
 * @param {Object} props - Component props
 * @param {function(string): void} props.onEventClick - Callback function when an event is clicked. Receives the event ID as a parameter.
 * @param {function(SlotInfo): void} props.onSlotSelect - Callback function when a slot is selected. Receives slot information as a parameter.
 *
 * @returns {JSX.Element} Rendered EventCalendar component
 */
const localizer = momentLocalizer(moment); // Using moment for date localization

interface EventCalendarProps {
  onEventClick: (eventId: string) => void;
  onSlotSelect: (slotInfo: SlotInfo) => void;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ onEventClick, onSlotSelect  }) => {
  const { events } = useEventStore(); //---> events function from from EventStore!

  useEffect(() => {
  }, [events])

  return (
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%', width: '100%' }}
        onSelectEvent={(event) => onEventClick(String(event.id))}
        onSelectSlot={onSlotSelect}
        selectable
      />
  );
};

export default EventCalendar;
