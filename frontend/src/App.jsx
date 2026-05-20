import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, Navigate, useNavigate } from 'react-router-dom'

// --- AUTHENTICATION COMPONENT ---
const LoginScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup'
    
    try {
      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      if (response.ok) {
        onLogin(data) // Pass the user data up to App.jsx
      } else {
        setError(data.error || "Authentication failed")
      }
    } catch (err) {
      setError("Server connection failed")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-md border border-slate-100">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-6">
          {isLogin ? 'Welcome Back' : 'Create an Account'}
        </h2>
        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded text-sm text-center">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
            <input type="email" required className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                   value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Password</label>
            <input type="password" required className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500 outline-none" 
                   value={password} onChange={e => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded transition-colors">
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm">
          <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 hover:underline">
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  )
}

// --- NAVIGATION COMPONENT ---
const Navbar = ({ user, onLogout }) => {
  const location = useLocation();
  const isAgent = location.pathname === '/agent';

  return (
    <nav className={`${isAgent ? 'bg-slate-900' : 'bg-blue-600'} text-white shadow-md`}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="font-bold text-xl tracking-tight">
          {isAgent ? '⚙️ Service Cloud Console' : '🌐 SmartHelp Portal'}
        </div>
        <div className="flex items-center gap-4">
          {user.role === 'AGENT' && (
            <>
              <Link to="/" className={`px-3 py-1 rounded hover:bg-white/20 text-sm ${!isAgent ? 'bg-white/10' : ''}`}>Portal</Link>
              <Link to="/agent" className={`px-3 py-1 rounded hover:bg-white/20 text-sm ${isAgent ? 'bg-white/10' : ''}`}>Dashboard</Link>
            </>
          )}
          <span className="text-sm opacity-75 border-l border-white/30 pl-4 py-1">
            {user.email} ({user.role})
          </span>
          <button onClick={onLogout} className="text-sm px-3 py-1 bg-white/10 hover:bg-red-500 rounded transition-colors">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

// --- CUSTOMER PORTAL COMPONENT ---
// (Paste your existing CustomerPortal component code here exactly as it was)
const CustomerPortal = () => {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)
    const [submittedTicket, setSubmittedTicket] = useState(null) 
  
    const handleSubmit = async (e) => {
      e.preventDefault()
      setLoading(true)
      setSubmittedTicket(null)
  
      try {
        const response = await fetch('http://localhost:8080/api/tickets', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description })
        })
        const data = await response.json() 
        setTitle('')
        setDescription('')
        setSubmittedTicket(data)
      } catch (error) {
        console.error("Error submitting ticket:", error)
      } finally {
        setLoading(false)
      }
    }
  
    const getExpectedResponseTime = (priority) => {
      if (priority === 'HIGH') return '15 minutes'
      if (priority === 'MEDIUM') return '2-4 hours'
      return '24 hours'
    }
  
    return (
      <div className="max-w-2xl mx-auto mt-12 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">How can we help?</h2>
        <p className="text-gray-500 mb-6">Submit a ticket and our AI routing system will prioritize your request.</p>
        
        {submittedTicket && (
          <div className="mb-8 p-6 bg-blue-50 border border-blue-100 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">✓</div>
              <h3 className="text-lg font-bold text-blue-900">Ticket Received (Case #{submittedTicket.id})</h3>
            </div>
            <p className="text-blue-800 mb-4">
              Our AI system has analyzed your request and categorized it as <strong>{submittedTicket.category}</strong>.
            </p>
            <div className="bg-white p-4 rounded border border-blue-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Assigned Priority:</span>
                <span className="font-bold text-blue-700">{submittedTicket.priority}</span>
              </div>
              <hr className="my-2 border-gray-100" />
              <div className="flex justify-between items-center">
                <span className="text-gray-600 font-medium">Expected Response:</span>
                <span className="font-bold text-blue-700">{getExpectedResponseTime(submittedTicket.priority)}</span>
              </div>
            </div>
            <button onClick={() => setSubmittedTicket(null)} className="mt-4 text-sm font-semibold text-blue-600 hover:text-blue-800 underline">
              Submit another ticket
            </button>
          </div>
        )}
  
        {!submittedTicket && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Issue Subject</label>
              <input type="text" required className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Detailed Description</label>
              <textarea required rows="5" className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:bg-blue-400 shadow-md">
              {loading ? 'Processing via AI...' : 'Submit Support Ticket'}
            </button>
          </form>
        )}
      </div>
    )
}

