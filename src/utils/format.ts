/**
 * 格式化日期为 YYYY-MM-DD（便于等宽字体对齐）
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 格式化中文长日期，如 2026年11月20日
 */
export function formatDateLong(date: Date): string {
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

/**
 * 根据中英混排正文字数估算阅读时间（分钟）
 */
export function estimateReadingMinutes(body: string | undefined): number {
  if (!body) return 1;
  const cleaned = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/[#>*_~\-\[\]()]/g, ' ');
  const chineseChars = (cleaned.match(/[\u4e00-\u9fa5]/g) || []).length;
  const englishWords = (cleaned.replace(/[\u4e00-\u9fa5]/g, ' ').match(/[A-Za-z0-9]+/g) || []).length;
  const minutes = Math.ceil(chineseChars / 320 + englishWords / 200);
  return Math.max(1, minutes);
}
