export const LANGUAGES = {
  english: {
    code: 'en',
    name: 'English',
    nativeName: 'English'
  },
  hindi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिंदी'
  },
  telugu: {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు'
  }
} as const;

export type Language = keyof typeof LANGUAGES;

export const CROP_CATEGORIES = [
  'cereals',
  'pulses',
  'vegetables',
  'fruits',
  'spices',
  'cash_crops'
] as const;

export const DISEASE_SEVERITY_LEVELS = {
  low: { color: 'green', label: 'Low Risk' },
  medium: { color: 'yellow', label: 'Medium Risk' },
  high: { color: 'red', label: 'High Risk' },
  critical: { color: 'red', label: 'Critical' }
} as const;

export const WEATHER_ALERT_TYPES = {
  rain: { icon: 'cloud-rain', color: 'blue' },
  drought: { icon: 'sun', color: 'orange' },
  storm: { icon: 'cloud-lightning', color: 'purple' },
  hail: { icon: 'cloud-hail', color: 'gray' },
  frost: { icon: 'snowflake', color: 'cyan' }
} as const;

export const MARKET_TRENDS = {
  up: { icon: 'trending-up', color: 'green' },
  down: { icon: 'trending-down', color: 'red' },
  stable: { icon: 'minus', color: 'gray' }
} as const;
