import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar placeholder */}
        <nav className="bg-white shadow px-4 py-3 mb-8">
          <span className="font-bold text-xl text-primary-600">SkillSwap</span>
        </nav>
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<div>Home Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/profile" element={<div>Profile Page (Protected)</div>} />
            <Route path="/requests" element={<div>Requests Page (Protected)</div>} />
            <Route path="*" element={<div>404 - Not Found</div>} />
          </Routes>
        </main>
        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;
