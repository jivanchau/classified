import { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import api from '../../services/api';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add } from '@mui/icons-material';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { useLocation, useNavigate } from 'react-router-dom';
import './roles.css';

interface RoleRow {
  id: string;
  name: string;
  permissions: string[];
}

export default function RolesPage() {
  const [rows, setRows] = useState<RoleRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewRole, setViewRole] = useState<RoleRow | null>(null);
  const [viewError, setViewError] = useState<string | null>(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesRes = await api.get('/roles');
        setRows(rolesRes.data);
        setError(null);
      } catch (err: any) {
        const message = err?.response?.data?.message || 'Failed to load roles';
        setError(Array.isArray(message) ? message.join(', ') : message);
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  useEffect(() => {
    const state = location.state as { success?: string } | null;
    if (state?.success) {
      setSuccessMessage(state.success);
      navigate(location.pathname, { replace: true });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(null), 5000);
    return () => clearTimeout(timer);
  }, [successMessage]);

  const handleView = async (role: RoleRow) => {
    setViewRole(role);
    setViewError(null);
    setViewLoading(true);
    try {
      const { data } = await api.get(`/roles/${role.id}`);
      setViewRole(data);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to load role';
      setViewError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setViewLoading(false);
    }
  };

  const handleEdit = (role: RoleRow) => {
    navigate(`/admin/settings/roles/${role.id}/edit`);
  };

  const handleDelete = async (role: RoleRow) => {
    const confirmed = window.confirm(`Delete role "${role.name}"?`);
    if (!confirmed) return;
    try {
      setDeletingId(role.id);
      await api.delete(`/roles/${role.id}`);
      setRows(prev => prev.filter(r => r.id !== role.id));
      if (viewRole?.id === role.id) {
        setViewRole(null);
      }
      setError(null);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to delete role';
      setError(Array.isArray(message) ? message.join(', ') : message);
    } finally {
      setDeletingId(null);
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Role', flex: 1 },
    {
      field: 'permissions',
      headerName: 'Permissions',
      flex: 2,
      renderCell: params => {
        const text = params.row.permissions?.join(', ') || '';
        return text.length > 60 ? `${text.slice(0, 60)}...` : text;
      }
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 110,
      getActions: params => [
        <GridActionsCellItem
          icon={<VisibilityIcon fontSize="small" sx={{ color: '#2563eb', margin: 0, }} />}
          label="View"
          onClick={() => handleView(params.row)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          icon={<EditIcon fontSize="small" sx={{ color: '#15803d' }} />}
          label="Edit"
          onClick={() => handleEdit(params.row)}
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
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2><LockPersonIcon fontSize="small" sx={{ marginRight: '4px' }} /> Roles</h2>
        <button className="btn " onClick={() => navigate('/admin/settings/roles/new')}>
          <Add fontSize="small" sx={{ marginRight: '4px' }} /> Role
        </button>
      </div>

      {successMessage && (
        <div className="roles-toast roles-toast-success">
          {successMessage}
        </div>
      )}
      {error && <div style={{ color: 'crimson', marginBottom: '0.5rem' }}>{error}</div>}

      <div style={{ height: 360, marginTop: '1rem' }}>
        <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick loading={loading} />
      </div>

      {viewRole && (
        <div className="roles-modal-backdrop">
          <div className="roles-modal">
            <div className="modalTitle">
              <h3 style={{ margin: 0 }}>{viewRole.name}</h3>
              <button className="roles-modal-close" type="button" onClick={() => setViewRole(null)}>
                ×
              </button>
            </div>
            {viewError && <div style={{ color: 'crimson', marginBottom: '0.5rem' }}>{viewError}</div>}
            {viewLoading ? (
              <div className="roles-modal-muted">Loading role details...</div>
            ) : viewError ? (
              <div className="roles-modal-muted">Unable to load details for this role.</div>
            ) : (
              <>
                <div className="labelRow">
                  <div className="label">Role name</div>
                  <div>: {viewRole.name}</div>
                </div>
                <div className="roles-modal-section">
                  <div className="roles-modal-label">Permissions</div>
                  {viewRole.permissions?.length ? (
                    <div className="roles-permission-list">
                      {viewRole.permissions.map(permission => (
                        <span key={permission} className="roles-permission-chip">
                          {permission}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="roles-modal-muted">No permissions assigned</div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
