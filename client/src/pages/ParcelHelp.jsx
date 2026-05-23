import { useEffect, useState } from 'react';
import {
  createParcelHelperActivity,
  getActiveParcelHelpers
} from '../services/api.js';

function ParcelHelp() {
  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: ''
  });
  const [helpers, setHelpers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadHelpers = async () => {
    try {
      const response = await getActiveParcelHelpers();
      setHelpers(response.data.activities);
    } catch (_error) {
      setError('Could not load active parcel helpers.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHelpers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    try {
      const response = await createParcelHelperActivity(formData);
      setHelpers((currentHelpers) => [response.data.activity, ...currentHelpers]);
      setFormData({ fromLocation: '', toLocation: '' });
      setSuccess('You are now active as a parcel helper.');
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Could not create parcel helper activity.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-7">
      <section>
        <p className="text-sm font-semibold uppercase text-teal-700">Parcel Help</p>
        <h2 className="mt-1 text-3xl font-bold text-slate-950">Become an active parcel helper</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Share your travel route so nearby community members can ask for help with parcel delivery.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <form
          className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200"
          onSubmit={handleSubmit}
        >
          <h3 className="text-xl font-bold text-slate-950">Your parcel route</h3>

          {error && (
            <div className="mt-5 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-md border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-800">
              {success}
            </div>
          )}

          <div className="mt-5 space-y-5">
            <label className="block">
              <span className="text-sm font-medium text-slate-700">From Location</span>
              <input
                className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                name="fromLocation"
                type="text"
                value={formData.fromLocation}
                onChange={handleChange}
                placeholder="Example: College Gate"
                required
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-slate-700">To Location</span>
              <input
                className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
                name="toLocation"
                type="text"
                value={formData.toLocation}
                onChange={handleChange}
                placeholder="Example: City Mall"
                required
              />
            </label>

            <button
              className="w-full rounded-md bg-teal-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-slate-400"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Become Active Parcel Helper'}
            </button>
          </div>
        </form>

        <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-950">Active parcel helpers</h3>
              <p className="mt-1 text-sm text-slate-600">
                People currently available to help with parcel delivery.
              </p>
            </div>
            <p className="text-sm font-semibold text-teal-700">{helpers.length} active</p>
          </div>

          {isLoading ? (
            <p className="mt-8 text-sm text-slate-600">Loading active helpers...</p>
          ) : helpers.length === 0 ? (
            <div className="mt-8 rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <p className="font-semibold text-slate-900">No active parcel helpers yet</p>
              <p className="mt-2 text-sm text-slate-600">Create the first active route using the form.</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {helpers.map((activity) => (
                <article
                  className="rounded-lg border border-slate-200 bg-slate-50 p-5"
                  key={activity.id}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-slate-950">{activity.helper.name}</h4>
                      <p className="mt-1 text-sm text-slate-500">
                        Help count: {activity.helper.helpCount}
                      </p>
                    </div>
                    <button
                      className="rounded-md border border-teal-700 px-3 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-700 hover:text-white"
                      type="button"
                    >
                      Message
                    </button>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <div className="rounded-md bg-white p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-semibold uppercase text-slate-500">From</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {activity.fromLocation}
                      </p>
                    </div>
                    <div className="rounded-md bg-white p-4 ring-1 ring-slate-200">
                      <p className="text-xs font-semibold uppercase text-slate-500">To</p>
                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {activity.toLocation}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </section>
    </div>
  );
}

export default ParcelHelp;
