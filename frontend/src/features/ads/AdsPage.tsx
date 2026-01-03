import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FrontendHeader from '../../components/layouts/frontend/Header';
import { useAppSelector } from '../../store/store';

const quickFilters = [
  'Restaurants',
  'Coworking',
  'Shops',
  'Nightlife',
  'Fitness',
  'Events',
  'Outdoors',
  'Family Friendly'
];

const filterCategories = ['Eat & Drink', 'Real Estate', 'Services', 'Jobs', 'Travel', 'Health', 'Events', 'Education'];

const featureOptions = ['Open Now', 'Has Parking', 'Pet Friendly', 'Live Music', 'Takes Credit Cards', 'Wheelchair Friendly'];

const ads = [
  {
    title: 'Evergreen Workspace',
    location: 'Chelsea, New York',
    category: 'Coworking',
    price: '$45/day pass',
    badge: 'Featured',
    status: 'Open now',
    distance: '0.4 mi',
    rating: 4.9,
    reviews: 136,
    tags: ['Fast Wi-Fi', '24/7', 'Meeting rooms'],
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'Market Row Bistro',
    location: 'SoHo, New York',
    category: 'Restaurant',
    price: '$$ - Modern European',
    badge: 'Hot',
    status: 'Closes 11:00 PM',
    distance: '1.1 mi',
    rating: 4.7,
    reviews: 258,
    tags: ['Brunch', 'Terrace', 'Craft cocktails'],
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'North End Loft',
    location: 'Williamsburg, Brooklyn',
    category: 'Apartments',
    price: '$3,200/mo',
    badge: 'New',
    status: 'Tour today',
    distance: '2.3 mi',
    rating: 4.8,
    reviews: 82,
    tags: ['2 beds', 'Washer / Dryer', 'Skyline view'],
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'Sunrise Pilates Studio',
    location: 'DUMBO, Brooklyn',
    category: 'Fitness',
    price: '$28/class',
    badge: 'Popular',
    status: 'Open now',
    distance: '3.0 mi',
    rating: 4.6,
    reviews: 191,
    tags: ['Beginner friendly', 'Locker room', 'Waterfront'],
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'Atlas Rooftop Bar',
    location: 'Midtown, New York',
    category: 'Nightlife',
    price: '$$ - Cocktails',
    badge: 'Tonight',
    status: 'Opens 5:00 PM',
    distance: '0.9 mi',
    rating: 4.5,
    reviews: 320,
    tags: ['Live DJ', 'City views', 'Reservations'],
    image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'Seaside Farmers Market',
    location: 'Red Hook, Brooklyn',
    category: 'Events',
    price: 'Free entry',
    badge: 'Weekend',
    status: 'Saturday 9 AM',
    distance: '4.1 mi',
    rating: 4.8,
    reviews: 67,
    tags: ['Local produce', 'Live music', 'Family'],
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1600&q=80'
  }
];

const statHighlights = [
  { label: 'Listings nearby', value: '1,240+' },
  { label: 'New this week', value: '128' },
  { label: 'Average rating', value: '4.7 / 5' },
  { label: 'Communities', value: '42' }
];

const statusStyles: Record<string, string> = {
  'Open now': 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  'Tour today': 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  'Closes 11:00 PM': 'bg-amber-50 text-amber-700 ring-amber-200',
  'Opens 5:00 PM': 'bg-slate-50 text-slate-700 ring-slate-200',
  'Saturday 9 AM': 'bg-cyan-50 text-cyan-700 ring-cyan-200'
};

type LayoutMode = 'two' | 'three' | 'list';

const layoutOptions: { id: LayoutMode; label: string }[] = [
  { id: 'two', label: '2 per row' },
  { id: 'three', label: '3 per row' },
  { id: 'list', label: 'List' }
];

