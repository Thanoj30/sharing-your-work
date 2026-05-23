import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { getCurrentUser } from '../services/api.js';

const navigationItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Parcel Help', path: '/dashboard/parcel-help' },
  { label: 'Grocery Help', path: '/dashboard/grocery-help' },
  { label: 'Friends', path: '/dashboard/friends' },
  { label: 'Nearby Users', path: '/dashboard/nearby-users' },
  { label: 'Messages', path: '/dashboard/messages' },
  { label: 'Profile', path: '/dashboard/profile' },
  { label: 'Settings', path: '/dashboard/settings' }
];

function DashboardLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
      return;
    }

    const loadUser = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } catch (_error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login', { replace: true });
  };

  const linkClassName = ({ isActive }) => (
    [
      'block rounded-md px-4 py-3 text-sm font-semibold transition',
      isActive
        ? 'bg-teal-700 text-white shadow-sm'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
    ].join(' ')
  );

  if (isLoading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-100 px-4 text-slate-700">
        <p className="text-sm font-medium">Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 lg:flex">
      {isSidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-slate-950/40 lg:hidden"
          type="button"
          aria-label="Close sidebar"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={[
          'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 lg:static lg:translate-x-0',
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        ].join(' ')}
      >
        <div className="border-b border-slate-200 px-6 py-6">
          <p className="text-sm font-semibold uppercase text-teal-700">Sharing Your Work</p>
          <h1 className="mt-1 text-xl font-bold">Community Hub</h1>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-5">
          {navigationItems.map((item) => (
            <NavLink
              className={linkClassName}
              end={item.path === '/dashboard'}
              key={item.path}
              to={item.path}
              onClick={() => setIsSidebarOpen(false)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <div className="rounded-md bg-slate-50 p-4">
            <p className="text-sm font-bold text-slate-900">{user?.name}</p>
            <p className="mt-1 truncate text-xs text-slate-500">{user?.email}</p>
          </div>
          <button
            className="mt-3 w-full rounded-md border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-700 hover:text-teal-700"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </aside>

      <section className="min-w-0 flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase text-teal-700">Sharing Your Work</p>
              <p className="text-lg font-bold">Community Hub</p>
            </div>
            <button
              className="grid h-10 w-10 place-items-center rounded-md border border-slate-300"
              type="button"
              aria-label="Open sidebar"
              onClick={() => setIsSidebarOpen(true)}
            >
              <span className="space-y-1.5">
                <span className="block h-0.5 w-5 bg-slate-800" />
                <span className="block h-0.5 w-5 bg-slate-800" />
                <span className="block h-0.5 w-5 bg-slate-800" />
              </span>
            </button>
          </div>
        </header>

        <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8 lg:px-10 lg:py-8">
          <Outlet context={{ user }} />
        </div>
      </section>
    </main>
  );
}

export default DashboardLayout;
