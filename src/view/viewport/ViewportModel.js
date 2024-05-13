import '../../model/common/User';
import '../../store/common/Country.js';
import '../../store/currency/Currency';

Ext.define('Abraxa.view.viewport.ViewportModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.viewport',

    data: {
        currentUser: new Abraxa.model.common.User(),
        is_logged: false,
        registration_mode: false,
    },
    stores: {
        countryStore: {
            type: 'countryStore',
        },
        currencies: {
            type: 'currency',
            autoLoad: true,
        },
    },
    // formulas: {
    //     setCurrentUser: {
    //         bind: {
    //             bindTo: '{currentUser}',
    //             deep: true,
    //         },
    //         get: function (currentUser) {
    //             if (currentUser.get('id')) {
    //                 console.log('currentUser', currentUser);
    //                 // Env.currentUser = currentUser;
    //             }
    //         },
    //     },
    // },
});
