import { useAuth } from "../auth/useAuth.js";

// Top bar shared by every screen: app name, menu, signed-in user.
export default function AppHeader({ pages, current, onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <header className="app-header">
      <div className="header-left">
        <h1>StudentHub</h1>
        <nav className="main-nav" aria-label="Main">
          {pages.map((p) => (
            <button
              key={p.id}
              type="button"
              className={p.id === current ? "nav-link active" : "nav-link"}
              aria-current={p.id === current ? "page" : undefined}
              onClick={() => onNavigate(p.id)}
            >
              {p.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="header-user">
        <span>
          {user?.username} <span className="badge">{user?.role}</span>
        </span>
        <button type="button" className="btn btn-small btn-secondary" onClick={() => logout()}>
          Sign out
        </button>
      </div>
    </header>
  );
}
