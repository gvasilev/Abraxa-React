//let companyTooltipTimeout;
import './AbraxaTooltip';

Ext.define('Abraxa.view.common.tooltips.CompanyToolTip', {
    extend: 'Abraxa.view.common.tooltips.AbraxaTooltip',
    xtype: 'company.tooltip',
    minWidth: 480,
    minHeight: 200,
    cls: 'a-company-tooltip',
    showAnimation: 'pop',
    id: 'companyTooltip',
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
        '<tpl if="country_name"><div class="sm-label">{country_name}</div><tpl else><div class="sm-label">Country</div></tpl>' +
        '<div class="label hbox">{[this.getOrgIsVerified(values)]}{org_name}<div class="a-status-badge a-has-icon status-sm status-{rating.name}"><i class="material-icons">star</i>{rating.name}</div></div></div>' +
        '<div class="tooltip-content">' +
        '<ul>' +
        '<tpl if="org_type_names"><li><div class="hbox"><i class="md-icon-outlined">label</i><div class="a-company-type">{[this.getTags(values.org_type_names)]}</div></div></li></tpl>' +
        '<tpl if="org_email"><li><div class="hbox"><i class="md-icon-outlined">email</i><a class="c-blue" href="mailto:{org_email}">{org_email}</a></div></li><tpl else><li><div class="hbox"><i class="md-icon-outlined">email</i><a class="c-blue" href="javascript:void(0)">---</a></div></li></tpl>' +
        '<tpl if="org_phone"><li><div class="hbox"><i class="md-icon-outlined">phone</i><a class="c-blue" href="tel:{org_phone}">{org_phone}</a></div></li><tpl else><li><div class="hbox"><i class="md-icon-outlined">phone</i><span class="c-blue">---</span></div></li></tpl>' +
        '{[this.getPhones(values.phones)]}' +
        '<tpl if="contacts_count"><li><div class="hbox"><i class="md-icon-outlined">group</i><span href="javascript:void(0);" class="fw-b contacts_count" data-company-id="{org_id}">{contacts_count} contacts</span></div></li><tpl else><li><div class="hbox"><i class="md-icon-outlined">group</i><span href="javascript:void(0);" class="fw-b">---</span></div></li></tpl>' +
        '<tpl if="org_registration_number"><li><div class="hbox"><i class="material-icons-outlined">assured_workload</i><span class="fw-b">{org_registration_number}</span></div></li><tpl else><li><div class="hbox"><i class="material-icons-outlined">assured_workload</i>---</div></li></tpl>' +
        '</ul>' +
        '<ul>' +
        '<tpl if="balance"><li><div class="hbox a-company-balance {[this.getBalanceColor(values)]}"><i class="material-icons">attach_money</i><span class="fw-b">{[this.getBalance(values)]} </span></div></li><tpl else><li><div class="hbox a-company-balance"><i class="material-icons">attach_money</i>---</div></li></tpl>' +
        '<tpl if="deals"><li><div class="hbox a-company-deals"><i class="material-icons-outlined">local_offer</i><span class="fw-b">{deals.appointed_active} appointments</span></div></li><tpl else><li><div class="hbox a-company-deals"><i class="material-icons">local_offer</i>---</div></li></tpl>' +
        // '<tpl><li><div class="hbox"><i class="md-icon">short_text</i><span class="a-placeholder">Some company note</span></div></li></tpl>' +
        '</ul>' +
        '</div>' +
        '</div>',
        {
            getPhones: function(phones) {
                let res = '';
                if (phones && phones.length) {
                    Ext.each(phones, function(phone) {
                        res +=
                            '<li><div class="hbox"><i class="md-icon-outlined">phone</i><a class="c-blue" href="tel:' +
                            phone.phone +
                            '">' +
                            phone.phone +
                            '</a></div></li>';
                    });
                }
                return res;
            },
        },
        {
            getTags: function(tags) {
                if (tags && tags.length) {
                    let res = '';
                    Ext.each(tags, function(tag) {
                        res +=
                            '<span class="a-status-badge status-' + tag.toLowerCase() + ' rounded">' + tag + '</span>';
                    });
                    return res;
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            getBalance: function(values) {
                var default_currency = Ext.getCmp('main-viewport')
                    .getVM()
                    .get('currentUser')
                    .getCompany()
                    .get('default_currency');
                if (values.balance && values.balance.total) {
                    let currentUserType = Ext.getCmp('main-viewport').getVM().get('currentUserType'),
                        str = '<em>(debit)</em>';
                    if (currentUserType == 'agent') {
                        if (Ext.isNumber(values.balance.total)) {
                            if (Ext.Number.sign(values.balance.total) === -1) {
                                str = '<em>(credit)</em>';
                            }
                        }
                    } else {
                        if (Ext.isNumber(values.balance.total)) {
                            if (Ext.Number.sign(values.balance.total) === -1) {
                                str = '<em>(debit)</em>';
                            } else {
                                str = '<em>(credit)</em>';
                            }
                        }
                    }
                    return (
                        default_currency +
                        ' ' +
                        Ext.util.Format.number(Math.abs(values.balance.total), ' 0,000.00') +
                        ' ' +
                        str
                    );
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            getBalanceColor: function(values) {
                let colorCls = '',
                    currentUserType = Ext.getCmp('main-viewport').getVM().get('currentUserType');
                if (currentUserType == 'agent') {
                    if (Ext.isNumber(values.balance.total)) {
                        if (Ext.Number.sign(values.balance.total) === -1) {
                            colorCls = 'green';
                        }
                        if (Ext.Number.sign(values.balance.total) === 1) {
                            colorCls = 'red';
                        }
                    }
                } else {
                    if (Ext.isNumber(values.balance.total)) {
                        if (Ext.Number.sign(values.balance.total) === -1) {
                            colorCls = 'red';
                        }
                        if (Ext.Number.sign(values.balance.total) === 1) {
                            colorCls = 'green';
                        }
                    }
                }
                return colorCls;
            },
        },

        {
            getOrgIsVerified: function(values) {
                let orgIsVerified = values.compliance;

                html =
                    '<div class="a-tooltip-verification a-verification"><i class="a-verification-icon material-icons md-icon-outlined md-16 mr-4">verified_user</i></div>';

                if (orgIsVerified) {
                    html =
                        '<div class="a-tooltip-verification a-verification a-' +
                        orgIsVerified.status +
                        '"><i class="a-verification-icon material-icons ' +
                        (orgIsVerified.status != 'verified' ? 'md-icon-outlined' : '') +
                        ' md-16 mr-4"></i></div>';
                }
                return html;
            },
        },
    ],
    bbar: {
        items: [
            '->',
            {
                xtype: 'button',
                margin: '8 0 8 8',
                ui: 'action',
                text: 'View details',
                handler: function(me) {
                    let record = me.upVM().get('record');
                    if (record) {
                        me.up('[xtype=company\\.tooltip]').hide();
                        Ext.getCmp('main-viewport')
                            .getController()
                            .redirectTo('company/' + record.org_id);
                    }
                },
            },
        ],
    },
});
