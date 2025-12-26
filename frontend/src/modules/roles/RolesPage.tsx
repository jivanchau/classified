import { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem, GridColDef } from '@mui/x-data-grid';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Add } from '@mui/icons-material';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import { useNavigate } from 'react-router-dom';

interface RoleRow {
  id: string;
  name: string;
  permissions: string[];
}

interface RoleFormValues {
  name: string;
  permissions: string[];
}

const RoleSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  permissions: Yup.array().of(Yup.string()).min(1, 'Select at least one permission')
});

export default function RolesPage() {
  const [rows, setRows] = useState<RoleRow[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, permissionsRes] = await Promise.all([api.get('/roles'), api.get('/permissions')]);
        console.log('Roles:', rolesRes.data);
        setRows(rolesRes.data);
        setPermissions(permissionsRes.data.map((p: any) => p.name));
        setError(null);
      } catch (err: any) {
        const message = err?.response?.data?.message || 'Failed to load roles or permissions';
        setError(Array.isArray(message) ? message.join(', ') : message);
      }
    };
    fetchData();
  }, []);

  const handleView = (role: RoleRow) => {
    console.log('View role', role);
  };

  const handleEdit = (role: RoleRow) => {
    console.log('Edit role', role);
  };

  const handleDelete = (role: RoleRow) => {
    console.log('Delete role', role);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Role', flex: 1 },
    {
      field: 'permissions',
      headerName: 'Permissions',
      flex: 2,
      renderCell: params => params.row.permissions?.join(', ').slice(0, 50) + "..." || ''
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

      <div style={{ height: 360, marginTop: '1rem' }}>
        <DataGrid rows={rows} columns={columns} disableRowSelectionOnClick />
      </div>
    </div>
  );
}
