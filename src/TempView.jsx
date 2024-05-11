import ReExt from '@gusmano/reext';
import './Application.js';
import './core/override/Abraxa.data.proxy.Ajax.js';
import './view/main/MainViewport.jsx'

const TempView = () => {
    return (
         <ReExt xtype='MainViewPort' />
    );
};
export default TempView;