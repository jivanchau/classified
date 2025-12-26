import { useEffect, useMemo, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import api from '../../services/api';
import './roles.css';

interface Permission {
  id: string;
  name: string;
  description?: string;
}

interface RoleFormValues {
  name: string;
  permissions: string[];
}

const RoleSchema = Yup.object().shape({
  name: Yup.string().required('Role name is required'),
  permissions: Yup.array().of(Yup.string()).min(1, 'Select at least one permission')
});

export default function AddRolePage() {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    api
      .get('/permissions')
      .then(res => {
        setPermissions(res.data);
        setError(null);
      })
      .catch(err => {
        const message = err?.response?.data?.message || 'Failed to load permissions';
        setError(Array.isArray(message) ? message.join(', ') : message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const groupedPermissions = useMemo(() => {
    const groups = new Map<string, Permission[]>();
    permissions.forEach(permission => {
      const [group] = permission.name.split('.');
      const groupName = group || 'other';
      groups.set(groupName, [...(groups.get(groupName) || []), permission]);
    });

    return Array.from(groups.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([group, items]) => ({
        group,
        items: items.sort((a, b) => a.name.localeCompare(b.name))
      }));
  }, [permissions]);

  return (
    <div className="card new-card">
      <h2><LockPersonIcon fontSize="small" sx={{ marginRight: '4px' }} />Add Role</h2>
      {error && <div style={{ color: 'crimson', marginBottom: '0.75rem' }}>{error}</div>}
      {success && <div style={{ color: 'green', marginBottom: '0.75rem' }}>{success}</div>}
      <Formik<RoleFormValues>
        initialValues={{ name: '', permissions: [] }}
        validationSchema={RoleSchema}
        onSubmit={async (values, helpers) => {
          try {
            await api.post('/roles', values);
            helpers.resetForm();
            setSuccess('Role created successfully');
            setError(null);
          } catch (err: any) {
            const message = err?.response?.data?.message || 'Failed to create role';
            setError(Array.isArray(message) ? message.join(', ') : message);
            setSuccess(null);
          }
        }}
      >
        {({ values, errors, setFieldValue, isSubmitting }) => {
          const toggleGroup = (groupPermissions: Permission[], checked: boolean) => {
            const current = new Set(values.permissions);
            if (checked) {
              groupPermissions.forEach(p => current.add(p.name));
            } else {
              groupPermissions.forEach(p => current.delete(p.name));
            }
            setFieldValue('permissions', Array.from(current));
          };

          const togglePermission = (permissionName: string, checked: boolean) => {
            const selected = checked
              ? [...values.permissions, permissionName]
              : values.permissions.filter(p => p !== permissionName);
            setFieldValue('permissions', selected);
          };

          return (
            <Form className="form-grid form-inline" style={{ gap: '1rem' }}>
              <label>
                <div className='label'>Role name </div>
                <div className='field'>: <Field name="name" placeholder="manager" type="text" className="w-[200px]" /></div>
                {errors.name && <div style={{ color: 'crimson' }}>{errors.name}</div>}
              </label>

              <div style={{ gridColumn: '1 / -1' }}>
              <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>Assign permissions</div>
              {errors.permissions && <div style={{ color: 'crimson', marginBottom: '0.5rem' }}>{errors.permissions as string}</div>}
              {loading && <div style={{ color: '#4b5563' }}>Loading permissions...</div>}
              {!loading && !groupedPermissions.length && (
                <div style={{ color: '#4b5563' }}>No permissions available. Create permissions first.</div>
              )}
              <div className="permission-groups" style={{ display: 'grid', gap: '1rem' }}>
                {groupedPermissions.map(group => {
                  const allSelected = group.items.every(permission => values.permissions.includes(permission.name));
                  const noneSelected = group.items.every(permission => !values.permissions.includes(permission.name));
                  const isCollapsed = !!collapsedGroups[group.group];
                    const toggleCollapse = () =>
                      setCollapsedGroups(prev => ({
                        ...prev,
                        [group.group]: !isCollapsed
                      }));

                    return (
                      <div
                        key={group.group}
                        style={{
                          border: '1px solid #e5e7eb',
                          borderRadius: 6,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', padding: '0.5rem', backgroundColor: '#ccc' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, marginBottom: 0, textTransform: 'capitalize' }}>
                            <input
                              type="checkbox"
                              checked={allSelected}
                              aria-checked={!allSelected && !noneSelected ? 'mixed' : allSelected}
                              onChange={e => toggleGroup(group.items, e.target.checked)}
                            />
                            <h4 style={{ margin: 0 }}>{group.group}</h4>
                          </label>
                          <button type="button" onClick={toggleCollapse} style={{ fontSize: '0.9rem' }}>
                            {isCollapsed ? 'Show' : 'Hide'}
                          </button>
                        </div>
                        {!isCollapsed && (
                          <div style={{ display: 'flex', gap: '0.35rem', padding: '0.5rem', flexWrap: 'wrap' }}>
                            {group.items.map(permission => {
                              const checked = values.permissions.includes(permission.name);
                              return (
                                <label
                                  key={permission.id}
                                  style={{
                                    display: 'flex',
                                    gap: '0.5rem',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    marginRight: 20
                                  }}
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={e => togglePermission(permission.name, e.target.checked)}
                                  />
                                  <div>
                                    <div style={{ fontWeight: 500 }}>{permission.name}</div>
                                    
                                  </div>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '0.5rem' }}>
                <button type="submit" disabled={isSubmitting}>
                  Submit
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}
