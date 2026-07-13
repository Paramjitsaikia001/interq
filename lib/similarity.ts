/**
 * Calculates the Jaccard similarity of two strings based on their character trigrams.
 * This mimics PostgreSQL's pg_trgm similarity() function.
 */
export function getTrigramSimilarity(str1: string, str2: string): number {
  const getTrigrams = (str: string) => {
    // Pad with two spaces at the front and one space at the end
    const s = `  ${str.toLowerCase()} `;
    const trigrams = new Set<string>();
    for (let i = 0; i < s.length - 2; i++) {
      trigrams.add(s.substring(i, i + 3));
    }
    return trigrams;
  };

  const t1 = getTrigrams(str1);
  const t2 = getTrigrams(str2);

  if (t1.size === 0 || t2.size === 0) return 0;

  let intersection = 0;
  for (const trigram of t1) {
    if (t2.has(trigram)) {
      intersection++;
    }
  }

  const union = t1.size + t2.size - intersection;
  if (union === 0) return 0;
  return intersection / union;
}
