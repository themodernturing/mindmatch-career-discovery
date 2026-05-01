export const APP_ID = process.env.NEXT_PUBLIC_APP_ID ?? 'careerlens'

export const APP_CONFIG = APP_ID === 'mindmatch'
  ? {
      appName: 'MindMatch',
      requirePayment: false,
      enableGoogleAuth: true,
      showPaidRegistration: false,
      domain: 'mind-match-assessment-at.netlify.app',
    }
  : {
      appName: 'CareerLens',
      requirePayment: true,
      enableGoogleAuth: false,
      showPaidRegistration: true,
      domain: 'careerlens-at.netlify.app',
    }

// TEMPORARY — public feedback-testing mode for CareerLens.
// Allows unauthenticated users to take the full assessment without login or payment.
// Results are shown in-session only; no data is saved to the database.
// To enable: set NEXT_PUBLIC_ENABLE_PUBLIC_TEST_MODE=true in Netlify env vars and redeploy.
// To disable: remove that env var and redeploy. Delete this export when testing is done.
export const IS_PUBLIC_TEST_MODE =
  APP_ID === 'careerlens' &&
  process.env.NEXT_PUBLIC_ENABLE_PUBLIC_TEST_MODE === 'true'
