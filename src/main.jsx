import React from 'react'
import ReactDOM from 'react-dom/client'
import { ReExtLoader, Fill } from '@gusmano/reext'
import {Auth0Provider} from '@auth0/auth0-react'


(async () => {
    Fill();
    const {default: ReExtData} = await import('./ReExtData')
    await ReExtLoader(ReExtData);
    // const auth0Domain = import.meta.env.AUTH0_DOMAIN;
    // console.log('auth0Domain', auth0Domain);
    // const auth0ClientId = import.meta.env.AUTH0_CLIENT_ID;
    const {default: App} = await import('./App');
    ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <Auth0Provider
                domain="secure.abraxa.com"
                clientId="OA9kkh9hzaOjOYYMadf8zLQVJjcslyyR"
                audience="https://abraxa.eu.auth0.com/api/v2/"
                authorizationParams={{
                    redirect_uri: window.location.origin,
                }}
            >
                <App />
            </Auth0Provider>
        </React.StrictMode>
    )
})();
