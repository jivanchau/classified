import { useEffect, useMemo, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import CategoryIcon from '@mui/icons-material/Category';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import ImageIcon from '@mui/icons-material/Image';
import api from '../../services/api';
import { useToast } from '../../components/ToastProvider';
import './categories.css';
import '../permissions/permission.css';

interface CategoryNode {
  id: string;
  title: string;
  banner?: string | null;
  shortDesc?: string | null;
  parentId: string | null;
  position: number;
  children: CategoryNode[];
}

interface FlatCategoryOption {
  id: string;
  title: string;
  depth: number;
}

interface MediaItem {
  id: string;
  title: string;
  url: string;
  fileName: string;
}

const CategorySchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  banner: Yup.string(),
  shortDesc: Yup.string(),
  parentId: Yup.string().nullable()
});

const flattenCategories = (nodes: CategoryNode[], depth = 0, acc: FlatCategoryOption[] = []): FlatCategoryOption[] => {
  nodes.forEach(node => {
    acc.push({ id: node.id, title: node.title, depth });
    flattenCategories(node.children || [], depth + 1, acc);
  });
  return acc;
};

const findNodeById = (nodes: CategoryNode[], id: string): CategoryNode | undefined => {
  for (const node of nodes) {
    if (node.id === id) return node;
    const child = findNodeById(node.children || [], id);
    if (child) return child;
  }
  return undefined;
};

const collectDescendants = (node: CategoryNode, acc: Set<string>) => {
  node.children?.forEach(child => {
    acc.add(child.id);
    collectDescendants(child, acc);
  });
};

const filterTree = (nodes: CategoryNode[], term: string): CategoryNode[] => {
  const query = term.trim().toLowerCase();
  if (!query) return nodes;

  const walk = (items: CategoryNode[]): CategoryNode[] =>
    items
      .map(item => {
        const filteredChildren = walk(item.children || []);
        const matches =
          item.title.toLowerCase().includes(query) ||
          (item.shortDesc || '').toLowerCase().includes(query) ||
          filteredChildren.length > 0;

        if (!matches) return null;
        return { ...item, children: filteredChildren };
      })
      .filter((item): item is CategoryNode => Boolean(item));

  return walk(nodes);
};

const detachNode = (nodes: CategoryNode[], id: string): { tree: CategoryNode[]; detached: CategoryNode | null } => {
  let detached: CategoryNode | null = null;
  const tree = nodes.reduce<CategoryNode[]>((acc, node) => {
    if (node.id === id) {
      detached = { ...node, children: node.children.map(child => ({ ...child })) };
      return acc;
    }

    const { tree: updatedChildren, detached: childDetached } = detachNode(node.children || [], id);
    if (childDetached) detached = childDetached;
    acc.push({ ...node, children: updatedChildren });
    return acc;
  }, []);

  return { tree, detached };
};

const insertNode = (nodes: CategoryNode[], parentId: string | null, node: CategoryNode): { tree: CategoryNode[]; inserted: boolean } => {
  if (!parentId) {
    return { tree: [...nodes, { ...node }], inserted: true };
  }

  let inserted = false;
  const tree = nodes.map(item => {
    if (item.id === parentId) {
      inserted = true;
      return { ...item, children: [...(item.children || []), { ...node }] };
    }
    const { tree: updatedChildren, inserted: childInserted } = insertNode(item.children || [], parentId, node);
    if (childInserted) inserted = true;
    return { ...item, children: updatedChildren };
  });

  return { tree: inserted ? tree : [...tree, { ...node }], inserted };
};

const applyPositions = (nodes: CategoryNode[]): CategoryNode[] =>
  nodes.map((node, idx) => ({
    ...node,
    position: idx + 1,
    children: applyPositions(node.children || [])
  }));

const moveNode = (nodes: CategoryNode[], draggedId: string, newParentId: string | null) => {
  const { tree: withoutDragged, detached } = detachNode(nodes, draggedId);
  if (!detached) return nodes;
  const { tree } = insertNode(withoutDragged, newParentId, detached);
  return applyPositions(tree);
};

