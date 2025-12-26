import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/store';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Properties', href: '#properties' },
  { label: 'Services', href: '#services' },
  { label: 'News', href: '#news' },
  { label: 'Contacts', href: '#contacts' }
];

const categories = [
  {
    title: 'Fashion & Beauty',
    icon: '👜',
    iconClass: 'bg-purple-50 text-purple-600 ring-purple-200',
    accent: 'text-purple-700',
    items: [
      { label: 'Accessories & Jewelry', count: 3456 },
      { label: 'Health & Beauty Products', count: 143 },
      { label: "Men's Clothes", count: 52 },
      { label: "Women's Clothes", count: 1306 }
    ]
  },
  {
    title: 'Real Estate',
    icon: '🏢',
    iconClass: 'bg-rose-50 text-rose-600 ring-rose-200',
    accent: 'text-rose-700',
    items: [
      { label: 'Apartments for Rent', count: 7903 },
      { label: 'Roommates/Rooms for Rent', count: 2033 },
      { label: 'Short Term Rentals', count: 9071 },
      { label: 'Housing for Rent', count: 1455 }
    ]
  },
  {
    title: 'Jobs',
    icon: '💼',
    iconClass: 'bg-blue-50 text-blue-600 ring-blue-200',
    accent: 'text-blue-700',
    items: [
      { label: 'Administrative/Support', count: 660 },
      { label: 'Art/Culture', count: 10 },
      { label: 'Bankers/Brokers', count: 36 },
      { label: 'Construction/Labor', count: 421 }
    ]
  },
  {
    title: 'Pets',
    icon: '🐾',
    iconClass: 'bg-emerald-50 text-emerald-600 ring-emerald-200',
    accent: 'text-emerald-700',
    items: [
      { label: 'Cats/Kittens', count: 90 },
      { label: 'Dogs/Puppies', count: 4 },
      { label: 'Birds', count: 82 },
      { label: 'Fish', count: 151 }
    ]
  },
  {
    title: 'Baby & Kids',
    icon: '🍼',
    iconClass: 'bg-amber-50 text-amber-600 ring-amber-200',
    accent: 'text-amber-700',
    items: [
      { label: 'Baby & Kids Clothes', count: 483 },
      { label: 'Baby Stuff', count: 1946 },
      { label: 'Buggies & Strollers', count: 78 },
      { label: 'Carriers & Child Seats', count: 105 }
    ]
  },
  {
    title: 'Multimedia & Electronics',
    icon: '🎧',
    iconClass: 'bg-cyan-50 text-cyan-600 ring-cyan-200',
    accent: 'text-cyan-700',
    items: [
      { label: 'Audio', count: 1450 },
      { label: 'Cameras', count: 902 },
      { label: 'Computers', count: 55 },
      { label: 'Computers/Software', count: 178 }
    ]
  },
  {
    title: 'Services',
    icon: '🛠️',
    iconClass: 'bg-pink-50 text-pink-600 ring-pink-200',
    accent: 'text-pink-700',
    items: [
      { label: 'Automotive Services', count: 100 },
      { label: 'Career/HR Services', count: 48 },
      { label: 'Computer/Tech Help', count: 320 },
      { label: 'Construction/Labor', count: 154 }
    ]
  },
  {
    title: 'Home & Garden',
    icon: '🏡',
    iconClass: 'bg-orange-50 text-orange-600 ring-orange-200',
    accent: 'text-orange-700',
    items: [
      { label: 'Bathroom', count: 15 },
      { label: 'Bedroom', count: 112 },
      { label: 'DIY', count: 8 },
      { label: 'Garden', count: 45 }
    ]
  },
  {
    title: 'Personals',
    icon: '🫂',
    iconClass: 'bg-red-50 text-red-600 ring-red-200',
    accent: 'text-red-700',
    items: [
      { label: 'Friendship', count: 321 },
      { label: 'Women Seeking Men', count: 210 },
      { label: 'Men Seeking Women', count: 151 },
      { label: 'Men Seeking Men', count: 1044 }
    ]
  },
  {
    title: 'Music, Movies & Books',
    icon: '📚',
    iconClass: 'bg-lime-50 text-lime-600 ring-lime-200',
    accent: 'text-lime-700',
    items: [
      { label: 'Books', count: 2102 },
      { label: 'CDs & Records', count: 1590 },
      { label: 'Movies, Blu-rays & DVDs', count: 76 },
      { label: 'Office Supplies & Stationery', count: 11 }
    ]
  },
  {
    title: 'Events',
    icon: '🎟️',
    iconClass: 'bg-teal-50 text-teal-600 ring-teal-200',
    accent: 'text-teal-700',
    items: [
      { label: 'Classic & Cultural', count: 5 },
      { label: 'Concerts', count: 14 },
      { label: 'Sports', count: 93 },
      { label: 'Other Events', count: 1 }
    ]
  },
  {
    title: 'Community',
    icon: '🎉',
    iconClass: 'bg-rose-50 text-rose-600 ring-rose-200',
    accent: 'text-rose-700',
    items: [
      { label: 'Activity Partners', count: 59 },
      { label: 'Artists', count: 23 },
      { label: 'Babysitter', count: 160 },
      { label: 'Household Help', count: 6 }
    ]
  },
  {
    title: 'Hobby & Leisure',
    icon: '🎯',
    iconClass: 'bg-sky-50 text-sky-600 ring-sky-200',
    accent: 'text-sky-700',
    items: [
      { label: 'Arts & Antiques', count: 51 },
      { label: 'Arts & Crafts', count: 111 },
      { label: 'Collectibles', count: 1087 },
      { label: 'Food & Beverages', count: 23 }
    ]
  },
  {
    title: 'Vehicles',
    icon: '🚗',
    iconClass: 'bg-amber-50 text-amber-600 ring-amber-200',
    accent: 'text-amber-700',
    items: [
      { label: 'Cars', count: 15 },
      { label: 'Bikes', count: 1199 },
      { label: 'Boats', count: 46 },
      { label: 'Commercial Trucks', count: 22 }
    ]
  },
  {
    title: 'Classes',
    icon: '🎓',
    iconClass: 'bg-fuchsia-50 text-fuchsia-600 ring-fuchsia-200',
    accent: 'text-fuchsia-700',
    items: [
      { label: 'Art/Music/Dance Classes', count: 22 },
      { label: 'Computer Classes', count: 402 },
      { label: 'Continuing Education', count: 1000 },
      { label: 'Language Classes', count: 66 }
    ]
  }
];

