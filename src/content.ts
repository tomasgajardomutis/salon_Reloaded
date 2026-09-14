export interface ServiceItem {
  number: string;
  title: string;
  text: string;
}

export interface GalleryItem {
  title: string;
  label: string;
  className: string;
  imageUrl: string;
}

export interface ReviewItem {
  text: string;
  name: string;
}

export interface SiteContent {
  heroLead: string;
  introTitle: string;
  introText: string;
  addressLine1: string;
  addressLine2: string;
  weekdayHours: string;
  saturdayHours: string;
  services: ServiceItem[];
  gallery: GalleryItem[];
  reviews: ReviewItem[];
}

export const defaultContent: SiteContent = {
  heroLead: 'Cabello, manicure, cejas y pestañas con atención cercana, asesoría profesional y resultados pensados para ti.',
  introTitle: 'Tu cambio parte con una buena conversación.',
  introText: 'Escuchamos lo que buscas, observamos lo que te favorece y construimos un resultado coherente con tu estilo. Nuestro foco no es solo que salgas distinta: es que salgas sintiéndote mejor contigo.',
  addressLine1: 'Av. Irarrázaval 3601, Local 28',
  addressLine2: 'Edificio Acuario · Ñuñoa, Santiago',
  weekdayHours: '10:00 — 19:00',
  saturdayHours: '10:00 — 16:00',
  services: [
    { number: '01', title: 'Cabello', text: 'Corte, coloración personalizada, balayage, tratamientos de hidratación, peinados y cambios de look.' },
    { number: '02', title: 'Manicure', text: 'Manicure y cuidado de manos con terminaciones prolijas para un resultado elegante y duradero.' },
    { number: '03', title: 'Cejas', text: 'Diseño y definición para equilibrar tus facciones y potenciar una mirada naturalmente armónica.' },
    { number: '04', title: 'Pestañas', text: 'Servicios para realzar la mirada con un acabado cuidado, femenino y adaptado a tu estilo.' },
  ],
  gallery: [
    { title: 'Color & dimensión', label: 'Cabello', className: 'gallery-a', imageUrl: '' },
    { title: 'Cambios de look', label: 'Transformaciones', className: 'gallery-b', imageUrl: '' },
    { title: 'Detalles impecables', label: 'Manicure', className: 'gallery-c', imageUrl: '' },
    { title: 'Miradas que destacan', label: 'Cejas & pestañas', className: 'gallery-d', imageUrl: '' },
    { title: 'Brillo & cuidado', label: 'Tratamientos', className: 'gallery-e', imageUrl: '' },
    { title: 'Tu mejor versión', label: 'Imagen Reloaded', className: 'gallery-f', imageUrl: '' },
  ],
  reviews: [],
};
