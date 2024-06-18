Ext.define('Abraxa.view.settings.workflows.DisbursementApprovalsContent', {
    extend: 'Ext.Container',
    xtype: 'DisbursementApprovalsContent',
    padding: 32,
    hidden: true,
    cls: 'a-dialog-card a-dialog-card-last',
    items: [
        {
            xtype: 'div',
            cls: 'h5',
            html: 'Approvers',
        },
        {
            xtype: 'container',
            cls: 'mt-16',
            layout: {
                type: 'hbox',
                align: 'middle',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'div',
                    cls: 'h3 m-0',
                    html: 'Then assign role',
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'c-blue-grey-500 mr-16',
                            html: 'Approve automatically',
                        },
                        {
                            xtype: 'checkboxfield',
                            ui: 'switch icon',
                            label: false,
                            bind: {
                                checked: '{workflow.approve_automatically}',
                            },
                            listeners: {
                                change: function (me, value) {
                                    if (!value) {
                                        let approvals = me.upVM().get('approvals');
                                        if (!approvals.getCount()) {
                                            approvals.add({
                                                roles: null,
                                                override: false,
                                            });
                                        }
                                    }
                                },
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-dialog-card-form',
            bind: {
                hidden: '{workflow.approve_automatically}',
            },
            items: [
                {
                    xtype: 'list',
                    cls: 'a-form-assign-role-list approvals_list',
                    bind: {
                        store: '{approvals}',
                    },
                    itemConfig: {
                        viewModel: {
                            formulas: {
                                recordIndex: {
                                    bind: {
                                        bindTo: '{record}',
                                        deep: true,
                                    },
                                    get: function (record) {
                                        if (record) {
                                            let store = record.store;
                                            return store.indexOf(record);
                                        }
                                    },
                                },
                            },
                        },
                        xtype: 'container',
                        cls: 'a-assign-role-item a-bb-100',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                            pack: 'space-between',
                        },
                        items: [
                            {
                                xtype: 'selectfield',
                                flex: 2,
                                clearable: false,
                                labelAlign: 'left',
                                ui: 'classic hovered-border',
                                cls: 'a-field-icon icon-rounded icon-manage-accounts',
                                padding: '8 0',
                                valueField: 'id',
                                displayField: 'name',
                                multiSelect: true,
                                bind: {
                                    store: '{roles}',
                                    placeholder: '{record.roles.length ? "" : "Any role"}',
                                    label: '{recordIndex+1} approver',
                                    value: '{record.roles}',
                                },
                            },
                            {
                                xtype: 'container',
                                flex: 1,
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                    pack: 'end',
                                },
                                bind: {
                                    hidden: '{recordIndex === 0 ? false:true}',
                                },
                                items: [
                                    {
                                        xtype: 'button',
                                        ui: 'tool round',
                                        iconCls: 'md-icon md-icon-add-circle',
                                        tooltip: {
                                            anchorToTarget: true,
                                            anchor: true,
                                            html: 'Add approver',
                                            align: 'bc-tc?',
                                            showDelay: 0,
                                            hideDelay: 0,
                                            dismissDelay: 0,
                                            allowOver: false,
                                            closeAction: 'destroy',
                                        },
                                        handler: function (me) {
                                            me.up('list').getStore().add({
                                                roles: null,
                                                override: false,
                                            });
                                        },
                                    },
                                ],
                            },
                            {
                                xtype: 'container',
                                flex: 1,
                                layout: {
                                    type: 'hbox',
                                    align: 'middle',
                                    pack: 'end',
                                },
                                bind: {
                                    hidden: '{recordIndex === 0 ? true:false}',
                                },
                                items: [
                                    {
                                        xtype: 'checkboxfield',
                                        bind: {
                                            checked: '{record.override}',
                                        },
                                        boxLabel: 'Override all above',
                                    },
                                    {
                                        xtype: 'div',
                                        cls: 'a-sep-action',
                                    },
                                    {
                                        xtype: 'button',
                                        ui: 'tool round',
                                        iconCls: 'md-icon md-icon-delete',
                                        tooltip: {
                                            anchorToTarget: true,
                                            anchor: true,
                                            html: 'Delete approver',
                                            align: 'bc-tc?',
                                            showDelay: 0,
                                            hideDelay: 0,
                                            dismissDelay: 0,
                                            allowOver: false,
                                            closeAction: 'destroy',
                                        },
                                        handler: function (me) {
                                            me.up('list').getStore().remove(me.upVM().get('record'));
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-dialog-card-info',
            bind: {
                cls: 'a-dialog-card-info { workflow.approve_automatically ? "a-form-show":""}',
            },
            items: [
                {
                    xtype: 'div',
                    cls: 'a-info-box',
                    html: '<i class="md-icon">info</i>I would like the system to send an automatic approval message to my vendor on behalf of my organization',
                },
            ],
        },
    ],
});
