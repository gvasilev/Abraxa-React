import '../../../../../view/common/combo/PortsServed';
import '../../../../../core/components/combo/PortRemote';

Ext.define('Abraxa.view.settings.users_teams.teams.rules.CreateRule', {
    extend: 'Ext.Dialog',
    xtype: 'settings.rules.create',
    cls: 'a-dialog-create a-dialog-has-icon',
    manageBorders: false,
    scrollable: 'y',
    width: 540,
    minHeight: 340,
    maxHeight: 860,
    padding: 0,
    showAnimation: 'pop',
    closable: true,
    draggable: false,
    maximizable: false,
    maximized: false,
    bind: {
        title: '<div class="a-badge a-badge-rules"><i class="md-icon-outlined">filter_alt</i></div>{editMode ? "Edit rule":"Create rule"}',
    },
    items: [
        {
            xtype: 'container',
            flex: 1,
            layout: 'vbox',
            items: [
                {
                    xtype: 'formpanel',
                    padding: '0 24 0 72',
                    flex: 1,
                    scrollable: 'y',
                    layout: 'vbox',
                    items: [
                        {
                            xtype: 'form.error',
                            hidden: true,
                            margin: 0,
                            padding: 8,
                            docked: 'top',
                        },
                        {
                            xtype: 'combobox',
                            testId: 'addRuleDialogPropertyTestId',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-filter icon-rounded',
                            placeholder: 'Choose property',
                            label: 'Property',
                            labelAlign: 'left',
                            flex: 1,
                            valueField: 'id',
                            required: true,
                            displayField: 'name',
                            queryMode: 'local',
                            bind: {
                                store: '{rulesSource}',
                                value: '{record.property}',
                            },
                            listeners: {
                                beforequery: function () {
                                    let store = this.upVM().get('filteredRules');
                                    if (store) {
                                        this.setStore(store);
                                    }
                                },
                                expand: function () {
                                    let store = this.upVM().get('filteredRules');
                                    if (store) {
                                        this.setStore(store);
                                    }
                                },
                                beforepickercreate: function () {
                                    let store = this.upVM().get('filteredRules');
                                    if (store) {
                                        this.setStore(store);
                                    }
                                },
                                focusleave: function () {
                                    let store = this.upVM().get('rulesSource');
                                    if (store) {
                                        this.setStore(store);
                                    }
                                },
                                change: function (me, newValue, oldValue) {
                                    let store = this.upVM().get('rulesSource');
                                    let editMode = this.upVM().get('editMode');
                                    if (store) {
                                        this.setStore(store);
                                    }
                                    if (newValue) {
                                        let record = me.upVM().get('record');
                                        if (record.get('value') && !editMode) {
                                            record.set('value', null);
                                        }
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'combobox',
                            testId: 'addRuleDialogConditionTestId',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-functions icon-rounded',
                            placeholder: 'Choose condition',
                            label: 'Condition',
                            labelAlign: 'left',
                            flex: 1,
                            valueField: 'id',
                            required: true,
                            displayField: 'name',
                            queryMode: 'local',
                            store: {
                                data: [
                                    {
                                        id: 'in',
                                        name: 'Equals',
                                    },
                                    {
                                        id: 'not in',
                                        name: 'Does not equal',
                                    },
                                ],
                            },
                            bind: {
                                value: '{record.condition}',
                            },
                        },
                        {
                            xtype: 'ports.served.combo',
                            testId: 'addRuleDialogValueTestIdPortServed',
                            label: 'Port',
                            labelAlign: 'left',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-port icon-rounded',
                            multiSelect: true,
                            forceSelection: false,
                            placeholder: 'Choose ports',
                            hidden: true,
                            required: true,
                            bind: {
                                value: '{record.port_value}',
                                hidden: '{(currentUser.company.type == "principal" ? true:false) || (record.property == "port_id"  ? false:true)}',
                                required: '{record.property == "port_id" ? true:false}',
                                placeholder: '{record.value ? "":"Choose ports"}',
                            },
                        },
                        {
                            xtype: 'portRemoteCombo',
                            label: 'Port',
                            labelAlign: 'left',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-port icon-rounded',
                            multiSelect: true,
                            forceSelection: true,
                            placeholder: 'Choose ports',
                            bind: {
                                value: '{record.port_value}',
                                hidden: '{(currentUser.company.type == "agent" ? true:false) || (record.property == "port_id"  ? false:true)}',
                                required: '{record.property == "port_id" ? true:false}',
                                placeholder: '{record.value ? "":"Choose ports"}',
                            },
                            listeners: {
                                painted: function (me) {
                                    let store = me.getStore();
                                    store.getProxy().setExtraParams({});
                                    let rule = me.upVM().get('record');
                                    if (rule.get('value')) {
                                        store.getProxy().setExtraParams({
                                            ports: JSON.stringify(rule.get('value')),
                                        });
                                    }
                                    store.load({
                                        callback: function (records, operation, success) {
                                            if (success) {
                                                me.setValue(rule.get('value'));
                                            }
                                        },
                                    });
                                },
                            },
                        },
                        {
                            xtype: 'combobox',
                            label: 'Appointing party',
                            placeholder: 'Choose office',
                            labelAlign: 'left',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-business-center icon-rounded',
                            editable: false,
                            displayField: 'office_name',
                            valueField: 'id',
                            queryMode: 'local',
                            forceSelection: false,
                            multiSelect: true,
                            bind: {
                                store: '{offices}',
                                value: '{record.office_value}',
                                required: '{record.property == "appointing_party_email" ? true:false}',
                                placeholder: '{record.value ? "":"Choose office"}',
                                hidden: '{(currentUser.company.type == "agent" ? true:false) || (record.property == "appointing_party_email"  ? false:true)}',
                            },
                        },
                        {
                            xtype: 'selectfield',
                            testId: 'addRuleDialogValueTestIdPortFunction',
                            label: 'Port function',
                            labelAlign: 'left',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-short icon-rounded',
                            placeholder: 'Choose function',
                            queryMode: 'local',
                            valueField: 'name',
                            displayField: 'name',
                            multiSelect: true,
                            forceSelection: false,
                            hidden: true,
                            required: true,
                            bind: {
                                value: '{record.port_function_value}',
                                store: '{berthFunctions}',
                                placeholder: '{record.value ? "":"Choose function"}',
                                hidden: '{record.property == "port_function"  ? false:true}',
                                required: '{record.property == "port_function"  ? true:false}',
                            },
                        },
                        {
                            xtype: 'organization.combo',
                            testId: 'addRuleDialogValueTestIdOrganization',
                            label: 'Organization',
                            labelAlign: 'left',
                            placeholder: 'Choose company',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-business-center icon-rounded',
                            floatedPicker: {
                                cls: 'a-organization-combo a-combo-has-check',
                                minWidth: 220,
                            },
                            hidden: true,
                            required: true,
                            multiSelect: true,
                            bind: {
                                value: '{record.organization_value}',
                                placeholder: '{record.value ? "":"Choose company"}',
                                valueField: '{record.property == "principal_org_id"  ? "org_id":"org_name"}',
                                hidden: '{(currentUser.company.type == "principal" ? true:false) || (record.property == "principal_org_id"  ? false:true)}',
                                required: '{record.property == "principal_org_id"  ? true:false}',
                            },

                            listeners: {
                                painted: function (me) {
                                    let record = this.upVM().get('record');
                                    if (record.get('property') == 'principal_org_id' && record.get('value')) {
                                        me.getStore()
                                            .getProxy()
                                            .setUrl(
                                                Env.ApiEndpoint +
                                                    'organizations-remote?org_ids=' +
                                                    JSON.stringify(record.get('value'))
                                            );
                                        me.getStore().load({
                                            callback: function (records, operation, success) {
                                                let values = [];
                                                Ext.Array.each(records, function (organization) {
                                                    values.push(organization.get('org_id'));
                                                });
                                                me.setValue(values);
                                                me.getStore()
                                                    .getProxy()
                                                    .setUrl(Env.ApiEndpoint + 'organizations-remote');
                                            },
                                            scope: this,
                                        });
                                    }
                                },
                                beforequery: function (query) {
                                    let me = this,
                                        store = query.combo.getStore(),
                                        selections = this.getSelection();
                                    if (selections && selections.length) {
                                        let values = [];
                                        Ext.Array.each(selections, function (selection) {
                                            values.push(selection.get('org_id'));
                                        });
                                        store
                                            .getProxy()
                                            .setUrl(
                                                Env.ApiEndpoint +
                                                    'organizations-remote?org_ids=' +
                                                    JSON.stringify(values)
                                            );
                                        store.on('load', function (store, records, options) {
                                            me.getStore()
                                                .getProxy()
                                                .setUrl(Env.ApiEndpoint + 'organizations-remote');
                                        });
                                    }
                                },
                                show: function (me) {
                                    let record = this.upVM().get('record');
                                    if (record.get('property') == 'principal_org_id' && record.get('value')) {
                                        me.getStore()
                                            .getProxy()
                                            .setUrl(
                                                Env.ApiEndpoint +
                                                    'organizations-remote?org_ids=' +
                                                    JSON.stringify(record.get('value'))
                                            );
                                        me.getStore().load({
                                            callback: function (records, operation, success) {
                                                let values = [];
                                                Ext.Array.each(records, function (selection) {
                                                    values.push(selection.get('org_id'));
                                                });
                                                me.setValue(values);
                                                me.getStore()
                                                    .getProxy()
                                                    .setUrl(Env.ApiEndpoint + 'organizations-remote');
                                            },
                                            scope: this,
                                        });
                                    }
                                },
                            },
                        },
                        {
                            xtype: 'selectfield',
                            label: 'Agency type',
                            testId: 'addRuleDialogValueTestIdAgency',
                            labelAlign: 'left',
                            ui: 'classic hovered-border',
                            cls: 'a-field-icon icon-short icon-rounded non-editable',
                            forceSelection: true,
                            clearable: true,
                            placeholder: 'Choose type',
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'id',
                            hidden: true,
                            required: true,
                            multiSelect: true,
                            bind: {
                                store: '{agencyTypes}',
                                value: '{record.agency_type_value}',
                                placeholder: '{record.value ? "":"Choose type"}',
                                hidden: '{record.property == "agency_type"  ? false:true}',
                                required: '{record.property == "agency_type"  ? true:false}',
                            },
                            listeners: {
                                painted: function (me) {
                                    me.setError(null);
                                },
                            },
                        },
                    ],
                },
            ],
        },
    ],
    buttons: [
        {
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: function () {
                this.up('dialog').upVM().get('record').reject();
                this.up('dialog').destroy();
            },
        },
        {
            xtype: 'button',
            testId: 'addRuleDialogSaveBtnTestId',
            ui: 'action',
            bind: {
                text: '{editMode ? "Save":"Create"}',
            },
            handler: function (me) {
                let dialog = me.up('dialog'),
                    form = dialog.down('formpanel'),
                    vm = me.upVM(),
                    team = vm.get('team'),
                    store = vm.get('rules');
                if (form.validate()) {
                    dialog.down('form\\.error').setHtml('').hide().removeCls('error');
                    let record = vm.get('record'),
                        editMode = vm.get('editMode');
                    if (editMode) {
                        store.sync({
                            success: function (batch, opt) {
                                if (team) {
                                    team.rules().commitChanges();
                                    team.set('auto_update', new Date());
                                }
                                Ext.toast('Record updated', 1000);
                            },
                            failure: function (batch, operations) {
                                Ext.Msg.alert('Something went wrong', 'Cannot update rule!');
                            },
                        });
                        dialog.destroy();
                    } else {
                        store.add(record);
                        store.sync({
                            success: function (batch, opt) {
                                if (team) {
                                    team.rules().commitChanges();
                                    team.set('auto_update', new Date());
                                }
                                Ext.toast('Record created', 1000);
                                dialog.destroy();
                            },
                            failure: function (batch, operations) {
                                Ext.Msg.alert('Something went wrong', 'Cannot create rule!');
                            },
                        });
                    }
                } else {
                    dialog.down('form\\.error').setHtml('Please fill in all required fields').show().addCls('error');
                    me.toggle();
                }
            },
        },
    ],
});
