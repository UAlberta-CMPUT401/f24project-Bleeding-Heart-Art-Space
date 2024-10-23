import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const VolunteerManagement: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [roleName, setRoleName] = useState('');
    const [roles, setRoles] = useState<any[]>([]); // State for existing roles
    const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null); // State for selected role ID

    // Fetch existing roles when the component mounts
    useEffect(() => {
        const fetchRoles = async () => {
            try {
                const response = await axios.get(`${apiUrl}/volunteer_roles`);
                setRoles(response.data);
            } catch (error) {
                console.error('Error fetching roles:', error);
                alert('Failed to load roles. Please try again.');
            }
        };

        fetchRoles();
    }, []);

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
        if (roleName.trim() === '') {
            alert('Please enter a role name');
            return;
        }

        try {
            // Post the new role to the backend
            await axios.post(`${apiUrl}/volunteer_roles`, { name: roleName });
            alert('Volunteer role created successfully!');
            handleClose();
        } catch (error) {
            console.error('Error creating volunteer role:', error);
            alert('Failed to create volunteer role. Please try again.');
        }
    };

    const handleDeleteRole = async () => {
        if (selectedRoleId === null || !window.confirm('Are you sure you want to delete this role?')) {
            return;
        }

        try {
            // Delete the role from the backend
            await axios.delete(`${apiUrl}/volunteer_roles/${selectedRoleId}`);
            alert('Volunteer role deleted successfully!');
            // Refresh the roles list after deletion
            const updatedRoles = roles.filter(role => role.id !== selectedRoleId);
            setRoles(updatedRoles);
            setSelectedRoleId(null); // Reset selected role after deletion
        } catch (error) {
            console.error('Error deleting volunteer role:', error);
            alert('Failed to delete volunteer role. Please try again.');
        }
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
