import ConfirmationDialog from '@components/ConfirmationDialog';
import { useAuth } from '@lib/context/AuthContext';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { useManageUserStore } from '@stores/useManageUserStore';
import { BackendUserAndRole, BatchAssignRole } from '@utils/fetch';
import React, { useEffect, useState } from 'react';

const cols: GridColDef[] = [
    { field: 'first_name', headerName: 'First Name', width: 120 },
    { field: 'last_name', headerName: 'Last Name', width: 120 },
    { field: 'email', headerName: 'Email', width: 240 },
    { field: 'phone', headerName: 'Phone', width: 180 },
    { field: 'title', headerName: 'Role', width: 120 },
];

const ManageUsers: React.FC = () => {
    const { users, roles, assignRoles } = useManageUserStore();
    const [selectedUsers, setSelectedUsers] = useState<BackendUserAndRole[]>([]);
    const [selectedRole, setSelectedRole] = useState<number | undefined>(undefined);
    const { user } = useAuth();
    const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);
    const [confirmAssignOpen, setConfirmAssignOpen] = useState(false);

    const handleUserSelect = (ids: GridRowSelectionModel) => {
        setSelectionModel(ids);
        const selectedIDs = new Set(ids);
        setSelectedUsers(users.filter((user) => selectedIDs.has(user.id)));
    };

    const handleRoleSelect = (event: SelectChangeEvent<number | undefined>) => {
        setSelectedRole(event.target.value ? Number(event.target.value) : undefined);
    };
    useEffect(() => {
        if (selectedUsers.length === 0) {
            setSelectedRole(undefined);
        }
    }, [selectedUsers]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (selectedRole === undefined) return;
        setConfirmAssignOpen(true);
    };

    const confirmAssignRoles = () => {
        if (!user) return;
        if (selectedRole === undefined) return;
        const payload: BatchAssignRole = {
            users: selectedUsers.map(user => user.id),
            role: selectedRole,
        }
        assignRoles(payload, user);
        setSelectionModel([]);
        setSelectedUsers([]);
        setSelectedRole(undefined);
        setConfirmAssignOpen(false);
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
                rows={users}
                columns={cols}
                initialState={{ 
                    pagination: { 
                        paginationModel: {
                            page: 0,
                            pageSize: 10,
                        }
                    },
                    sorting: {
                        sortModel: [{ field: 'last_name', sort: 'asc' }],
                    }
                }}
                rowSelectionModel={selectionModel}
                onRowSelectionModelChange={handleUserSelect}
                checkboxSelection
                sx={{ width: '100%' }}
            />
            {(selectedUsers.length > 0) && 
                <form onSubmit={handleSubmit}>
                    <FormControl
                        sx={{ 
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                        }}
                    >
                        <InputLabel color="secondary" >Role</InputLabel>
                        <Select<number | undefined>
                            value={selectedRole}
                            label="Role"
                            onChange={handleRoleSelect}
                            color="secondary"
                            sx={{ width: '10rem' }}
                        >
                            {roles.map(role => {
                                return <MenuItem key={role.id} value={role.id}>{role.title}</MenuItem>;
                            })}
                        </Select>
                        <Button type="submit" variant="contained" color="secondary">
                            Confirm
                        </Button>
                    </FormControl>
                </form>}
            <ConfirmationDialog
                open={confirmAssignOpen}
                message={`Are you sure you want to assign ${roles.find(role => role.id === selectedRole)?.title} to ${selectedUsers.length} selected user(s)`}
                onConfirm={confirmAssignRoles}
                onCancel={() => setConfirmAssignOpen(false)}
                title='Confirm Assign'
            />
        </Box>
    );
};

export default ManageUsers;