const layoutIcons: Record<LayoutMode, JSX.Element> = {
  two: (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
      <rect x="3" y="3.5" width="6" height="5.5" rx="1.2" fill="currentColor" />
      <rect x="11" y="3.5" width="6" height="5.5" rx="1.2" fill="currentColor" />
      <rect x="3" y="11" width="6" height="5.5" rx="1.2" fill="currentColor" />
      <rect x="11" y="11" width="6" height="5.5" rx="1.2" fill="currentColor" />
    </svg>
  ),
  three: (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
      <rect x="2.5" y="3.5" width="4.2" height="4.8" rx="1.1" fill="currentColor" />
      <rect x="7.9" y="3.5" width="4.2" height="4.8" rx="1.1" fill="currentColor" />
      <rect x="13.3" y="3.5" width="4.2" height="4.8" rx="1.1" fill="currentColor" />
      <rect x="2.5" y="10.7" width="4.2" height="4.8" rx="1.1" fill="currentColor" />
      <rect x="7.9" y="10.7" width="4.2" height="4.8" rx="1.1" fill="currentColor" />
      <rect x="13.3" y="10.7" width="4.2" height="4.8" rx="1.1" fill="currentColor" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden>
      <rect x="3" y="4" width="2.8" height="2.8" rx="0.8" fill="currentColor" />
      <rect x="3" y="9" width="2.8" height="2.8" rx="0.8" fill="currentColor" />
      <rect x="3" y="14" width="2.8" height="2.8" rx="0.8" fill="currentColor" />
      <rect x="7.4" y="4" width="9.6" height="2.6" rx="1.1" fill="currentColor" />
      <rect x="7.4" y="9" width="9.6" height="2.6" rx="1.1" fill="currentColor" />
      <rect x="7.4" y="14" width="9.6" height="2.6" rx="1.1" fill="currentColor" />
    </svg>
  )
};

