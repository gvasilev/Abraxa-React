//let companyTooltipTimeout;

Ext.define('Abraxa.view.common.tooltips.TenantToolTip', {
    extend: 'Abraxa.view.common.tooltips.AbraxaTooltip',
    xtype: 'tenant.tooltip',
    minWidth: 480,
    minHeight: 200,
    cls: 'a-company-tooltip',
    viewModel: {
        data: {
            company_id: '',
            record: null,
            clickedElement: null,
            timeOutToHide: 1000,
        },
    },
    anchorToTarget: true,
    tpl: [
        '<div class="tooltip-body">' +
            '<div class="tooltip-title company-head-badge" data-company-id="{id}"><div class="badge"><i class="material-icons">business</i></div><tpl if="country && country != 255"><div class="sm-label">{countries.country_name}</div><tpl else><div class="sm-label">Country</div></tpl><div class="label hbox">{name}</div></div>' +
            '<div class="tooltip-content">' +
            '<ul>' +
            '<tpl if="email"><li><div class="hbox"><i class="md-icon-outlined">email</i><a class="c-blue" href="mailto:{email}">{email}</a></div></li><tpl else><li><div class="hbox"><i class="md-icon-outlined">email</i><a class="c-blue" href="javascript:void(0)">---</a></div></li></tpl>' +
            '<tpl if="phone"><li><div class="hbox"><i class="md-icon-outlined">phone</i><span class="c-blue">{phone}</span></div></li><tpl else><li><div class="hbox"><i class="md-icon-outlined">phone</i><span class="c-blue">---</span></div></li></tpl>' +
            '</ul>' +
            '</div>' +
            '</div>',
    ],
});