const flattenForOrder = (nodes: CategoryNode[], parentId: string | null = null, acc: { id: string; parentId: string | null; position: number }[] = []) => {
  nodes.forEach((node, index) => {
    const position = node.position || index + 1;
    acc.push({ id: node.id, parentId, position });
    flattenForOrder(node.children || [], node.id, acc);
  });
  return acc;
};

const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const assetBase = apiBase.replace(/\/api$/, '');
const buildUrl = (path: string) => (path?.startsWith('http') ? path : `${assetBase}${path || ''}`);

const CategoryItem = ({
  node,
  depth,
  onView,
  onEdit,
  onDelete,
  onDrop,
  onDragStart,
  onDragEnd,
  onDragEnter,
  draggingId,
  dragOverId,
  selectedId,
  deletingId
}: {
  node: CategoryNode;
  depth: number;
  onView: (node: CategoryNode) => void;
  onEdit: (node: CategoryNode) => void;
  onDelete: (node: CategoryNode) => void;
  onDrop: (targetId: string) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onDragEnter: (id: string) => void;
  draggingId: string | null;
  dragOverId: string | null;
  selectedId: string | null;
  deletingId: string | null;
}) => {
  return (
    <div className="category-item">
      <div
        className={`category-row ${draggingId === node.id ? 'is-dragging' : ''} ${dragOverId === node.id ? 'is-over' : ''} ${selectedId === node.id ? 'is-selected' : ''}`}
        style={{ paddingLeft: `${depth * 14}px` }}
        draggable
        onDragStart={() => onDragStart(node.id)}
        onDragEnd={onDragEnd}
        onDragOver={e => {
          e.preventDefault();
          onDragEnter(node.id);
        }}
        onDrop={e => {
          e.preventDefault();
          onDrop(node.id);
        }}
      >
        <div className="category-left">
          <div className="drag-handle">
            <DragIndicatorIcon fontSize="small" />
          </div>
          <div>
            <div className="category-title">
              {node.title}
              <span className="category-badge">#{node.position}</span>
            </div>
            <div className="category-meta">{node.shortDesc || 'No short description yet'}</div>
          </div>
        </div>
        <div className="category-actions">
          <button type="button" onClick={() => onView(node)} title="View">
            <VisibilityIcon fontSize="small" />
          </button>
          <button type="button" onClick={() => onEdit(node)} title="Edit">
            <EditIcon fontSize="small" />
          </button>
          <button type="button" onClick={() => onDelete(node)} title="Delete" className="danger" disabled={deletingId === node.id}>
            <DeleteIcon fontSize="small" />
          </button>
        </div>
      </div>
      {node.children?.length > 0 && (
        <div className="category-children">
          {node.children.map(child => (
            <CategoryItem
              key={child.id}
              node={child}
              depth={depth + 1}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onDrop={onDrop}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragEnter={onDragEnter}
              draggingId={draggingId}
              dragOverId={dragOverId}
              selectedId={selectedId}
              deletingId={deletingId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showMediaModal, setShowMediaModal] = useState(false);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [mediaLoading, setMediaLoading] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [mediaSelectionMode, setMediaSelectionMode] = useState<'single' | 'multiple'>('single');
  const [mediaSelectedUrls, setMediaSelectedUrls] = useState<string[]>([]);
  const [mediaLoadedOnce, setMediaLoadedOnce] = useState(false);
  const [applyMediaSelection, setApplyMediaSelection] = useState<(value: string) => void>(() => () => {});
  const { showSuccess, showError } = useToast();

  const loadCategories = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/categories');
      setCategories(data);
      setError(null);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to load categories';
      const parsed = Array.isArray(message) ? message.join(', ') : message;
      setError(parsed);
      showError(parsed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedId) {
      const existing = findNodeById(categories, selectedId);
      if (!existing) setSelectedId(null);
    }
  }, [categories, selectedId]);

  const filteredCategories = useMemo(() => filterTree(categories, searchTerm), [categories, searchTerm]);
  const flatOptions = useMemo(() => flattenCategories(categories), [categories]);
  const selectedCategory = selectedId ? findNodeById(categories, selectedId) || null : null;
  const editingCategory = editingId ? findNodeById(categories, editingId) || null : null;

  const excludedParentIds = useMemo(() => {
    if (!editingCategory) return new Set<string>();
    const ids = new Set<string>([editingCategory.id]);
    collectDescendants(editingCategory, ids);
    return ids;
  }, [editingCategory]);

  const handleDrop = async (targetId: string | null) => {
    if (!draggingId || draggingId === targetId) return;
    const draggingNode = findNodeById(categories, draggingId);
    if (!draggingNode) return;
    const descendants = new Set<string>();
    collectDescendants(draggingNode, descendants);
    if (targetId && descendants.has(targetId)) {
      showError('Cannot move a category inside its own child');
      setDraggingId(null);
      setDragOverId(null);
      return;
    }

    const nextTree = moveNode(categories, draggingId, targetId);
    setCategories(nextTree);
    setDraggingId(null);
    setDragOverId(null);

    try {
      const payload = flattenForOrder(nextTree);
      const { data } = await api.patch('/categories/reorder', { items: payload });
      setCategories(data);
      showSuccess('Hierarchy updated');
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to update hierarchy';
      const parsed = Array.isArray(message) ? message.join(', ') : message;
      showError(parsed);
      await loadCategories();
    }
  };

  const handleDelete = async (category: CategoryNode) => {
    const confirmed = window.confirm(`Delete category "${category.title}"?`);
    if (!confirmed) return;
    try {
      setDeletingId(category.id);
      await api.delete(`/categories/${category.id}`);
      showSuccess('Category deleted');
      await loadCategories();
      if (selectedId === category.id) setSelectedId(null);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to delete category';
      const parsed = Array.isArray(message) ? message.join(', ') : message;
      showError(parsed);
      setError(parsed);
    } finally {
      setDeletingId(null);
    }
  };

  const initialValues = editingCategory
    ? {
        title: editingCategory.title,
        banner: editingCategory.banner || '',
        shortDesc: editingCategory.shortDesc || '',
        parentId: editingCategory.parentId || ''
      }
    : { title: '', banner: '', shortDesc: '', parentId: '' };

  const parseBannerValue = (val?: string | null) =>
    (val || '')
      .split(',')
      .map(v => v.trim())
      .filter(Boolean);

  const loadMedia = async () => {
    try {
      setMediaLoading(true);
      const { data } = await api.get('/media');
      setMediaItems(data);
      setMediaError(null);
      setMediaLoadedOnce(true);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to load media';
      const parsed = Array.isArray(message) ? message.join(', ') : message;
      setMediaError(parsed);
      showError(parsed);
    } finally {
      setMediaLoading(false);
    }
  };

  return (
    <div className="card rounded-xs permissions-page categories-page">
      <div className="flex flex-wrap gap-2 items-center justify-between bg-blue-600 text-white px-3 py-1.5">
        <h2 className="flex items-center gap-2">
          <CategoryIcon /> Categories
        </h2>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <input
            type="text"
            placeholder="Search categories..."
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

      <div className="categories-body">
        <div className="categories-tree">
          {draggingId && (
            <div
              className={`root-drop-zone ${dragOverId === 'root' ? 'active' : ''}`}
              onDragOver={e => {
                e.preventDefault();
                setDragOverId('root');
              }}
              onDrop={e => {
                e.preventDefault();
                handleDrop(null);
              }}
              onDragLeave={() => setDragOverId(null)}
            >
              Drop here to move to the top level
            </div>
          )}

          {loading ? (
            <div className="category-empty">Loading categories...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="category-empty">No categories found.</div>
          ) : (
            filteredCategories.map(node => (
              <CategoryItem
                key={node.id}
                node={node}
                depth={0}
                onView={category => setSelectedId(category.id)}
                onEdit={category => {
                  setEditingId(category.id);
                  setShowModal(true);
                }}
                onDelete={handleDelete}
                onDrop={target => handleDrop(target)}
                onDragStart={id => setDraggingId(id)}
                onDragEnd={() => {
                  setDraggingId(null);
                  setDragOverId(null);
                }}
                onDragEnter={setDragOverId}
                draggingId={draggingId}
                dragOverId={dragOverId}
                selectedId={selectedId}
                deletingId={deletingId}
              />
            ))
          )}
        </div>

        <div className="categories-detail">
          <div className="detail-header">
            <h3>Category detail</h3>
            {selectedCategory && (
              <button type="button" className="text-sm edit-link" onClick={() => {
                setEditingId(selectedCategory.id);
                setShowModal(true);
              }}>
                <EditIcon fontSize="small" /> Edit
              </button>
            )}
          </div>
          {selectedCategory ? (
            <div className="detail-body">
              <div className="detail-row">
                <div className="detail-label">Title</div>
                <div className="detail-value">{selectedCategory.title}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Banner</div>
                <div className="detail-value">
                  {parseBannerValue(selectedCategory.banner).length ? (
                    <div className="detail-banners">
                      {parseBannerValue(selectedCategory.banner).map(url => (
                        <div key={url} className="detail-banner-thumb">
                          <img src={buildUrl(url)} alt={selectedCategory.title} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    'N/A'
                  )}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Short description</div>
                <div className="detail-value">{selectedCategory.shortDesc || 'N/A'}</div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Parent</div>
                <div className="detail-value">
                  {selectedCategory.parentId
                    ? findNodeById(categories, selectedCategory.parentId)?.title || 'N/A'
                    : 'Top level'}
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-label">Children</div>
                <div className="detail-value">
                  {selectedCategory.children?.length
                    ? selectedCategory.children.map(child => child.title).join(', ')
                    : 'N/A'}
                </div>
              </div>
            </div>
          ) : (
            <div className="category-empty muted">Select a category to view details</div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="permissions-modal-backdrop">
          <div className="modal permissions-modal">
            <div className="modalTitle">
              <h3 style={{ marginTop: 0 }}>{editingCategory ? 'Edit category' : 'Add category'}</h3>
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
                validationSchema={CategorySchema}
                onSubmit={async (values, helpers) => {
                  const payload = {
                    ...values,
                    parentId: values.parentId || null
                  };
                  try {
                    if (editingCategory) {
                      await api.patch(`/categories/${editingCategory.id}`, payload);
                      showSuccess('Category updated');
                    } else {
                      await api.post('/categories', payload);
                      showSuccess('Category created');
                    }
                    setShowModal(false);
                    setEditingId(null);
                    helpers.resetForm();
                    await loadCategories();
                  } catch (err: any) {
                    const message = err?.response?.data?.message || 'Failed to save category';
                    const parsed = Array.isArray(message) ? message.join(', ') : message;
                    showError(parsed);
                    setError(parsed);
                  }
                }}
              >
                {({ errors, values, setFieldValue, isSubmitting }) => (
                  <Form className="form-grid">
                    <label>
                      <div>Title</div>
                      <Field name="title" placeholder="Category title" />
                      {errors.title && <div style={{ color: 'crimson' }}>{errors.title}</div>}
                    </label>
                    <label>
                      <div className="banner-label">
                        <span>Banner</span>
                        <label className="media-mode">
                          <input
                            type="checkbox"
                            checked={mediaSelectionMode === 'multiple'}
                            onChange={e => {
                              const nextMode = e.target.checked ? 'multiple' : 'single';
                              setMediaSelectionMode(nextMode);
                              if (nextMode === 'single' && mediaSelectedUrls.length > 1) {
                                setMediaSelectedUrls(mediaSelectedUrls.slice(0, 1));
                              }
                            }}
                          />
                          <span>Multi-select</span>
                        </label>
                      </div>
                      <div className="media-picker-row">
                        <Field name="banner" placeholder="Image URL or comma-separated URLs" />
                        <button
                          type="button"
                          className="secondary"
                          onClick={async () => {
                            const parsed = parseBannerValue(values.banner);
                            setMediaSelectedUrls(parsed);
                            setMediaSelectionMode(parsed.length > 1 ? 'multiple' : 'single');
                            setApplyMediaSelection(() => (value: string) => setFieldValue('banner', value));
                            setShowMediaModal(true);
                            if (!mediaLoadedOnce) {
                              await loadMedia();
                            }
                          }}
                        >
                          <ImageIcon fontSize="small" /> Choose from media
                        </button>
                      </div>
                      {values.banner && (
                        <div className="media-picker-preview">
                          {parseBannerValue(values.banner).map(url => (
                            <div key={url} className="media-preview-thumb">
                              <img src={buildUrl(url)} alt="Selected banner" />
                            </div>
                          ))}
                        </div>
                      )}
                    </label>
                    <label>
                      <div>Short description</div>
                      <Field as="textarea" name="shortDesc" placeholder="Quick summary" rows={3} />
                    </label>
                    <label>
                      <div>Parent category</div>
                      <select
                        name="parentId"
                        value={values.parentId || ''}
                        onChange={e => setFieldValue('parentId', e.target.value)}
                      >
                        <option value="">Top level</option>
                        {flatOptions
                          .filter(option => !excludedParentIds.has(option.id))
                          .map(option => (
                            <option key={option.id} value={option.id}>
                              {`${'-- '.repeat(option.depth)}${option.title}`}
                            </option>
                          ))}
                      </select>
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

      {showMediaModal && (
        <div className="permissions-modal-backdrop">
          <div className="modal permissions-modal media-picker-modal">
            <div className="modalTitle">
              <h3 style={{ marginTop: 0 }}>Select media</h3>
              <a
                href="#closeMedia"
                className="closeModalButton"
                onClick={e => {
                  e.preventDefault();
                  setShowMediaModal(false);
                }}
              >
                ×
              </a>
            </div>
            <div className="modalBody">
              <div className="media-picker-header">
                <div>
                  <div className="eyebrow">Pick {mediaSelectionMode === 'single' ? 'one' : 'one or more'} image(s)</div>
                  {mediaError && <div style={{ color: 'crimson' }}>{mediaError}</div>}
                </div>
                <button
                  type="button"
                  className="secondary"
                  onClick={() => {
                    setMediaLoadedOnce(false);
                    loadMedia();
                  }}
                  disabled={mediaLoading}
                >
                  Refresh
                </button>
              </div>
              <div className="media-picker-grid">
                {mediaLoading ? (
                  <div className="media-empty">Loading media...</div>
                ) : mediaItems.length === 0 ? (
                  <div className="media-empty">No media uploaded yet.</div>
                ) : (
                  mediaItems.map(item => {
                    const isSelected = mediaSelectedUrls.includes(item.url);
                    return (
                      <button
                        type="button"
                        key={item.id}
                        className={`media-picker-card ${isSelected ? 'is-selected' : ''}`}
                        onClick={() => {
                          if (mediaSelectionMode === 'single') {
                            setMediaSelectedUrls([item.url]);
                            return;
                          }
                          setMediaSelectedUrls(current =>
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
                    setShowMediaModal(false);
                    setMediaSelectedUrls([]);
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (mediaSelectedUrls.length === 0) {
                      showError('Please select at least one image');
                      return;
                    }
                    const value = mediaSelectionMode === 'single' ? mediaSelectedUrls[0] : mediaSelectedUrls.join(',');
                    applyMediaSelection(value);
                    setShowMediaModal(false);
                  }}
                >
                  Use selection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
