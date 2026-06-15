import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setLoading(true); setError(null);
    try {
      const res = await loginUser(form);
      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('role', res.data.role);
      navigate('/dashboard');
    } catch (e) {
      setError('❌ Invalid username or password');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-sm mx-auto mt-24 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-2 text-pink-700">Officer Login</h2>
      <p className="text-sm text-gray-400 mb-6">KYC Audit System</p>
      {error && <p className="mb-4 text-red-500 text-sm">{error}</p>}
      <div className="flex flex-col gap-4">
        <input className="border rounded-lg p-3 focus:outline-pink-400"
          placeholder="Username"
          value={form.username}
          onChange={e => setForm({ ...form, username: e.target.value })} />
        <input className="border rounded-lg p-3 focus:outline-pink-400"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })} />
        <button onClick={handleLogin} disabled={loading}
          className="bg-pink-700 text-white py-3 rounded-lg font-semibold hover:bg-pink-800 disabled:opacity-50">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </div>
      </div>
  );
}