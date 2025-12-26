import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="app-main">
      <div className="card" style={{ maxWidth: 480, margin: '3rem auto', textAlign: 'center' }}>
        <h2>Access denied</h2>
        <p>You do not have the required role or permission to view this page.</p>
        <Link to="/dashboard">Back to dashboard</Link>
      </div>
    </div>
  );
}
