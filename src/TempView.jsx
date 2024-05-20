import ReExt from '@gusmano/reext';
import './utils/AbraxaConstants.jsx';
import './utils/AbraxaFunctions';
// import './core/components/AbraxaStateProvider.jsx';
import './core/override/Abraxa.data.proxy.Ajax.js';
import './core/override/Abraxa.data.proxy.Rest.js';
import './core/override/Abraxa.AjaxRequest.jsx';
import './core/override/Abraxa.Ajax.js';
import './core/override/Server.js';
import './core/override/Abraxa.data.Store.js';
// import './core/override/Rest.js';
import './core/override/Abraxa.data.ChainedStore.jsx';
import './core/override/Abraxa.data.Model.jsx';
import './utils/AbraxaConstants.jsx';
import './utils/AbraxaFunctions.jsx';
import './core/components/AbraxaDiv.jsx';
import './store/View.js';
import './core/components/AbraxaContainer';
import './core/components/AbraxaPanel';
import './view/viewport/ViewportController.js';
import './view/viewport/ViewportModel.js';
import './view/main/MainViewport.jsx';
import './controller/AbraxaController.jsx';
import './core/globals/Abraxa.Socket.js';
import './view/error/404.jsx';
import './core/override/Abraxa.Dialog.js';
import './core/override/Abraxa.MessageBox.js';
import './view/calculator/portcostengine/MainPage.jsx';
import './view/settings/SettingsMainLayout.jsx';

import './view/common/dialog/Vessel';
import './view/common/dialog/port/PortMain';

// Import CSS
import './index.css';
import '../styles/1.css';
import '../styles/2.css';
import '../styles/3.css';
import '../styles/4.css';

const TempView = () => {
    return (
         <ReExt xtype='MainViewPort'/>
    );
};
export default TempView;
