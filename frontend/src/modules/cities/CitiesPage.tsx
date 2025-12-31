import { useEffect, useMemo, useState } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import MapIcon from '@mui/icons-material/Map';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import api from '../../services/api';
import { useToast } from '../../components/ToastProvider';
import '../permissions/permission.css';
import './cities.css';

interface LocationItem {
  id: string;
  cityId: string;
  name: string;
  code: string;
}

interface CityItem {
  id: string;
  name: string;
  code: string;
  locations: LocationItem[];
}

const CitySchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  code: Yup.string().required('Required')
});

const LocationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  code: Yup.string().required('Required'),
  cityId: Yup.string().required('Required')
});

const CityRow = ({
  city,
  selected,
  onSelect,
  onEdit,
  onDelete,
  deletingId
}: {
  city: CityItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onEdit: (city: CityItem) => void;
  onDelete: (city: CityItem) => void;
  deletingId?: string | null;
}) => (
  <div className={`city-row ${selected ? 'is-selected' : ''}`} onClick={() => onSelect(city.id)}>
    <div className="city-left">
      <div className="city-icon">
        <LocationCityIcon fontSize="small" />
      </div>
      <div>
        <div className="city-name">
          {city.name}
          <span className="city-code">{city.code}</span>
        </div>
        <div className="city-meta">
          <MapIcon fontSize="small" /> {city.locations?.length || 0} locations
        </div>
      </div>
    </div>
    <div className="city-actions">
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          onSelect(city.id);
        }}
        title="View"
      >
        <VisibilityIcon fontSize="small" />
      </button>
      <button
        type="button"
        onClick={e => {
          e.stopPropagation();
          onEdit(city);
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
          onDelete(city);
        }}
        title="Delete"
        disabled={deletingId === city.id}
      >
        <DeleteIcon fontSize="small" />
      </button>
    </div>
  </div>
);

const LocationsList = ({
  locations,
  onEdit,
  onDelete,
  deletingId
}: {
  locations: LocationItem[];
  onEdit: (location: LocationItem) => void;
  onDelete: (location: LocationItem) => void;
  deletingId?: string | null;
}) => (
  <div className="locations-list">
    {locations.length === 0 ? (
      <div className="city-empty muted">No locations yet.</div>
    ) : (
      locations.map(location => (
        <div key={location.id} className="location-row">
          <div>
            <div className="location-name">
              {location.name}
              <span className="location-code">{location.code}</span>
            </div>
            <div className="location-meta">City ID: {location.cityId}</div>
          </div>
          <div className="location-actions">
            <button type="button" onClick={() => onEdit(location)} title="Edit location">
              <EditIcon fontSize="small" />
            </button>
            <button
              type="button"
              className="danger"
              onClick={() => onDelete(location)}
              title="Delete location"
              disabled={deletingId === location.id}
            >
              <DeleteIcon fontSize="small" />
            </button>
          </div>
        </div>
      ))
    )}
  </div>
);

