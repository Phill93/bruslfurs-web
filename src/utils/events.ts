export type EventStatus = 'open' | 'full' | 'closed' | 'cancelled';

export interface DatedEvent {
  data: { start: Date; end: Date };
}

export function splitEvents<T extends DatedEvent>(events: T[], now = new Date()) {
  const upcoming = events
    .filter((event) => event.data.end.getTime() >= now.getTime())
    .sort((a, b) => a.data.start.getTime() - b.data.start.getTime());
  const past = events
    .filter((event) => event.data.end.getTime() < now.getTime())
    .sort((a, b) => b.data.start.getTime() - a.data.start.getTime());
  return { upcoming, past };
}

const dateFormatter = new Intl.DateTimeFormat('de-DE', {
  timeZone: 'Europe/Berlin',
  weekday: 'short',
  day: '2-digit',
  month: 'long',
  year: 'numeric',
});

const timeFormatter = new Intl.DateTimeFormat('de-DE', {
  timeZone: 'Europe/Berlin',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatEventDate(start: Date, end: Date) {
  const sameDay = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(start)
    === new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Berlin' }).format(end);
  if (sameDay) return `${dateFormatter.format(start)}, ${timeFormatter.format(start)}–${timeFormatter.format(end)} Uhr`;
  return `${dateFormatter.format(start)}, ${timeFormatter.format(start)} Uhr – ${dateFormatter.format(end)}, ${timeFormatter.format(end)} Uhr`;
}

export function formatDate(date: Date) {
  return dateFormatter.format(date);
}

export const statusLabels: Record<EventStatus, string> = {
  open: 'Anmeldung offen',
  full: 'Ausgebucht',
  closed: 'Anmeldung geschlossen',
  cancelled: 'Abgesagt',
};
