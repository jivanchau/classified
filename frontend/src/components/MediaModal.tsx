import { useEffect, useState } from 'react';
import api from '../services/api';
import { useToast } from './ToastProvider';

export type MediaSelectionMode = 'single' | 'multiple';

interface MediaItem {
  id: string;
  title: string;
  url: string;
  fileName: string;
}

interface MediaModalProps {
  open: boolean;
  selectionMode: MediaSelectionMode;
  initialSelection?: string[];
  onClose: () => void;
  onConfirm: (urls: string[]) => void;
}

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const assetBase = apiBase.replace(/\/api$/, '');
const buildUrl = (path: string) => (path?.startsWith('http') ? path : `${assetBase}${path || ''}`);

export default function MediaModal({ open, selectionMode, initialSelection = [], onClose, onConfirm }: MediaModalProps) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUrls, setSelectedUrls] = useState<string[]>(initialSelection);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { showError } = useToast();

  useEffect(() => {
    if (selectionMode === 'single' && selectedUrls.length > 1) {
      setSelectedUrls(selectedUrls.slice(0, 1));
    }
  }, [selectionMode, selectedUrls]);

  const loadMedia = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/media');
      setItems(data);
      setError(null);
      setHasLoaded(true);
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
    if (!open || hasLoaded) return;
    loadMedia();
  }, [open, hasLoaded]);

  useEffect(() => {
    if (open) {
      setSearchTerm('');
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setSelectedUrls(initialSelection);
  }, [open, initialSelection]);

  if (!open) return null;

  const searchQuery = searchTerm.trim().toLowerCase();
  const filteredItems = searchQuery
    ? items.filter(item => [item.title, item.fileName].some(value => value.toLowerCase().includes(searchQuery)))
    : items;

  return (
    <div className="permissions-modal-backdrop">
      <div className="modal permissions-modal media-picker-modal">
        <div className="modalTitle">
          <h3 style={{ marginTop: 0 }}>Select media</h3>
          <a
            href="#closeMedia"
            className="closeModalButton"
            onClick={e => {
              e.preventDefault();
              onClose();
            }}
          >
            ×
          </a>
        </div>
        <div className="modalBody">
          <div className="media-picker-header">
            <div>
              <div className="eyebrow">Pick {selectionMode === 'single' ? 'one' : 'one or more'} image(s)</div>
              {error && <div style={{ color: 'crimson' }}>{error}</div>}
            </div>
            <div className="media-picker-actions">
              <input
                type="text"
                className="media-picker-search"
                placeholder="Search by title or file name"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <button
                type="button"
                className="secondary"
                onClick={() => setHasLoaded(false)}
                disabled={loading}
              >
                Refresh
              </button>
            </div>
          </div>
          <div className="media-picker-grid">
            {loading ? (
              <div className="media-empty">Loading media...</div>
            ) : filteredItems.length === 0 ? (
              <div className="media-empty">
                {items.length === 0 ? 'No media uploaded yet.' : 'No media found for that search.'}
              </div>
            ) : (
              filteredItems.map(item => {
                const isSelected = selectedUrls.includes(item.url);
                return (
                  <button
                    type="button"
                    key={item.id}
                    className={`media-picker-card ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => {
                      if (selectionMode === 'single') {
                        setSelectedUrls([item.url]);
                        return;
                      }
                      setSelectedUrls(current =>
                        current.includes(item.url) ? current.filter(u => u !== item.url) : [...current, item.url]
                      );
                    }}
                  >
                    <div className="media-picker-thumb">
                      <img src={buildUrl(item.url)} alt={item.title} />
                    </div>
                    <div className="media-picker-title">{item.title}</div>
                    <div className="media-picker-filename">{item.fileName}</div>
                  </button>
                );
              })
            )}
          </div>
          <div className="permissions-form-actions modalFooter">
            <button
              type="button"
              className="secondary"
              onClick={() => {
                onClose();
                setSelectedUrls(initialSelection);
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (selectedUrls.length === 0) {
                  showError('Please select at least one image');
                  return;
                }
                onConfirm(selectionMode === 'single' ? [selectedUrls[0]] : selectedUrls);
              }}
            >
              Use selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
