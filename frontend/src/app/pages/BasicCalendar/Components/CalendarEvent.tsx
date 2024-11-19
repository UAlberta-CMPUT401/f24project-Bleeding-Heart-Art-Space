import React, { useEffect } from 'react';
import { Calendar, momentLocalizer, SlotInfo } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useEventStore } from '@stores/useEventStore';

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
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        onSelectEvent={(event) => onEventClick(String(event.id))}
        onSelectSlot={onSlotSelect}
        selectable
      />
    </div>
  );
};

export default EventCalendar;
