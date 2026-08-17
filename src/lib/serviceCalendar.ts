export type SundayService = {
  value: string;
  day: string;
  date: string;
  serviceType: string;
};

export function classifySundayService(date: Date): string {
  if (date.getDate() <= 7) return 'Celebration & Communion Service';

  const nextSunday = new Date(date);
  nextSunday.setDate(date.getDate() + 7);
  if (nextSunday.getMonth() !== date.getMonth()) {
    return 'Supernatural Service';
  }
  return 'Gaining Wisdom Service';
}

export function getUpcomingSundayServices(
  from = new Date(),
  count = 4
): SundayService[] {
  const formatter = new Intl.DateTimeFormat('en-NG', {
    month: 'short',
    day: 'numeric',
  });
  const cursor = new Date(from);
  cursor.setHours(12, 0, 0, 0);
  cursor.setDate(cursor.getDate() + ((7 - cursor.getDay()) % 7));

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(cursor);
    date.setDate(cursor.getDate() + index * 7);
    return {
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`,
      day: index === 0 ? 'Next Sunday' : 'Sunday',
      date: formatter.format(date),
      serviceType: classifySundayService(date),
    };
  });
}
