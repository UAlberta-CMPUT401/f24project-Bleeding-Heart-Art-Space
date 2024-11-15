import React, { useState } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useAuth } from '@lib/context/AuthContext';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useVolunteerRoleStore } from '@stores/useVolunteerRoleStore';
import { VolunteerRole } from '@utils/fetch';
import ConfirmationDialog from '@components/ConfirmationDialog';

const cols: GridColDef[] = [
    { field: 'name', headerName: 'Volunteer Role', flex: 1 },
];

const VolunteerRoles: React.FC = () => {
    const { user } = useAuth();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [roleName, setRoleName] = useState('');
    const { volunteerRoles, addVolunteerRole, deleteVolunteerRoles } = useVolunteerRoleStore();
    const [selectedRoles, setSelectedRoles] = useState<VolunteerRole[]>([]);

    const openDialog = () => {
        setCreateDialogOpen(true);
    };

    const closeDialog = () => {
        setCreateDialogOpen(false);
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

    const handleRoleSelect = (ids: GridRowSelectionModel) => {
        const selectedIDs = new Set(ids);
        setSelectedRoles(volunteerRoles.filter((role) => selectedIDs.has(role.id)));
    };

    const deleteSelectedRoles = () => {
        if (!user) return;
        deleteVolunteerRoles(selectedRoles, user);
        setConfirmDeleteOpen(false);
    }

    return (
        <Box
            sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'center',
            }}
        >
            <DataGrid
                rows={volunteerRoles}
                columns={cols}
                initialState={{ 
                    pagination: { 
                        paginationModel: {
                            page: 0,
                            pageSize: 10,
                        }
                    },
                    sorting: {
                        sortModel: [{ field: 'name', sort: 'asc' }],
                    }
                }}
                onRowSelectionModelChange={handleRoleSelect}
                checkboxSelection
                sx={{ width: '100%' }}
            />
            {(selectedRoles.length > 0) && <Button variant="contained" color="secondary" onClick={() => setConfirmDeleteOpen(true)}>
                Delete Selected Roles
            </Button>}
            <Button variant="contained" color="primary" onClick={openDialog}>
                Create Volunteer Role
            </Button>
            <Dialog open={createDialogOpen} onClose={closeDialog}>
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
                    <Button variant='contained' onClick={createRole} color="secondary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
            <ConfirmationDialog 
                open={confirmDeleteOpen}
                message={`Are you sure you want to delete ${selectedRoles.length} selected role(s)`}
                onConfirm={deleteSelectedRoles}
                onCancel={() => setConfirmDeleteOpen(false)}
                title='Confirm Delete'
            />
        </Box>
    );
};

export default VolunteerRoles;