const featuredListings = [
  {
    title: 'Modern Loft with Skyline Views',
    location: 'Chelsea, New York',
    price: '$4,500/mo',
    beds: 2,
    baths: 2,
    area: 1280,
    badge: 'For Rent',
    category: 'Loft',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'Sunny Family Home on a Quiet Block',
    location: 'Outer Sunset, San Francisco',
    price: '$1,250,000',
    beds: 3,
    baths: 2,
    area: 1820,
    badge: 'For Sale',
    category: 'House',
    image: 'https://images.unsplash.com/photo-1600585154340-0ef3c08de9f5?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'Warehouse Loft Turned Creative Studio',
    location: 'Pilsen, Chicago',
    price: '$3,200/mo',
    beds: 1,
    baths: 1,
    area: 1010,
    badge: 'For Rent',
    category: 'Studio',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'Beachfront Bungalow with Private Deck',
    location: 'North Beach, Miami',
    price: '$2,900/mo',
    beds: 2,
    baths: 2,
    area: 1180,
    badge: 'For Rent',
    category: 'Bungalow',
    image: 'https://images.unsplash.com/photo-1507089958701-5a03f7e4ffe4?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'High-Rise Condo Overlooking the Bay',
    location: 'South Lake Union, Seattle',
    price: '$970,000',
    beds: 2,
    baths: 2,
    area: 1420,
    badge: 'For Sale',
    category: 'Condo',
    image: 'https://images.unsplash.com/photo-1512914890250-353c97c9e7c7?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'Countryside Cottage with Orchard',
    location: 'Leipers Fork, Nashville',
    price: '$685,000',
    beds: 3,
    baths: 2,
    area: 1640,
    badge: 'For Sale',
    category: 'Cottage',
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'Industrial Studio with Rooftop Access',
    location: 'East Austin, Austin',
    price: '$2,400/mo',
    beds: 1,
    baths: 1,
    area: 890,
    badge: 'For Rent',
    category: 'Studio',
    image: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'Rowhouse with Garden Courtyard',
    location: 'Brooklyn Heights, New York',
    price: '$1,450,000',
    beds: 4,
    baths: 3,
    area: 2105,
    badge: 'For Sale',
    category: 'Townhouse',
    image: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1600&q=80'
  }
];

