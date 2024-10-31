import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { deleteVolunteerRole, getVolunteerRoles, isOk, postVolunteerRole, VolunteerRole } from '@utils/fetch';
import { useAuth } from '@lib/context/AuthContext';

const VolunteerManagement: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [roleName, setRoleName] = useState('');
    const [roles, setRoles] = useState<VolunteerRole[]>([]); // State for existing roles
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null); // State for selected role ID
    const { user } = useAuth();

    // Fetch existing roles when the component mounts
    useEffect(() => {
        if (user) {
            getVolunteerRoles(user).then(response => {
                if (isOk(response.status)) {
                    setRoles(response.data);
                }
            });
        }
    }, [user]);

    // Open the dialog to create a new volunteer role
    const handleOpen = () => {
        setOpen(true);
    };

    // Close the dialog
    const handleClose = () => {
        setOpen(false);
        setRoleName('');
        setSelectedRoleId(null); // Reset selected role on close
    };

    // Handle form submission for creating a new role
    const handleCreateRole = async () => {
        if (!user) return;
        if (roleName.trim() === '') {
            alert('Please enter a role name');
            return;
        }

        postVolunteerRole({ name: roleName }, user).then(response => {
            if (isOk(response.status)) {
                alert('Volunteer role created successfully!');
                setRoles(prev => [...prev, response.data]);
                handleClose();
            } else {
                console.error('Error creating volunteer role:', roleName);
                alert('Failed to create volunteer role. Please try again.');
            }
        });
    };

    const handleDeleteRole = async () => {
        if (!user) return;
        if (selectedRoleId === null || !window.confirm('Are you sure you want to delete this role?')) {
            return;
        }

        deleteVolunteerRole(selectedRoleId, user).then(response => {
            if (isOk(response.status)) {
                alert('Volunteer role deleted successfully!');
                const updatedRoles = roles.filter(role => role.id !== selectedRoleId);
                setRoles(updatedRoles);
                setSelectedRoleId(null);
            } else {
                console.error('Error deleting volunteer role:', selectedRoleId);
                alert('Failed to delete volunteer role. Please try again.');
            }
        })
    };

    return (
        <>
            <Button variant="contained" color="primary" onClick={handleOpen}>
                Create Volunteer Role
            </Button>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Create New Volunteer Role</DialogTitle>
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
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateRole} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dropdown to select and delete existing roles */}
            <FormControl fullWidth style={{ marginTop: '20px' }}>
                <InputLabel>Delete Volunteer Role</InputLabel>
                <Select
                    value={selectedRoleId || ''}
                    onChange={(e) => setSelectedRoleId(e.target.value ? Number(e.target.value) : null)}
                >
                    {roles.map(role => (
                        <MenuItem key={role.id} value={role.id}>
                            {role.name}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Button 
                variant="contained" 
                color="secondary" 
                onClick={handleDeleteRole} 
                style={{ marginTop: '10px' }}
                disabled={selectedRoleId === null} // Disable button if no role is selected
            >
                Delete Selected Role
            </Button>
        </>
    );
};

export default VolunteerManagement;
