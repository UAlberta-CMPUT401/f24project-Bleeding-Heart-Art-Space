import React from 'react';
import { Card, SxProps, Typography, Theme } from '@mui/material';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PeopleIcon from '@mui/icons-material/People';

const iconSx: SxProps<Theme> = (theme) => ({
  marginRight: '0.5rem',
  verticalAlign: 'middle',
  color: theme.palette.orange.main,
});

type ShiftCardProps = {
  roleName: string;
  start: Date;
  end: Date;
  volunteers?: number;
  maxVolunteers?: number;
  sx?: SxProps<Theme>;
  children?: React.ReactNode;
}
const ShiftCard: React.FC<ShiftCardProps> = ({ roleName, start, end, volunteers, maxVolunteers, sx, children }) => {
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
      <Typography variant="body1">
        <AssignmentIndIcon 
          sx={iconSx}
        /> 
        <span style={{ fontWeight: 'bold' }} >Role:</span> 
        <span> {roleName}</span>
      </Typography>
      
      <Typography variant="body1">
        <AccessTimeIcon 
          sx={iconSx}
        /> 
        <span style={{ fontWeight: 'bold' }} >Start:</span> 
        <span> {start.toLocaleString()}</span>
      </Typography>
      
      <Typography variant="body1">
        <AccessTimeIcon 
          sx={iconSx}
        /> 
        <span style={{ fontWeight: 'bold' }} >End:</span> 
        <span> {end.toLocaleString()}</span>
      </Typography>
        
      {
        (volunteers !== undefined && maxVolunteers !== undefined) &&
        <Typography variant="body1">
          <PeopleIcon 
            sx={iconSx}
          /> 
          <span style={{ fontWeight: 'bold' }} >Volunteers:</span> 
          <span> {volunteers}/{maxVolunteers}</span>
        </Typography>
      }
      {
        (volunteers === undefined && maxVolunteers !== undefined) &&
        <Typography variant="body1">
          <PeopleIcon 
            sx={iconSx}
          /> 
          <span style={{ fontWeight: 'bold' }} >Max Volunteers:</span> 
          <span> {maxVolunteers}</span>
        </Typography>
      }

      {children}

    </Card>
  );
}

export default ShiftCard;
