import destinationService from '../api/destinationService';
import { destinations as mockDestinations } from '../data/mockData';
import { resolveMediaUrl } from '../utils/mediaUrl';

function mockExtrasByCity(city) {
  if (!city) return null;
  const key = city.trim().toLowerCase();
  return (
    mockDestinations.find((m) => m.city?.toLowerCase() === key) ||
    mockDestinations.find((m) => m.name?.toLowerCase().includes(key))
  );
}

/** Fusionne les champs riches du mock (galerie, highlights…) avec une ligne API. */
export function enrichDestination(apiRow) {
  const extras = mockExtrasByCity(apiRow.city) || {};
  const priceFrom =
    apiRow.priceFrom != null
      ? Number(apiRow.priceFrom)
      : extras.priceFrom ?? 0;

  return {
    ...extras,
    ...apiRow,
    id: apiRow.id,
    name: apiRow.name ?? extras.name,
    description: apiRow.description ?? extras.description,
    longDescription: extras.longDescription || apiRow.description,
    country: apiRow.country ?? extras.country,
    city: apiRow.city ?? extras.city,
    imageUrl: resolveMediaUrl(apiRow.imageUrl || extras.imageUrl),
    priceFrom,
    rating: apiRow.rating ?? extras.rating ?? 0,
    featured: apiRow.featured ?? extras.featured ?? false,
    highlights: extras.highlights || [],
    gallery: extras.gallery?.length
      ? extras.gallery.map(resolveMediaUrl)
      : apiRow.imageUrl
        ? [resolveMediaUrl(apiRow.imageUrl)]
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
  try {
    const { data } = await destinationService.getById(id);
    return enrichDestination(data);
  } catch {
    return mockDestinations.find((d) => d.id === Number(id)) || null;
  }
}
