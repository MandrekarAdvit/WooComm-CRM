import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import { Home, Users, BarChart2, Settings, DollarSign, MessageSquare, X, Activity, Calendar, Zap } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// --- PAGE 1: HOME DASHBOARD ---
const DashboardHome = ({ customers }) => {
  const totalRev = customers.reduce((acc, c) => acc + c.totalSpent, 0);
  const vipCount = customers.filter(c => c.status === 'VIP').length;

  return (
    <div className="animate-in fade-in duration-500 font-serif">
      <h2 className="text-2xl font-bold text-emerald-900 mb-6 border-b-2 border-orange-100 pb-2">Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
          <div className="text-emerald-700 text-sm font-medium mb-2 flex items-center gap-2"><Users size={16}/> Total Customers</div>
          <div className="text-4xl font-bold text-emerald-900">{customers.length}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
          <div className="text-emerald-700 text-sm font-medium mb-2 flex items-center gap-2"><DollarSign size={16}/> Total Revenue</div>
          <div className="text-4xl font-bold text-emerald-900">₹{totalRev.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
          <div className="text-emerald-700 text-sm font-medium mb-2 flex items-center gap-2"><Activity size={16}/> VIP Members</div>
          <div className="text-4xl font-bold text-emerald-900">{vipCount}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm h-64 overflow-y-auto">
            <h3 className="font-semibold text-emerald-800 mb-4 flex items-center gap-2"><Calendar size={18}/> Recent Activity</h3>
            <div className="space-y-3">
              {[...customers].reverse().slice(0, 4).map((c, i) => (
                 <div key={i} className="text-sm text-slate-600 flex justify-between items-center border-b border-orange-50 pb-2 last:border-0">
                   <span>Order synced: <strong className="text-emerald-900">{c.firstName}</strong></span>
                   <span className="text-emerald-600 font-bold">₹{c.totalSpent.toLocaleString('en-IN')}</span>
                 </div>
              ))}
              {customers.length === 0 && <div className="text-sm text-orange-300 italic">Waiting for data synchronization...</div>}
            </div>
         </div>

         {/* AI Agent Logs */}
        <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm h-64 overflow-y-auto">
        <h3 className="font-semibold text-emerald-800 mb-4 flex items-center gap-2 text-lg">
          <MessageSquare size={20}/> AI Agent Logs
        </h3>
        <div className="space-y-4">
          {customers.flatMap(c => c.notes.map(n => ({ name: c.firstName, note: n }))).reverse().slice(0, 3).map((log, i) => (
              <div key={i} className="text-base text-emerald-900 bg-orange-50 p-4 rounded-xl border border-orange-100 leading-relaxed shadow-sm">
                <span className="font-bold text-emerald-700 mb-2 block text-sm uppercase tracking-wide border-b border-orange-200 pb-1">
                  Target: {log.name}
                </span> 
                <span className="font-medium">{log.note}</span>
              </div>
          ))}
          {customers.every(c => c.notes.length === 0) && <div className="text-base text-orange-300 italic text-center mt-10">System ready for sentiment analysis.</div>}
        </div>
       </div>
      </div>
    </div> 
  );
};

// --- PAGE 2: CUSTOMERS DIRECTORY ---
const CustomersPage = ({ customers, fetchData }) => {
  const [activeCustomer, setActiveCustomer] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  const handleAIAnalysis = async () => {
    if (!noteText) return;
    try {
      const res = await axios.post(`http://localhost:5000/api/customers/${activeCustomer._id}/notes`, { note: noteText });
      setAiResponse(res.data.aiActionTaken);
      fetchData(); 
      setTimeout(() => { setActiveCustomer(null); setNoteText(''); setAiResponse(''); }, 3000);
    } catch (err) { console.error(err); }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/customers/${id}/order-status`, { orderStatus: status });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const getBadgeStyle = (status) => {
    if (status === 'VIP') return 'bg-emerald-100 text-emerald-800';
    if (status === 'At-Risk') return 'bg-orange-200 text-orange-900';
    return 'bg-orange-50 text-orange-700';
  };

  return (
    <div className="animate-in fade-in duration-500 font-serif">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-emerald-900">Customer Directory</h2>
        <button onClick={fetchData} className="bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-bold hover:bg-emerald-700 shadow-md transition-all">Refresh Data</button>
      </div>

      <div className="bg-white rounded-2xl border border-orange-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-orange-50/50 border-b border-orange-100 text-emerald-800">
            <tr>
              <th className="p-4 font-bold">Customer</th>
              <th className="p-4 font-bold">Spent</th>
              <th className="p-4 font-bold">Loyalty</th>
              <th className="p-4 font-bold">Order Stage</th>
              <th className="p-4 font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id} className="border-b border-orange-50 last:border-0 hover:bg-orange-50/30 transition-colors">
                <td className="p-4 font-medium text-emerald-900">{c.firstName} {c.lastName}</td>
                <td className="p-4 font-bold text-emerald-800">₹{c.totalSpent.toLocaleString('en-IN')}</td>
                <td className="p-4"><span className={`px-3 py-1 rounded-full text-xs font-bold ${getBadgeStyle(c.status)}`}>{c.status}</span></td>
                <td className="p-4">
                  <select 
                    value={c.orderStatus || 'Pending'} 
                    onChange={(e) => updateOrderStatus(c._id, e.target.value)}
                    className={`text-xs font-bold p-1 rounded-md border border-orange-100 cursor-pointer focus:ring-1 focus:ring-emerald-500 outline-none ${
                      c.orderStatus === 'Completed' ? 'text-emerald-700 bg-emerald-50' : 
                      c.orderStatus === 'Processing' ? 'text-orange-700 bg-orange-50' : 'text-slate-500 bg-slate-50'
                    }`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td className="p-4">
                  <button onClick={() => setActiveCustomer(c)} className="text-emerald-600 hover:text-emerald-800 font-bold flex items-center gap-1 text-xs">
                    <MessageSquare size={14} /> AI Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {activeCustomer && (
        <div className="fixed inset-0 bg-emerald-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 font-serif">
          <div className="bg-white p-8 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in duration-200 border-4 border-orange-50">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-emerald-900">Agentic AI Review</h3>
              <X onClick={() => setActiveCustomer(null)} className="cursor-pointer text-orange-300 hover:text-orange-500" />
            </div>
            <p className="text-sm text-emerald-700 mb-4 font-medium italic">Analyzing history for {activeCustomer.firstName}</p>
            <textarea 
              value={noteText} onChange={(e) => setNoteText(e.target.value)}
              className="w-full h-32 p-4 border-2 border-orange-100 rounded-2xl mb-4 text-sm focus:border-emerald-500 outline-none font-serif bg-orange-50/20"
              placeholder="Paste customer support note here..."
            />
            {aiResponse && <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-sm mb-4 font-bold border border-emerald-100">{aiResponse}</div>}
            <button onClick={handleAIAnalysis} className="w-full bg-emerald-800 text-white py-3 rounded-2xl font-bold hover:bg-emerald-900 transition-colors shadow-lg">Run AI Analysis</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- PAGE 3: REPORTS & AI INSIGHTS ---
const ReportsPage = ({ customers }) => {
  const [insights, setInsights] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

  const chartData = customers.map(c => ({
    name: c.firstName,
    spent: c.totalSpent,
    fill: c.status === 'VIP' ? '#059669' : c.status === 'At-Risk' ? '#fb923c' : '#fed7aa'
  }));

  const generateAIReport = async () => {
    setLoadingAI(true);
    try {
      const res = await axios.get('http://localhost:5000/api/reports/ai-insights');
      setInsights(res.data.insights);
    } catch (err) { console.error(err); }
    setLoadingAI(false);
  };

  return (
    <div className="animate-in fade-in duration-500 font-serif">
      <h2 className="text-2xl font-bold text-emerald-900 mb-6">Financial Reports and AI Strategy</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
          <h3 className="font-semibold text-emerald-800 mb-6">Customer Lifetime Value Distribution</h3>
          <div className="h-80 w-full font-sans">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fed7aa" />
                <XAxis dataKey="name" stroke="#065f46" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#065f46" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip cursor={{fill: '#fff7ed'}} contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="spent" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-emerald-900 rounded-3xl p-6 shadow-xl text-white flex flex-col font-serif border-4 border-emerald-800">
          <div className="flex items-center gap-2 mb-4 text-orange-300 font-bold">
            <Zap size={24} />
            <h3 className="font-bold text-lg text-white underline underline-offset-8">AI Strategy Analyst</h3>
          </div>
          <p className="text-emerald-100 text-sm mb-6 leading-relaxed">Automated business strategy generated from latest WooCommerce order flow.</p>
          <button onClick={generateAIReport} disabled={loadingAI} className="w-full bg-orange-400 hover:bg-orange-500 text-emerald-950 py-3 rounded-2xl font-black transition-all shadow-lg mb-6 active:scale-95">
            {loadingAI ? 'Scanning Data...' : 'Run Strategy Report'}
          </button>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {insights.map((insight, index) => (
              <div key={index} className="bg-emerald-800/50 p-4 rounded-2xl border border-emerald-700 text-sm leading-relaxed text-emerald-50">
                {insight}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [customers, setCustomers] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/customers');
      setCustomers(res.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <Router>
      <div className="flex h-screen bg-orange-50/30 font-serif">
        <div className="w-64 bg-orange-100/50 border-r border-orange-200 flex flex-col shadow-sm">
          <div className="h-16 flex items-center px-6 border-b border-orange-200 bg-white">
            <h1 className="text-xl font-black text-emerald-900 tracking-tight font-serif italic">WooComm <span className="text-orange-500">CRM</span></h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <Link to="/" className="flex items-center gap-3 px-4 py-3 text-emerald-800 hover:bg-white hover:text-orange-600 rounded-2xl font-bold transition-all">
              <Home size={18} /> Dashboard
            </Link>
            <Link to="/customers" className="flex items-center gap-3 px-4 py-3 text-emerald-800 hover:bg-white hover:text-orange-600 rounded-2xl font-bold transition-all">
              <Users size={18} /> Directory
            </Link>
            <Link to="/reports" className="flex items-center gap-3 px-4 py-3 text-emerald-800 hover:bg-white hover:text-orange-600 rounded-2xl font-bold transition-all">
              <BarChart2 size={18} /> Reports
            </Link>
          </nav>
          <div className="p-6 bg-white border-t border-orange-100">
             <div className="flex items-center gap-3 text-emerald-700 hover:text-orange-500 cursor-pointer font-bold">
              <Settings size={18} /> Settings
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-10 bg-[#fffcf9]">
          <Routes>
            <Route path="/" element={<DashboardHome customers={customers} />} />
            <Route path="/customers" element={<CustomersPage customers={customers} fetchData={fetchData} />} />
            <Route path="/reports" element={<ReportsPage customers={customers} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;