Ext.define('Abraxa.view.portcall.principal.disbursements.BillingPartiesMenuListPrincipal', {
    extend: 'Ext.menu.Menu',
    xtype: 'BillingPartiesMenuListPrincipal',
    ui: 'dropdown',
    cls: 'a-main-recent-menu is-animated',
    width: 320,
    hidden: true,
    flex: 1,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'div',
            margin: '0 16 16',
            cls: 'h5',
            html: 'Billing parties',
        },
        {
            xtype: 'list',
            reference: 'billingPartyMenuList',
            minHeight: 100,
            scrollable: false,
            selectable: {
                mode: 'single',
            },
            flex: 1,
            bind: {
                store: '{billingPartyStore}',
            },
            itemConfig: {
                viewModel: {},
                bind: {
                    html: '<div class="hbox"><div class="a-badge a-badge-x32 a-badge-account"><i class="md-icon-outlined">corporate_fare</i></div><div class="ml-12 text-truncate"><a href="javascript:void(0)" class="fw-b text-truncate">{record.org_name}</a><div class="sm-title"</div></div>',
                },
            },
            listeners: {
                childtap: function (list, record) {
                    this.up('BillingPartiesMenuListPrincipal').hide();
                },
                painted: function () {
                    this.select(this.lookupViewModel().get('selectedBillingParty'));
                },
                select: function (list, record) {
                    this.lookupViewModel().set('selectedBillingParty', record);
                },
            },
        },
    ],
});
