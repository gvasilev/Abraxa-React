import './MainController.js';
import '../main/MainHeader.jsx';
import '../../core/components/AbraxaDiv.js';
import './CdbMainViewModel.jsx';
import './company/CompanyView.jsx';
import './CdbHeader';

Ext.define('Abraxa.view.cdb.MainView', {
    extend: 'Ext.Container',
    xtype: 'cdb.main',
    itemId: 'cdbMainView',
    viewModel: 'cdb-main-viewmodel',
    controller: 'cdb.maincontroller',
    layout: 'fit',
    bodyCls: 'a-layout-card-wrap',
    items: [
        {
            xtype: 'main.header',
        },
        {
            xtype: 'cdb.companyview',
            flex: 1,
        },
    ],
    loadRecord: function (id) {
        let company = Ext.create('Abraxa.model.company.Company', {
            id: id,
        });
        company.load({
            scope: this,
            success: function (record, operation) {
                this.getViewModel().set('object_record', record);
            },
            failure: function (record, operation) {
                Ext.Msg.alert('Error', 'Could not load record');
            },
        });
    },
    listeners: {
        painted: function (me) {
            if (me.upVM().get('currentUserType') !== 'agent') {
                //Ext.getCmp('main-viewport').getController().redirectTo('404');
            }
        },
    },
});
