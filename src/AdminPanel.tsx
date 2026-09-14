import { api, auth } from '@appdeploy/client';
import { LogOut, Save, ShieldCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { SiteContent } from './content';

interface AdminPanelProps {
  content: SiteContent;
  onClose: () => void;
  onSaved: (content: SiteContent) => void;
}

type AuthState = 'checking' | 'signed_out' | 'authorized' | 'denied';

export default function AdminPanel({ content, onClose, onSaved }: AdminPanelProps) {
  const [draft, setDraft] = useState<SiteContent>(content);
  const [authState, setAuthState] = useState<AuthState>('checking');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  async function verifyAccess() {
    if (!auth.isSignedIn()) {
      setAuthState('signed_out');
      return;
    }
    try {
      await auth.getUser();
      await api.get('/api/admin/status');
      setAuthState('authorized');
    } catch {
      setAuthState('denied');
    }
  }

  useEffect(() => {
    void verifyAccess();
  }, []);

  async function signIn() {
    setMessage('');
    try {
      await auth.signIn({ scope: 'openid email profile offline_access' });
      await verifyAccess();
    } catch (err) {
      const code = (err as { code?: string }).code;
      setMessage(code === 'popup_blocked' ? 'Permite ventanas emergentes para iniciar sesión.' : 'No se pudo iniciar sesión. Inténtalo nuevamente.');
    }
  }

  async function signOut() {
    await auth.signOut();
    setAuthState('signed_out');
    setMessage('Sesión cerrada.');
  }

  async function save() {
    setSaving(true);
    setMessage('');
    try {
      const response = await api.put('/api/admin/site-content', { content: draft });
      const saved = response.data.content as SiteContent;
      onSaved(saved);
      setDraft(saved);
      setMessage('Cambios publicados correctamente.');
    } catch {
      setMessage('No se pudieron guardar los cambios. Revisa tu sesión e inténtalo de nuevo.');
    } finally {
      setSaving(false);
    }
  }

  function update<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setDraft(current => ({ ...current, [key]: value }));
  }

  return (
    <div className="admin-backdrop" role="dialog" aria-modal="true" aria-label="Administración del sitio">
      <div className="admin-panel">
        <div className="admin-header">
          <div>
            <span className="admin-kicker"><ShieldCheck size={15} /> Área privada</span>
            <h2>Administrar Imagen Reloaded</h2>
          </div>
          <button className="admin-icon-button" onClick={onClose} aria-label="Cerrar administración"><X /></button>
        </div>

        {authState === 'checking' && <div className="admin-state">Verificando sesión…</div>}

        {authState === 'signed_out' && (
          <div className="admin-state">
            <h3>Acceso de administrador</h3>
            <p>Inicia sesión con la cuenta autorizada para editar y publicar el contenido del sitio.</p>
            <button className="admin-primary" onClick={signIn}>Iniciar sesión</button>
            {message && <p className="admin-message">{message}</p>}
          </div>
        )}

        {authState === 'denied' && (
          <div className="admin-state">
            <h3>Cuenta sin permiso</h3>
            <p>Esta cuenta inició sesión correctamente, pero no está autorizada para administrar el sitio.</p>
            <button className="admin-secondary" onClick={signOut}>Cerrar sesión</button>
          </div>
        )}

        {authState === 'authorized' && (
          <>
            <div className="admin-toolbar">
              <span>Los cambios se publican al guardar.</span>
              <button className="admin-secondary" onClick={signOut}><LogOut size={16} /> Cerrar sesión</button>
            </div>

            <div className="admin-form">
              <section>
                <h3>Portada y presentación</h3>
                <label>Texto principal<textarea value={draft.heroLead} onChange={e => update('heroLead', e.target.value)} /></label>
                <label>Título de presentación<input value={draft.introTitle} onChange={e => update('introTitle', e.target.value)} /></label>
                <label>Descripción<textarea value={draft.introText} onChange={e => update('introText', e.target.value)} /></label>
              </section>

              <section>
                <h3>Servicios</h3>
                {draft.services.map((service, index) => (
                  <div className="admin-repeat" key={`${service.number}-${index}`}>
                    <label>Nombre<input value={service.title} onChange={e => update('services', draft.services.map((item, i) => i === index ? { ...item, title: e.target.value } : item))} /></label>
                    <label>Descripción<textarea value={service.text} onChange={e => update('services', draft.services.map((item, i) => i === index ? { ...item, text: e.target.value } : item))} /></label>
                  </div>
                ))}
              </section>

              <section>
                <h3>Galería</h3>
                <p className="admin-help">Puedes pegar una URL pública de imagen para cada tarjeta. Si la dejas vacía, se mantiene el tratamiento gráfico dorado.</p>
                {draft.gallery.map((item, index) => (
                  <div className="admin-repeat" key={`${item.className}-${index}`}>
                    <label>Título<input value={item.title} onChange={e => update('gallery', draft.gallery.map((galleryItem, i) => i === index ? { ...galleryItem, title: e.target.value } : galleryItem))} /></label>
                    <label>Categoría<input value={item.label} onChange={e => update('gallery', draft.gallery.map((galleryItem, i) => i === index ? { ...galleryItem, label: e.target.value } : galleryItem))} /></label>
                    <label>URL de imagen<input type="url" placeholder="https://..." value={item.imageUrl} onChange={e => update('gallery', draft.gallery.map((galleryItem, i) => i === index ? { ...galleryItem, imageUrl: e.target.value } : galleryItem))} /></label>
                  </div>
                ))}
              </section>

              <section>
                <h3>Reseñas destacadas</h3>
                <p className="admin-help">Agrega solo testimonios reales que tengas permiso de publicar.</p>
                {draft.reviews.map((review, index) => (
                  <div className="admin-repeat" key={index}>
                    <label>Reseña<textarea value={review.text} onChange={e => update('reviews', draft.reviews.map((item, i) => i === index ? { ...item, text: e.target.value } : item))} /></label>
                    <label>Nombre o fuente<input value={review.name} onChange={e => update('reviews', draft.reviews.map((item, i) => i === index ? { ...item, name: e.target.value } : item))} /></label>
                    <button className="admin-danger" onClick={() => update('reviews', draft.reviews.filter((_, i) => i !== index))}>Eliminar reseña</button>
                  </div>
                ))}
                <button className="admin-secondary" onClick={() => update('reviews', [...draft.reviews, { text: '', name: '' }])}>Agregar reseña</button>
              </section>

              <section>
                <h3>Ubicación y horarios</h3>
                <label>Dirección<input value={draft.addressLine1} onChange={e => update('addressLine1', e.target.value)} /></label>
                <label>Referencia<input value={draft.addressLine2} onChange={e => update('addressLine2', e.target.value)} /></label>
                <label>Lunes a viernes<input value={draft.weekdayHours} onChange={e => update('weekdayHours', e.target.value)} /></label>
                <label>Sábado<input value={draft.saturdayHours} onChange={e => update('saturdayHours', e.target.value)} /></label>
              </section>
            </div>

            <div className="admin-savebar">
              {message && <span className="admin-message">{message}</span>}
              <button className="admin-primary" onClick={save} disabled={saving}><Save size={17} /> {saving ? 'Guardando…' : 'Guardar y publicar'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
