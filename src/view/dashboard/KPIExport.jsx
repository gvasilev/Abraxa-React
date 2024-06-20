Ext.define('Abraxa.view.Dashboard.KPIExport', {
    xtype: 'dashboard.kpiexport',
    extend: 'Ext.Dialog',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    title: 'KPIs Report',
    manageBorders: false,
    closable: true,
    centered: true,
    minWidth: 540,
    maxWidth: 540,
    padding: '0 8',
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    scrollable: true,
    items: [
        {
            xtype: 'formpanel',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-form',
                    items: [
                        {
                            xtype: 'selectfield',
                            editable: false,
                            label: 'Period',
                            required: true,
                            name: 'period',

                            labelAlign: 'left',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-date icon-rounded non-editable',

                            options: [
                                {
                                    text: 'Today',
                                    value: 'today',
                                },
                                {
                                    text: 'Last 7 days',
                                    value: 'last7days',
                                },
                                {
                                    text: 'Last 30 days',
                                    value: 'last30days',
                                },
                                {
                                    text: 'Last 90 days',
                                    value: 'last90days',
                                },
                                {
                                    text: 'This year',
                                    value: 'year',
                                },
                                {
                                    text: 'Custom',
                                    value: 'custom',
                                },
                            ],
                            value: 'last7days',
                            listeners: {
                                change: function (me, newValue) {
                                    let container = Ext.ComponentQuery.query('[cls~=customForm]')[0];
                                    if (newValue === 'custom') {
                                        if (container && !container.isVisible()) {
                                            container.setHidden(false);
                                            this.upVM().set('required', true);
                                        }
                                    } else {
                                        container.setHidden(true);
                                        this.upVM().set('required', false);
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'container',
                            cls: 'customForm',
                            hidden: true,
                            items: [
                                {
                                    xtype: 'container',
                                    items: [
                                        {
                                            label: 'From:',
                                            itemId: 'fromField',
                                            required: false,
                                            hidden: true,

                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-date icon-rounded',

                                            bind: {
                                                required: '{required}',
                                                hidden: '{!required}',
                                            },
                                            name: 'from',
                                            xtype: 'abraxa.datefield',
                                            listeners: {
                                                show: function () {
                                                    this.setError(null);
                                                },
                                            },
                                        },
                                        {
                                            label: 'To:',
                                            itemId: 'toField',
                                            required: false,
                                            hidden: true,

                                            labelAlign: 'left',
                                            ui: 'classic hovered-border',
                                            cls: 'a-field-icon icon-date icon-rounded',

                                            bind: {
                                                required: '{required}',
                                                hidden: '{!required}',
                                            },
                                            name: 'to',
                                            xtype: 'abraxa.datefield',
                                            listeners: {
                                                show: function () {
                                                    this.setError(null);
                                                },
                                            },
                                        },
                                    ],
                                },
                                {
                                    xtype: 'selectfield',
                                    editable: false,
                                    label: 'View',
                                    required: false,
                                    hidden: true,
                                    placeholder: 'Select view',

                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-short icon-rounded',

                                    bind: {
                                        required: '{required}',
                                        hidden: '{!required}',
                                    },

                                    name: 'custom_view',
                                    options: [
                                        {
                                            text: 'Daily',
                                            value: 'daily',
                                        },
                                        {
                                            text: 'Weekly',
                                            value: 'weekly',
                                        },
                                        {
                                            text: 'Monthly',
                                            value: 'monthly',
                                        },
                                        {
                                            text: 'Yearly',
                                            value: 'yearly',
                                        },
                                    ],
                                    listeners: {
                                        show: function () {
                                            this.setError(null);
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'combobox',
                            label: 'Port',
                            required: true,
                            multiSelect: true,
                            forceSelection: false,
                            name: 'ports',
                            placeholder: 'Search port',

                            labelAlign: 'left',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-port icon-rounded',

                            itemTpl:
                                '<tpl if="port_id != -1"><div class="combo-item hbox">' +
                                '<div class="sm-icon"><i class="material-icons-outlined md-18">place</i></div>' +
                                '<label class="sm-type">{country_name}</label>' +
                                '<div class="sm-value">{port_name}</div>' +
                                '</div><tpl else><div class="sm-icon"></div>' +
                                '<label class="sm-type"></label>' +
                                '<div class="sm-value">{port_name}</div></div></tpl>',
                            valueField: 'port_id',
                            displayField: 'port_name',
                            queryMode: 'local',
                            floatedPicker: {
                                xtype: 'boundlist',
                                infinite: false,
                                // BoundListNavigationModel binds to input field
                                // Must only be enabled when list is visible
                                navigationModel: {
                                    disabled: true,
                                },
                                scrollToTopOnRefresh: false,
                                loadingHeight: 70,
                                maxHeight: 300,
                                floated: true,
                                axisLock: true,
                                hideAnimation: null,
                                listeners: {
                                    select: function (me, selection) {
                                        if (selection) {
                                            let combo = me.up('combobox');
                                            let comboboxValue = combo.getValue();
                                            if (selection[0].get('port_id') == -1 && comboboxValue.length > 1) {
                                                combo.clearValue();
                                                combo.setValue(-1);
                                            } else {
                                                if (selection[0].get('port_id') != -1) {
                                                    var index = comboboxValue.indexOf(-1);
                                                    if (index > -1) {
                                                        comboboxValue.splice(index, 1);
                                                        combo.clearValue();
                                                        combo.setValue(comboboxValue);
                                                    }
                                                }
                                            }
                                        }
                                    },
                                },
                            },
                            bind: {
                                store: '{portServerWithAll}',
                            },
                            listeners: {
                                painted: function (me) {
                                    let store = me.getStore();
                                    if (store) {
                                        let record = store.findRecord('port_id', -1);
                                        if (record) {
                                            me.setValue(record.get('port_id'));
                                        }
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'selectfield',
                            editable: false,
                            label: 'Type',
                            name: 'type',
                            multiSelect: true,
                            forceSelection: true,
                            valueField: 'id',
                            displayField: 'name',
                            placeholder: 'Choose type',
                            labelAlign: 'left',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-short icon-rounded',

                            bind: {
                                store: '{typeWithAll}',
                            },
                            value: -1,
                            floatedPicker: {
                                xtype: 'boundlist',
                                infinite: false,
                                // BoundListNavigationModel binds to input field
                                // Must only be enabled when list is visible
                                navigationModel: {
                                    disabled: true,
                                },
                                scrollToTopOnRefresh: false,
                                loadingHeight: 70,
                                maxHeight: 300,
                                floated: true,
                                axisLock: true,
                                hideAnimation: null,
                                listeners: {
                                    select: function (me, selection) {
                                        if (selection) {
                                            let combo = me.up('selectfield');
                                            let comboboxValue = combo.getValue();
                                            if (selection[0].get('id') == -1 && comboboxValue.length > 1) {
                                                combo.clearValue();
                                                combo.setValue(-1);
                                            } else {
                                                if (selection[0].get('id') != -1) {
                                                    var index = comboboxValue.indexOf(-1);
                                                    if (index > -1) {
                                                        comboboxValue.splice(index, 1);
                                                        combo.clearValue();
                                                        combo.setValue(comboboxValue);
                                                    }
                                                }
                                            }
                                        }
                                    },
                                },
                            },
                        },
                        {
                            xtype: 'container',
                            margin: '8 0 0 0',
                            layout: {
                                type: 'hbox',
                            },
                            items: [
                                {
                                    xtype: 'div',
                                    width: 164,
                                },
                                {
                                    xtype: 'checkbox',
                                    margin: '0 32 0 0',
                                    name: 'datailedView',
                                    checked: true,
                                    ui: 'large',
                                    boxLabel: 'Detailed view',
                                    labelAlign: 'right',
                                },
                                // {
                                //     xtype: 'checkbox',
                                //     label: 'Income',
                                //     cls: 'income-checkbox',
                                //     labelTextAlign: 'left',
                                //     labelAlign: 'right',
                                //     name: 'includeIncome',
                                //     checked: true,
                                //     listeners: {
                                //         change: function (me, newValue) {
                                //             let balanceCheckBox = this.up('container').down('[cls~=balance-checkbox]');
                                //             if (newValue) {
                                //                 if (balanceCheckBox.getChecked()) {
                                //                     balanceCheckBox.setChecked(false);
                                //                 }
                                //                 balanceCheckBox.setDisabled(true);
                                //             } else {
                                //                 if (balanceCheckBox.getChecked()) {
                                //                     balanceCheckBox.setChecked(false);
                                //                 }
                                //                 balanceCheckBox.setDisabled(false);
                                //             }
                                //         }
                                //     }
                                // },
                                {
                                    xtype: 'checkbox',
                                    name: 'includeBalance',
                                    checked: true,

                                    ui: 'large',
                                    boxLabel: 'Balance',
                                    labelAlign: 'right',

                                    // listeners: {
                                    //     change: function (me, newValue) {
                                    //         let incomeCheckBox = this.up('container').down('[cls~=income-checkbox]');
                                    //         if (newValue) {
                                    //             if (incomeCheckBox.getChecked()) {
                                    //                 incomeCheckBox.setChecked(false);
                                    //             }
                                    //             incomeCheckBox.setDisabled(true);
                                    //         } else {
                                    //             if (incomeCheckBox.getChecked()) {
                                    //                 incomeCheckBox.setChecked(false);
                                    //             }
                                    //             incomeCheckBox.setDisabled(false);
                                    //         }
                                    //     }
                                    // }
                                },
                            ],
                        },
                        {
                            xtype: 'panel',
                            margin: '8 0 0 0',
                            ui: 'title-md',
                            title: 'Advanced filter',
                            collapsible: {
                                direction: 'bottom',
                                dynamic: true,
                                tool: {
                                    left: -8,
                                },
                            },
                            header: {
                                padding: '0 8 0 40',
                            },
                            collapsed: true,
                            items: [
                                {
                                    xtype: 'organization.combo',
                                    label: 'Client',
                                    // multiSelect: true,
                                    name: 'clients',
                                    placeholder: 'Choose Company',

                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-business icon-rounded',
                                },
                                {
                                    xtype: 'selectfield',
                                    editable: false,
                                    label: 'Deal type',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    name: 'deal_type',
                                    value: 'appointing_party_id',
                                    options: [
                                        {
                                            text: 'Appointing',
                                            value: 'appointing_party_id',
                                        },
                                        {
                                            text: 'Nominating',
                                            value: 'nominating_party_id',
                                        },
                                        {
                                            text: 'All',
                                            value: 'all',
                                        },
                                    ],
                                    listeners: {
                                        show: function () {
                                            this.setError(null);
                                        },
                                    },
                                },
                                {
                                    xtype: 'vessel.combo',
                                    label: 'Vessel(s)',
                                    placeholder: 'Start typing',
                                    name: 'vessels',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-search icon-rounded',
                                    listeners: {
                                        select: function (me, selection) {
                                            if (selection) {
                                                if (selection.get('is_custom')) {
                                                    me.upVM().set('is_custom', true);
                                                }
                                            }
                                        },
                                    },
                                },
                                {
                                    xtype: 'selectfield',
                                    margin: '4 0',
                                    editable: false,
                                    label: 'Group by',
                                    name: 'group_by',
                                    labelAlign: 'left',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-short icon-rounded non-editable',

                                    options: [
                                        {
                                            text: 'Port',
                                            value: 'Port',
                                        },
                                        {
                                            text: 'Company',
                                            value: 'Company',
                                        },
                                        {
                                            text: 'Vessel',
                                            value: 'Vessel',
                                        },
                                    ],
                                    value: 'Port',
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    buttonToolbar: {
        xtype: 'toolbar',
        docked: 'bottom',
        ui: 'toolbar-panel-bottom',
        border: true,
    },
    bbar: {
        items: [
            '->',
            {
                text: 'Cancel',
                handler: function () {
                    this.up('dialog').destroy();
                },
                ui: 'default',
            },
            {
                text: 'Generate',
                enableToggle: true,
                ui: 'action loading',
                margin: '0 0 0 8',
                // ui: 'solid-normal',
                handler: function (item, el) {
                    let me = this,
                        dialog = this.up('dialog'),
                        form = dialog.down('formpanel'),
                        urlToSend = Env.ApiEndpoint + 'dashboard/kpi_export';
                    if (form.validate()) {
                        me.setDisabled(true);
                        let values = form.getValues();
                        if (values.from) {
                            values.from = moment(values.from).local().format('YYYY-MM-DD HH:mm:ss');
                        }
                        if (values.to) {
                            values.to = moment(values.to).local().format('YYYY-MM-DD HH:mm:ss');
                        }
                        values.is_custom = dialog.getVM().get('is_custom');
                        var req = new XMLHttpRequest();
                        req.open('POST', urlToSend, true);
                        req.responseType = 'blob';
                        req.onload = function (event) {
                            if (this.status === 200) {
                                me.toggle();
                                var blob = req.response;
                                var fileName = 'Appointments Report';
                                var link = document.createElement('a');
                                link.href = window.URL.createObjectURL(blob);
                                link.download = fileName + '.pdf';
                                link.click();
                                Ext.toast('Document created', 1500);
                                dialog.destroy();
                                mixpanel.track('Main dashboard export');
                            }
                            if (this.status === 403) {
                                var reader = new FileReader();
                                reader.onloadend = function () {
                                    var jsonResponse = JSON.parse(reader.result);
                                    Ext.Msg.alert('Warning', jsonResponse.error);
                                    me.setDisabled(false);
                                    me.toggle();
                                };
                                reader.readAsText(req.response);
                            }
                        };
                        req.send(JSON.stringify(values));
                    } else {
                        me.setDisabled(false);
                        me.toggle();
                        Ext.Msg.alert('Warning', 'Please fill all fields!');
                    }
                },
            },
        ],
    },
});
