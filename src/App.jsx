import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { Home, Users, Trophy, Bell, Repeat2, UserPlus, Swords, Shield, LogIn, LogOut, Wallet, BarChart3 } from 'lucide-react'
import { endpoints, roleColors } from './lib/api'

function Nav() {
  const [open, setOpen] = useState(false)
  return (
    <div className="sticky top-0 z-40 backdrop-blur bg-slate-900/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/mlbb-logo.png" alt="MLBB" className="w-8 h-8" />
          <span className="font-bold text-white">MPL ID Fantasy</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-slate-200">
          <Link to="/draft" className="hover:text-white">Draft</Link>
          <Link to="/leaderboard" className="hover:text-white">Leaderboard</Link>
          <Link to="/transfer" className="hover:text-white">Transfers</Link>
          <Link to="/stats" className="hover:text-white">Player Stats</Link>
          <Link to="/notifications" className="hover:text-white">Updates</Link>
        </div>
        <div className="flex items-center gap-3">
          <AuthMenu />
          <button onClick={() => setOpen(!open)} className="md:hidden text-white">☰</button>
        </div>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-3 flex flex-col gap-2 text-slate-200">
          <Link to="/draft" onClick={() => setOpen(false)}>Draft</Link>
          <Link to="/leaderboard" onClick={() => setOpen(false)}>Leaderboard</Link>
          <Link to="/transfer" onClick={() => setOpen(false)}>Transfers</Link>
          <Link to="/stats" onClick={() => setOpen(false)}>Player Stats</Link>
          <Link to="/notifications" onClick={() => setOpen(false)}>Updates</Link>
        </div>
      )}
    </div>
  )
}

function useAuth() {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('mlbb_user')
    return raw ? JSON.parse(raw) : null
  })
  const login = async (email, password) => {
    const u = await endpoints.login({ email, password })
    setUser(u)
    localStorage.setItem('mlbb_user', JSON.stringify(u))
  }
  const register = async (username, email, password) => {
    const u = await endpoints.register({ username, email, password })
    setUser(u)
    localStorage.setItem('mlbb_user', JSON.stringify(u))
  }
  const logout = () => { setUser(null); localStorage.removeItem('mlbb_user') }
  return { user, login, register, logout }
}

function AuthMenu() {
  const { user, logout } = useAuthContext()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  return (
    <div className="relative">
      {user ? (
        <button onClick={() => setOpen(!open)} className="flex items-center gap-2 text-slate-200 hover:text-white">
          <img src={user.avatar_url || 'https://i.pravatar.cc/24'} className="w-7 h-7 rounded-full"/>
          <span className="hidden sm:inline">{user.username}</span>
        </button>
      ) : (
        <Link to="/auth" className="text-slate-200 hover:text-white flex items-center gap-2"><LogIn size={18}/> Sign in</Link>
      )}
      {open && (
        <div className="absolute right-0 mt-2 w-44 bg-slate-800 border border-white/10 rounded-lg shadow-xl py-2">
          <Link to="/profile" className="block px-3 py-2 text-slate-200 hover:bg-slate-700/50">Profile</Link>
          <button onClick={() => { logout(); setOpen(false); navigate('/') }} className="w-full text-left px-3 py-2 text-red-300 hover:bg-slate-700/50 flex items-center gap-2">
            <LogOut size={16}/> Logout
          </button>
        </div>
      )}
    </div>
  )
}

const AuthContext = (props) => null
function useAuthContext(){
  // simple context shim via window for prototype
  return window.__AUTH__
}

function AuthProvider({ children }){
  const auth = useAuth()
  useEffect(()=>{ window.__AUTH__ = auth }, [auth.user])
  return children
}

function Shell({ children }){
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(56,189,248,.15),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(251,191,36,.12),transparent_40%)] pointer-events-none"/>
      <Nav />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  )
}

// Pages
function HomePage(){
  const { user } = useAuthContext()
  return (
    <Shell>
      <section className="grid md:grid-cols-3 gap-6">
        <Card title="Draft your team" icon={<Swords className="text-cyan-400"/>} cta="Start Draft" to="/draft">
          Pick your MPL ID stars within budget. Color-coded by role. Live points during match days.
        </Card>
        <Card title="Compete in leagues" icon={<Trophy className="text-amber-400"/>} cta="View Leaderboard" to="/leaderboard">
          Global rankings and private leagues. Weekly results and season standings.
        </Card>
        <Card title="Track live updates" icon={<Bell className="text-pink-400"/>} cta="View Updates" to="/notifications">
          Real-time match notifications, MVPs, and score changes.
        </Card>
      </section>

      <section className="mt-10 grid lg:grid-cols-3 gap-6">
        <HeroPanel />
        <FlowPanel />
      </section>
    </Shell>
  )
}

