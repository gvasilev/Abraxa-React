import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReExtLoaderFunction, Fill, ReExtProvider } from '@gusmano/reext';
import { Auth0Provider } from '@auth0/auth0-react';
import mixpanel from 'mixpanel-browser';
import moment from 'moment';
import 'moment-timezone';
import numeral from 'numeral';
import UserMention from './helpers/mention/Mention';
import WebViewer from '@pdftron/webviewer';
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://420c7834aeca214d484bed6572ebcfe2@o233857.ingest.us.sentry.io/4507377588436992",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^http:\/\/live\.abx-internal\.com\/server\/api/],
  // Session Replay
  replaysSessionSampleRate: 0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

// Initialize Mixpanel
mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
    "api_host": import.meta.env.VITE_MIXPANEL_API_HOST,
    batch_requests: true
});

// Declare global variables
window.moment = moment;
window.mixpanel = mixpanel;
window.numeral = numeral;
window.Mention = UserMention;
window.WebViewer = WebViewer;

(async () => {
    Fill();
    const { default: ReExtData } = await import('./ReExtData');
    window.Env = await import('./env');
    await ReExtLoaderFunction(ReExtData);
    const { default: App } = await import('./App');

    window.root = ReactDOM.createRoot(document.getElementById('root')).render(
        <Auth0Provider
            domain={import.meta.env.VITE_AUTH0_DOMAIN}
            clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
            audience={import.meta.env.VITE_AUTH0_AUDIENCE}
            // useRefreshTokens="true"
            authorizationParams={{
                redirect_uri: window.location.href,
            }}
        >
            <ReExtProvider splash={true} ReExtData={ReExtData}>
                <App />
            </ReExtProvider>
        </Auth0Provider>
    )
})();
