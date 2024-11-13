import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useAuth } from '@lib/context/AuthContext';
import { getVolunteerRoles, isOk, postVolunteerRole, VolunteerRole } from '@utils/fetch';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';

const cols: GridColDef[] = [
    { field: 'name', headerName: 'Volunteer Role', flex: 1 },
];

const paginationModel = { page: 0, pageSize: 20 };

const VolunteerRoles: React.FC = () => {
    const [roles, setRoles] = useState<VolunteerRole[]>([]); // State for existing roles
    const { user } = useAuth();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [roleName, setRoleName] = useState('');

    useEffect(() => {
        if (user) {
            getVolunteerRoles(user).then(response => {
                if (isOk(response.status)) {
                    setRoles(response.data);
                }
            });
        }
    }, [user]);

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

        postVolunteerRole({ name: roleName }, user).then(response => {
            if (isOk(response.status)) {
                alert('Volunteer role created successfully!');
                setRoles(prev => [...prev, response.data]);
                closeDialog();
            } else {
                console.error('Error creating volunteer role:', roleName);
                alert('Failed to create volunteer role. Please try again.');
            }
        });
    };

    return (
        <>
            <DataGrid
                rows={roles}
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
