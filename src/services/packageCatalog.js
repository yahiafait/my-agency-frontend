import packageService from '../api/packageService';
import { packages as mockPackages } from '../data/mockData';
import { resolveMediaUrl } from '../utils/mediaUrl';

/** Normalise une ligne API pour les cartes forfait du site public. */
export function enrichPackage(apiRow) {
  const dest = apiRow.destination;
  const destinationId = dest?.id ?? apiRow.destinationId ?? null;

  return {
    id: apiRow.id,
    title: apiRow.title,
    description: apiRow.description,
    durationDays: apiRow.durationDays,
    price: Number(apiRow.price),
    imageUrl: resolveMediaUrl(apiRow.imageUrl || dest?.imageUrl || ''),
    featured: Boolean(apiRow.featured),
    destinationId: destinationId != null ? Number(destinationId) : null,
    destination: dest
      ? {
          city: dest.city,
          country: dest.country,
          name: dest.name,
          imageUrl: resolveMediaUrl(dest.imageUrl),
        }
      : null,
    hotelsCount: Array.isArray(apiRow.hotels) ? apiRow.hotels.length : 0,
  };
}

export async function fetchPackagesCatalog({ featured, destinationId } = {}) {
  const params = {};
  if (featured) params.featured = true;
  if (destinationId != null && destinationId !== '') {
    params.destinationId = Number(destinationId);
  }

  try {
    const { data } = await packageService.getAll(params);
    const list = Array.isArray(data) ? data : [];
    return list.map(enrichPackage);
  } catch {
    let fallback = [...mockPackages];
    if (featured) fallback = fallback.filter((p) => p.featured);
    if (destinationId != null && destinationId !== '') {
      const destNum = Number(destinationId);
      fallback = fallback.filter((p) => p.destinationId === destNum);
    }
    return fallback.map((p) => ({
      ...p,
      imageUrl: resolveMediaUrl(p.imageUrl),
    }));
  }
}

export async function fetchPackageById(id) {
  try {
    const { data } = await packageService.getById(id);
    return enrichPackage(data);
  } catch {
    const found = mockPackages.find((p) => p.id === Number(id));
    return found
      ? { ...found, imageUrl: resolveMediaUrl(found.imageUrl) }
      : null;
  }
}
