import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../../store/store';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Ads', href: '/ads' },
  { label: 'Properties', href: '#properties' },
  { label: 'Services', href: '#services' },
  { label: 'News', href: '#news' },
  { label: 'Contacts', href: '#contacts' }
];

type PrimaryCta = { href: string; label: string };

type FrontendHeaderProps = {
  primaryCta?: PrimaryCta;
};

export default function FrontendHeader({ primaryCta }: FrontendHeaderProps) {
  const { user } = useAppSelector(state => state.auth);
  const resolvedPrimaryCta: PrimaryCta =
    primaryCta ?? (user ? { href: '/dashboard', label: 'Dashboard' } : { href: '/login', label: 'Login' });
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
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
                </Link>{' '}
                /{' '}
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
            {navItems.map(item =>
              item.href.startsWith('/') ? (
                <Link key={item.label} to={item.href} className="hover:text-indigo-600">
                  {item.label}
                </Link>
              ) : (
                <a key={item.label} href={item.href} className="hover:text-indigo-600">
                  {item.label}
                </a>
              )
            )}
          </nav>
          <div className="flex items-center gap-3">
            <Link
              to={resolvedPrimaryCta.href}
              className="hidden rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:bg-indigo-500 md:inline-flex"
            >
              {resolvedPrimaryCta.label}
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
              {navItems.map(item =>
                item.href.startsWith('/') ? (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="hover:text-indigo-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <a
                    key={item.label}
                    href={item.href}
                    className="hover:text-indigo-600"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              )}
            </nav>
            <div className="flex gap-3">
              <Link
                to={resolvedPrimaryCta.href}
                className="flex-1 rounded-full bg-indigo-600 px-4 py-2 text-center text-sm font-semibold text-white shadow-md shadow-indigo-500/30 transition hover:bg-indigo-500"
                onClick={() => setMenuOpen(false)}
              >
                {resolvedPrimaryCta.label}
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
    </>
  );
}
