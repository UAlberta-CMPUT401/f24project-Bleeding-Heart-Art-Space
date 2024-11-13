import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAuth } from '@lib/context/AuthContext';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useVolunteerRoleStore } from '@stores/useVolunteerRoleStore';

const cols: GridColDef[] = [
    { field: 'name', headerName: 'Volunteer Role', flex: 1 },
];

const paginationModel = { page: 0, pageSize: 10 };

const VolunteerRoles: React.FC = () => {
    const { user } = useAuth();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [roleName, setRoleName] = useState('');
    const { volunteerRoles, addVolunteerRole } = useVolunteerRoleStore();

    const openDialog = () => {
        setDialogOpen(true);
    };

    const closeDialog = () => {
        setDialogOpen(false);
        setRoleName('');
    };

    const createRole = async () => {
        if (!user) return;
        if (roleName.trim() === '') {
            alert('Please enter a role name');
            return;
        }

        addVolunteerRole({ name: roleName }, user);
        closeDialog();
    };

    return (
        <>
            <DataGrid
                rows={volunteerRoles}
                columns={cols}
                initialState={{ pagination: { paginationModel } }}
                checkboxSelection
            />

            <Button variant="contained" color="primary" onClick={openDialog}>
                Create Volunteer Role
            </Button>
            <Dialog open={dialogOpen} onClose={closeDialog}>
                <DialogTitle>Create Volunteer Role</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Role Name"
                        fullWidth
                        value={roleName}
                        onChange={(e) => setRoleName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="error">
                        Cancel
                    </Button>
                    <Button onClick={createRole} color="success">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default VolunteerRoles;
