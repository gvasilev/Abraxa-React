Ext.define('Abraxa.view.voyages.create.VoyagesAgentInformation', {
    extend: 'Ext.form.Panel',
    xtype: 'voyages.agent.information',
    reference: 'voyages_create_agent_information',
    header: false,
    style: 'margin: 8px auto;',
    width: '70%',
    items: [
        {
            xtype: 'abraxa.formlist',
            scrollable: false,
            variableHeights: true,
            bind: {
                store: '{voyage.invitations}',
            },
            itemConfig: {
                xtype: 'container',
                margin: '8 8 16 8',
                cls: 'main-container',
                style: 'background-color: #fff; border-radius: 4px;',
                shadow: true,
                viewModel: {
                    formulas: {
                        _action_button: function (get) {
                            var store = this.getView().getParent().getStore();
                            if (store.indexOf(get('record')) == 0) {
                                return true;
                            }
                            return false;
                        },
                    },
                },
                items: [
                    {
                        xtype: 'container',
                        padding: '16',
                        layout: {
                            type: 'hbox',
                        },
                        items: [
                            {
                                xtype: 'button',
                                bind: {
                                    hidden: '{_action_button}',
                                },
                                iconCls: 'md-icon-close',
                                ui: 'round tool-round-md',
                                arrow: false,
                                right: 8,
                                top: 8,
                                tooltip: {
                                    showOnTap: true,
                                    html: 'Remove',
                                    align: 'bc-tc?',
                                    showDelay: 0,
                                    hideDelay: 0,
                                    dismissDelay: 0,
                                    allowOver: false,
                                    closeAction: 'destroy',
                                },
                                handler: function () {
                                    this.up('voyages\\.agent\\.information')
                                        .down('abraxa\\.formlist')
                                        .getStore()
                                        .remove(this.upVM().get('record'));
                                },
                            },
                        ],
                    },
                    {
                        xtype: 'container',
                        padding: '0 16 16 16',
                        items: [
                            {
                                xtype: 'fieldcontainer',
                                margin: 0,
                                defaults: {
                                    ui: 'classic',
                                    labelAlign: 'top',
                                    flex: 1,
                                },
                                items: [
                                    {
                                        xtype: 'organization.combo',
                                        label: 'Company name',
                                        valueField: 'org_id',
                                        queryMode: 'local',
                                        placeholder: 'Choose Company',
                                        flex: 1,
                                        margin: '0 6 0 0',
                                        disabled: false,
                                        required: true,
                                        bind: {
                                            store: '{organizations}',
                                            value: '{record.org_id}',
                                            disabled: '{editMode && !record.phantom}',
                                        },
                                        listeners: {
                                            select: function () {
                                                let selection = this.getSelection(),
                                                    record = this.upVM().get('record');

                                                let companyRecord = this.lookupViewModel().get('record');
                                                companyRecord.set('org_email', selection.get('org_email'));
                                                companyRecord.set('org_phone', selection.get('org_phone'));
                                                record.set('org_name', selection.get('org_name'));
                                            },
                                        },
                                    },
                                    {
                                        xtype: 'textfield',
                                        itemId: 'company_email',
                                        label: 'Email',
                                        placeholder: 'Company email',
                                        flex: 1,
                                        margin: '0 0 0 6',
                                        bind: {
                                            value: '{record.org_email}',
                                        },
                                        disabled: true,
                                    },
                                    {
                                        xtype: 'textfield',
                                        label: 'Phone',
                                        margin: '0 0 0 6',
                                        placeholder: 'Company phone',
                                        flex: 1,
                                        bind: {
                                            value: '{record.org_phone}',
                                        },
                                        disabled: true,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
        },
        {
            xtype: 'button',
            text: 'Add',
            ui: 'btn-sm round raised normal',
            margin: '0 8 8',
            iconCls: 'md-icon-add',
            trigger: false,
            handler: function () {
                this.up('voyages\\.agent\\.information').down('abraxa\\.formlist').getStore().add({});
            },
        },
    ],
});
