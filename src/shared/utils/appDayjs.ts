import dayjs, { type Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

const APP_TIMEZONE = import.meta.env.VITE_APP_TIMEZONE || 'Asia/Ho_Chi_Minh';

export const appDayJs = {
  timezone: APP_TIMEZONE,

  /**
   * Convert local time to UTC.
   *
   * Example:
   * 2026-09-26 14:00 VN
   * -> 2026-09-26T07:00:00.000Z
   */
  toUTC(value: Dayjs | string | Date): Dayjs {
    if (dayjs.isDayjs(value)) {
      return dayjs.tz(value.format('YYYY-MM-DD HH:mm:ss'), APP_TIMEZONE).utc();
    }
    return dayjs.tz(value, APP_TIMEZONE).utc();
  },

  /**
   * Convert UTC time to local time.
   *
   * Example:
   * 2026-09-26T07:00:00.000Z
   * -> 2026-09-26 14:00 VN
   */
  fromUTC(value: Dayjs | string | Date): Dayjs {
    return dayjs.utc(value).tz(APP_TIMEZONE);
  },

  /**
   * Convert local time to UTC ISO string
   * for sending to API.
   */
  toUTCISOString(value: Dayjs | string | Date): string {
    return this.toUTC(value).toISOString();
  },

  /**
   * Format UTC value for displaying in timezone.
   */
  formatVN(
    value?: Dayjs | string | Date | null,
    format = 'DD/MM/YYYY HH:mm:ss',
  ): string {
    if (!value) return '—';
    return this.fromUTC(value).format(format);
  },
};