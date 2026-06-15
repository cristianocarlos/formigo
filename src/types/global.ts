import type {getBrowserInfo} from '@/utils/globals';

declare global {
  interface Window {
    formigoBrowserInfo: ReturnType<typeof getBrowserInfo>;
    turnstile: Turnstile.Turnstile;
  }
}
