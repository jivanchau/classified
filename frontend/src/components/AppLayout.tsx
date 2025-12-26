import { Outlet } from 'react-router-dom';
import Header from '../layouts/admin/Header';
import Footer from '../layouts/admin/Footer';

export default function AppLayout() {

  return (
    <div className="app-shell">
      <Header />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
