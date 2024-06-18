import '../../model/common/User';
import '../../store/common/Country';
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
    formulas: {
        setCurrentUser: {
            bind: {
                bindTo: '{currentUser}',
                deep: true,
            },
            get: function (currentUser) {
                const vm = this;
                if (currentUser.get('id')) {
                    window.CurrentUser = currentUser;
                    console.log(currentUser);
                    vm.set('currentUser', currentUser);
                }
            },
        },
    },
});
