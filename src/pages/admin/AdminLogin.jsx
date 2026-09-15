import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { staffLogin } from '../../admin/services/staffAuthService';
import { images } from '../../data/images';
import './AdminLogin.css';

export default function AdminLogin() {
  const { applySession } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin/messages';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const auth = await staffLogin(email.trim(), password);
      applySession(auth);
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.status === 401 || err.response?.status === 403
          ? 'Email ou mot de passe incorrect'
          : 'Connexion impossible. Vérifiez que le serveur est démarré.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page admin-login">
      <div className="admin-login__wrap">
      <div className="admin-login__card">
        <img src={images.logo} alt="MAI Tourisme" className="admin-login__logo" />
        <h1>Espace personnel</h1>
        <p>Messages, réservations et catalogue destinations</p>
        <div className="admin-login__roles">
          <span className="admin-login__role">Admin</span>
          <span className="admin-login__role admin-login__role--orange">Manager</span>
        </div>

        {error && <p className="admin-login__error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@maitourism.ma"
            />
          </label>
          <label>
            Mot de passe
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
            />
          </label>
          <button type="submit" className="btn btn--primary btn--lg" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>

        <p className="admin-login__hint">
          Admin : <code>admin@maitourism.ma</code> / <code>MaiTourisme2025!</code> — Managers :{' '}
          <code>manager1@</code> / <code>manager2@maitourism.ma</code> / <code>Manager2025!</code>
        </p>
      </div>
      </div>
    </div>
  );
}
