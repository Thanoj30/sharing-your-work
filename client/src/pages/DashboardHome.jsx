import { useOutletContext } from 'react-router-dom';

function DashboardHome() {
  const { user } = useOutletContext();

  return (
    <div className="space-y-6">
      <section>
        <p className="text-sm font-semibold uppercase text-teal-700">Overview</p>
        <h2 className="mt-1 text-3xl font-bold tracking-normal text-slate-950">Dashboard</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Welcome back, {user?.name}. Track your account and jump into help-sharing sections from the sidebar.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-slate-500">Help count</p>
          <p className="mt-3 text-4xl font-bold text-teal-700">{user?.helpCount ?? 0}</p>
        </article>
        <article className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-slate-500">Parcel requests</p>
          <p className="mt-3 text-4xl font-bold text-slate-950">0</p>
        </article>
        <article className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-slate-500">Grocery requests</p>
          <p className="mt-3 text-4xl font-bold text-slate-950">0</p>
        </article>
      </section>

      <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h3 className="text-xl font-bold text-slate-950">Account</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-md border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-500">Email</p>
            <p className="mt-1 break-words text-slate-800">{user?.email}</p>
          </div>
          <div className="rounded-md border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-500">Phone</p>
            <p className="mt-1 text-slate-800">{user?.contactInfo?.phone || 'Not provided'}</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default DashboardHome;

