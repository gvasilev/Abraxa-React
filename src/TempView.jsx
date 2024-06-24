import ReExt from '@gusmano/reext';
import './utils/AbraxaConstants';
import './utils/AbraxaFunctions';
import './core/override/Abraxa.data.proxy.Ajax';
import './core/override/Abraxa.data.proxy.Rest';
import './core/override/Abraxa.AjaxRequest';
import './core/override/Abraxa.Ajax';
import './core/override/Server';
import './core/components/AbraxaStateProvider.jsx'
import './core/override/Abraxa.data.Store';
import './core/override/Abraxa.data.ChainedStore';
import './core/override/Abraxa.data.Model';
import './utils/AbraxaConstants';
import './utils/AbraxaFunctions';
import './core/components/AbraxaDiv';
import './store/View';
import './core/components/AbraxaContainer';
import './core/components/AbraxaPanel';
import './view/viewport/ViewportController';
import './view/viewport/ViewportModel';
import './view/main/MainViewport';
import './controller/AbraxaController';
import './core/globals/Abraxa.Socket';
import './view/error/404';
import './core/override/Abraxa.Dialog';
import './core/override/Abraxa.MessageBox';
import './view/calculator/portcostengine/MainPage';
import './view/settings/SettingsMainLayout';
import './view/common/dialog/Vessel';
import './view/common/dialog/port/PortMain';
import './core/globals/AbraxaPoup';

// Import CSS
import './index.css';
import '../styles/1.css';
import '../styles/2.css';
import '../styles/3.css';
import '../styles/4.css';
import './helpers/mention/mention.css';

const TempView = () => {
    return <ReExt xtype="MainViewPort" />;
};
export default TempView;
