import ReExt from '@gusmano/reext';
import './core/override/Abraxa.data.proxy.Ajax.js';
import './core/override/Abraxa.AjaxRequest.jsx';
import './core/override/Abraxa.Ajax.js';
import './core/override/Server.js';
import './core/override/Rest.js';
import './core/components/AbraxaDiv.js';
import './store/View.js';
import './view/viewport/ViewportController.js';
import './view/viewport/ViewportModel.js';
import './view/main/MainViewport.jsx';
import './controller/AbraxaController.jsx';
import './core/globals/Abraxa.Socket.js';

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
