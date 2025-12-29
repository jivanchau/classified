import { useEffect, useMemo, useState } from 'react';
import { DataGrid, GridActionsCellItem, GridColDef, GridPagination } from '@mui/x-data-grid';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import SecurityIcon from '@mui/icons-material/Security';
import AddIcon from '@mui/icons-material/Add';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './users.css';
import { useToast } from '../../components/ToastProvider';

interface UserRow {
  id: string;
  name: string;
  email: string;
  roles: string[];
  permissions?: string[];
}

interface RoleOption {
  id: string;
  name: string;
  permissions: string[];
}

const CreateUserSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too Short!').required('Required'),
  roles: Yup.array().of(Yup.string())
});

const EditUserSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too Short!'),
  roles: Yup.array().of(Yup.string())
});

export default function UsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignModalUser, setAssignModalUser] = useState<UserRow | null>(null);
  const [assignRoles, setAssignRoles] = useState<string[]>([]);
  const [assignSubmitting, setAssignSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();
  const closeModal = () => {
    setShowModal(false);
    setEditingUser(null);
  };

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.all([api.get('/users'), api.get('/roles')]);
        setRows(usersRes.data);
        setRoles(rolesRes.data);
        setError(null);
      } catch (err: any) {
        const message = err?.response?.data?.message || 'Failed to load users or roles';
        const parsed = Array.isArray(message) ? message.join(', ') : message;
        setError(parsed);
        showError(parsed);
      }
    };
    load();
  }, []);

  const filteredRows = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return rows;
    return rows.filter(row => {
      const rolesText = row.roles?.join(', ')?.toLowerCase() || '';
      const permissionsText = row.permissions?.join(', ')?.toLowerCase() || '';
      return (
        row.name.toLowerCase().includes(query) ||
        row.email.toLowerCase().includes(query) ||
        rolesText.includes(query) ||
        permissionsText.includes(query)
      );
    });
  }, [rows, searchTerm]);

  const openAssignModal = (user: UserRow) => {
    setAssignModalUser(user);
    setAssignRoles(user.roles || []);
    setAssignError(null);
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (user: UserRow) => {
    setEditingUser(user);
    setFormError(null);
    setShowModal(true);
  };

  const handleDelete = async (user: UserRow) => {
    const confirmed = window.confirm(`Delete user "${user.name}"?`);
    if (!confirmed) return;
    try {
      setDeletingId(user.id);
      await api.delete(`/users/${user.id}`);
      setRows(prev => prev.filter(row => row.id !== user.id));
      if (assignModalUser?.id === user.id) {
        setAssignModalUser(null);
      }
      showSuccess('User deleted successfully');
      setError(null);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to delete user';
      const parsed = Array.isArray(message) ? message.join(', ') : message;
      setError(parsed);
      showError(parsed);
    } finally {
      setDeletingId(null);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'serial',
      headerName: '#',
      width: 70,
      sortable: false,
      filterable: false,
      valueGetter: params => params.api.getRowIndexRelativeToVisibleRows(params.id) + 1
    },
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1.2 },
    {
      field: 'roles',
      headerName: 'Roles',
      flex: 1,
      renderCell: params => params.row.roles?.join(', ')
    },
    {
      field: 'permissions',
      headerName: 'Permissions',
      flex: 1.5,
      renderCell: params => params.row.permissions?.join(', ')
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: params => [
        <GridActionsCellItem
          icon={<ManageAccountsIcon fontSize="small" />}
          label="Assign roles"
          onClick={() => openAssignModal(params.row)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          icon={<EditIcon fontSize="small" sx={{ color: '#15803d' }} />}
          label="Edit"
          onClick={() => openEditModal(params.row)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon fontSize="small" sx={{ color: '#dc2626' }} />}
          label="Delete"
          onClick={() => handleDelete(params.row)}
          disabled={deletingId === params.id}
          showInMenu={false}
        />
      ]
    }
  ];

  return (
    <div className="card rounded-xs users-page">
      <div className='flex flex-wrap gap-2 items-center justify-between bg-blue-600 text-white px-3 py-1.5 users-header'>
        <h2 className='flex items-center gap-2'><SecurityIcon /> Users</h2>
        <div className='flex items-center gap-2 flex-1 justify-end'>
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='px-2 py-1 rounded border border-blue-200 text-black min-w-[220px] flex-1 max-w-xs'
          />
          <button type="button" onClick={openCreateModal} className='p-1 px-2 text-sm bg-white text-blue-700 hover:bg-blue-50'>
            <AddIcon fontSize='small' className='p-0' /> Add
          </button>
        </div>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
      </div>

      {showModal && (
        <div className="users-modal-backdrop">
          <div className="modal users-modal">
            <div className="modalTitle">
              <h3 style={{ marginTop: 0 }}>{editingUser ? 'Edit user' : 'Add user'}</h3>
              <a href='#closeModal' className='closeModalButton' onClick={closeModal}>×</a>
            </div>
            <div className="modalBody">
              <Formik
                initialValues={{
                  name: editingUser?.name || '',
                  email: editingUser?.email || '',
                  password: '',
                  roles: editingUser?.roles || []
                }}
                enableReinitialize
                validationSchema={editingUser ? EditUserSchema : CreateUserSchema}
                onSubmit={async (values, helpers) => {
                  try {
                    const payload: any = {
                      name: values.name,
                      email: values.email,
                      roles: values.roles
                    };
                    if (values.password) {
                      payload.password = values.password;
                    }

                    if (editingUser) {
                      const { data } = await api.patch(`/users/${editingUser.id}`, payload);
                      setRows(prev => prev.map(row => (row.id === data.id ? data : row)));
                      showSuccess('User updated successfully');
                    } else {
                      const { data } = await api.post('/users', payload);
                      setRows(prev => [...prev, data]);
                      helpers.resetForm();
                      showSuccess('User created successfully');
                    }

                    setShowModal(false);
                    setEditingUser(null);
                    setFormError(null);
                  } catch (err: any) {
                    const message = err?.response?.data?.message || (editingUser ? 'Failed to update user' : 'Failed to create user');
                    const parsed = Array.isArray(message) ? message.join(', ') : message;
                    setFormError(parsed);
                    showError(parsed);
                  }
                }}
              >
                {({ errors, values, setFieldValue }) => (
                  <Form className="form-grid">
                    <label>
                      <div>Name</div>
                      <Field name="name" placeholder="Jane Doe" />
                      {errors.name && <div style={{ color: 'crimson' }}>{errors.name}</div>}
                    </label>
                    <label>
                      <div>Email</div>
                      <Field name="email" type="email" placeholder="jane@example.com" />
                      {errors.email && <div style={{ color: 'crimson' }}>{errors.email}</div>}
                    </label>
                    <label>
                      <div>Password {editingUser ? '(leave blank to keep unchanged)' : ''}</div>
                      <Field name="password" type="password" placeholder="••••••••" />
                      {errors.password && <div style={{ color: 'crimson' }}>{errors.password}</div>}
                    </label>
                    <label>
                      <div>Roles</div>
                      <select
                        multiple
                        name="roles"
                        value={values.roles}
                        onChange={e => {
                          const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                          setFieldValue('roles', selected);
                        }}
                      >
                        {roles.map(role => (
                          <option key={role.id} value={role.name}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                      {errors.roles && <div style={{ color: 'crimson' }}>{errors.roles as string}</div>}
                    </label>
                    {formError && <div style={{ color: 'crimson' }}>{formError}</div>}
                    <div className="permissions-form-actions modalFooter">
                      <button type="button" onClick={closeModal}>
                        Cancel
                      </button>
                      <button className='' type="submit">Save</button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}

      {assignModalUser && (
        <div className="users-modal-backdrop">
          <div className="modal users-modal">
            <div className="modalTitle">
              <h3 style={{ marginTop: 0 }}>Assign roles</h3>
              <a href='#closeAssign' className='closeModalButton' onClick={() => setAssignModalUser(null)}>×</a>
            </div>
            <div className="modalBody" style={{ display: 'grid', gap: '0.75rem' }}>
              <div>
                <div style={{ fontWeight: 600 }}>{assignModalUser.name}</div>
                <div style={{ color: '#4b5563' }}>{assignModalUser.email}</div>
              </div>
              <label>
                <div>Roles</div>
                <select
                  multiple
                  value={assignRoles}
                  onChange={e => {
                    const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                    setAssignRoles(selected);
                  }}
                >
                  {roles.map(role => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </label>
              {assignError && <div style={{ color: 'crimson' }}>{assignError}</div>}
              <div className="permissions-form-actions modalFooter">
                <button type="button" onClick={() => setAssignModalUser(null)}>
                  Cancel
                </button>
                <button
                  className=''
                  type="button"
                  disabled={assignSubmitting}
                  onClick={async () => {
                    if (!assignModalUser) return;
                    try {
                      setAssignSubmitting(true);
                      const { data } = await api.patch(`/users/${assignModalUser.id}/roles`, { roles: assignRoles });
                      setRows(prev => prev.map(row => (row.id === data.id ? data : row)));
                      setAssignModalUser(null);
                      setAssignError(null);
                      showSuccess('Roles assigned successfully');
                    } catch (err: any) {
                      const message = err?.response?.data?.message || 'Failed to assign roles';
                      const parsed = Array.isArray(message) ? message.join(', ') : message;
                      setAssignError(parsed);
                      showError(parsed);
                    } finally {
                      setAssignSubmitting(false);
                    }
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="permissions-table">
        <DataGrid
          rows={filteredRows}
          columns={columns}
          disableRowSelectionOnClick
          autoHeight={false}
          className="permissions-grid"
          density="compact"
          rowHeight={36}
          columnHeaderHeight={38}
          hideFooterSelectedRowCount
          slots={{
            footer: () => (
              <div className="permissions-grid-footer">
                <GridPagination />
              </div>
            )
          }}
        />
      </div>
    </div>
  );
}
