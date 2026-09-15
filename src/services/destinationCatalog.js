import destinationService from '../api/destinationService';
import { destinations as mockDestinations } from '../data/mockData';
import { extraReservationCities } from '../data/reservationCities';
import { resolveMediaUrl } from '../utils/mediaUrl';

const EXTRA_DESTINATION_PREFIX = 'extra:';

export function isExtraDestinationId(id) {
  return id != null && String(id).startsWith(EXTRA_DESTINATION_PREFIX);
}

function normalizeCityKey(city) {
  return city?.trim().toLowerCase() ?? '';
}

function extraDestinationId(city) {
  const slug = normalizeCityKey(city)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `${EXTRA_DESTINATION_PREFIX}${slug}`;
}

function mockExtrasByCity(city) {
  if (!city) return null;
  const key = city.trim().toLowerCase();
  return (
    mockDestinations.find((m) => m.city?.toLowerCase() === key) ||
    mockDestinations.find((m) => m.name?.toLowerCase().includes(key))
  );
}

function hasApiImage(apiRow) {
  return Boolean(apiRow?.imageUrl?.trim());
}

/** Fusionne les champs riches du mock (galerie, highlights…) avec une ligne API. */
export function enrichDestination(apiRow) {
  const extras = mockExtrasByCity(apiRow.city) || {};
  const priceFrom =
    apiRow.priceFrom != null
      ? Number(apiRow.priceFrom)
      : extras.priceFrom ?? 0;
  const imageUrl = hasApiImage(apiRow) ? resolveMediaUrl(apiRow.imageUrl) : '';

  return {
    ...extras,
    ...apiRow,
    id: apiRow.id,
    name: apiRow.name ?? extras.name,
    description: apiRow.description ?? extras.description,
    longDescription: extras.longDescription || apiRow.description,
    country: apiRow.country ?? extras.country,
    city: apiRow.city ?? extras.city,
    imageUrl,
    priceFrom,
    rating: apiRow.rating ?? extras.rating ?? 0,
    featured: apiRow.featured ?? extras.featured ?? false,
    highlights: hasApiImage(apiRow) ? extras.highlights || [] : [],
    gallery: hasApiImage(apiRow)
      ? extras.gallery?.length
        ? extras.gallery.map(resolveMediaUrl)
        : [resolveMediaUrl(apiRow.imageUrl)]
      : [],
    bestSeason: extras.bestSeason,
    durationSuggestion: extras.durationSuggestion,
  };
}

export async function fetchDestinationsCatalog({ featured } = {}) {
  try {
    const { data } = await destinationService.getAll(featured);
    const list = Array.isArray(data) ? data : [];
    return list.map(enrichDestination);
  } catch {
    if (featured) {
      return mockDestinations.filter((d) => d.featured);
    }
    return [...mockDestinations];
  }
}

export async function fetchDestinationById(id) {
  if (isExtraDestinationId(id)) {
    return null;
  }
  try {
    const { data } = await destinationService.getById(id);
    return enrichDestination(data);
  } catch {
    return mockDestinations.find((d) => d.id === Number(id)) || null;
  }
}

/** Catalogue API + villes supplémentaires pour le formulaire de réservation. */
export async function fetchReservationDestinations() {
  const catalog = await fetchDestinationsCatalog();
  const seen = new Set(catalog.map((d) => normalizeCityKey(d.city)));

  const extras = extraReservationCities
    .filter((c) => !seen.has(normalizeCityKey(c.city)))
    .map((c) => ({
      id: extraDestinationId(c.city),
      name: `${c.city}, ${c.country}`,
      city: c.city,
      country: c.country,
      imageUrl: '',
      priceFrom: c.priceFrom ?? 0,
      isExtraCity: true,
    }));

  return [
    ...catalog.map((d) => ({ ...d, isExtraCity: false })),
    ...extras,
  ].sort((a, b) => a.name.localeCompare(b.name, 'fr'));
}
