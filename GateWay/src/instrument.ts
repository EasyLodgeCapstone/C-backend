// instrument.ts
import * as Sentry from '@sentry/nestjs';
import { nodeProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: 'https://248e1dd10f17082f65376333eac2d944@o4510988121407488.ingest.us.sentry.io/4512069097881600',
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
  profileSessionSampleRate: 1.0,
  profileLifecycle: 'trace',
  dataCollection: {
    // userInfo: false,
    // httpBodies: [],
  },
});

Sentry.startSpan({ name: 'My Span' }, () => {
  // profiled code
});