function Card({ title, icon, children, cta, to }){
  return (
    <Link to={to} className="group rounded-2xl p-6 bg-slate-900/60 border border-white/10 hover:border-white/20 hover:shadow-[0_0_0_1px_rgba(255,255,255,.1),0_30px_80px_-20px_rgba(56,189,248,.25)] transition-all">
      <div className="flex items-center gap-3 mb-3">{icon}<h3 className="font-semibold">{title}</h3></div>
      <p className="text-slate-300/80 text-sm mb-4">{children}</p>
      <span className="text-cyan-300 group-hover:text-cyan-200 inline-flex items-center gap-2">{cta} →</span>
    </Link>
  )
}

function HeroPanel(){
  return (
    <div className="col-span-2 rounded-2xl p-6 bg-gradient-to-br from-indigo-700/30 via-purple-700/20 to-slate-800 border border-white/10">
      <h3 className="font-semibold mb-2 flex items-center gap-2"><Shield size={18}/> MPL ID Fantasy League</h3>
      <p className="text-slate-200/90">Build a dream roster of pros. Earn points from KDA, objectives, damage, MVPs and win rate. Mobile-first, esports aesthetic.</p>
      <div className="mt-4 grid sm:grid-cols-3 gap-4">
        {[
          {label:'Tank',color:'bg-cyan-600'},
          {label:'Mage',color:'bg-purple-600'},
          {label:'Assassin',color:'bg-pink-600'},
        ].map((r)=> (
          <div key={r.label} className={`rounded-xl px-4 py-3 ${r.color} bg-opacity-80`}>{r.label}</div>
        ))}
      </div>
    </div>
  )
}

