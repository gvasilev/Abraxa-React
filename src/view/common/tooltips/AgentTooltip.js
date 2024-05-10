//let companyTooltipTimeout;

Ext.define('Abraxa.view.common.tooltips.AgentTooltip', {
    extend: 'Abraxa.view.common.tooltips.AbraxaTooltip',
    xtype: 'AgentTooltip',
    minWidth: 480,
    minHeight: 200,
    cls: 'a-company-tooltip',
    showAnimation: 'pop',
    id: 'agentTooltip',
    viewModel: {
        data: {
            company_id: '',
            record: null,
            clickedElement: null,

            timeOutToHide: 1000,
        },
    },

    bind: {
        data: '{record}',
    },
    anchorToTarget: true,
    tpl: [
        '<div class="tooltip-body">' +
            '<div class="tooltip-title company-head-badge" data-company-id="{org_id}"><div class="badge"><i class="material-icons">business</i></div>' +
            '<tpl ><div>Country: <span class="sm-label"> {country}</span></div></tpl>' +
            '<div class="label hbox">{name}</div></div>' +
            '<div class="tooltip-content">' +
            '<ul>' +
            '<tpl if="email" ><li><div class="hbox"><i class="md-icon-outlined">email</i><a class="c-blue" href="mailto:{email}">{email}</a></div></li><tpl else><li><div class="hbox"><i class="md-icon-outlined">email</i><a class="c-blue" href="javascript:void(0)">---</a></div></li></tpl>' +
            '<tpl if="phone"><li><div class="hbox"><i class="md-icon-outlined">phone</i><a class="c-blue" href="tel:{phone}">{phone}</a></div></li><tpl else><li><div class="hbox"><i class="md-icon-outlined">phone</i><span class="c-blue">---</span></div></li></tpl>' +
            '<tpl if="trade_reg"><li><div class="hbox"><i class="material-icons-outlined">assured_workload</i><span class="fw-b">{trade_reg}</span></div></li><tpl else><li><div class="hbox"><i class="material-icons-outlined">assured_workload</i>---</div></li></tpl>' +
            '</ul>' +
            '</div>' +
            '</div>',
    ],
    // bbar: {
    //     items: [
    //         '->',
    //         {
    //             xtype: 'button',
    //             margin: '8 0 8 8',
    //             ui: 'action',
    //             text: 'Close',
    //             handler: function (me) {
    //                 let record = me.upVM().get('record');
    //                 if (record) {
    //                     me.up('[xtype=AgentTooltip]').hide();
    //                     // Ext.getCmp('main-viewport')
    //                     //     .getController()
    //                     //     .redirectTo('company/' + record.org_id);
    //                 }
    //             },
    //         },
    //     ],
    // },
});
