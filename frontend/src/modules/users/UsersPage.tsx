import { useEffect, useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';

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

const UserSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Too Short!').required('Required'),
  roles: Yup.array().of(Yup.string())
});

export default function UsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [roles, setRoles] = useState<RoleOption[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [assignError, setAssignError] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [usersRes, rolesRes] = await Promise.all([api.get('/users'), api.get('/roles')]);
        setRows(usersRes.data);
        setRoles(rolesRes.data);
        setError(null);
      } catch (err: any) {
        const message = err?.response?.data?.message || 'Failed to load users or roles';
        setError(Array.isArray(message) ? message.join(', ') : message);
      }
    };
    load();
  }, []);

  const selectedUser = rows.find(u => u.id === selectedUserId);
  const derivedPermissions = Array.from(
    new Set(
      selectedRoles.flatMap(
        roleName => roles.find(r => r.name === roleName)?.permissions || []
      )
    )
  );

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
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
    }
  ];

  return (
    <div className="card">
      <h2>Users</h2>
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
      <Formik
        initialValues={{ name: '', email: '', password: '', roles: [] as string[] }}
        validationSchema={UserSchema}
        onSubmit={async (values, helpers) => {
          try {
            const payload = {
              name: values.name,
              email: values.email,
              password: values.password,
              roles: values.roles
            };
            const { data } = await api.post('/users', payload);
            setRows(prev => [...prev, data]);
            helpers.resetForm();
            setError(null);
          } catch (err: any) {
            const message = err?.response?.data?.message || 'Failed to create user';
            setError(Array.isArray(message) ? message.join(', ') : message);
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
              <div>Password</div>
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
            <button type="submit">Create user</button>
          </Form>
        )}
      </Formik>
      <div style={{ height: 380, marginTop: '1rem' }}>
        <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick />
      </div>
      <div style={{ marginTop: '1.5rem' }}>
        <h3>Assign roles to a user</h3>
        {assignError && <div style={{ color: 'crimson' }}>{assignError}</div>}
        <form
          className="form-grid"
          onSubmit={async e => {
            e.preventDefault();
            if (!selectedUserId) return;
            try {
              const { data } = await api.patch(`/users/${selectedUserId}/roles`, { roles: selectedRoles });
              setRows(prev => prev.map(row => (row.id === data.id ? data : row)));
              setAssignError(null);
            } catch (err: any) {
              const message = err?.response?.data?.message || 'Failed to assign roles';
              setAssignError(Array.isArray(message) ? message.join(', ') : message);
            }
          }}
        >
          <label>
            <div>User</div>
            <select
              value={selectedUserId}
              onChange={e => {
                const userId = e.target.value;
                setSelectedUserId(userId);
                const user = rows.find(u => u.id === userId);
                setSelectedRoles(user?.roles || []);
              }}
            >
              <option value="">Select a user</option>
              {rows.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </label>
          <label>
            <div>Roles</div>
            <select
              multiple
              value={selectedRoles}
              onChange={e => {
                const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                setSelectedRoles(selected);
              }}
              disabled={!selectedUserId}
            >
              {roles.map(role => (
                <option key={role.id} value={role.name}>
                  {role.name}
                </option>
              ))}
            </select>
          </label>
          <div style={{ alignSelf: 'flex-end' }}>
            <button type="submit" disabled={!selectedUserId}>
              Update roles
            </button>
          </div>
        </form>
        <div>
          <div style={{ marginTop: '0.5rem' }}>
            <strong>Permissions from selection:</strong>{' '}
            {derivedPermissions.length ? derivedPermissions.join(', ') : 'None'}
          </div>
          {selectedUser && (
            <div style={{ marginTop: '0.25rem', color: '#444' }}>
              Current permissions on user: {selectedUser.permissions?.length ? selectedUser.permissions.join(', ') : 'None'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
