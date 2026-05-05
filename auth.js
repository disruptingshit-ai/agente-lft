// auth.js — Sistema de permisos Agente LFT
// Importar en todas las páginas protegidas con: <script src="auth.js"></script>

const AUTH = {
  // Roles disponibles
  ROLES: {
    SUPERADMIN: 'superadmin',
    DESPACHO: 'despacho',
    ABOGADO: 'abogado'
  },

  // Páginas y los roles que pueden acceder
  PAGE_PERMISSIONS: {
    'dashboard-superadmin.html': ['superadmin'],
    'dashboard-despacho.html': ['superadmin', 'despacho'],
    'perfil-abogado.html': ['superadmin', 'abogado']
  },

  // Guardar sesión después del login
  saveSession(phone, rol) {
    sessionStorage.setItem('lft_phone', phone);
    sessionStorage.setItem('lft_rol', rol);
    sessionStorage.setItem('lft_ts', Date.now());
  },

  // Obtener sesión actual
  getSession() {
    const phone = sessionStorage.getItem('lft_phone');
    const rol = sessionStorage.getItem('lft_rol');
    const ts = sessionStorage.getItem('lft_ts');
    if (!phone || !rol || !ts) return null;
    // Sesión expira en 8 horas
    if (Date.now() - parseInt(ts) > 8 * 60 * 60 * 1000) {
      this.clearSession();
      return null;
    }
    return { phone, rol };
  },

  // Cerrar sesión
  clearSession() {
    sessionStorage.removeItem('lft_phone');
    sessionStorage.removeItem('lft_rol');
    sessionStorage.removeItem('lft_ts');
  },

  // Verificar si la página actual tiene permiso
  checkAccess() {
    const page = window.location.pathname.split('/').pop();
    const required = this.PAGE_PERMISSIONS[page];
    if (!required) return true; // página pública

    const session = this.getSession();
    if (!session) {
      window.location.href = 'login.html';
      return false;
    }

    if (!required.includes(session.rol)) {
      // Redirigir según el rol que tiene
      const redirects = {
        superadmin: 'dashboard-superadmin.html',
        despacho: 'dashboard-despacho.html',
        abogado: 'perfil-abogado.html'
      };
      window.location.href = redirects[session.rol] || 'login.html';
      return false;
    }

    return true;
  },

  // Redirigir al dashboard correcto según rol
  redirectByRole(rol) {
    const redirects = {
      superadmin: 'dashboard-superadmin.html',
      despacho: 'dashboard-despacho.html',
      abogado: 'perfil-abogado.html'
    };
    window.location.href = redirects[rol] || 'login.html';
  }
};

// Ejecutar verificación automáticamente al cargar (skip en login)
document.addEventListener('DOMContentLoaded', () => {
  if (!window.__skipAuthCheck) AUTH.checkAccess();
});
