import ReExt from '@gusmano/reext';
import './core/override/Abraxa.data.proxy.Ajax.js';
import './core/override/Abraxa.Ajax.js';
import './core/components/AbraxaDiv.js';
import './store/View.js';
import './view/viewport/ViewportController.js';
import './view/viewport/ViewportModel.js';
import './view/main/MainViewport.jsx';

const TempView = () => {
    return (
         <ReExt xtype='MainViewPort' />
    );
};
export default TempView;