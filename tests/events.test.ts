import { describe, expect, it } from 'vitest';
import { splitEvents } from '../src/utils/events';

const event = (start: string, end: string) => ({ data: { start: new Date(start), end: new Date(end) } });

describe('splitEvents', () => {
  const now = new Date('2026-07-20T12:00:00+02:00');

  it('sortiert kommende Events aufsteigend', () => {
    const later = event('2026-09-01T10:00:00+02:00', '2026-09-01T12:00:00+02:00');
    const sooner = event('2026-08-01T10:00:00+02:00', '2026-08-01T12:00:00+02:00');
    expect(splitEvents([later, sooner], now).upcoming).toEqual([sooner, later]);
  });

  it('sortiert vergangene Events absteigend', () => {
    const older = event('2026-04-01T10:00:00+02:00', '2026-04-01T12:00:00+02:00');
    const newer = event('2026-06-01T10:00:00+02:00', '2026-06-01T12:00:00+02:00');
    expect(splitEvents([older, newer], now).past).toEqual([newer, older]);
  });

  it('behandelt ein laufendes Event als kommend', () => {
    const running = event('2026-07-20T10:00:00+02:00', '2026-07-20T14:00:00+02:00');
    expect(splitEvents([running], now).upcoming).toEqual([running]);
    expect(splitEvents([running], now).past).toEqual([]);
  });
});
