import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReExtLoaderFunction, Fill, ReExtProvider } from '@gusmano/reext';
import { Auth0Provider } from '@auth0/auth0-react';
import mixpanel from 'mixpanel-browser';
import moment from 'moment';
import 'moment-timezone';
import numeral from 'numeral';

// Initialize Mixpanel
mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
    "api_host": import.meta.env.VITE_MIXPANEL_API_HOST,
    batch_requests: true
});

// Declare global variables
window.moment = moment;
window.mixpanel = mixpanel;
window.numeral = numeral;

(async () => {
    Fill();
    const { default: ReExtData } = await import('./ReExtData');
    window.Env = await import('./env');
    await ReExtLoaderFunction(ReExtData);
    const { default: App } = await import('./App');

    ReactDOM.createRoot(document.getElementById('root')).render(
        <Auth0Provider
            domain={import.meta.env.VITE_AUTH0_DOMAIN}
            clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
            audience={import.meta.env.VITE_AUTH0_AUDIENCE}
            // useRefreshTokens="true"
            authorizationParams={{
                redirect_uri: window.location.origin,
            }}
        >
            <ReExtProvider splash={true} ReExtData={ReExtData}>
                <App />
            </ReExtProvider>
        </Auth0Provider>
    )
})();
