import { useEffect, useMemo, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import StarsIcon from '@mui/icons-material/Stars';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '../../services/api';
import { useToast } from '../../components/ToastProvider';
import '../permissions/permission.css';
import './features-options.css';

interface FeatureOption {
  id: string;
  text: string;
  icon: string | null;
  status: 'active' | 'inactive';
}

const FeatureOptionSchema = Yup.object().shape({
  text: Yup.string().required('Required'),
  icon: Yup.string(),
  status: Yup.string().oneOf(['active', 'inactive']).required('Required')
});

const FeatureOptionRow = ({
  option,
  selected,
  onSelect,
  onEdit,
  onDelete,
  deletingId
}: {
  option: FeatureOption;
  selected: boolean;
  onSelect: (id: string) => void;
  onEdit: (option: FeatureOption) => void;
  onDelete: (option: FeatureOption) => void;
  deletingId: string | null;
}) => (
  <div className={`feature-option-row ${selected ? 'is-selected' : ''}`} onClick={() => onSelect(option.id)}>
    <div className="feature-option-left">
      <div className="feature-option-icon">
        <StarsIcon fontSize="small" />
      </div>
      <div>
        <div className="feature-option-title">
          {option.text}
          {option.icon && <span className="feature-option-chip">{option.icon}</span>}
        </div>
        <div className="feature-option-meta">
          <span className={`status-chip ${option.status === 'active' ? 'is-active' : 'is-inactive'}`}>
            {option.status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>
    </div>
    <div className="feature-option-actions">
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          onSelect(option.id);
        }}
        title="View"
      >
        <VisibilityIcon fontSize="small" />
      </button>
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          onEdit(option);
        }}
        title="Edit"
      >
        <EditIcon fontSize="small" />
      </button>
      <button
        type="button"
        className="danger"
        onClick={e => {
          e.stopPropagation();
          onDelete(option);
        }}
        title="Delete"
        disabled={deletingId === option.id}
      >
        <DeleteIcon fontSize="small" />
      </button>
    </div>
  </div>
);

