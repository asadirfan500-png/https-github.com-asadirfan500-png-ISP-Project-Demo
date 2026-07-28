/**
 * Caption-only hard gate. When a visual is attached, Claude must judge the image —
 * do not zero the review from caption text alone (a Citroën car photo can be
 * client-related even if the copy never says "Citroën").
 */

const CLIENT_MARKERS =
  /citro[eë]n|citroenuk|ë-?c[345]|c[345]\s*aircross|berlingo|Ami\b|@citroen|everyday\s*outsiders|manual\s*not\s*included|chevrons?/i;

const COMPETITOR_MARKERS =
  /\b(bmw|audi|mercedes|volkswagen|\bvw\b|toyota|ford|peugeot|renault|tesla|nissan|hyundai|\bkia\b|volvo|jaguar|land\s*rover|\bmini\b|honda|mazda|skoda|seat\b|cupra|porsche|ferrari|lamborghini)\b/i;

const AUTOMOTIVE_MARKERS =
  /\b(car|cars|vehicle|drive|driving|driver|ev\b|electric|boot|trunk|road\s*trip|motor|van\b|suv|hatch|mileage|charging|dealership|garage)\b/i;

export function looksClientRelated(caption: string): boolean {
  return CLIENT_MARKERS.test(caption);
}

export function captionNamesCompetitorOnly(caption: string): boolean {
  const text = caption.trim();
  if (!text) return false;
  return COMPETITOR_MARKERS.test(text) && !CLIENT_MARKERS.test(text);
}

/**
 * Hard-zero from caption alone only when there is no visual to inspect.
 * With an image/reel, relevance is decided by vision (car, logo, chevrons).
 */
export function isClearlyUnrelatedToClient(
  caption: string,
  options?: { hasVisual?: boolean },
): boolean {
  const text = caption.trim();
  const hasVisual = Boolean(options?.hasVisual);

  if (CLIENT_MARKERS.test(text)) return false;

  // Competitor named in copy with no Citroën mention — unrelated even with a visual
  if (captionNamesCompetitorOnly(text)) return true;

  // With a photo/reel, never invent "unrelated" from caption wording alone
  if (hasVisual) return false;

  if (!text) return true;

  // Caption-only reviews: long non-automotive copy with no client signal
  if (text.length >= 40 && !AUTOMOTIVE_MARKERS.test(text)) {
    return true;
  }

  return false;
}
