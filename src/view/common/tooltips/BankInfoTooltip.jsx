Ext.define('Abraxa.view.common.tooltips.BankInfoTooltip', {
    extend: 'Ext.tip.ToolTip',
    xtype: 'bank.info.tooltip',
    cls: 'a-company-tooltip',
    trackMouse: true,
    ui: 'card',
    zIndex: 9999,
    closable: true,
    closeAction: 'destroy',
    minWidth: 450,
    minHeight: 200,
    tpl:
        '<div class="tooltip-body">' +
        '<div class="tooltip-title company-head-badge"><div class="badge bank"><i class="md-icon-outlined">account_balance</i></div>' +
        '<div class="label c-blue">{bank_name}</div>' +
        '</div>' +
        '<div class="tooltip-content">' +
        '<div class="a-bank-info">' +
        '<tpl if="address"><div class="a-bank-address">{address}</div></tpl>' +
        '<tpl if="bank_branch_number"><div class="a-bank-row"><label>Beneficiary</label><div>{bank_branch_number}</div></div></tpl>' +
        '<tpl><div class="a-bank-row"><label>Currency</label><div class="fw-b c-accent">{currency}</div></div></tpl>' +
        '<tpl if="iban"><div class="a-bank-row"><label>{number_type}</label><div>{iban}</div></div></tpl>' +
        '<tpl if="swift_number"><div class="a-bank-row"><label>SWIFT N</label><div>{swift_number}</div></div></tpl>' +
        '<tpl if="bank_swift"><div class="a-bank-row"><label>SWIFT</label><div>{bank_swift}</div></div></tpl>' +
        '<tpl if="account_number"><div class="a-bank-row"><label>Account No</label><div>{account_number}</div></div></tpl>' +
        '<tpl if="beneficiary"><div class="a-bank-row"><label>Beneficiary</label><div>{beneficiary}</div></div></tpl>' +
        '<tpl if="corresponding_bank"><div class="a-bank-row"><label>Correspondent bank</label><div>{corresponding_bank}</div></div></tpl>' +
        '</div>' +
        '</div>' +
        '</div>',
});
