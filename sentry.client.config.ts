import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://2e94b4e9eb8a6eaa8b724dffdd357522@o4510814265606144.ingest.us.sentry.io/4510852449697792",
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration(),
  ],
});
