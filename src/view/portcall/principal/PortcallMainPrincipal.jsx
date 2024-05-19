import './PortcallViewModelPrincipal.jsx';
import './PortcallControllerPrincipal.jsx';
Ext.define('Abraxa.view.portcall.principal.PortcallMainPrincipal', {
    extend: 'Ext.Container',
    xtype: 'PortcallMainPrincipal',
    alias: 'widget.principalportcall.main',
    viewModel: 'PortcallViewModelPrincipal',
    controller: 'PortcallControllerPrincipal',
    reference: 'portcallMainViewPrincipal',
    publishes: ['record'],
    flex: 1,
    layout: 'fit',
    slug: 'portcall',
    bind: {
        activeItemIndex: '{mainTabbar.activeTabIndex}',
        permission: '{userPermissions}',
    },
    defaults: {
        hideMode: 'clip',
    },
    items: [
        {
            xtype: 'main.header',
        },
        {
            xtype: 'summary.main',
            hidden: false,
            bind: {
                hidden: '{portCallRecord.read_only || mainTabbar.activeTabIndex == 0 ? false: true}',
            },
        },
        {
            xtype: 'appointment.main',
            hideMode: 'display',
            hidden: true,
            bind: {
                hidden: '{portCallRecord.read_only || mainTabbar.activeTabIndex == 1 ? false: true}',
            },
        },
        {
            xtype: 'sof.main',
            hideMode: 'display',
            hidden: true,
            bind: {
                hidden: '{!portCallRecord.read_only && mainTabbar.activeTabIndex == 2 ? false: true}',
            },
        },
        {
            xtype: 'documents.main',
            hideMode: 'clip',
            hidden: true,
            bind: {
                hidden: '{!portCallRecord.read_only && mainTabbar.activeTabIndex == 3 ? false: true}',
            },
        },
        {
            xtype: 'husbandry.main',
            hideMode: 'display',
            hidden: true,
            bind: {
                hidden: '{!portCallRecord.read_only && mainTabbar.activeTabIndex == 4 ? false: true}',
            },
        },
        {
            xtype: 'DisbursementsMainPrincipal',
            hidden: true,
            bind: {
                hidden: '{!portCallRecord.read_only && mainTabbar.activeTabIndex == 5 ? false: true}',
            },
        },
        {
            xtype: 'payments.main',
            hidden: true,
            bind: {
                hidden: '{!portCallRecord.read_only && mainTabbar.activeTabIndex == 6 ? false: true}',
            },
        },
        {
            xtype: 'portcall.sof.kpis',
            hidden: true,
            bind: {
                hidden: '{!portCallRecord.read_only && mainTabbar.activeTabIndex == 7 ? false: true}',
            },
        },
    ],
    loadRecord: function (id, args) {
        let viewRecord = this.getRecord();
        if (viewRecord && viewRecord.get('id') == id) {
            return;
        }
        Ext.getCmp('main-viewport').setMasked({
            xtype: 'viewport.mask',
        });
        let portCall = Ext.create('Abraxa.model.portcall.Portcall', {
            id: id,
        });
        portCall.load({
            scope: this,
            success: function (record, operation) {
                this.setRecord(record);
            },
            failure: function (record, operation) {
                Ext.Msg.alert('Error', 'Could not load record');
            },
        });
    },
});