export default function CitiesPage() {
  const [cities, setCities] = useState<CityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedCityId, setSelectedCityId] = useState<string | null>(null);
  const [editingCityId, setEditingCityId] = useState<string | null>(null);
  const [showCityModal, setShowCityModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  const loadCities = async (preferredSelection?: string) => {
    try {
      setLoading(true);
      const { data } = await api.get<CityItem[]>('/cities');
      setCities(data);
      setError(null);
      setSelectedCityId(current => {
        const candidate = preferredSelection ?? current;
        if (candidate && data.some((city: CityItem) => city.id === candidate)) return candidate;
        return data[0]?.id ?? null;
      });
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to load cities';
      const parsed = Array.isArray(message) ? message.join(', ') : message;
      setError(parsed);
      showError(parsed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCities();
  }, []);

  const findLocation = (id: string | null): LocationItem | null => {
    if (!id) return null;
    for (const city of cities) {
      const location = city.locations?.find(loc => loc.id === id);
      if (location) return location;
    }
    return null;
  };

  const selectedCity = selectedCityId ? cities.find(city => city.id === selectedCityId) || null : null;
  const editingCity = editingCityId ? cities.find(city => city.id === editingCityId) || null : null;
  const editingLocation = findLocation(editingLocationId);

  const filteredCities = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return cities;
    return cities.filter(city => city.name.toLowerCase().includes(query) || city.code.toLowerCase().includes(query));
  }, [cities, searchTerm]);

  const filteredLocations = useMemo(() => {
    const list = selectedCity?.locations || [];
    const query = locationSearch.trim().toLowerCase();
    if (!query) return list;
    return list.filter(
      loc => loc.name.toLowerCase().includes(query) || loc.code.toLowerCase().includes(query) || loc.cityId.toLowerCase().includes(query)
    );
  }, [selectedCity, locationSearch]);

  const cityInitialValues = editingCity
    ? { name: editingCity.name, code: editingCity.code }
    : { name: '', code: '' };

  const locationInitialValues = editingLocation
    ? { name: editingLocation.name, code: editingLocation.code, cityId: editingLocation.cityId }
    : { name: '', code: '', cityId: selectedCityId || '' };

  const handleDeleteCity = async (city: CityItem) => {
    const confirmed = window.confirm(`Delete city "${city.name}"?`);
    if (!confirmed) return;
    try {
      setDeletingId(city.id);
      await api.delete(`/cities/${city.id}`);
      showSuccess('City deleted');
      await loadCities();
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to delete city';
      const parsed = Array.isArray(message) ? message.join(', ') : message;
      showError(parsed);
      setError(parsed);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteLocation = async (location: LocationItem) => {
    const confirmed = window.confirm(`Delete location "${location.name}"?`);
    if (!confirmed) return;
    try {
      setDeletingId(location.id);
      await api.delete(`/cities/${location.cityId}/locations/${location.id}`);
      showSuccess('Location deleted');
      await loadCities(selectedCityId || location.cityId);
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Failed to delete location';
      const parsed = Array.isArray(message) ? message.join(', ') : message;
      showError(parsed);
      setError(parsed);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="card rounded-xs permissions-page cities-page">
      <div className="flex flex-wrap gap-2 items-center justify-between bg-blue-600 text-white px-3 py-1.5">
        <h2 className="flex items-center gap-2">
          <LocationCityIcon /> Cities & Locations
        </h2>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <input
            type="text"
            placeholder="Search cities..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-2 py-1 rounded border border-blue-200 text-black min-w-[220px] flex-1 max-w-xs"
          />
          <button
            type="button"
            onClick={() => {
              setEditingCityId(null);
              setShowCityModal(true);
            }}
            className="p-1 px-2 text-sm bg-white text-blue-700 hover:bg-blue-50"
          >
            <AddIcon fontSize="small" className="p-0" /> Add city
          </button>
          <button
            type="button"
            onClick={() => {
              if (!selectedCityId) {
                showError('Select a city first');
                return;
              }
              setEditingLocationId(null);
              setShowLocationModal(true);
            }}
            className="p-1 px-2 text-sm bg-white text-blue-700 hover:bg-blue-50"
            disabled={!selectedCityId}
          >
            <AddIcon fontSize="small" className="p-0" /> Add location
          </button>
        </div>
        {error && <div style={{ color: 'crimson' }}>{error}</div>}
      </div>

      <div className="cities-body">
        <div className="cities-list">
          {loading ? (
            <div className="city-empty">Loading cities...</div>
          ) : filteredCities.length === 0 ? (
            <div className="city-empty">No cities found.</div>
          ) : (
            filteredCities.map(city => (
              <CityRow
                key={city.id}
                city={city}
                selected={selectedCityId === city.id}
                onSelect={setSelectedCityId}
                onEdit={item => {
                  setEditingCityId(item.id);
                  setShowCityModal(true);
                }}
                onDelete={handleDeleteCity}
                deletingId={deletingId}
              />
            ))
          )}
        </div>

        <div className="cities-detail">
          <div className="detail-header">
            <h3>City detail</h3>
            {selectedCity && (
              <div className="detail-actions">
                <button
                  type="button"
                  className="edit-link"
                  onClick={() => {
                    setEditingCityId(selectedCity.id);
                    setShowCityModal(true);
                  }}
                >
                  <EditIcon fontSize="small" /> Edit city
                </button>
                <button
                  type="button"
                  className="danger-link"
                  onClick={() => handleDeleteCity(selectedCity)}
                  disabled={deletingId === selectedCity.id}
                >
                  <DeleteIcon fontSize="small" /> Delete
                </button>
              </div>
            )}
          </div>
          {selectedCity ? (
            <>
              <div className="detail-body">
                <div className="detail-row">
                  <div className="detail-label">Name</div>
                  <div className="detail-value">{selectedCity.name}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Code</div>
                  <div className="detail-value code-pill">{selectedCity.code}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Locations</div>
                  <div className="detail-value">{selectedCity.locations?.length || 0}</div>
                </div>
              </div>

              <div className="locations-header">
                <div className="locations-title">
                  <MapIcon /> Locations
                </div>
                <div className="location-actions-row">
                  <input
                    type="text"
                    placeholder="Search locations..."
                    value={locationSearch}
                    onChange={e => setLocationSearch(e.target.value)}
                  />
                  <button
                    type="button"
                    className="secondary"
                    onClick={() => {
                      setEditingLocationId(null);
                      setShowLocationModal(true);
                    }}
                  >
                    <AddIcon fontSize="small" /> Add location
                  </button>
                </div>
              </div>
              <LocationsList
                locations={filteredLocations}
                onEdit={location => {
                  setEditingLocationId(location.id);
                  setShowLocationModal(true);
                }}
                onDelete={handleDeleteLocation}
                deletingId={deletingId}
              />
            </>
          ) : (
            <div className="city-empty muted">Select a city to view detail</div>
          )}
        </div>
      </div>

      {showCityModal && (
        <div className="permissions-modal-backdrop">
          <div className="modal permissions-modal">
            <div className="modalTitle">
              <h3 style={{ marginTop: 0 }}>{editingCity ? 'Edit city' : 'Add city'}</h3>
              <a
                href="#closeModal"
                className="closeModalButton"
                onClick={e => {
                  e.preventDefault();
                  setShowCityModal(false);
                  setEditingCityId(null);
                }}
              >
                ×
              </a>
            </div>
            <div className="modalBody">
              <Formik
                initialValues={cityInitialValues}
                enableReinitialize
                validationSchema={CitySchema}
                onSubmit={async (values, helpers) => {
                  try {
                    const { data } = editingCity
                      ? await api.patch<CityItem>(`/cities/${editingCity.id}`, values)
                      : await api.post<CityItem>('/cities', values);
                    showSuccess(`City ${editingCity ? 'updated' : 'created'}`);
                    setShowCityModal(false);
                    setEditingCityId(null);
                    helpers.resetForm();
                    await loadCities(data?.id);
                  } catch (err: any) {
                    const message = err?.response?.data?.message || 'Failed to save city';
                    const parsed = Array.isArray(message) ? message.join(', ') : message;
                    showError(parsed);
                    setError(parsed);
                  }
                }}
              >
                {({ errors, isSubmitting }) => (
                  <Form className="form-grid">
                    <label>
                      <div>Name</div>
                      <Field name="name" placeholder="City name" />
                      {errors.name && <div style={{ color: 'crimson' }}>{errors.name}</div>}
                    </label>
                    <label>
                      <div>Code</div>
                      <Field name="code" placeholder="City code" />
                      {errors.code && <div style={{ color: 'crimson' }}>{errors.code}</div>}
                    </label>
                    <div className="permissions-form-actions modalFooter">
                      <button
                        type="button"
                        onClick={() => {
                          setShowCityModal(false);
                          setEditingCityId(null);
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

      {showLocationModal && (
        <div className="permissions-modal-backdrop">
          <div className="modal permissions-modal">
            <div className="modalTitle">
              <h3 style={{ marginTop: 0 }}>{editingLocation ? 'Edit location' : 'Add location'}</h3>
              <a
                href="#closeModal"
                className="closeModalButton"
                onClick={e => {
                  e.preventDefault();
                  setShowLocationModal(false);
                  setEditingLocationId(null);
                }}
              >
                ×
              </a>
            </div>
            <div className="modalBody">
              <Formik
                initialValues={locationInitialValues}
                enableReinitialize
                validationSchema={LocationSchema}
                onSubmit={async (values, helpers) => {
                  try {
                    const activeLocation = findLocation(editingLocationId);
                    const currentCityId = activeLocation?.cityId || selectedCityId || values.cityId;
                    const targetCityId = values.cityId || currentCityId;
                    const pathCityId = editingLocation ? currentCityId : targetCityId;

                    if (!targetCityId || !pathCityId) {
                      showError('Select a city for this location');
                      return;
                    }

                    if (editingLocation) {
                      await api.patch(`/cities/${pathCityId}/locations/${editingLocation.id}`, {
                        name: values.name,
                        code: values.code,
                        cityId: targetCityId
                      });
                    } else {
                      await api.post(`/cities/${targetCityId}/locations`, values);
                    }

                    showSuccess(`Location ${editingLocation ? 'updated' : 'created'}`);
                    setShowLocationModal(false);
                    setEditingLocationId(null);
                    helpers.resetForm();
                    await loadCities(targetCityId);
                  } catch (err: any) {
                    const message = err?.response?.data?.message || 'Failed to save location';
                    const parsed = Array.isArray(message) ? message.join(', ') : message;
                    showError(parsed);
                    setError(parsed);
                  }
                }}
              >
                {({ errors, values, setFieldValue, isSubmitting }) => (
                  <Form className="form-grid">
                    <label>
                      <div>Location name</div>
                      <Field name="name" placeholder="Location name" />
                      {errors.name && <div style={{ color: 'crimson' }}>{errors.name}</div>}
                    </label>
                    <label>
                      <div>Location code</div>
                      <Field name="code" placeholder="Location code" />
                      {errors.code && <div style={{ color: 'crimson' }}>{errors.code}</div>}
                    </label>
                    <label>
                      <div>City</div>
                      <select name="cityId" value={values.cityId} onChange={e => setFieldValue('cityId', e.target.value)}>
                        <option value="">Select city</option>
                        {cities.map(city => (
                          <option key={city.id} value={city.id}>
                            {city.name} ({city.code})
                          </option>
                        ))}
                      </select>
                      {errors.cityId && <div style={{ color: 'crimson' }}>{errors.cityId}</div>}
                    </label>
                    <div className="permissions-form-actions modalFooter">
                      <button
                        type="button"
                        onClick={() => {
                          setShowLocationModal(false);
                          setEditingLocationId(null);
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
