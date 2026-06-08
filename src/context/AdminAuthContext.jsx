import { createContext, useContext, useMemo, useState } from 'react';
import { TOKEN_STORAGE } from '../api/axiosClient';

const SESSION_KEY = 'mai_tourism_staff_session';

function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [session, setSession] = useState(readSession);

  const isStaff = Boolean(session?.token);
  const role = session?.role || null;
  const isAdmin = role === 'ADMIN';
  const isManager = role === 'MANAGER';

  const applySession = (auth) => {
    const next = {
      token: auth.token,
      role: auth.role,
      email: auth.email,
      firstName: auth.firstName,
      lastName: auth.lastName,
      userId: auth.userId,
    };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(next));
    sessionStorage.setItem(TOKEN_STORAGE, auth.token);
    setSession(next);
  };

  const logout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(TOKEN_STORAGE);
    setSession(null);
  };

  const value = useMemo(
    () => ({
      session,
      isStaff,
      isAdmin,
      isManager,
      role,
      applySession,
      logout,
      displayName:
        session?.firstName && session?.lastName
          ? `${session.firstName} ${session.lastName}`
          : session?.email || '',
    }),
    [session, isStaff, isAdmin, isManager, role]
  );

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
