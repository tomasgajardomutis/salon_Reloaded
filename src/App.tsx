import { api } from '@appdeploy/client';
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Instagram,
  MapPin,
  Menu,
  Phone,
  Scissors,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import AdminPanel from './AdminPanel';
import { defaultContent, type SiteContent } from './content';

const phoneDisplay = '+56 9 5496 5835';
const whatsappUrl = 'https://wa.me/56954965835?text=Hola%20Imagen%20Reloaded%2C%20quiero%20agendar%20una%20hora.';
const instagramUrl = 'https://www.instagram.com/imagen_reloaded';
const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=Av.%20Irarr%C3%A1zaval%203601%2C%20Local%2028%2C%20%C3%91u%C3%B1oa%2C%20Chile';
const googleReviewsUrl = 'https://www.google.com/search?q=Sal%C3%B3n+Imagen+Reloaded+%C3%91u%C3%B1oa+rese%C3%B1as';

function mergeContent(stored: Partial<SiteContent> | null): SiteContent {
  if (!stored) return defaultContent;
  return {
    ...defaultContent,
    ...stored,
    services: Array.isArray(stored.services) && stored.services.length ? stored.services : defaultContent.services,
    gallery: Array.isArray(stored.gallery) && stored.gallery.length ? stored.gallery : defaultContent.gallery,
    reviews: Array.isArray(stored.reviews) ? stored.reviews : defaultContent.reviews,
  };
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [content, setContent] = useState<SiteContent>(defaultContent);

  useEffect(() => {
    api.get('/api/site-content')
      .then(response => setContent(mergeContent(response.data.content as Partial<SiteContent> | null)))
      .catch(() => setContent(defaultContent));
  }, []);

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#inicio" aria-label="Imagen Reloaded - inicio">
          <img src="./resources/logo.png" alt="Logo de Salón Imagen Reloaded" />
          <span><strong>Imagen</strong> Reloaded</span>
        </a>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Navegación principal">
          <a href="#servicios" onClick={() => setMenuOpen(false)}>Servicios</a>
          <a href="#galeria" onClick={() => setMenuOpen(false)}>Galería</a>
          <a href="#resenas" onClick={() => setMenuOpen(false)}>Reseñas</a>
          <a href="#visitanos" onClick={() => setMenuOpen(false)}>Visítanos</a>
          <a className="nav-cta" href={whatsappUrl} target="_blank" rel="noreferrer">Agendar hora</a>
        </nav>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-grain" />
          <div className="hero-copy">
            <p className="eyebrow"><Sparkles size={16} /> Salón de belleza en Ñuñoa</p>
            <h1>Especialistas en cambios que <em>elevan tu imagen.</em></h1>
            <p className="hero-lead">{content.heroLead}</p>
            <div className="hero-actions">
              <a className="button button-gold" href={whatsappUrl} target="_blank" rel="noreferrer">Quiero agendar <ArrowRight size={18} /></a>
              <a className="button button-ghost" href="#servicios">Ver servicios</a>
            </div>
            <div className="trust-row">
              <div><strong>Ñuñoa</strong><span><MapPin size={14} /> Irarrázaval 3601</span></div>
              <div><strong>6 días</strong><span><Clock3 size={14} /> Lun a sáb</span></div>
              <div><strong>Contacto directo</strong><span><Phone size={14} /> WhatsApp</span></div>
            </div>
          </div>
          <div className="hero-mark" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <img src="./resources/logo.png" alt="" />
          </div>
        </section>

        <section className="intro section-pad">
          <div className="section-kicker">Imagen Reloaded</div>
          <div className="intro-grid"><h2>{content.introTitle}</h2><p>{content.introText}</p></div>
        </section>

        <section className="services section-pad" id="servicios">
          <div className="section-heading">
            <div><div className="section-kicker">Nuestros servicios</div><h2>Todo lo que tu imagen necesita, en un solo lugar.</h2></div>
            <Scissors size={46} strokeWidth={1.2} />
          </div>
          <div className="service-grid">
            {content.services.map(service => (
              <article className="service-card" key={`${service.number}-${service.title}`}>
                <span>{service.number}</span><h3>{service.title}</h3><p>{service.text}</p>
                <a href={whatsappUrl} target="_blank" rel="noreferrer">Consultar disponibilidad <ArrowRight size={16} /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="gallery-section section-pad" id="galeria">
          <div className="section-heading light">
            <div><div className="section-kicker">Galería</div><h2>Resultados que hablan por sí solos.</h2></div>
            <a href={instagramUrl} target="_blank" rel="noreferrer" className="instagram-link"><Instagram size={18} /> @imagen_reloaded</a>
          </div>
          <div className="gallery-grid">
            {content.gallery.map(item => (
              <a className={`gallery-card ${item.className}`} href={instagramUrl} target="_blank" rel="noreferrer" key={`${item.className}-${item.title}`}>
                {item.imageUrl && <img className="gallery-photo" src={item.imageUrl} alt={`${item.label}: ${item.title}`} loading="lazy" />}
                <div className="gallery-shine" />
                <div><small>{item.label}</small><strong>{item.title}</strong></div>
                <Instagram size={20} />
              </a>
            ))}
          </div>
          <p className="gallery-note">La selección completa de trabajos reales y novedades está en nuestro Instagram.</p>
        </section>

        <section className="reviews section-pad" id="resenas">
          <div className="reviews-score">
            <Star size={42} />
            <div className="section-kicker">Reseñas</div>
            <h2 className="reviews-title">La confianza se construye servicio a servicio.</h2>
            <a className="reviews-link" href={googleReviewsUrl} target="_blank" rel="noreferrer">Ver opiniones en Google <ArrowRight size={16} /></a>
          </div>
          <div className="review-list">
            {content.reviews.length > 0 ? content.reviews.map((review, index) => (
              <blockquote key={`${review.name}-${index}`}><Star size={20} fill="currentColor" /><p>“{review.text}”</p><cite>{review.name}</cite></blockquote>
            )) : (
              <div className="reviews-empty"><p>Las reseñas destacadas se publicarán aquí una vez verificadas por el salón.</p><a href={googleReviewsUrl} target="_blank" rel="noreferrer">Consultar reseñas públicas en Google</a></div>
            )}
          </div>
        </section>

        <section className="visit section-pad" id="visitanos">
          <div className="visit-card">
            <div className="section-kicker">Ven a vernos</div>
            <h2>Estamos en el corazón de Ñuñoa.</h2>
            <p className="address">{content.addressLine1}<br />{content.addressLine2}</p>
            <div className="hours">
              <div><span>Lunes a viernes</span><strong>{content.weekdayHours}</strong></div>
              <div><span>Sábado</span><strong>{content.saturdayHours}</strong></div>
              <div><span>Domingo</span><strong>Cerrado</strong></div>
            </div>
            <div className="visit-actions">
              <a href={mapsUrl} target="_blank" rel="noreferrer"><MapPin size={18} /> Cómo llegar</a>
              <a href="tel:+56954965835"><Phone size={18} /> {phoneDisplay}</a>
            </div>
          </div>
          <div className="booking-card">
            <CalendarDays size={38} />
            <p className="eyebrow">Tu próximo cambio empieza aquí</p>
            <h2>Reserva tu hora.</h2>
            <p>Cuéntanos qué servicio buscas y te ayudamos a encontrar la mejor hora disponible.</p>
            <a className="button button-dark" href={whatsappUrl} target="_blank" rel="noreferrer">Agendar por WhatsApp <ArrowRight size={18} /></a>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand"><img src="./resources/logo.png" alt="Imagen Reloaded" /><p>Especialistas en cambios que elevan tu imagen.</p></div>
        <div><strong>Contacto</strong><a href="tel:+56954965835">{phoneDisplay}</a><a href={instagramUrl} target="_blank" rel="noreferrer">Instagram</a></div>
        <div><strong>Ubicación</strong><a href={mapsUrl} target="_blank" rel="noreferrer">{content.addressLine1}<br />Ñuñoa, Región Metropolitana</a><button className="footer-admin" onClick={() => setAdminOpen(true)}>Administrar sitio</button></div>
        <p className="copyright">© 2026 Imagen Reloaded. Todos los derechos reservados.</p>
      </footer>
      <a className="floating-book" href={whatsappUrl} target="_blank" rel="noreferrer"><span>Agendar</span><Phone size={20} /></a>
      {adminOpen && <AdminPanel content={content} onClose={() => setAdminOpen(false)} onSaved={setContent} />}
    </div>
  );
}

export default App;