const newListings = [
  {
    title: 'Skyline Apartment with Glass Walls',
    location: 'Long Island City, New York',
    price: '$980,000',
    badge: 'For Sale',
    tag: 'Apartment',
    beds: 2,
    baths: 2,
    area: 1240,
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'Townhouse with Private Garden',
    location: 'Capitol Hill, Seattle',
    price: '$1,150,000',
    badge: 'For Sale',
    tag: 'Townhouse',
    beds: 3,
    baths: 3,
    area: 1760,
    image: 'https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'Modern Studio near Waterfront',
    location: 'Mission Bay, San Francisco',
    price: '$3,150/mo',
    badge: 'For Rent',
    tag: 'Studio',
    beds: 1,
    baths: 1,
    area: 720,
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'Coastal Cottage with Porch',
    location: 'Rockport, Maine',
    price: '$615,000',
    badge: 'For Sale',
    tag: 'Cottage',
    beds: 2,
    baths: 2,
    area: 980,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'Warehouse Loft Turned Gallery',
    location: 'Arts District, Los Angeles',
    price: '$4,200/mo',
    badge: 'For Rent',
    tag: 'Loft',
    beds: 1,
    baths: 1,
    area: 1350,
    image: 'https://images.unsplash.com/photo-1507089958701-5a03f7e4ffe4?auto=format&fit=crop&w=1600&q=80'
  },
  {
    title: 'Lakeview Home with Deck',
    location: 'Lake Union, Seattle',
    price: '$1,020,000',
    badge: 'For Sale',
    tag: 'House',
    beds: 4,
    baths: 3,
    area: 2025,
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80'
  }
];

const filterCategories = ['Apartments', 'Houses', 'Rooms', 'Commercial', 'Short Term', 'Land'];
const filterAmenities = ['Air Conditioning', 'Balcony', 'Parking', 'Pet Friendly', 'Gym', 'Pool'];

const footerNews = [
  {
    date: '24 October 2016',
    meta: 'Lifestyle / 0 Comment',
    title: 'In Pede Mi Aliquet Sit Amet Euismod In Auctor'
  },
  {
    date: '17 October 2016',
    meta: 'Cities, Tips / 4 Comments',
    title: 'Fusce Euismod Consequat Ante'
  },
  {
    date: '12 October 2016',
    meta: 'Food / 6 Comments',
    title: 'Donec Sagittis Euismod Purus Sed Ut Perspiciatis'
  }
];

const footerCategories = ['Fashion & Beauty', 'Baby & Kids', 'Jobs', 'Services', 'Real Estate', 'Hobby & Leisure', 'Classes'];
const footerLinks = ['About', 'How It Works', 'Terms Of Use', 'Privacy Policy', 'Help/FAQ', 'Contact', 'Newsletter'];

