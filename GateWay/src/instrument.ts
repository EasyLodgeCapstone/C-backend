// Import with `const Sentry = require("@sentry/nestjs");` if you are using CJS
import * as Sentry from 'node_modules/@sentry/nestjs/build/types';
import { nodeProfilingIntegration } from 'node_modules/@sentry/profiling-node/build/types';

Sentry.init({
  dsn: 'https://248e1dd10f17082f65376333eac2d944@o4510988121407488.ingest.us.sentry.io/4512069097881600',
  integrations: [nodeProfilingIntegration()],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set sampling rate for profiling - this is evaluated only once per SDK.init call
  profileSessionSampleRate: 1.0,
  // Trace lifecycle automatically enables profiling during active traces
  profileLifecycle: 'trace',
  dataCollection: {
    // To disable sending user data and HTTP bodies, uncomment the lines below. For more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/#dataCollection
    // userInfo: false,
    // httpBodies: [],
  },
});

// Profiling happens automatically after setting it up with `Sentry.init()`.
// All spans (unless those discarded by sampling) will have profiling data attached to them.
Sentry.startSpan(
  {
    name: 'My Span',
  },
  () => {
    // The code executed here will be profiled
  },
);
