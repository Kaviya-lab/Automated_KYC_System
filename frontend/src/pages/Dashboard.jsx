import { useState, useEffect } from 'react';
import { getApplications, reviewApplication, getStatistics } from '../services/api';

const statusColor = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-700',
  REJECTED: 'bg-red-100 text-red-700'
};

function StatCard({ label, value, color }) {
  return (
    <div className={`rounded-xl shadow p-5 flex flex-col items-center ${color}`}>
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm font-medium mt-1">{label}</p>
    </div>
  );
}

export default function Dashboard() {
  const [apps, setApps] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [officer, setOfficer] = useState('Officer_1');
  const [msg, setMsg] = useState('');

  const load = async () => {
    const [appsRes, statsRes] = await Promise.all([
      getApplications({ status: filter, search }),
      getStatistics()
    ]);
    setApps(appsRes.data);
    setStats(statsRes.data);
  };

  useEffect(() => { load(); }, [filter, search]);

  const handleReview = async (id) => {
    try {
      await reviewApplication(id, { reviewed_by: officer });
      setMsg(`✅ Application #${id} reviewed.`);
      load();
    } catch { setMsg('❌ Review failed.'); }
  };

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-pink-700">Officer Dashboard</h2>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Applications" value={stats.total} color="bg-white text-gray-700" />
        <StatCard label="Pending Reviews" value={stats.pending} color="bg-yellow-50 text-yellow-800" />
        <StatCard label="Approved" value={stats.approved} color="bg-green-50 text-green-700" />
        <StatCard label="Rejected" value={stats.rejected} color="bg-red-50 text-red-700" />
      </div>

      {msg && <p className="mb-4 text-green-600">{msg}</p>}

      {/* Filters */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input className="border rounded-lg p-2 flex-1" placeholder="Search by name..."
          value={search} onChange={e => setSearch(e.target.value)} />
        <input className="border rounded-lg p-2 w-48" placeholder="Officer name"
          value={officer} onChange={e => setOfficer(e.target.value)} />
        <select className="border rounded-lg p-2" value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {/* Applications */}
      <div className="grid gap-4">
        {apps.length === 0 && <p className="text-gray-500">No applications found.</p>}
        {apps.map(app => (
  <div key={app.id} className="bg-white rounded-xl shadow p-5 flex flex-col sm:flex-row sm:items-center gap-4">
    <div className="flex-1">
      <p className="font-bold text-lg">{app.customer_name}</p>
      <p className="text-sm text-gray-500">PAN: {app.pan_number} | Aadhaar: {app.aadhaar_number}</p>
      <p className="text-xs text-gray-400 mt-1">{new Date(app.created_at).toLocaleString()}</p>
      {app.risk_score !== 'UNKNOWN' && (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full mt-1 inline-block
          ${app.risk_score === 'LOW' ? 'bg-green-100 text-green-700' :
            app.risk_score === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-700'}`}>
          Risk: {app.risk_score}
          <p className="text-xs text-gray-400 mt-1">
  Docs: {app.pan_image ? '✅ PAN' : '❌ PAN'} | {app.aadhaar_image ? '✅ Aadhaar' : '❌ Aadhaar'}
</p>
        </span>
      )}
    </div>
    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColor[app.status]}`}>
      {app.status}
    </span>
    {app.status === 'PENDING' && (
      <button onClick={() => handleReview(app.id)}
        className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 text-sm">
        Review
      </button>
    )}
  </div>
))}
      </div>
    </div>
  );
}