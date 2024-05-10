import { useAuth0 } from '@auth0/auth0-react';
import Cookies from 'js-cookie';
import './preloader/Preloader.jsx'
import './preloader/Preloader.css'
import Preloader from './preloader/Preloader.jsx';
import './accounts/AccountDetails.jsx'
import TempView from '../TempView.jsx';

const App = () => {
    const { isLoading, isAuthenticated, error, user, getIdTokenClaims, getAccessTokenSilently, loginWithRedirect, logout } = useAuth0();
    const fetchToken = async function () {
        const tokenClaims = await getIdTokenClaims();
        Cookies.set('token', tokenClaims.__raw);
    };

    if (isLoading) {
        return <Preloader />;
    }
    if (error) {
        return <div>Oops... {error.message}</div>;
    }

    if (isAuthenticated) {
        fetchToken();

        return (
            <div>
                <TempView />
                <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                    Log out
                </button>
            </div>
        );
    } else {
        loginWithRedirect();
    }
}
export default App;