export default function AdsPage() {
  const { user } = useAppSelector(state => state.auth);
  const primaryCta = user ? { href: '/dashboard', label: 'Go to dashboard' } : { href: '/register', label: 'Post your ad' };
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('three');
  const [collapsedAd, setCollapsedAd] = useState<string>('');
 
  const isListLayout = layoutMode === 'list';

  const gridColumnsClass =
    layoutMode === 'three' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : layoutMode === 'two' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1';

  useEffect(() => {
    if (layoutMode !== 'three') {
      setCollapsedAd('');
    }else {
      setCollapsedAd('three');
    }
  }, [layoutMode]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <FrontendHeader primaryCta={primaryCta} />

      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-900 to-blue-800 text-white">
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 20%, #22d3ee 0, transparent 35%), radial-gradient(circle at 80% 10%, #a855f7 0, transparent 30%), radial-gradient(circle at 60% 80%, #0ea5e9 0, transparent 35%)' }} />
        <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(255,255,255,0.08),transparent)]" />

        <div className="relative mx-auto max-w-6xl px-6 py-14 lg:py-16">
          <div className="flex items-center gap-3 text-sm text-white/80">
            <Link to="/" className="font-semibold text-white hover:text-amber-200">
              Home
            </Link>
            <span className="opacity-60">/</span>
            <span className="font-semibold text-amber-200">Ads</span>
          </div>

          

          <form className="mt-8 grid grid-cols-1 gap-3 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl shadow-slate-900/20 backdrop-blur lg:grid-cols-[1.4fr,1fr,1fr,0.8fr]">
            <label className="flex flex-col gap-1 text-sm font-semibold text-white/80">
              What are you looking for?
              <input
                type="text"
                placeholder='Try "coffee", "coworking", "loft"'
                className="w-full rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-slate-900 placeholder:text-slate-500 outline-none transition focus:border-amber-200 focus:ring-4 focus:ring-amber-100"
              />
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold text-white/80">
              Location
              <select className="w-full rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-200 focus:ring-4 focus:ring-amber-100">
                <option>All NYC</option>
                <option>Manhattan</option>
                <option>Brooklyn</option>
                <option>Queens</option>
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-semibold text-white/80">
              Category
              <select className="w-full rounded-xl border border-white/20 bg-white/90 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-200 focus:ring-4 focus:ring-amber-100">
                <option>Any category</option>
                <option>Eat & Drink</option>
                <option>Real Estate</option>
                <option>Services</option>
              </select>
            </label>
            <button
              type="submit"
              className="mt-5 w-full self-center rounded-xl bg-amber-400 px-6 py-3 text-sm font-bold uppercase tracking-wide text-slate-900 shadow-lg shadow-amber-500/30 transition hover:-translate-y-[1px] hover:bg-amber-300 lg:mt-6"
            >
              Search
            </button>
          </form>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm font-semibold text-white/80">
            {quickFilters.map(filter => (
              <button
                key={filter}
                type="button"
                className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-white shadow-sm shadow-slate-900/20 transition hover:border-amber-200 hover:bg-white/20"
              >
                {filter}
              </button>
            ))}
            <span className="rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-amber-200">
              Show map
            </span>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-white/80 sm:grid-cols-4">
            {statHighlights.map(stat => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/15 bg-white/10 px-4 py-3 shadow-sm shadow-slate-900/20 backdrop-blur"
              >
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-100/80">{stat.label}</div>
                <div className="mt-2 text-lg font-bold text-white">{stat.value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-3 pb-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 lg:grid-cols-[0.9fr,1.8fr]">
            <aside className="space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-slate-900/5">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Filter ads</h2>
                <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">Reset</button>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Search</label>
                <input
                  type="text"
                  placeholder="Title, address, tag..."
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Category</label>
                <div className="grid grid-cols-2 gap-2">
                  {filterCategories.map(category => (
                    <label
                      key={category}
                      className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                    >
                      <input type="checkbox" className="accent-indigo-600" />
                      {category}
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Price</label>
                <div className="flex items-center gap-3">
                  <input type="range" min="0" max="500" defaultValue="120" className="w-full accent-indigo-600" />
                  <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow-sm shadow-slate-900/20">
                    up to $120
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Rating</label>
                <div className="flex flex-wrap gap-2">
                  {[5, 4, 3].map(star => (
                    <label
                      key={star}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700"
                    >
                      <input type="checkbox" className="accent-indigo-600" />
                      {star}.0+
                      <span className="text-amber-500" aria-hidden>
                        *
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Features</label>
                <div className="grid grid-cols-1 gap-2">
                  {featureOptions.map(option => (
                    <label
                      key={option}
                      className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm"
                    >
                      <span>{option}</span>
                      <input type="checkbox" className="accent-indigo-600" />
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 px-4 py-5 text-white shadow-lg shadow-indigo-500/30">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-white/70">Featured</p>
                <h3 className="mt-2 text-lg font-bold leading-tight">List your place on Knowhere</h3>
                <p className="mt-1 text-sm text-white/80">
                  Reach thousands of locals looking for their next favorite spot.
                </p>
                <Link
                  to={primaryCta.href}
                  className="mt-3 inline-flex items-center justify-center rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wide text-slate-900 shadow-sm transition hover:-translate-y-[1px] hover:bg-amber-100"
                >
                  {primaryCta.label}
                </Link>
              </div>
            </aside>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-100/70 px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm font-semibold text-slate-800">
                  <span className="font-bold text-slate-900">{ads.length}</span> results found
                </div>
                <div className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
                  <label className="flex items-center gap-2">
                    <span className="text-slate-600">Sort by:</span>
                    <div className="relative">
                      <select className=" select h-9 rounded-md border border-slate-300 bg-white px-3 pr-8 text-sm font-medium text-slate-800 shadow-inner outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100">
                        <option>Rating</option>
                        <option>Top rated</option>
                        <option>Closest</option>
                        <option>Newest</option>
                      </select>
                      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-500">▾</span>
                    </div>
                  </label>
                  <div className="flex items-center gap-1">
                    {layoutOptions.map(option => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setLayoutMode(option.id)}
                        className={`flex h-9 w-9 p-0 items-center justify-center rounded-md border text-slate-500 transition hover:border-slate-300 hover:text-slate-700 ${
                          layoutMode === option.id
                            ? 'border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-200'
                            : 'border-slate-200 bg-white'
                        }`}
                        aria-label={`Switch to ${option.label} layout`}
                      >
                        {layoutIcons[option.id]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className={`grid gap-4 ${gridColumnsClass}`}>
                {ads.map(ad => {
                  const isCollapsed = layoutMode === 'three'
                  return (
                  <article
                    key={ad.title}
                    className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-md hover:shadow-slate-900/10 ${
                      isListLayout ? 'sm:flex sm:h-56' : ''
                    }`}
                  >
                    <div
                      className={`relative ${isListLayout ? 'h-56 w-full sm:w-64 sm:flex-shrink-0' : 'h-48'} ${
                        layoutMode === 'three' ? 'cursor-pointer' : ''
                      }`}
                      role={layoutMode === 'three' ? 'button' : undefined}
                      tabIndex={layoutMode === 'three' ? 0 : undefined}
                      onClick={() => {
                        if (layoutMode === 'three') {
                          setCollapsedAd(current => (current === ad.title ? '' : ad.title));
                        }
                      }}
                      onKeyDown={event => {
                        if (layoutMode !== 'three') return;
                        if (event.key === 'Enter' || event.key === ' ') {
                          event.preventDefault();
                          setCollapsedAd(current => (current === ad.title ? '' : ad.title));
                        }
                      }}
                    >
                      <img
                        src={ad.image}
                        alt={ad.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/15 to-transparent" aria-hidden />
                      <div className="absolute left-4 top-4 flex items-center gap-2">
                        <span className="rounded-full bg-amber-400 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-900 shadow-sm shadow-amber-400/40">
                          {ad.badge}
                        </span>
                        <span className="rounded-full bg-white/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-900 shadow-sm backdrop-blur">
                          {ad.category}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/85 text-slate-700 shadow-sm backdrop-blur transition hover:text-indigo-600"
                        aria-label="Save ad"
                      >
                        Save
                      </button>
                      <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-1.5 text-sm font-bold text-slate-900 shadow">
                        {ad.price}
                      </div>
                    </div>

                    <div className={`space-y-3 p-5 ${isListLayout ? 'sm:flex-1' : ''}`}>
                      <div className="flex flex-col gap-3 sm:items-start sm:justify-between">
                        <div className="space-y-1">
                          {!isCollapsed && (
                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{ad.category}</p>
                          )}
                          <h3 className="text-xl font-bold text-slate-900">{ad.title}</h3>
                          {!isCollapsed && (
                            <p className="text-sm text-slate-600">
                              {ad.location} - {ad.distance}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-start sm:items-end">
                          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 ring-2 ring-emerald-100">
                            * {ad.rating}
                            <span className="text-xs font-semibold text-emerald-700/80">({ad.reviews} reviews)</span>
                          </div>
                          {!isCollapsed && (
                            <span
                              className={`mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ring-2 ${statusStyles[ad.status] || 'bg-slate-50 text-slate-700 ring-slate-200'}`}
                            >
                              {ad.status}
                            </span>
                          )}
                        </div>
                      </div>

                      {!isCollapsed && (
                        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700">
                          {ad.tags.map(tag => (
                            <span key={tag} className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {!isCollapsed && (
                          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                            <span className="inline-flex items-center gap-2">Guided tour available</span>
                            <span className="inline-flex items-center gap-2">Same-day booking</span>
                          </div>
                        )}
                        <div className="flex gap-2">
                          <button className="rounded-full border border-slate-900 bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:border-slate-800 hover:bg-slate-800">
                            Details
                          </button>
                          <button className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/30 transition hover:-translate-y-[1px] hover:bg-indigo-500">
                            Directions
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
