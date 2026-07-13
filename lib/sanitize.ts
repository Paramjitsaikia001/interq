/**
 * Sanitizes markdown content by stripping `<script>` and `<iframe>` tags and their inner HTML.
 * This prevents Cross-Site Scripting (XSS) attacks in user-generated markdown.
 */
export function sanitizeMarkdown(content: string): string {
  if (!content) return '';
  
  let sanitized = content;
  
  // Strip <script>...</script> blocks
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Strip <iframe>...</iframe> blocks
  sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  
  // Strip any remaining standalone script/iframe openings/closings
  sanitized = sanitized.replace(/<\/?[^>]*script[^>]*>/gi, '');
  sanitized = sanitized.replace(/<\/?[^>]*iframe[^>]*>/gi, '');
  
  return sanitized;
}
