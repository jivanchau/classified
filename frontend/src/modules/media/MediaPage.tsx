import { useEffect, useMemo, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '../../services/api';
import { useToast } from '../../components/ToastProvider';
import './media.css';
import '../permissions/permission.css';

interface MediaItem {
  id: string;
  title: string;
  url: string;
  fileName: string;
  mimeType?: string;
  size?: number;
  createdAt?: string;
}

interface FormValues {
  title: string;
  file: File | null;
}

const MediaSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  file: Yup.mixed().nullable().required('Image is required')
});

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const assetBase = apiBase.replace(/\/api$/, '');
const buildUrl = (path: string) => (path?.startsWith('http') ? path : `${assetBase}${path || ''}`);

const formatSize = (bytes?: number) => {
  if (!bytes) return 'N/A';
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
};

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  const loadMedia = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/media');
      setItems(data);
      setError(null);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to load media';
      const parsed = Array.isArray(message) ? message.join(', ') : message;
      setError(parsed);
      showError(parsed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const selectedItem = selectedId ? items.find(item => item.id === selectedId) || null : null;

  useEffect(() => {
    if (!selectedItem) {
      setShowDetailModal(false);
    }
  }, [selectedItem]);

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return items;
    return items.filter(item => item.title.toLowerCase().includes(term) || item.fileName.toLowerCase().includes(term));
  }, [items, searchTerm]);

  const handleDelete = async (item: MediaItem) => {
    const confirmed = window.confirm(`Delete media "${item.title}"?`);
    if (!confirmed) return;
    try {
      await api.delete(`/media/${item.id}`);
      setItems(prev => prev.filter(m => m.id !== item.id));
      if (selectedId === item.id) {
        setSelectedId(null);
        setShowDetailModal(false);
      }
      showSuccess('Media deleted');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to delete media';
      const parsed = Array.isArray(message) ? message.join(', ') : message;
      showError(parsed);
      setError(parsed);
    }
  };

  const initialValues: FormValues = { title: '', file: null };

  return (
    <div className="card rounded-xs permissions-page media-page">
      <div className="flex flex-wrap gap-2 items-center justify-between bg-blue-600 text-white px-3 py-1.5">
        <h2 className="flex items-center gap-2">
          <AddPhotoAlternateIcon /> Media
        </h2>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <input
            type="text"
            placeholder="Search media..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-2 py-1 rounded border border-blue-200 text-black min-w-[220px] flex-1 max-w-xs"
          />
          <button type="button" onClick={() => setShowUploadModal(true)} className="p-1 px-2 text-sm bg-white text-blue-700 hover:bg-blue-50">
            <AddIcon fontSize="small" className="p-0" /> Add
          </button>
        </div>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
      </div>

      <div className="media-body">
        <div className="media-grid">
          {loading ? (
            <div className="media-empty">Loading media...</div>
          ) : filteredItems.length === 0 ? (
            <div className="media-empty">No media found.</div>
          ) : (
            filteredItems.map(item => (
              <div
                key={item.id}
                className={`media-card ${selectedId === item.id ? 'is-selected' : ''}`}
                onClick={() => {
                  setSelectedId(item.id);
                  setShowDetailModal(true);
                }}
              >
                <div className="media-thumb">
                  <img src={buildUrl(item.url)} alt={item.title} />
                </div>
                <div className="media-info">
                  <div className="media-title">
                    <span>{item.title}</span>
                    <button
                      type="button"
                      className="ghost"
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedId(item.id);
                        setShowDetailModal(true);
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </button>
                  </div>
                  <div className="media-meta">
                    <span>{item.mimeType || 'Image'}</span>
                    <span>•</span>
                    <span>{formatSize(item.size)}</span>
                  </div>
                </div>
                <div className="media-actions">
                  <button
                    type="button"
                    className="danger"
                    onClick={e => {
                      e.stopPropagation();
                      handleDelete(item);
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showDetailModal && selectedItem && (
        <div className="permissions-modal-backdrop">
          <div className="modal permissions-modal media-detail-modal">
            <div className="modalTitle">
              <h3 style={{ marginTop: 0 }}>Media detail</h3>
              <a
                href="#closeDetail"
                className="closeModalButton"
                onClick={e => {
                  e.preventDefault();
                  setShowDetailModal(false);
                }}
              >
                ×
              </a>
            </div>
            <div className="modalBody media-detail-modal__body">
              <div className="detail-preview detail-preview--modal">
                <img src={buildUrl(selectedItem.url)} alt={selectedItem.title} />
              </div>
              <div className="detail-row">
                <div className="detail-label">Title</div>
                <div className="detail-value">{selectedItem.title}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Filename</div>
                <div className="detail-value">{selectedItem.fileName}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Type</div>
                <div className="detail-value">{selectedItem.mimeType || 'Image'}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Size</div>
                <div className="detail-value">{formatSize(selectedItem.size)}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Created</div>
                <div className="detail-value">
                  {selectedItem.createdAt ? new Date(selectedItem.createdAt).toLocaleString() : 'N/A'}
                </div>
              </div>
              <div className="detail-actions">
                <a href={buildUrl(selectedItem.url)} target="_blank" rel="noreferrer" className="ghost">
                  <VisibilityIcon fontSize="small" /> Open
                </a>
                <button type="button" className="danger" onClick={() => handleDelete(selectedItem)}>
                  <DeleteIcon fontSize="small" /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showUploadModal && (
        <div className="permissions-modal-backdrop">
          <div className="modal permissions-modal">
            <div className="modalTitle">
              <h3 style={{ marginTop: 0 }}>Add media</h3>
              <a
                href="#closeModal"
                className="closeModalButton"
                onClick={e => {
                  e.preventDefault();
                  setShowUploadModal(false);
                  setFilePreview(null);
                }}
              >
                ×
              </a>
            </div>
            <div className="modalBody">
              <Formik
                initialValues={initialValues}
                validationSchema={MediaSchema}
                onSubmit={async (values, helpers) => {
                  if (!values.file) {
                    showError('Image is required');
                    return;
                  }
                  try {
                    setUploading(true);
                    const formData = new FormData();
                    formData.append('title', values.title);
                    formData.append('file', values.file);
                    const { data } = await api.post('/media', formData, {
                      headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    setItems(prev => [data, ...prev]);
                    setSelectedId(data.id);
                    helpers.resetForm();
                    setShowUploadModal(false);
                    setFilePreview(null);
                    showSuccess('Media uploaded');
                  } catch (err: any) {
                    const message = err?.response?.data?.message || 'Failed to upload media';
                    const parsed = Array.isArray(message) ? message.join(', ') : message;
                    showError(parsed);
                    setError(parsed);
                  } finally {
                    setUploading(false);
                  }
                }}
              >
                {({ errors, setFieldValue, values }) => (
                  <Form className="form-grid">
                    <label>
                      <div>Title</div>
                      <Field name="title" placeholder="Banner image" />
                      {errors.title && <div style={{ color: 'crimson' }}>{errors.title as string}</div>}
                    </label>
                    <label>
                      <div>Image</div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => {
                          const file = e.currentTarget.files?.[0] || null;
                          setFieldValue('file', file);
                          if (filePreview) {
                            URL.revokeObjectURL(filePreview);
                          }
                          setFilePreview(file ? URL.createObjectURL(file) : null);
                        }}
                      />
                      {errors.file && <div style={{ color: 'crimson' }}>{errors.file as string}</div>}
                    </label>
                    {filePreview && (
                      <div className="preview-box">
                        <img src={filePreview} alt="Preview" />
                      </div>
                    )}
                    <div className="permissions-form-actions modalFooter">
                      <button
                        type="button"
                        onClick={() => {
                          setShowUploadModal(false);
                          setFilePreview(null);
                        }}
                        className="secondary"
                      >
                        Cancel
                      </button>
                      <button type="submit" disabled={uploading}>
                        {uploading ? 'Uploading...' : 'Save'}
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
