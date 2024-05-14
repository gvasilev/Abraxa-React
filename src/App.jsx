import { useAuth0 } from '@auth0/auth0-react';
import Cookies from 'js-cookie';
import './preloader/Preloader.jsx';
import './preloader/Preloader.css';
import Preloader from './preloader/Preloader.jsx';
import './utils/AbraxaConstants.jsx';
import TempView from './TempView.jsx';

const App = () => {
    const { isLoading, isAuthenticated, error, user, getIdTokenClaims, getAccessTokenSilently, loginWithRedirect, logout } = useAuth0();
    const fetchToken = async function () {
        const tokenClaims = await getIdTokenClaims();
        Cookies.set('token', tokenClaims.__raw);
    };

    const LogoutButton = () => {
        const { logout } = useAuth0();

        const handleLogout = () => {
            logout({ logoutParams: { returnTo: window.location.origin } })
        };

        return (
            <button id="logoutButton" onClick={handleLogout} style={{ display: 'none' }}>
                Logout
            </button>
        );
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
            <div style={{
                boxSizing:'border-box',height:'100%',
                display:'flex',flexDirection:'column'
                }}>
                <TempView />
                <LogoutButton />
            </div>
        );
    } else {
        loginWithRedirect();
    }
}
export default App;
