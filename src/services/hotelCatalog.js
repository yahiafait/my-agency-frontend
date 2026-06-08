import hotelService from '../api/hotelService';
import { hotels as mockHotels } from '../data/mockData';
import { resolveMediaUrl } from '../utils/mediaUrl';

function mockExtrasByCity(city) {
  if (!city) return null;
  const key = city.trim().toLowerCase();
  return mockHotels.find((h) => h.city?.toLowerCase() === key);
}

/** Normalise une ligne API pour les cartes hôtel du site public. */
export function enrichHotel(apiRow) {
  const extras = mockExtrasByCity(apiRow.city) || {};
  return {
    ...extras,
    ...apiRow,
    id: apiRow.id,
    name: apiRow.name ?? extras.name,
    description: apiRow.description ?? extras.description,
    city: apiRow.city ?? extras.city,
    country: apiRow.country ?? extras.country ?? 'Maroc',
    stars: apiRow.stars ?? extras.stars ?? 3,
    pricePerNight: Number(apiRow.pricePerNight ?? extras.pricePerNight ?? 0),
    imageUrl: resolveMediaUrl(apiRow.imageUrl || extras.imageUrl),
    featured: Boolean(apiRow.featured ?? extras.featured),
  };
}

export async function fetchHotelsCatalog({ featured } = {}) {
  try {
    const { data } = await hotelService.getAll(featured);
    const list = Array.isArray(data) ? data : [];
    return list.map(enrichHotel);
  } catch {
    if (featured) {
      return mockHotels.filter((h) => h.featured).map((h) => ({
        ...h,
        imageUrl: resolveMediaUrl(h.imageUrl),
      }));
    }
    return mockHotels.map((h) => ({
      ...h,
      imageUrl: resolveMediaUrl(h.imageUrl),
    }));
  }
}