// --- AGENT DASHBOARD COMPONENT ---
// (Paste your existing AgentDashboard component code here)
const AgentDashboard = () => {
    const [tickets, setTickets] = useState([])
  
    const fetchTickets = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/tickets')
        const data = await response.json()
        setTickets(data.sort((a, b) => b.id - a.id))
      } catch (error) {
        console.error("Error fetching tickets:", error)
      }
    }
  
    useEffect(() => {
      fetchTickets()
      const interval = setInterval(fetchTickets, 5000) 
      return () => clearInterval(interval)
    }, [])
  
    const handleDelete = async (id) => {
      try {
        await fetch(`http://localhost:8080/api/tickets/${id}`, { method: 'DELETE' })
        setTickets(tickets.filter(ticket => ticket.id !== id))
      } catch (error) {
        console.error("Error deleting ticket:", error)
      }
    }
  
    const getPriorityColor = (priority) => {
      switch (priority) {
        case 'HIGH': return 'bg-red-50 text-red-700 border-red-500'
        case 'MEDIUM': return 'bg-amber-50 text-amber-700 border-amber-500'
        case 'LOW': return 'bg-emerald-50 text-emerald-700 border-emerald-500'
        default: return 'bg-gray-50 text-gray-700 border-gray-400'
      }
    }
  
    return (
      <div className="max-w-6xl mx-auto mt-8 px-4">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Active Queue</h2>
          </div>
          <div className="text-sm font-semibold text-slate-500 bg-white px-3 py-1 rounded border shadow-sm">
            Total Tickets: {tickets.length}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {tickets.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-dashed text-gray-500">Inbox is zero. Waiting for new tickets...</div>
          ) : (
            tickets.map(ticket => (
              <div key={ticket.id} className={`p-5 rounded-xl border-l-4 shadow-sm bg-white hover:shadow-md transition-shadow ${getPriorityColor(ticket.priority).split(' ')[2]}`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-xl text-slate-800 mb-2">{ticket.title}</h3>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 bg-slate-100 text-xs font-bold rounded uppercase text-slate-600 border border-slate-200">{ticket.category}</span>
                      <span className={`px-2 py-1 text-xs font-bold rounded uppercase border ${getPriorityColor(ticket.priority)}`}>{ticket.priority} PRIORITY</span>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(ticket.id)} className="px-3 py-1 bg-slate-100 hover:bg-green-100 hover:text-green-700 text-slate-500 text-sm font-semibold rounded border border-slate-200 transition-colors">
                    ✓ Resolve Case
                  </button>
                </div>
                <p className="text-slate-600 mt-3 mb-4 bg-slate-50 p-3 rounded border border-slate-100">{ticket.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    )
}

// --- MAIN APP COMPONENT ---
function App() {
  // Load user from local storage so they don't get logged out on refresh
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('crm_user')))

  const handleLogin = (userData) => {
    localStorage.setItem('crm_user', JSON.stringify(userData))
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('crm_user')
    setUser(null)
  }

  // If not logged in, force them to the login screen
  if (!user) {
    return <LoginScreen onLogin={handleLogin} />
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 font-sans">
        <Navbar user={user} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<CustomerPortal />} />
          
          {/* THE PROTECTED ROUTE */}
          <Route path="/agent" element={
            user.role === 'AGENT' ? <AgentDashboard /> : <Navigate to="/" replace />
          } />
          
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App