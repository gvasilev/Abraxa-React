import './ProformaController';
import '../../../store/inquiry/InquiryPriceBooks';

Ext.define('Abraxa.view.inquiry.inquiryDetails.CreateProforma', {
    extend: 'Ext.Dialog',
    xtype: 'proforma.create',
    controller: 'proforma-controller',
    title: '<div class="a-badge a-badge-estimate"><i class="md-icon-outlined">attach_money</i></div>Create estimate',
    cls: 'a-dialog-create a-dialog-has-icon',
    width: 540,
    padding: '0 24 24 72',
    closable: true,
    draggable: false,
    items: [
        {
            xtype: 'formpanel',
            padding: 0,
            ui: 'no-border-radius',
            items: [
                {
                    xtype: 'form.error',
                    docked: 'top',
                    hidden: true,
                    margin: 0,
                    padding: 8,
                    showAnimation: 'fadeIn',
                },
                {
                    xtype: 'textfield',
                    label: false,
                    clearable: false,
                    placeholder: 'Proforma name',
                    ui: 'field-xl no-border classic',
                    required: true,
                    name: 'name',
                    bind: {
                        value: '{offer.name}',
                    },
                    listeners: {
                        painted: function() {
                            this.focus();
                        },
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'Disbursement ID',
                    clearable: false,
                    placeholder: 'Disbursement ID',
                    cls: 'a-field-icon icon-short icon-rounded',
                    ui: 'classic hovered-border',
                    required: true,
                    labelAlign: 'left',
                    bind: {
                        disabled: '{customSequence.inquiry ? true : false}',
                        required: '{customSequence.inquiry ? false : true}',
                        placeholder: '{customSequence.inquiry ? "Automated sequence" : "Disbursement ID"}',
                        value: '{offer.group_id}',
                    },
                    listeners: {
                        painted: function() {
                            this.setError(false);
                        },
                    },
                },
                {
                    xtype: 'combobox',
                    queryMode: 'local',
                    label: 'Port',
                    labelAlign: 'left',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-port icon-rounded',
                    required: true,
                    selectable: true,
                    forceSelection: true,
                    flex: 1,
                    valueField: 'id',
                    displayField: 'name',
                    reference: 'estimatePortCombo',
                    itemTpl:
                        '<div class="combo-item">' +
                        '<div class="sm-icon"><i class="md-icon-outlined md-18">place</i></div>' +
                        '<label class="sm-type">{code}</label>' +
                        '<div class="sm-value">{name}</div>' +
                        '</div>',
                    placeholder: 'Choose port',
                    bind: {
                        value: '{offer.port_id}',
                        store: '{portStore}',
                    },
                    listeners: {
                        painted: function(me) {
                            me.setError(false);
                        },
                    },
                },
                {
                    xtype: 'common-combo-currency',
                    placeholder: 'Currency',
                    labelAlign: 'left',
                    label: 'Currency',
                    ui: 'classic hovered-border',
                    required: true,
                    cls: 'a-field-icon icon-money icon-rounded',
                    reference: 'currencyCombo',
                    matchFieldWidth: true,
                    bind: {
                        value: '{offer.currency}',
                    },
                },
                {
                    xtype: 'container',
                    margin: '2 0 0 0',
                    padding: '0 0 2 0',
                    defaults: {
                        labelAlign: 'left',
                        ui: 'classic hovered-border',
                    },
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    hidden: true,
                    bind: {
                        hidden: '{showExchangeRate ? false : true}',
                    },
                    items: [
                        {
                            xtype: 'abraxa.currency.field',
                            flex: 1,
                            label: 'Exchange rate',
                            placeholder: '0,000.00',
                            cls: 'a-prepend a-field-icon icon-exchange icon-rounded',
                            required: false,
                            bind: {
                                value: '{offer.exchange_rate}',
                                required: '{showExchangeRate ? true:false}',
                            },
                        },
                        {
                            xtype: 'div',
                            cls: 'c-light-grey',
                            width: 120,
                            margin: '0 0 0 16',
                            bind: {
                                html: '{showExchangeRate.port_currency}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'my-16',
                    html: '<hr>',
                },
                {
                    xtype: 'combobox',
                    testId: 'priceBookComboCreateProforma',
                    placeholder: 'Choose price book',
                    queryMode: 'local',
                    valueField: 'id',
                    displayField: 'name',
                    labelAlign: 'left',
                    label: 'Price book',
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-rounded icon-description',
                    // reference: 'selectedTemplate',
                    // slug: 'portcallTemplates',
                    hidden: true,
                    floatedPicker: {
                        loadingHeight: null,
                    },
                    bind: {
                        label: '{(currentUserPlan == "starter") ? "<span class=\\"hbox\\">Price book<i class=\\"far fa-gem c-premium ml-8\\" data-qtip=\\"Premium feature\\" data-qalign=\\"bc-tc\\" data-qanchor=\\"true\\"></i></span>":"Price book"}',
                        store: '{priceBooks}',
                        value: '{offer.template_id}',
                        permission: '{userPermissions}',
                        hidden: '{priceBooks.count ? false : true}',
                    },
                    listeners: {
                        painted: function(me) {
                            me.setError(false);
                        },
                    },
                },
            ],
        },
    ],
    buttons: [
        {
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: function(btn) {
                btn.upVM().get('offer').reject();
                this.up('dialog').destroy();
            },
        },
        {
            text: 'Create',
            testId: 'createProformaCreateButton',
            ui: 'action loading',
            enableToggle: true,
            handler: 'createProforma',
        },
    ],
});