function FlowPanel(){
  const steps = [
    { title: 'Register', desc: 'Create your manager profile' },
    { title: 'Draft', desc: 'Pick players within budget' },
    { title: 'Score', desc: 'Points update live on match days' },
    { title: 'Rank', desc: 'Climb leaderboards and win leagues' },
  ]
  return (
    <div className="rounded-2xl p-6 bg-slate-900/60 border border-white/10">
      <h3 className="font-semibold mb-3">How it works</h3>
      <ol className="space-y-2">
        {steps.map((s,i)=> (
          <li key={i} className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-xs font-bold">{i+1}</div>
            <div>
              <div className="font-medium">{s.title}</div>
              <div className="text-slate-300/80 text-sm">{s.desc}</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function DraftPage(){
  const { user } = useAuthContext()
  const [players, setPlayers] = useState([])
  const [selected, setSelected] = useState([])
  const budget = 100
  const total = selected.reduce((s,p)=> s + p.cost, 0)
  useEffect(()=>{ endpoints.players().then(setPlayers).catch(()=>{}) },[])

  const toggle = (p) => {
    if (selected.find(x=>x.ign===p.ign)) setSelected(selected.filter(x=>x.ign!==p.ign))
    else setSelected([...selected, p])
  }
  const save = async ()=>{
    if (!user) return alert('Sign in first')
    if (total>budget) return alert('Budget exceeded')
    const id = await endpoints.draft({ user_id: user.user_id, week: 1, player_ids: selected.map(p=>p._id || p.id || p.pid || p.ign), budget })
    alert('Draft saved!')
  }

  return (
    <Shell>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xl font-semibold">Select Players</h2>
            <div className="text-sm text-slate-300">Budget: <span className="font-semibold text-emerald-400">{budget-total}</span></div>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {players.map((p)=> (
              <div key={p.ign} className={`rounded-2xl border border-white/10 bg-slate-900/60 p-4 hover:border-white/20 transition ${selected.find(x=>x.ign===p.ign)?'ring-2 ring-cyan-400':''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${roleColors[p.role]||'bg-slate-700'} flex items-center justify-center text-xs font-bold`}>{p.role?.[0]?.toUpperCase()||'?'}</div>
                  <div>
                    <div className="font-semibold">{p.ign}</div>
                    <div className="text-xs text-slate-400">{p.team}</div>
                  </div>
                  <div className="ml-auto text-amber-300 font-semibold">${p.cost}</div>
                </div>
                <div className="mt-2 grid grid-cols-4 gap-2 text-xs text-slate-300">
                  <Stat label="KDA" value={p.kda} />
                  <Stat label="DMG" value={p.damage} />
                  <Stat label="OBJ" value={p.objectives} />
                  <Stat label="WR" value={`${p.win_rate}%`} />
                </div>
                <button onClick={()=>toggle(p)} className="mt-3 w-full rounded-lg py-2 bg-cyan-600 hover:bg-cyan-500 font-medium">
                  {selected.find(x=>x.ign===p.ign) ? 'Remove' : 'Add'}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="rounded-2xl p-4 bg-slate-900/60 border border-white/10 sticky top-24">
            <h3 className="font-semibold mb-2">Your Picks</h3>
            <div className="space-y-2 max-h-[50vh] overflow-auto pr-1">
              {selected.map((p)=> (
                <div key={p.ign} className="flex items-center gap-3 bg-slate-800/60 rounded-xl p-2">
                  <div className={`w-8 h-8 rounded-md ${roleColors[p.role]||'bg-slate-700'}`}></div>
                  <div className="text-sm">{p.ign} <span className="text-slate-400">({p.team})</span></div>
                  <div className="ml-auto text-amber-300 font-semibold">${p.cost}</div>
                </div>
              ))}
              {selected.length===0 && (<div className="text-sm text-slate-400">No players selected yet.</div>)}
            </div>
            <div className="mt-3 flex items-center justify-between text-sm"><span>Total</span><span className="font-semibold">${total}</span></div>
            <button onClick={save} className="mt-3 w-full rounded-lg py-2 bg-emerald-600 hover:bg-emerald-500 font-medium">Save Draft</button>
          </div>
        </div>
      </div>
    </Shell>
  )
}

function Stat({label, value}){ return (
  <div className="bg-slate-800/60 rounded-md p-2 text-center">
    <div className="text-[10px] text-slate-400">{label}</div>
    <div className="font-semibold">{value}</div>
  </div>
)}

function StatsPage(){
  const [players, setPlayers] = useState([])
  useEffect(()=>{ endpoints.players().then(setPlayers).catch(()=>{}) },[])
  return (
    <Shell>
      <h2 className="text-xl font-semibold mb-4">Player Stats</h2>
      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800/60">
            <tr className="text-left">
              {['IGN','Team','Role','KDA','Damage','Objectives','Win Rate','MVP','Cost'].map(h=> (
                <th key={h} className="px-3 py-2 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map(p=> (
              <tr key={p.ign} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-3 py-2 font-medium">{p.ign}</td>
                <td className="px-3 py-2">{p.team}</td>
                <td className="px-3 py-2"><span className={`px-2 py-1 rounded text-xs ${roleColors[p.role]} `}>{p.role}</span></td>
                <td className="px-3 py-2">{p.kda}</td>
                <td className="px-3 py-2">{p.damage}</td>
                <td className="px-3 py-2">{p.objectives}</td>
                <td className="px-3 py-2">{p.win_rate}%</td>
                <td className="px-3 py-2">{p.mvp_count}</td>
                <td className="px-3 py-2 font-semibold text-amber-300">${p.cost}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  )
}

function LeaderboardPage(){
  const [rows, setRows] = useState([])
  useEffect(()=>{ endpoints.leaderboard().then(setRows).catch(()=>{}) },[])
  return (
    <Shell>
      <h2 className="text-xl font-semibold mb-4">Global Leaderboard</h2>
      <div className="rounded-xl overflow-hidden border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-800/60"><tr>{['#','Manager','Points'].map(h=> <th key={h} className="px-3 py-2 text-left font-medium">{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((r,i)=> (
              <tr key={r.user_id} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-3 py-2">{i+1}</td>
                <td className="px-3 py-2 font-medium">{r.username}</td>
                <td className="px-3 py-2 font-semibold">{r.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Shell>
  )
}

function TransferPage(){
  const { user } = useAuthContext()
  const [players, setPlayers] = useState([])
  const [outId, setOut] = useState('')
  const [inId, setIn] = useState('')
  useEffect(()=>{ endpoints.players().then(setPlayers).catch(()=>{}) },[])
  const submit = async ()=>{
    if (!user) return alert('Sign in first')
    if (!outId || !inId) return
    await endpoints.transfer({ user_id: user.user_id, week:1, out_player_id: outId, in_player_id: inId })
    alert('Transfer requested')
  }
  return (
    <Shell>
      <h2 className="text-xl font-semibold mb-4">Transfers</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <select onChange={(e)=>setOut(e.target.value)} className="bg-slate-800/60 border border-white/10 rounded-lg p-3">
          <option value="">Select player out</option>
          {players.map(p=> <option key={p.ign} value={p._id || p.id || p.ign}>{p.ign} (${p.cost})</option>)}
        </select>
        <select onChange={(e)=>setIn(e.target.value)} className="bg-slate-800/60 border border-white/10 rounded-lg p-3">
          <option value="">Select player in</option>
          {players.map(p=> <option key={p.ign} value={p._id || p.id || p.ign}>{p.ign} (${p.cost})</option>)}
        </select>
      </div>
      <button onClick={submit} className="mt-4 rounded-lg py-2 px-4 bg-cyan-600 hover:bg-cyan-500">Confirm Transfer</button>
    </Shell>
  )
}

function NotificationsPage(){
  const [items, setItems] = useState([])
  useEffect(()=>{ endpoints.notifications().then(setItems).catch(()=>{}) },[])
  return (
    <Shell>
      <h2 className="text-xl font-semibold mb-4">Live Updates</h2>
      <div className="space-y-3">
        {items.map((n,i)=> (
          <div key={i} className="rounded-xl p-4 bg-slate-900/60 border border-white/10">
            <div className="text-sm text-slate-400">{new Date(n.created_at).toLocaleString?.()||''}</div>
            <div className="font-semibold">{n.title}</div>
            <div className="text-slate-300/90">{n.message}</div>
          </div>
        ))}
        {items.length===0 && <div className="text-slate-400">No notifications yet.</div>}
      </div>
    </Shell>
  )
}

function AuthPage(){
  const { login, register } = useAuthContext()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const submit = async (e)=>{
    e.preventDefault()
    if (mode==='login') await login(email, password)
    else await register(username, email, password)
    window.location.href = '/'
  }
  return (
    <Shell>
      <div className="max-w-md mx-auto bg-slate-900/60 border border-white/10 rounded-2xl p-6">
        <div className="flex gap-2 mb-4">
          <button onClick={()=>setMode('login')} className={`flex-1 rounded-lg py-2 ${mode==='login'?'bg-cyan-600':'bg-slate-800/60'}`}>Login</button>
          <button onClick={()=>setMode('register')} className={`flex-1 rounded-lg py-2 ${mode==='register'?'bg-cyan-600':'bg-slate-800/60'}`}>Register</button>
        </div>
        <form onSubmit={submit} className="space-y-3">
          {mode==='register' && (
            <input placeholder="Username" className="w-full p-3 rounded-lg bg-slate-800/60 border border-white/10" value={username} onChange={e=>setUsername(e.target.value)} required/>
          )}
          <input placeholder="Email" type="email" className="w-full p-3 rounded-lg bg-slate-800/60 border border-white/10" value={email} onChange={e=>setEmail(e.target.value)} required/>
          <input placeholder="Password" type="password" className="w-full p-3 rounded-lg bg-slate-800/60 border border-white/10" value={password} onChange={e=>setPassword(e.target.value)} required/>
          <button className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500">{mode==='login'?'Sign In':'Create Account'}</button>
        </form>
      </div>
    </Shell>
  )
}

function ProfilePage(){
  const { user } = useAuthContext()
  if (!user) return <Shell><div className="text-slate-300">Please sign in.</div></Shell>
  return (
    <Shell>
      <div className="max-w-xl mx-auto grid gap-4">
        <div className="rounded-2xl p-6 bg-slate-900/60 border border-white/10">
          <div className="flex items-center gap-4">
            <img src={user.avatar_url || 'https://i.pravatar.cc/80'} className="w-16 h-16 rounded-full"/>
            <div>
              <div className="text-xl font-semibold">{user.username}</div>
              <div className="text-slate-400 text-sm">{user.email}</div>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  )
}

function App(){
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/draft" element={<DraftPage/>} />
          <Route path="/leaderboard" element={<LeaderboardPage/>} />
          <Route path="/transfer" element={<TransferPage/>} />
          <Route path="/stats" element={<StatsPage/>} />
          <Route path="/notifications" element={<NotificationsPage/>} />
          <Route path="/auth" element={<AuthPage/>} />
          <Route path="/profile" element={<ProfilePage/>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
