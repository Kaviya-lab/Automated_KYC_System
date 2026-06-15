import { useState } from 'react';
import { submitKYC, uploadDocuments } from '../services/api';

export default function Home() {
  const [form, setForm] = useState({ customer_name: '', pan_number: '', aadhaar_number: '' });
  const [panFile, setPanFile] = useState(null);
  const [aadhaarFile, setAadhaarFile] = useState(null);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true); setMsg(null); setError(null);
    try {
      // Step 1: Submit KYC details
      const res = await submitKYC(form);
      const appId = res.data.id;

      // Step 2: Upload documents if provided
      if (panFile && aadhaarFile) {
        const formData = new FormData();
        formData.append('pan_image', panFile);
        formData.append('aadhaar_image', aadhaarFile);
        await uploadDocuments(appId, formData);
      }

      setMsg('✅ KYC submitted successfully! Status: PENDING');
      setForm({ customer_name: '', pan_number: '', aadhaar_number: '' });
      setPanFile(null);
      setAadhaarFile(null);
    } catch (e) {
      const errMsg = e.response?.data?.detail;
      setError(`❌ ${errMsg || 'Submission failed. Check your inputs.'}`);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-pink-700">Submit KYC Application</h2>
      {msg && <p className="mb-4 text-green-600 font-medium">{msg}</p>}
      {error && <p className="mb-4 text-red-500 font-medium">{error}</p>}
      <div className="flex flex-col gap-4">
        <input className="border rounded-lg p-3 focus:outline-pink-400"
          placeholder="Full Name"
          value={form.customer_name}
          onChange={e => setForm({ ...form, customer_name: e.target.value })} />
        <input className="border rounded-lg p-3 focus:outline-pink-400"
          placeholder="PAN Number (e.g. ABCDE1234F)"
          value={form.pan_number}
          onChange={e => setForm({ ...form, pan_number: e.target.value.toUpperCase() })} />
        <input className="border rounded-lg p-3 focus:outline-pink-400"
          placeholder="Aadhaar Number (12 digits)"
          value={form.aadhaar_number}
          onChange={e => setForm({ ...form, aadhaar_number: e.target.value })} />

        {/* Document Upload Section */}
        <div className="border-t pt-4 mt-2">
          <p className="text-sm font-semibold text-gray-600 mb-3">Upload Documents</p>
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">PAN Card Image</label>
              <input type="file" accept="image/*,.pdf"
                onChange={e => setPanFile(e.target.files[0])}
                className="w-full text-sm border rounded-lg p-2" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Aadhaar Card Image</label>
              <input type="file" accept="image/*,.pdf"
                onChange={e => setAadhaarFile(e.target.files[0])}
                className="w-full text-sm border rounded-lg p-2" />
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-pink-700 text-white py-3 rounded-lg font-semibold hover:bg-pink-800 disabled:opacity-50">
          {loading ? 'Submitting...' : 'Submit KYC'}
        </button>
      </div>
    </div>
  );
}