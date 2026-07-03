import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);
      localStorage.setItem('token', res.data.token);
      navigate('/admin');
    } catch (err) {
      setError('Sai email hoặc mật khẩu');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="bg-surface p-8 rounded-xl shadow-md max-w-md w-full border border-outline-variant">
        <h1 className="text-2xl font-bold mb-6 text-center">Đăng nhập Admin</h1>
        {error && <p className="text-error mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-label-bold mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border p-2 rounded" required />
          </div>
          <div className="mb-6">
            <label className="block font-label-bold mb-1">Mật khẩu</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border p-2 rounded" required />
          </div>
          <button type="submit" className="w-full bg-secondary-fixed text-on-secondary-fixed py-2 rounded font-bold hover:opacity-90 transition">Đăng nhập</button>
        </form>
      </div>
    </div>
  );
};

export default Login;