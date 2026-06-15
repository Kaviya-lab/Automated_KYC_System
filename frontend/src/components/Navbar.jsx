import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <nav className="bg-pink-700 text-white px-6 py-4 flex gap-6 shadow-md items-center">
      <span className="font-bold text-lg mr-auto">🏦 KYC Audit System</span>
      {username && (
        <>
          <Link to="/" className="hover:underline">Submit KYC</Link>
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/audit" className="hover:underline">Audit Logs</Link>
          <span className="text-pink-200 text-sm">
            👤 {username} ({role})
          </span>
          <button onClick={handleLogout}
            className="bg-pink-900 px-3 py-1 rounded-lg text-sm hover:bg-pink-800">
            Logout
          </button>
        </>
      )}
    </nav>
  );
}