export default function FeaturesOptionsPage() {
  const [options, setOptions] = useState<FeatureOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  const loadOptions = async (preferredSelection?: string) => {
    try {
      setLoading(true);
      const { data } = await api.get<FeatureOption[]>('/features-options');
      setOptions(data);
      setError(null);
      setSelectedId(current => {
        const candidate = preferredSelection ?? current;
        if (candidate && data.some(option => option.id === candidate)) return candidate;
        return data[0]?.id ?? null;
      });
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to load feature options';
      const parsed = Array.isArray(message) ? message.join(', ') : message;
      setError(parsed);
      showError(parsed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOptions();
  }, []);

  useEffect(() => {
    if (selectedId && !options.some(option => option.id === selectedId)) {
      setSelectedId(null);
    }
  }, [options, selectedId]);

  const filteredOptions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return options;
    return options.filter(option => {
      return (
        option.text.toLowerCase().includes(term) ||
        (option.icon || '').toLowerCase().includes(term) ||
        (option.status || '').toLowerCase().includes(term)
      );
    });
  }, [options, searchTerm]);

  const selectedOption = selectedId ? options.find(option => option.id === selectedId) || null : null;
  const editingOption = editingId ? options.find(option => option.id === editingId) || null : null;

  const handleDelete = async (option: FeatureOption) => {
    const confirmed = window.confirm(`Delete feature option "${option.text}"?`);
    if (!confirmed) return;
    try {
      setDeletingId(option.id);
      await api.delete(`/features-options/${option.id}`);
      showSuccess('Feature option deleted');
      await loadOptions();
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to delete feature option';
      const parsed = Array.isArray(message) ? message.join(', ') : message;
      setError(parsed);
      showError(parsed);
    } finally {
      setDeletingId(null);
    }
  };

  const initialValues = editingOption
    ? { text: editingOption.text, icon: editingOption.icon || '', status: editingOption.status }
    : { text: '', icon: '', status: 'active' as const };

  return (
    <div className="card rounded-xs permissions-page features-options-page">
      <div className="flex flex-wrap gap-2 items-center justify-between bg-blue-600 text-white px-3 py-1.5">
        <h2 className="flex items-center gap-2">
          <StarsIcon /> Feature options
        </h2>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <input
            type="text"
            placeholder="Search feature options..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-2 py-1 rounded border border-blue-200 text-black min-w-[220px] flex-1 max-w-xs"
          />
          <button
            type="button"
            onClick={() => {
              setEditingId(null);
              setShowModal(true);
            }}
            className="p-1 px-2 text-sm bg-white text-blue-700 hover:bg-blue-50"
          >
            <AddIcon fontSize="small" className="p-0" /> Add
          </button>
        </div>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
      </div>

      <div className="features-options-body">
        <div className="features-options-list">
          {loading ? (
            <div className="feature-option-empty">Loading feature options...</div>
          ) : filteredOptions.length === 0 ? (
            <div className="feature-option-empty">No feature options found.</div>
          ) : (
            filteredOptions.map(option => (
              <FeatureOptionRow
                key={option.id}
                option={option}
                selected={selectedId === option.id}
                onSelect={setSelectedId}
                onEdit={opt => {
                  setEditingId(opt.id);
                  setShowModal(true);
                }}
                onDelete={handleDelete}
                deletingId={deletingId}
              />
            ))
          )}
        </div>

        <div className="features-options-detail">
          <div className="detail-header">
            <h3>Feature option detail</h3>
            {selectedOption && (
              <button
                type="button"
                className="text-sm edit-link"
                onClick={() => {
                  setEditingId(selectedOption.id);
                  setShowModal(true);
                }}
              >
                <EditIcon fontSize="small" /> Edit
              </button>
            )}
          </div>
          {selectedOption ? (
            <div className="detail-body">
              <div className="detail-row">
                <div className="detail-label">Text</div>
                <div className="detail-value">{selectedOption.text}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Icon</div>
                <div className="detail-value">{selectedOption.icon || 'N/A'}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Status</div>
                <div className="detail-value">
                  <span className={`status-chip ${selectedOption.status === 'active' ? 'is-active' : 'is-inactive'}`}>
                    {selectedOption.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">ID</div>
                <div className="detail-value">{selectedOption.id}</div>
              </div>
            </div>
          ) : (
            <div className="feature-option-empty muted">Select a feature option to view details</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="permissions-modal-backdrop">
          <div className="modal permissions-modal">
            <div className="modalTitle">
              <h3 style={{ marginTop: 0 }}>{editingOption ? 'Edit feature option' : 'Add feature option'}</h3>
              <a
                href="#closeModal"
                className="closeModalButton"
                onClick={e => {
                  e.preventDefault();
                  setShowModal(false);
                  setEditingId(null);
                }}
              >
                ×
              </a>
            </div>
            <div className="modalBody">
              <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={FeatureOptionSchema}
                onSubmit={async (values, helpers) => {
                  try {
                    if (editingOption) {
                      await api.patch(`/features-options/${editingOption.id}`, values);
                      showSuccess('Feature option updated');
                      await loadOptions(editingOption.id);
                    } else {
                      const { data } = await api.post('/features-options', values);
                      showSuccess('Feature option created');
                      await loadOptions(data?.id);
                    }
                    setShowModal(false);
                    setEditingId(null);
                    helpers.resetForm();
                  } catch (err: any) {
                    const message = err?.response?.data?.message || 'Failed to save feature option';
                    const parsed = Array.isArray(message) ? message.join(', ') : message;
                    setError(parsed);
                    showError(parsed);
                  }
                }}
              >
                {({ errors, isSubmitting }) => (
                  <Form className="form-grid">
                    <label>
                      <div>Text</div>
                      <Field name="text" placeholder="Feature text" />
                      {errors.text && <div style={{ color: 'crimson' }}>{errors.text}</div>}
                    </label>
                    <label>
                      <div>Icon</div>
                      <Field name="icon" placeholder="e.g., ph-bold ph-rocket" />
                    </label>
                    <label>
                      <div>Status</div>
                      <div className="status-options">
                        <label className="status-option">
                          <Field type="radio" name="status" value="active" />
                          <span>Active</span>
                        </label>
                        <label className="status-option">
                          <Field type="radio" name="status" value="inactive" />
                          <span>Inactive</span>
                        </label>
                      </div>
                      {errors.status && <div style={{ color: 'crimson' }}>{errors.status}</div>}
                    </label>
                    <div className="permissions-form-actions modalFooter">
                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false);
                          setEditingId(null);
                        }}
                        className="secondary"
                      >
                        Cancel
                      </button>
                      <button type="submit" disabled={isSubmitting}>
                        Save
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
