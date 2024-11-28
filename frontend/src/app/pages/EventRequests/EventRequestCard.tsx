import React, { useEffect, useState } from 'react';
import { Card, SxProps, Typography, Theme, Chip } from '@mui/material';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import PlaceIcon from '@mui/icons-material/Place';

const iconSx: SxProps<Theme> = (theme) => ({
  marginRight: '0.5rem',
  verticalAlign: 'middle',
  color: theme.palette.orange.main,
});

type ShiftCardProps = {
  status: number,
  eventName: string;
  requesterName: string;
  requesterEmail: string;
  start: Date;
  end: Date;
  venue: string;
  address: string;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
}
const EventRequestCard: React.FC<ShiftCardProps> = ({ status, eventName, requesterName, requesterEmail, start, end, venue, address, sx, children }) => {
  const [statusColor, setStatusColor] = useState<"error" | "success" | "warning">("warning");
  const [statusStr, setStatusStr] = useState<string>("");

  useEffect(() => {
    switch (status) {
      case 0: {
        setStatusColor("error");
        setStatusStr("Denied");
        break;
      }
      case 1: {
        setStatusColor("success");
        setStatusStr("Approved");
        break;
      }
      case 2: {
        setStatusColor("warning");
        setStatusStr("Pending");
        break;
      }
    }
  }, [status]);

  return (
    <Card
      sx={{
        ...sx,
        padding: '1rem',
        textAlign: 'left',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
      }}
    >
      <Chip color={statusColor} label={statusStr} sx={{ fontWeight: 'bold' }}/>
      <Typography variant="body1" fontWeight='bold'>
        Event:
      </Typography>

      <Typography variant="body1">
        <EventNoteIcon
          sx={iconSx}
        /> 
        <span style={{ fontWeight: 'bold' }} >Title:</span> 
        <span> {eventName}</span>
      </Typography>
      
      <Typography variant="body1">
        <AccessTimeIcon 
          sx={iconSx}
        /> 
        <span style={{ fontWeight: 'bold' }} >Start:</span> 
        <span> {start.toLocaleString([], { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })}</span>
      </Typography>
      
      <Typography variant="body1">
        <AccessTimeIcon 
          sx={iconSx}
        /> 
        <span style={{ fontWeight: 'bold' }} >End:</span> 
        <span> {end.toLocaleString([], { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          })}</span>
      </Typography>

      <Typography variant="body1">
        <PlaceIcon
          sx={iconSx}
        /> 
        <span style={{ fontWeight: 'bold' }} >Venue:</span> 
        <span> {venue}</span>
      </Typography>

      <Typography variant="body1">
        <PlaceIcon
          sx={iconSx}
        /> 
        <span style={{ fontWeight: 'bold' }} >Address:</span> 
        <span> {address}</span>
      </Typography>

      <Typography variant="body1" fontWeight='bold' sx={{ mt: '1rem' }}>
        Requested By:
      </Typography>

      <Typography variant="body1">
        <PersonIcon
          sx={iconSx}
        /> 
        <span style={{ fontWeight: 'bold' }} >Name:</span> 
        <span> {requesterName}</span>
      </Typography>

      <Typography variant="body1">
        <PersonIcon
          sx={iconSx}
        /> 
        <span style={{ fontWeight: 'bold' }} >Email:</span> 
        <span> {requesterEmail}</span>
      </Typography>

      {children}

    </Card>
  );
}

export default EventRequestCard;
