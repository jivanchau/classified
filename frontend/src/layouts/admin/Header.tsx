import { Link } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonPinIcon from '@mui/icons-material/PersonPin';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import { logout } from '../../store/authSlice';

const Header = () => {
    const { user } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement | null>(null);

  const toggleMenu = (name: string) => {
    setOpenMenu(current => (current === name ? null : name));
  };

  const closeMenu = () => setOpenMenu(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


    return(
        <header className="app-header">
        <div className="brand">Classified Admin</div>
        <nav className="nav-links" ref={navRef}>
          <Link to="/dashboard">Dashboard</Link>
          <div
            className={`nav-item dropdown ${openMenu === 'master' ? 'open' : ''}`}
          >
            <button
              className="nav-toggle"
              type="button"
              aria-haspopup="true"
              aria-expanded={openMenu === 'master'}
              onClick={() => toggleMenu('master')}
            >
              Master <KeyboardArrowDownIcon className="arrow" />
            </button>
            <div className="dropdown-menu" role="menu">
              <Link to="/admin/master/users" onClick={closeMenu}>Users</Link>
              <Link to="/admin/master/cities" onClick={closeMenu}>Cities</Link>
              <Link to="/admin/master/categories" onClick={closeMenu}>Categories</Link>
              <Link to="/admin/master/media" onClick={closeMenu}>Media</Link>
            </div>
          </div>
          <div
            className={`nav-item dropdown ${openMenu === 'reports' ? 'open' : ''}`}
          >
            <button
              className="nav-toggle"
              type="button"
              aria-haspopup="true"
              aria-expanded={openMenu === 'reports'}
              onClick={() => toggleMenu('reports')}
            >
              Reports <KeyboardArrowDownIcon className="arrow" />
            </button>
            <div className="dropdown-menu" role="menu">
              <Link to="/reports" onClick={closeMenu}>Reports</Link>
            </div>
          </div>
          <div
            className={`nav-item dropdown ${openMenu === 'setting' ? 'open' : ''}`}
          >
            <button
              className="nav-toggle"
              type="button"
              aria-haspopup="true"
              aria-expanded={openMenu === 'setting'}
              onClick={() => toggleMenu('setting')}
            >
              Setting <KeyboardArrowDownIcon className="arrow" />
            </button>
            <div className="dropdown-menu" role="menu">
              <Link to="/admin/settings/permissions" onClick={closeMenu}>Permissions</Link>
              <Link to="/admin/settings/roles" onClick={closeMenu}>Roles</Link>
            </div>
          </div>
        </nav>
        <div className="user-area">
          <a href="#">
            <span><PersonPinIcon fontSize='small' className='text-pink-500' /> {user?.name}</span>
          </a>
          <button
            type="button"
            className="logout-button bg-red-500 py-1 px-2"
            onClick={() => dispatch(logout())}
          >
            <LogoutIcon fontSize="small" className="logout-icon" />
          </button>
        </div>
      </header>
    )
}

export default Header;
