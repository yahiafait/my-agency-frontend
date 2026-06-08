/**
 * Icônes SVG pour la section « Nos services » (page À propos).
 * Style stroke moderne — ordre aligné sur translations.about.services (FR/EN).
 */

function SvgBase({ className, children }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {children}
    </svg>
  );
}

/** Billetterie aérienne */
export function IconAirTicket({ className }) {
  return (
    <SvgBase className={className}>
      <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21 4 19 4s-3 2-3.5 3.5L12 11 3.8 9.2c-.5-.1-.9.4-.7.9l1.6 4.8c.2.5.7.7 1.1.5L12 14l-2.3 6.3c-.2.5.2 1 .7.9l4.8-1.6c.5-.2.7-.7.5-1.1L12 14l6.8 2.3c.5.2 1-.2.9-.7l-1.6-4.8" />
    </SvgBase>
  );
}

/** Billetterie ferroviaire */
export function IconTrainTicket({ className }) {
  return (
    <SvgBase className={className}>
      <rect x="4" y="3" width="16" height="14" rx="2" />
      <path d="M4 11h16" />
      <circle cx="8" cy="15" r="1.25" fill="currentColor" stroke="none" />
      <circle cx="16" cy="15" r="1.25" fill="currentColor" stroke="none" />
      <path d="M8 19v2M16 19v2" />
    </SvgBase>
  );
}

/** Hôtels et hébergements */
export function IconHotel({ className }) {
  return (
    <SvgBase className={className}>
      <path d="M3 21V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v16" />
      <path d="M3 10h18M7 14h2M11 14h2M15 14h2M7 6h2M11 6h2M15 6h2" />
    </SvgBase>
  );
}

/** Voyages organisés */
export function IconOrganisedTrip({ className }) {
  return (
    <SvgBase className={className}>
      <circle cx="9" cy="7" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 21v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1" />
      <path d="M14 21v-1a4 4 0 0 1 4-4h.5" />
    </SvgBase>
  );
}

/** Circuits sur mesure */
export function IconCustomTour({ className }) {
  return (
    <SvgBase className={className}>
      <path d="M12 21s6-4.35 6-10a6 6 0 0 0-12 0c0 5.65 6 10 6 10z" />
      <circle cx="12" cy="11" r="2" />
      <path d="M12 2v2M4.2 4.2l1.4 1.4M2 12h2M19.8 4.2l-1.4 1.4M22 12h-2" />
    </SvgBase>
  );
}

/** Voyages d'affaires */
export function IconBusinessTravel({ className }) {
  return (
    <SvgBase className={className}>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
      <path d="M12 12v2M10 13h4" />
    </SvgBase>
  );
}

/** Congrès, séminaires, événementiel */
export function IconEvents({ className }) {
  return (
    <SvgBase className={className}>
      <path d="M4 5h16v14H4z" />
      <path d="M8 3v4M16 3v4M4 10h16" />
      <path d="M8 14h3M8 17h6" />
      <path d="M15 14l2 2 3-4" />
    </SvgBase>
  );
}

/** Hadj et Omra */
export function IconPilgrimage({ className }) {
  return (
    <SvgBase className={className}>
      <path d="M12 3v3" />
      <path d="M9 6h6l-1.2 13H10.2L9 6z" />
      <path d="M7.5 10h9M8 14h8M8.5 18h7" />
      <path d="M5 8l2 1M19 8l-2 1" />
    </SvgBase>
  );
}

/** Visa et formalités */
export function IconVisa({ className }) {
  return (
    <SvgBase className={className}>
      <rect x="5" y="2" width="14" height="20" rx="2" />
      <circle cx="12" cy="10" r="3" />
      <path d="M8 18c0-2.2 1.8-4 4-4s4 1.8 4 4" />
      <path d="M9 6h6" />
    </SvgBase>
  );
}

/** Location véhicules et transferts */
export function IconTransfer({ className }) {
  return (
    <SvgBase className={className}>
      <path d="M19 17h2v-5l-2.5-5H5L3 12v5h2" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
      <path d="M5 12h14M7 7h10" />
    </SvgBase>
  );
}

/** Ordre fixe = liste about.services (10 entrées) */
export const ABOUT_SERVICE_ICONS = [
  IconAirTicket,
  IconTrainTicket,
  IconHotel,
  IconOrganisedTrip,
  IconCustomTour,
  IconBusinessTravel,
  IconEvents,
  IconPilgrimage,
  IconVisa,
  IconTransfer,
];

export function AboutServiceIcon({ index, className }) {
  const Icon = ABOUT_SERVICE_ICONS[index] ?? IconCustomTour;
  return <Icon className={className} />;
}
