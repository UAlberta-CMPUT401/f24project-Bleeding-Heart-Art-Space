
import React, { useState } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useAuth } from '@lib/context/AuthContext';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useVolunteerRoleStore } from '@stores/useVolunteerRoleStore';
import { VolunteerRole } from '@utils/fetch';
import {ConfirmationDialog} from '@components/ConfirmationDialog';
import SnackbarAlert from '@components/SnackbarAlert';

const cols: GridColDef[] = [
    { field: 'name', headerName: 'Volunteer Role', flex: 1 },
];

/**
 * VolunteerRoles component manages the creation and deletion of volunteer roles.
 * 
 * @component
 * 
 * @returns {React.FC} A React functional component.
 * 
 * @remarks
 * This component uses Material-UI components and the MUI DataGrid for displaying and managing volunteer roles.
 * It allows users to create new volunteer roles and delete selected roles.
 * 
 * @example
 * ```tsx
 * import VolunteerRoles from './VolunteerRoles';
 * 
 * const App = () => (
 *   <div>
 *     <VolunteerRoles />
 *   </div>
 * );
 * 
 * export default App;
 * ```
 * 
 * @requires @mui/material
 * @requires @mui/x-data-grid
 * @requires @lib/context/AuthContext
 * @requires @stores/useVolunteerRoleStore
 * @requires @utils/fetch
 * @requires @components/ConfirmationDialog
 * @requires @components/SnackbarAlert
 * 
 * @function
 * @name VolunteerRoles
 * 
 * @property {Object} user - The authenticated user object from the AuthContext.
 * @property {boolean} createDialogOpen - State to manage the visibility of the create role dialog.
 * @property {boolean} confirmDeleteOpen - State to manage the visibility of the delete confirmation dialog.
 * @property {string} roleName - State to manage the name of the role being created.
 * @property {Array<VolunteerRole>} volunteerRoles - List of volunteer roles from the store.
 * @property {Function} addVolunteerRole - Function to add a new volunteer role.
 * @property {Function} deleteVolunteerRoles - Function to delete selected volunteer roles.
 * @property {Array<VolunteerRole>} selectedRoles - List of selected volunteer roles for deletion.
 * @property {boolean} snackbarOpen - State to manage the visibility of the snackbar alert.
 * @property {string} snackbarMessage - Message to be displayed in the snackbar alert.
 * @property {'success' | 'error' | 'info' | 'warning'} snackbarSeverity - Severity level of the snackbar alert.
 * 
 * @method openDialog - Opens the create role dialog.
 * @method closeDialog - Closes the create role dialog and resets the role name.
 * @method createRole - Creates a new volunteer role if the role name is valid and the user is authenticated.
 * @method handleRoleSelect - Handles the selection of roles in the DataGrid.
 * @method deleteSelectedRoles - Deletes the selected volunteer roles if the user is authenticated.
 */
const VolunteerRoles: React.FC = () => {
    const { user } = useAuth();
    const [createDialogOpen, setCreateDialogOpen] = useState(false);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [roleName, setRoleName] = useState('');
    const { volunteerRoles, addVolunteerRole, deleteVolunteerRoles } = useVolunteerRoleStore();
    const [selectedRoles, setSelectedRoles] = useState<VolunteerRole[]>([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error' | 'info' | 'warning'>('success');

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
            setSnackbarMessage('Please enter a role name');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
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
                pageSizeOptions={[5, 10, 20]}
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
            <SnackbarAlert
                open={snackbarOpen}
                onClose={() => setSnackbarOpen(false)}
                message={snackbarMessage}
                severity={snackbarSeverity}
            />
        </Box>
    );
};

export default VolunteerRoles;
