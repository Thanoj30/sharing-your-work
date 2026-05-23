import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import handshakeBackground from '../assets/handshake.png';
import { registerUser } from '../services/api.js';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profileImage: '',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

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
    setIsSubmitting(true);

    try {
      const response = await registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        profileImage: formData.profileImage,
        contactInfo: {
          phone: formData.phone,
          address: formData.address
        }
      });

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/dashboard', { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 bg-cover bg-center px-4 py-10 text-white"
      style={{ backgroundImage: `url(${handshakeBackground})` }}
    >
      <div className="absolute inset-0 -z-10 bg-slate-950/70" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950/80 via-slate-900/45 to-teal-950/70" />

      <section className="w-full max-w-2xl rounded-lg border border-white/25 bg-white/15 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl sm:p-8">
        <h1 className="text-3xl font-bold text-white sm:text-4xl">Sharing Your Work</h1>
        <p className="mt-3 text-sm leading-6 text-slate-100">
          Helping People Through Shared Travel & Community Support
        </p>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-teal-100">Register</p>

        {error && (
          <div className="mt-6 rounded-md border border-red-200/70 bg-red-50/95 px-4 py-3 text-sm text-red-700 shadow-sm">
            {error}
          </div>
        )}

        <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-slate-100">Name</span>
            <input
              className="mt-2 w-full rounded-md border border-white/50 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-teal-300 focus:bg-white focus:ring-2 focus:ring-teal-200/70"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-100">Email</span>
            <input
              className="mt-2 w-full rounded-md border border-white/50 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-teal-300 focus:bg-white focus:ring-2 focus:ring-teal-200/70"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-100">Password</span>
            <input
              className="mt-2 w-full rounded-md border border-white/50 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-teal-300 focus:bg-white focus:ring-2 focus:ring-teal-200/70"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              minLength="6"
              required
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-100">Profile image URL</span>
            <input
              className="mt-2 w-full rounded-md border border-white/50 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-teal-300 focus:bg-white focus:ring-2 focus:ring-teal-200/70"
              name="profileImage"
              type="url"
              value={formData.profileImage}
              onChange={handleChange}
              placeholder="Optional"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-100">Phone</span>
            <input
              className="mt-2 w-full rounded-md border border-white/50 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-teal-300 focus:bg-white focus:ring-2 focus:ring-teal-200/70"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Optional"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-slate-100">Address</span>
            <input
              className="mt-2 w-full rounded-md border border-white/50 bg-white/90 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-500 focus:border-teal-300 focus:bg-white focus:ring-2 focus:ring-teal-200/70"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              placeholder="Optional"
            />
          </label>

          <button
            className="rounded-md bg-teal-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-950/30 transition hover:bg-teal-400 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none sm:col-span-2"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-100">
          Already have an account?{' '}
          <Link className="font-semibold text-teal-100 underline decoration-teal-200/60 underline-offset-4 hover:text-white" to="/login">
            Login
          </Link>
        </p>
      </section>
    </main>
  );
}

export default Register;
