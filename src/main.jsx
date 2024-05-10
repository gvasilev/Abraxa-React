import React from 'react'
import ReactDOM from 'react-dom/client'
import { ReExtLoader, Fill } from '@gusmano/reext'
// var moment = require('moment'); // require
// import Env from './env.jsx'; // Import Env from env.jsx
//import '../styles/globals.scss'
//
//Fill();
//(async () => {
//    var reactroot = ReactDOM.createRoot(document.getElementById('root'));
//    try {
//        const {default: ReExtData} = await import('./ReExtData')
//        await ReExtLoader(ReExtData);
//        const {default: App} = await import('./App')
//        reactroot.render(
//            <React.StrictMode>
//                <App/>
//            </React.StrictMode>
//        )
//    } catch (e) {
//        reactroot.render(
//            <div style={{height: '100%', justifyContent: 'center', alignItems: 'center', display: 'flex'}}>
//                <div style={{textAlign: 'center', fontSize: '24px'}}>error: {e.toString()}</div>
//            </div>
//        )
//    }
//})();

(async () => {
    Fill();
    const {default: ReExtData} = await import('./ReExtData')
    await ReExtLoader(ReExtData);
    const {default: App} = await import('./App');
    ReactDOM.createRoot(document.getElementById('root')).render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    )
})();
