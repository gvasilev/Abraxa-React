Ext.define('Abraxa.view.portcall.principal.disbursements.DisbursementsMenuList', {
    extend: 'Ext.menu.Menu',
    xtype: 'DisbursementsMenuList',
    ui: 'dropdown',
    cls: 'a-main-recent-menu is-animated',
    width: 320,
    hidden: true,
    maxHeight: 400,
    scrollable: 'y',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'div',
            margin: '0 16 16',
            cls: 'h5',
            html: 'Disbursements',
        },
        {
            xtype: 'list',
            reference: 'disbursementsMenuList',
            minHeight: 100,
            scrollable: false,
            selectable: {
                mode: 'single',
            },
            bind: {
                store: '{billingPartyDisbursements}',
            },
            itemConfig: {
                viewModel: {},
                bind: {
                    tpl: '<div class="hbox"><span class="file-icon-badge file-icon-x32" data-type="{record.type}" data-icon="money"></span><div class="ml-12 text-truncate"><a href="javascript:void(0)" class="fw-b text-truncate">{record.name}</a><div class="sm-title"</div></div>',
                },
            },
            listeners: {
                childtap: function (list, record) {
                    // this.up('DisbursementDetails').setMasked(true);
                    this.up('DisbursementsMenuList').hide();
                },
                painted: function () {
                    this.select(this.lookupViewModel().get('selectedDisbursement'));
                },
                select: function (list, record) {
                    Ext.getCmp('main-viewport')
                        .getController()
                        .redirectTo('portcall/' + record.get('portcall_id') + '/disbursements/' + record.get('id'));
                },
            },
        },
    ],
});
