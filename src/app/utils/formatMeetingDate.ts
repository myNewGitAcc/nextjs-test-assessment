export function formatMeetingDate(
  isoDate: string,
  locale: Intl.LocalesArgument = 'en-US',
) {
  return new Date(isoDate).toLocaleDateString(locale);
}
