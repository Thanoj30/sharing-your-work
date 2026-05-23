import { useEffect, useState } from 'react';
import { getCurrentUser } from '../services/api.js';

function Profile() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getCurrentUser();
        setUser(response.data.user);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      } catch (_error) {
        setError('Could not load profile.');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (isLoading) {
    return <p className="text-sm text-slate-600">Loading profile...</p>;
  }

  return (
    <div className="space-y-7">
      <section>
        <p className="text-sm font-semibold uppercase text-teal-700">Profile</p>
        <h2 className="mt-1 text-3xl font-bold text-slate-950">{user?.name}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          View your account details and completed help count.
        </p>
      </section>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <section className="grid gap-5 md:grid-cols-3">
        <article className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-sm font-semibold text-slate-500">Help count</p>
          <p className="mt-3 text-4xl font-bold text-teal-700">{user?.helpCount ?? 0}</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            This increases when you mark a requested help task as completed.
          </p>
        </article>

        <article className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200 md:col-span-2">
          <h3 className="text-xl font-bold text-slate-950">Account details</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-md border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-500">Email</p>
              <p className="mt-1 break-words text-slate-800">{user?.email}</p>
            </div>
            <div className="rounded-md border border-slate-200 p-4">
              <p className="text-sm font-semibold text-slate-500">Phone</p>
              <p className="mt-1 text-slate-800">{user?.contactInfo?.phone || 'Not provided'}</p>
            </div>
            <div className="rounded-md border border-slate-200 p-4 sm:col-span-2">
              <p className="text-sm font-semibold text-slate-500">Address</p>
              <p className="mt-1 text-slate-800">{user?.contactInfo?.address || 'Not provided'}</p>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default Profile;