export default function HomePage() {
  const { user } = useAppSelector(state => state.auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeListing, setActiveListing] = useState(0);
  const FEATURED_VISIBLE = 4;
  const featuredMaxIndex = Math.max(0, featuredListings.length - FEATURED_VISIBLE);
  const featuredPages = Math.ceil(featuredListings.length / FEATURED_VISIBLE);
  const activeFeaturedPage = Math.floor(activeListing / FEATURED_VISIBLE);
  const canGoPrev = activeListing > 0;
  const canGoNext = activeListing < featuredMaxIndex;
  const primaryCta = user ? { href: '/dashboard', label: 'Dashboard' } : { href: '/login', label: 'Login' };

  const goToNextListing = () => {
    setActiveListing(index => Math.min(index + FEATURED_VISIBLE, featuredMaxIndex));
  };

  const goToPrevListing = () => {
    setActiveListing(index => Math.max(index - FEATURED_VISIBLE, 0));
  };

  const goToPage = (pageIndex: number) => {
    setActiveListing(Math.min(pageIndex * FEATURED_VISIBLE, featuredMaxIndex));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 text-slate-900">
      <div className="bg-slate-100 text-xs text-slate-700">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            
            <a href="tel:+1234567890" className="font-semibold text-slate-800 hover:text-indigo-600">
              +1 (234) 567-890
            </a>
            <span className="hidden h-4 w-px bg-slate-300 sm:block" aria-hidden />
            <a href="mailto:hello@classified.app" className="hover:text-indigo-600">
              hello@classified.app
            </a>
            
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Follow:</span>
              <a className="font-semibold text-slate-800 hover:text-indigo-600" href="#" aria-label="Facebook">
                Fb
              </a>
              <a className="font-semibold text-slate-800 hover:text-indigo-600" href="#" aria-label="Twitter">
                Tw
              </a>
              <a className="font-semibold text-slate-800 hover:text-indigo-600" href="#" aria-label="Instagram">
                Ig
              </a>
            </div>
            {!user && (
              <>
                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Log in
                </Link> / 
                <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-2xl font-black tracking-tight text-slate-900">
            Knowhere
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 lg:flex">
            {navItems.map(item => (
              <a key={item.label} href={item.href} className="hover:text-indigo-600">
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to={primaryCta.href}
              className="hidden rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:bg-indigo-500 md:inline-flex"
            >
              {primaryCta.label}
            </Link>
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-700 lg:hidden"
              onClick={() => setMenuOpen(open => !open)}
              aria-label="Toggle navigation"
            >
              <span className="block h-0.5 w-5 bg-current" />
              <span className="mt-1 block h-0.5 w-5 bg-current" />
              <span className="mt-1 block h-0.5 w-5 bg-current" />
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-slate-200 bg-white px-6 pb-4 lg:hidden">
            <nav className="flex flex-col gap-3 py-4 text-sm font-semibold text-slate-700">
              {navItems.map(item => (
                <a key={item.label} href={item.href} className="hover:text-indigo-600" onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="flex gap-3">
              <Link
                to={primaryCta.href}
                className="flex-1 rounded-full bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:bg-indigo-500"
                onClick={() => setMenuOpen(false)}
              >
                {primaryCta.label} 
              </Link>
              {!user && (
                <Link
                  to="/register"
                  className="flex-1 rounded-full border border-indigo-200 px-4 py-2 text-center text-sm font-semibold text-indigo-700 transition hover:border-indigo-300 hover:text-indigo-800"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign up
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="pb-16">
        <section className="relative min-h-[480px] overflow-hidden">
          <iframe
            title="Knowwhere map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3021.389725199462!2d-73.9934483845932!3d40.74870004392109!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259ac172f2c75%3A0xb1479ca163f92f3e!2s214%20W%2029th%20St%2C%20New%20York%2C%20NY%2010001!5e0!3m2!1sen!2sus!4v1675692179629!5m2!1sen!2sus"
            className="absolute inset-0 h-full w-full border-0"
            loading="lazy"
            allowFullScreen
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/60 via-slate-900/40 to-transparent" aria-hidden />
          
          <div className="absolute left-1/2 bottom-8 w-[92%] max-w-6xl -translate-x-1/2">
            <form className="grid grid-cols-1 gap-2 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl shadow-slate-900/15 backdrop-blur lg:grid-cols-[1.4fr,1fr,1fr,0.8fr,0.8fr,1fr,0.8fr]">
              <input
                type="text"
                name="query"
                placeholder="Looking for..."
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              <div className="flex items-center rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-600">
                <select className="w-full bg-transparent outline-none">
                  <option>All locations</option>
                  <option>New York</option>
                  <option>San Francisco</option>
                  <option>Chicago</option>
                </select>
                <span className="ml-2 text-slate-400">▾</span>
              </div>
              <div className="flex items-center rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-600">
                <select className="w-full bg-transparent outline-none">
                  <option>All categories</option>
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Retail</option>
                </select>
                <span className="ml-2 text-slate-400">▾</span>
              </div>
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price"
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              <div className="flex flex-col gap-2 rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-800">
                <label htmlFor="distance" className="whitespace-nowrap text-slate-600">
                  Distance
                </label>
                <input
                  id="distance"
                  type="range"
                  name="distance"
                  min="0"
                  max="50"
                  defaultValue="10"
                  className="w-full accent-amber-500"
                />
              </div>
              <button
                type="submit"
                className="w-full self-center rounded-lg bg-amber-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-500/25 transition hover:bg-amber-500 h-10"
              >
                Search
              </button>
            </form>
          </div>
        </section>

        <section id="categories" className="border-t border-slate-200 bg-white/90">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Browse</p>
                <h2 className="mt-1 text-2xl font-black text-slate-900">Shop by category</h2>
                <p className="text-sm text-slate-600">
                  All the neighborhoods and niches, neatly organized so you can jump right in.
                </p>
              </div>
              <a href="#categories" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                View all categories →
              </a>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map(category => (
                <article
                  key={category.title}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-md hover:shadow-slate-900/8"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded-full text-lg ring-4 ring-offset-2 ring-offset-white ${category.iconClass}`}
                      aria-hidden
                    >
                      {category.icon}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{category.title}</h3>
                  </div>
                  <ul className="space-y-2 text-sm">
                    {category.items.map(item => (
                      <li key={item.label} className="flex items-center justify-between gap-2">
                        <a href="#" className={`${category.accent} font-semibold hover:underline`}>
                          {item.label}
                        </a>
                        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{item.count}</span>
                      </li>
                    ))}
                    <li>
                      <a href="#" className={`${category.accent} inline-flex items-center gap-1 font-semibold hover:underline`}>
                        Show More
                        <span className="text-slate-400">▾</span>
                      </a>
                    </li>
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="featured" className="border-t border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-100">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Featured</p>
                <h2 className="mt-1 text-2xl font-black text-slate-900">Featured listings</h2>
                <p className="text-sm text-slate-600">Hand-picked homes and spaces you need to see first.</p>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={goToPrevListing}
                  disabled={!canGoPrev}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition ${
                    canGoPrev ? 'hover:-translate-y-[1px] hover:border-indigo-200 hover:text-indigo-600' : 'cursor-not-allowed opacity-40'
                  }`}
                  aria-label="Previous listing"
                >
                  <span aria-hidden>‹</span>
                </button>
                <button
                  type="button"
                  onClick={goToNextListing}
                  disabled={!canGoNext}
                  className={`flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition ${
                    canGoNext ? 'hover:-translate-y-[1px] hover:border-indigo-200 hover:text-indigo-600' : 'cursor-not-allowed opacity-40'
                  }`}
                  aria-label="Next listing"
                >
                  <span aria-hidden>›</span>
                </button>
              </div>
            </div>

            <div className="relative mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10">
              <div
                className="flex p-5 transition-transform duration-500"
                style={{ transform: `translateX(-${(100 / FEATURED_VISIBLE) * activeListing}%)` }}
              >
                {featuredListings.map(listing => (
                  <div
                    key={listing.title}
                    className="box-border flex-shrink-0 px-2.5"
                    style={{ width: `${100 / FEATURED_VISIBLE}%` }}
                  >
                    <article className="group relative h-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-md hover:shadow-slate-900/10">
                      <div className="relative h-48">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent opacity-90" aria-hidden />
                        <div className="absolute left-4 top-4 flex items-center gap-2">
                          <span className="rounded-full bg-amber-500 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow-sm shadow-amber-500/30">
                            {listing.badge}
                          </span>
                          <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-slate-900 shadow-sm backdrop-blur">
                            {listing.category}
                          </span>
                        </div>
                        <button
                          type="button"
                          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-slate-700 shadow-sm backdrop-blur transition hover:text-indigo-600"
                          aria-label="Save listing"
                        >
                          ♡
                        </button>
                        <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-slate-900 shadow">
                          {listing.price}
                        </div>
                      </div>
                      <div className="flex h-full flex-col gap-3 p-4">
                        <div className="space-y-1">
                          <h3 className="text-base font-bold text-slate-900">{listing.title}</h3>
                          <p className="text-sm text-slate-600">{listing.location}</p>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1">
                            <span aria-hidden>🛏</span> {listing.beds} Beds
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1">
                            <span aria-hidden>🛁</span> {listing.baths} Baths
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1">
                            <span aria-hidden>⬜</span> {listing.area.toLocaleString()} sq ft
                          </span>
                        </div>
                        <div className="mt-auto flex items-center justify-between">
                          <a href="#" className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-500">
                            View details →
                          </a>
                          <button className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm shadow-slate-900/20 transition hover:-translate-y-[1px] hover:bg-slate-800">
                            Schedule tour
                          </button>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>

              <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
                {Array.from({ length: featuredPages }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => goToPage(index)}
                    className={`h-2.5 rounded-full transition ${
                      index === activeFeaturedPage
                        ? 'w-8 bg-indigo-600 shadow ring-2 ring-indigo-200'
                        : 'w-2.5 bg-slate-300 hover:bg-slate-400'
                    }`}
                    aria-label={`Go to featured slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="new-listings" className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-12">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Explore</p>
                <h2 className="mt-1 text-2xl font-black text-slate-900">New listings</h2>
                <p className="text-sm text-slate-600">Fresh properties on the market with quick-glance details.</p>
              </div>
              <a href="#top" className="text-sm font-semibold text-indigo-600 hover:text-indigo-500">
                View all →
              </a>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-[1fr,2.4fr]">
              <aside className="rounded-2xl border border-slate-200 bg-slate-50/60 p-6 shadow-sm shadow-slate-900/5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-slate-900">Filters</h3>
                  <button className="text-xs font-semibold text-indigo-600 hover:text-indigo-500">Reset</button>
                </div>
                <div className="mt-5 space-y-6 text-sm">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Search</label>
                    <input
                      type="text"
                      placeholder="City, address, street"
                      className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 outline-none transition focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Listing type
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['For Sale', 'For Rent', 'Short Term'].map(option => (
                        <label
                          key={option}
                          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-700"
                        >
                          <input type="radio" name="listingType" className="accent-indigo-600" />
                          <span className="text-sm font-semibold">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Category</label>
                    <div className="grid grid-cols-2 gap-2">
                      {filterCategories.map(category => (
                        <label key={category} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-slate-700 shadow-sm">
                          <input type="checkbox" className="accent-indigo-600" />
                          <span className="text-sm font-semibold">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Price</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min="0"
                        max="2000000"
                        defaultValue="750000"
                        className="w-full accent-indigo-600"
                      />
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-800 shadow-sm">
                        $750k
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Amenities
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {filterAmenities.map(amenity => (
                        <label key={amenity} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-slate-700 shadow-sm">
                          <input type="checkbox" className="accent-indigo-600" />
                          <span className="text-sm font-semibold">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <button className="mt-2 w-full rounded-full bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/25 transition hover:bg-indigo-500">
                    Apply filters
                  </button>
                </div>
              </aside>

              <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-600">
                    Showing <span className="font-semibold text-slate-900">{newListings.length}</span> new listings
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-600">Sort by:</span>
                    <select className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-slate-800 outline-none transition hover:border-indigo-200 focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100">
                      <option>Most recent</option>
                      <option>Price: Low to High</option>
                      <option>Price: High to Low</option>
                    </select>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {newListings.map(listing => (
                    <article
                      key={listing.title}
                      className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-md hover:shadow-slate-900/10"
                    >
                      <div className="relative h-44">
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent" aria-hidden />
                        <div className="absolute left-4 top-4 flex items-center gap-2">
                          <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-900 shadow">
                            {listing.badge}
                          </span>
                          <span className="rounded-full bg-indigo-600/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white shadow shadow-indigo-500/30">
                            New
                          </span>
                        </div>
                        <button
                          type="button"
                          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-slate-700 shadow-sm backdrop-blur transition hover:text-indigo-600"
                          aria-label="Save listing"
                        >
                          ♡
                        </button>
                        <div className="absolute bottom-4 left-4 rounded-full bg-white/95 px-4 py-1.5 text-sm font-bold text-slate-900 shadow">
                          {listing.price}
                        </div>
                      </div>
                      <div className="space-y-3 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <h3 className="text-base font-bold text-slate-900">{listing.title}</h3>
                            <p className="flex items-center gap-2 text-sm text-slate-600">
                              <span aria-hidden>📍</span>
                              {listing.location}
                            </p>
                          </div>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-800">
                            {listing.tag}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1">
                            🛏 {listing.beds} Beds
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1">
                            🛁 {listing.baths} Baths
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1">
                            ⬜ {listing.area.toLocaleString()} sq ft
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <button className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 transition hover:text-indigo-500">
                            View details →
                          </button>
                          <button className="rounded-full bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow-sm shadow-slate-900/20 transition hover:-translate-y-[1px] hover:bg-slate-800">
                            Contact agent
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="mt-12">
          <div className="bg-emerald-500 text-white">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-4">
              <div>
                <h3 className="text-lg font-semibold">Latest News</h3>
                <ul className="mt-4 space-y-4 text-sm">
                  {footerNews.map(item => (
                    <li key={item.title} className="space-y-1">
                      <p className="text-white/80">
                        {item.date} / {item.meta}
                      </p>
                      <a href="#" className="font-semibold text-white hover:underline">
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Popular Categories</h3>
                <ul className="mt-4 space-y-2 text-sm font-semibold">
                  {footerCategories.map(item => (
                    <li key={item}>
                      <a href="#" className="hover:underline">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Like Us on Facebook</h3>
                <div className="mt-4 w-full max-w-[320px] overflow-hidden rounded-sm bg-white shadow">
                  <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3 text-slate-900">
                    <div className="flex h-12 w-12 items-center justify-center rounded bg-lime-400 text-2xl font-black text-slate-900">
                      e
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-slate-900">Envato</span>
                      <span className="text-xs text-slate-600">275K followers</span>
                    </div>
                  </div>
                  <div className="px-4 py-3">
                    <button className="flex items-center gap-2 rounded-sm border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100">
                      <span className="bg-blue-600 px-1 text-white">f</span>
                      Follow Page
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Quick Links</h3>
                <ul className="mt-4 space-y-2 text-sm font-semibold">
                  {footerLinks.map(link => (
                    <li key={link}>
                      <a href="#" className="hover:underline">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white">
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-6 py-12 md:grid-cols-[1.4fr,1fr,1fr]">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-2xl font-black text-slate-900">
                  <span className="text-purple-600">KN</span>
                  <span>OWHERE</span>
                </div>
                <p className="text-sm text-slate-600">
                  Duis ac turpis. Integer rutrum ante eu lacus. Vestibulum libero nisl, porta vel, scelerisque eget,
                  malesuada at, neque. Vivamus eget nibh. Etiam cursus leo vel metus.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-bold text-slate-900">Follow Us</h4>
                <div className="flex flex-wrap gap-2">
                  {['F', 'G+', 'T', 'In', '✉'].map(icon => (
                    <button
                      key={icon}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:text-indigo-600"
                      aria-label={`Follow on ${icon}`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-base font-bold text-slate-900">Mobile Apps</h4>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#"
                    className="flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-slate-800"
                  >
                    <span className="text-lg">▶</span>
                    Google Play
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-xs font-semibold text-white shadow hover:bg-slate-800"
                  >
                    <span className="text-lg"></span>
                    App Store
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50">
            <div className="mx-auto flex max-w-6xl items-center justify-center px-6 py-4 text-xs text-slate-600">
              Copyright <span className="px-1 font-semibold text-indigo-600">Knowhere</span> © 2016. All Rights Reserved
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
