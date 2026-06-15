import { useState, useEffect } from 'react';
import { getAuditLogs, exportCSV } from '../services/api';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    getAuditLogs().then(r => setLogs(r.data));
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-pink-700">Audit Logs</h2>
        <button onClick={exportCSV}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 text-sm">
          ⬇ Export CSV
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-pink-700 text-white">
            <tr>
              <th className="p-3 text-left">Log ID</th>
              <th className="p-3 text-left">App ID</th>
              <th className="p-3 text-left">Action</th>
              <th className="p-3 text-left">Reviewed By</th>
              <th className="p-3 text-left">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-gray-400 text-center">No logs yet.</td></tr>
            )}
            {logs.map(log => (
              <tr key={log.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{log.id}</td>
                <td className="p-3">{log.application_id}</td>
                <td className="p-3">{log.action_performed}</td>
                <td className="p-3">{log.reviewed_by}</td>
                <td className="p-3">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}