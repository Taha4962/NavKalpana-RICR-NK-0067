// ============================================
// App Component
// Router shell — pages will be added on Day 2
// ============================================

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Placeholder component for all pages
const ComingSoon = ({ title }) => (
  <div className="flex items-center justify-center min-h-screen bg-slate-900">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-indigo-400 mb-2">{title}</h1>
      <p className="text-slate-400">🚧 Coming Soon — Day 2</p>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ComingSoon title="🎓 Login" />} />
        <Route path="/dashboard" element={<ComingSoon title="📊 Dashboard" />} />
        <Route path="/batches" element={<ComingSoon title="📦 Batch Management" />} />
        <Route path="/assessments" element={<ComingSoon title="📝 Assessments" />} />
        <Route path="/students" element={<ComingSoon title="👥 Students" />} />
        <Route path="/support" element={<ComingSoon title="🆘 Support Requests" />} />
      </Routes>
    </Router>
  );
}

export default App;
