import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Cookies from 'js-cookie';
import './preloader/Preloader';
import Preloader from './preloader/Preloader';
import TempView from './TempView';

const App = () => {
    const { isLoading, isAuthenticated, error, getIdTokenClaims, loginWithRedirect, logout } = useAuth0();
    const [isExtAppReady, setIsExtAppReady] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            // Fetch token and initialize ExtJS app once authenticated
            const initializeApp = async () => {
                try {
                    const tokenClaims = await getIdTokenClaims();
                    Cookies.set('token', tokenClaims.__raw);

                    // Initialize ExtJS application
                    Ext.application({
                        name: 'Abraxa',
                        viewport: {
                            controller: 'viewport',
                            viewModel: 'viewport',
                        },
                        defaultToken: 'dashboard',
                        stores: [
                            'View', // creates one global instance of the Menu store (Ext.getStore('Menu'))
                        ],
                        launch: function() {
                            // Call the login function which returns a Promise
                            Ext.Viewport.getController().loginUser().then(function() {
                                // Proceed with the rest of the launch process once the user is logged in
                                Ext.Viewport.getController().initAfterLogin();
                                setIsExtAppReady(true);
                            }).catch(function(error) {
                                // Handle login failure (show error message, redirect to login page, etc.)
                                console.error('Login failed:', error);
                            });

                            //KILL THIS ASAP!!!
                            Ext.Ajax.on(
                                'beforerequest',
                                function (conn, options, eOptions) {
                                    let routeHash = Ext.Viewport.getViewModel().get('routeHash'),
                                        object_id = null;
                                    if (routeHash == '#portcall') {
                                        object_id = 3;
                                    } else if (routeHash == '#inquiry') {
                                        object_id = 6;
                                    } else if (routeHash == '#company') {
                                        object_id = 2;
                                    }
                                    conn.setDefaultHeaders({
                                        'Object-Id': object_id,
                                        'Object-Meta-Id': Ext.getCmp('main-viewport')
                                            ? Ext.getCmp('main-viewport').getViewModel().get('object_meta_id')
                                            : null,
                                    });
                                },
                                this
                            );
                        },
                    });
                } catch (error) {
                    console.error('Token fetching failed:', error);
                }
            };

            initializeApp();
        }
    }, [isAuthenticated, getIdTokenClaims]);

    const handleLogout = () => {
        logout({ returnTo: window.location.origin });
    };

    if (isLoading) {
        return <Preloader />;
    }

    if (error) {
        return <div>Oops... {error.message}</div>;
    }

    if (!isAuthenticated) {
        loginWithRedirect();
        return null; // Don't render anything while redirecting to login
    }

    if (isAuthenticated && isExtAppReady) {
        return (
            <div
                style={{
                    boxSizing: 'border-box',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                <TempView />
                <button id="logoutButton" onClick={handleLogout} style={{ display: 'none' }}>
                    Logout
                </button>
            </div>
        );
    }

    return <Preloader />; // Return null while waiting for ExtJS app to be ready
};
export default App;
