import { useEffect, useState } from 'react';
import { DataGrid, GridActionsCellItem, GridColDef, GridPagination, GridRowId, GridRowSelectionModel } from '@mui/x-data-grid';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';
import SecurityIcon from '@mui/icons-material/Security';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import './permission.css';

interface PermissionRow {
  id: string;
  name: string;
  description?: string;
}

const PermissionSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  description: Yup.string()
});

export default function PermissionsPage() {
  const [rows, setRows] = useState<PermissionRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectionModel, setSelectionModel] = useState<GridRowSelectionModel>([]);

  useEffect(() => {
    api
      .get('/permissions')
      .then(res => setRows(res.data))
      .catch(err => {
        const message = err?.response?.data?.message || 'Failed to load permissions';
        setError(message);
      });
  }, []);

  const handleDelete = async (id: GridRowId) => {
    try {
      await api.delete(`/permissions/${id}`);
      setRows(prev => prev.filter(row => row.id !== id));
      setSelectionModel(prev => prev.filter(selectedId => selectedId !== id));
      setError(null);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to delete permission';
      setError(Array.isArray(message) ? message.join(', ') : message);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectionModel.length) return;
    try {
      await Promise.all(selectionModel.map(id => api.delete(`/permissions/${id}`)));
      setRows(prev => prev.filter(row => !selectionModel.includes(row.id)));
      setSelectionModel([]);
      setError(null);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to delete selected permissions';
      setError(Array.isArray(message) ? message.join(', ') : message);
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
    { field: 'name', headerName: 'Permission', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 90,
      getActions: params => [
        <GridActionsCellItem
          icon={<EditIcon fontSize="small" />}
          label="Edit"
          onClick={() => setShowModal(true)}
          showInMenu={false}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon fontSize="small" />}
          label="Delete"
          onClick={() => handleDelete(params.id)}
          showInMenu={false}
        />
      ]
    }
  ];

  const filteredRows = rows.filter(row => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return true;
    return (
      row.name.toLowerCase().includes(query) ||
      (row.description || '').toLowerCase().includes(query)
    );
  });

  return (
    <div className="card rounded-xs permissions-page">
      <div className='flex flex-wrap gap-2 items-center justify-between bg-blue-600 text-white px-3 py-1.5'>
        <h2 className='flex items-center gap-2'><SecurityIcon /> Permissions</h2>
        <div className='flex items-center gap-2 flex-1 justify-end'>
          <input
            type="text"
            placeholder="Search permissions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className='px-2 py-1 rounded border border-blue-200 text-black min-w-[220px] flex-1 max-w-xs'
          />
          <button type="button" onClick={() => setShowModal(true)} className='p-1 px-2 text-sm bg-white text-blue-700 hover:bg-blue-50'>
            <AddIcon fontSize='small' className='p-0' /> Add
          </button>
        </div>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
      </div>
      {showModal && (
        <div
          className="permissions-modal-backdrop"
        >
          <div
            className="modal permissions-modal"
          >
            <div className="modalTitle">
              <h3 style={{ marginTop: 0 }}>Add permission</h3>
              <a href='#closeModal' className='closeModalButton' onClick={() => setShowModal(false)}>×</a>

            </div>
            <div className="modalBody">

            <Formik
              initialValues={{ name: '', description: '' }}
              validationSchema={PermissionSchema}
              onSubmit={async (values, helpers) => {
                try {
                  const { data } = await api.post('/permissions', values);
                  setRows(prev => [...prev, data]);
                  helpers.resetForm();
                  setShowModal(false);
                  setError(null);
                } catch (err: any) {
                  const message = err?.response?.data?.message || 'Failed to add permission';
                  setError(Array.isArray(message) ? message.join(', ') : message);
                }
              }}
            >
              {({ errors }) => (
                <Form className="form-grid">
                  <label>
                    <div>Permission name</div>
                    <Field name="name" placeholder="users.create" />
                    {errors.name && <div style={{ color: 'crimson' }}>{errors.name}</div>}
                  </label>
                  <label>
                    <div>Description</div>
                    <Field name="description" placeholder="Create new users" />
                  </label>
                  <div className="permissions-form-actions modalFooter">
                    <button type="button" onClick={() => setShowModal(false)}>
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
      <div className="permissions-table">
        <DataGrid
          rows={filteredRows}
          columns={columns}
          disableRowSelectionOnClick
          checkboxSelection
          autoHeight={false}
          className="permissions-grid"
          density="compact"
          rowHeight={36}
          columnHeaderHeight={38}
          hideFooterSelectedRowCount
          slots={{
            footer: () => (
              <div className="permissions-grid-footer">
                <button
                  type="button"
                  className="p-1 px-2 text-sm bg-red-600 text-white disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={handleBulkDelete}
                  disabled={!selectionModel.length}
                >
                  Delete Selected
                </button>
                <GridPagination />
              </div>
            )
          }}
          onRowSelectionModelChange={newSelection => setSelectionModel(newSelection)}
          rowSelectionModel={selectionModel}
        />
      </div>
      
    </div>
  );
}
