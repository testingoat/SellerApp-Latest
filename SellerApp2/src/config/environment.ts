/**
 * ENVIRONMENT CONFIGURATION (Seller App)
 *
 * Uses APP_ENV to select between staging and production servers:
 * - APP_ENV=staging    → https://staging.goatgoat.tech
 * - APP_ENV=production → https://goatgoat.tech
 *
 * Default is STAGING to keep all builds safe during development.
 */

const environments = {
  staging: {
    // Staging via nginx proxy (same as customer app)
    API_BASE_URL: 'https://staging.goatgoat.tech',
    FCM_ENDPOINT: '/admin/fcm-management',
    DEBUG_MODE: true,
    ENVIRONMENT: 'staging',
  },
  production: {
    // Production via nginx proxy (same as customer app)
    API_BASE_URL: 'https://goatgoat.tech',
    FCM_ENDPOINT: '/admin/fcm-management',
    DEBUG_MODE: false,
    ENVIRONMENT: 'production',
  },
};

/**
 * ENVIRONMENT SELECTION
 *
 * APP_ENV is read from process.env (Metro / build env):
 * - 'production' → production config
 * - anything else (or missing) → staging config
 */

const appEnvFromProcess = (process.env.APP_ENV || '').toLowerCase();
const appEnv: 'staging' | 'production' =
  appEnvFromProcess === 'production' ? 'production' : 'staging';

const config = environments[appEnv];

console.log(`Seller Environment: ${config.ENVIRONMENT.toUpperCase()}`);
console.log(`Seller API Base URL: ${config.API_BASE_URL}`);

export default config;

