// Shared mobile breakpoint for JS-side layout decisions (matches the CSS media queries)
export const MOBILE_QUERY = '(max-width: 768px)';

// Compact page list: [1, '…', 4, 5, 6, '…', 20]. Keeps pagination narrow on phones.
export const getPageList = (current, total, siblings = 1) => {
  if (total <= 5 + siblings * 2) return Array.from({ length: total }, (_, i) => i + 1);

  const start = Math.max(2, current - siblings);
  const end = Math.min(total - 1, current + siblings);
  const pages = [1];
  if (start > 2) pages.push('…');
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push('…');
  pages.push(total);
  return pages;
};
