import { useEffect, useState } from "react";

const blank = { name: "", role: "", location: "", domain: "", working: "Working" };
const LOGIN_USERNAME = "venkatesh";
const LOGIN_PASSWORD = "venkat@12";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("All domains");
  const [statusFilter, setStatusFilter] = useState("All status");
  const [showForm, setShowForm] = useState(false);
  const login = e => {
    e.preventDefault();
    if (username.trim() === LOGIN_USERNAME && password === LOGIN_PASSWORD) {
      setAuthenticated(true);
      setLoginError("");
    } else setLoginError("Invalid username or password.");
  };
  const logout = () => setAuthenticated(false);
  const load = async () => { const r = await fetch("/api/employees"); if (r.ok) setEmployees(await r.json()); };
  useEffect(() => { load(); }, []);
  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const save = async e => {
    e.preventDefault();
    const r = await fetch(editingId ? `/api/employees/${editingId}` : "/api/employees", { method: editingId ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    if (!r.ok) { setError("Please complete all fields."); return; }
    setForm(blank); setEditingId(null); setError(""); setShowForm(false); load();
  };
  const edit = e => { setEditingId(e.id); setForm({ name: e.name, role: e.role, location: e.location || "", domain: e.domain || "", working: e.working || "Working" }); setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const cancel = () => { setEditingId(null); setForm(blank); setError(""); setShowForm(false); };
  const remove = async id => { if (!window.confirm("Delete this employee?")) return; await fetch(`/api/employees/${id}`, { method: "DELETE" }); if (editingId === id) cancel(); load(); };
  const domains = ["All domains", ...new Set(employees.map(e => e.domain).filter(Boolean))];
  const visibleEmployees = employees.filter(e => `${e.name} ${e.role} ${e.location} ${e.domain}`.toLowerCase().includes(search.toLowerCase()) && (domainFilter === "All domains" || e.domain === domainFilter) && (statusFilter === "All status" || e.working === statusFilter));
  if (!authenticated) return <div className="login-page"><div className="login-card"><div className="login-brand"><div className="brand-mark">S</div><span>staidlogic</span></div><h1>Welcome back</h1><p className="login-subtitle">Sign in to manage your employee dashboard.</p><form onSubmit={login} className="login-form"><label>Username<input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter your username" autoComplete="username" /></label><label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" autoComplete="current-password" /></label><button className="primary login-button">Login</button></form><button className="forgot" type="button" onClick={() => alert("Please contact your administrator to reset your password.")}>Forgot password?</button>{loginError && <p className="error login-error">{loginError}</p>}</div></div>;
  return <div className="app-shell">
    <header className="topbar"><div className="brand-mark">S</div><div><div className="brand">staidlogic</div><div className="tagline">People operations</div></div><div className="header-spacer"/><button className="logout" onClick={logout}>Log out</button><div className="user-dot">A</div></header>
    <main className="content"><section className="intro"><div><p className="eyebrow">TEAM DIRECTORY</p><h1>Employees</h1><p className="subtext">Manage your team and keep employee details up to date.</p></div><div className="count-card"><strong>{employees.length}</strong><span>Total employees</span></div></section>
      <section className="toolbar"><input className="search" placeholder="Search employees..." value={search} onChange={e => setSearch(e.target.value)} /><select value={domainFilter} onChange={e => setDomainFilter(e.target.value)}>{domains.map(d => <option key={d}>{d}</option>)}</select><select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}><option>All status</option><option>Working</option><option>Not working</option></select><button className="primary add-button" onClick={() => { setEditingId(null); setForm(blank); setShowForm(!showForm); }}>{showForm ? "Close" : "+ Add employee"}</button></section>
      {showForm && <section className="panel"><div className="panel-heading"><div><h2>{editingId ? "Edit employee" : "Add employee"}</h2><p>{editingId ? "Update employee details." : "Create a new employee record."}</p></div></div>
        <form onSubmit={save} className="employee-form">{[["name","Full name","e.g. Priya Sharma"],["role","Role","e.g. Product Designer"],["location","Location","e.g. Bengaluru"],["domain","Domain","e.g. Design"]].map(([name,label,placeholder]) => <label key={name}>{label}<input name={name} placeholder={placeholder} value={form[name]} onChange={change} required /></label>)}<label>Working status<select name="working" value={form.working} onChange={change}><option>Working</option><option>Not working</option></select></label><div className="form-actions"><button className="primary">{editingId ? "Save changes" : "Add employee"}</button>{editingId && <button className="secondary" type="button" onClick={cancel}>Cancel</button>}</div></form>{error && <p className="error">{error}</p>}
      </section>}
      <section className="panel table-panel"><div className="table-heading"><div><h2>All employees</h2><p>{visibleEmployees.length} of {employees.length} employees shown</p></div></div><div className="table-wrap"><table><thead><tr><th>ID</th><th>Name</th><th>Role</th><th>Location</th><th>Domain</th><th>Working</th><th>Actions</th></tr></thead><tbody>{visibleEmployees.map(e => <tr key={e.id}><td className="id-cell">#{String(e.id).padStart(3,"0")}</td><td className="name-cell">{e.name}</td><td>{e.role}</td><td>{e.location}</td><td>{e.domain}</td><td><span className={`status ${e.working === "Working" ? "active" : "inactive"}`}><i/>{e.working}</span></td><td className="actions"><button onClick={() => edit(e)}>Edit</button><button className="delete" onClick={() => remove(e.id)}>Delete</button></td></tr>)}</tbody></table></div></section>
    </main></div>;
}
