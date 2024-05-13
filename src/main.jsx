import React from 'react';
import ReactDOM from 'react-dom/client';
import { ReExtLoaderFunction, Fill, ReExtProvider } from '@gusmano/reext';
import { Auth0Provider } from '@auth0/auth0-react';
import mixpanel from 'mixpanel-browser';
import moment from 'moment';

// Import CSS
import './index.css';
import '../styles/1.css';
import '../styles/2.css';
import '../styles/3.css';
import '../styles/4.css';

// Initialize Mixpanel
mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
    "api_host": import.meta.env.VITE_MIXPANEL_API_HOST,
    batch_requests: true
});

// Declare global variables
window.moment = moment;
window.mixpanel = mixpanel;

(async () => {
    Fill();
    const { default: ReExtData } = await import('./ReExtData');
    window.Env = await import('./env');
    await ReExtLoaderFunction(ReExtData);
    const { default: App } = await import('./App');

    //Adding ExtJS application launch as there is no Ext.Vieport otherwise
    Ext.application({
        name: 'Abraxa',
        viewport: {
            controller: 'viewport',
            viewModel: 'viewport',
        },
        stores: [
            'View', // creates one global instance of the Menu store (Ext.getStore('Menu'))
        ],
        launch: function() {
            Ext.Viewport.getController().loginUser();
        }
    });

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
