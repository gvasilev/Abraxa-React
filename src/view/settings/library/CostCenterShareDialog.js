Ext.define('Abraxa.view.settings.lirbrary.CostCenterShareDialog', {
    extend: 'Ext.Dialog',
    xtype: 'CostCenterShareDialog',
    cls: 'a-dialog-create a-dialog-create-portcall a-dialog-has-icon',
    showAnimation: 'pop',
    layout: 'vbox',
    padding: 22,
    width: 540,
    minHeight: 300,
    maxHeight: 700,
    draggable: false,
    title: '<div class="a-badge a-badge-default"><i class="md-icon">share</i></div>Share with agents',
    tools: {
        close: {
            tooltip: {
                showOnTap: true,
                html: 'Close',
                align: 'bc-tc?',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
            },
            handler: 'comfirmCancel',
        },
    },
    controller: 'costcenterShareDialogController',
    viewModel: {
        stores: {
            selectedAgents: {
                data: [],
            },
        },
        data: {
            changes: false,
            confirmButtonText: 'Share',
            disabledConfirmButton: true,
            hideInfoText: false,
        },

        formulas: {
            checkSelectedAgentsStatus: {
                bind: {
                    bindTo: '{selectedAgents}',
                    deep: true,
                },
                get: function (selectedAgents) {
                    this.set({
                        hideInfoText: !selectedAgents.count(),
                    });
                },
            },
        },
    },

    items: [
        {
            xtype: 'combobox',
            margin: '0 0 10 0',
            cls: 'a-field-icon icon-search',
            ui: 'classic ',
            placeholder: 'Choose company',
            valueField: 'id',
            displayField: 'name',
            queryMode: 'local',
            forceSelection: true,
            store: {
                type: 'AgentsStore',
                sorters: [
                    {
                        property: 'name',
                        direction: 'ASC',
                    },
                ],
            },
            listeners: {
                expand: 'adjustComboStore',
                select: 'addAgent',
            },
            itemTpl: '<div class="a-item-text fw-b">{name}</div><span class="c-grey">{email}</span>',
        },
        {
            xtype: 'container',
            hidden: false,
            bind: {
                hidden: '{hideInfoText}',
            },

            items: [
                {
                    xtype: 'component',
                    margin: '0 0 15 0',
                    html: '<div style="font-size: 13px; display: flex;justify-content: space-around; color: #546E7A;">These agents can use your Accounnting codes and Cost centers when creating DAs.</div>',
                },
                {
                    xtype: 'component',
                    html: '<div style=" border-top: 0.5px solid #B0BEC5; height: 0;width: 100%; "></div>',
                },
            ],
        },
        {
            xtype: 'container',
            scrollable: true,
            maxHeight: 400,
            items: [
                {
                    xtype: 'list',
                    itemId: 'selectedAgentsList',
                    cls: 'a-menu-list ',
                    bind: {
                        store: '{selectedAgents}',
                    },
                    selectable: {
                        deselectable: false,
                    },
                    itemConfig: {
                        viewModel: {},
                        cls: 'a-item',
                        xtype: 'container',
                        padding: '6 2 6 2',
                        layout: {
                            type: 'hbox',
                            align: 'center',
                        },
                        style: {
                            borderBottom: '0.5px solid #B0BEC5',
                            width: '100%',
                        },
                        items: [
                            {
                                xtype: 'div',
                                bind: {
                                    html: '<div class="a-item-text fw-b">{record.name}</div><span class="c-grey">{record.email}</span>',
                                },
                                flex: 1,
                            },
                            {
                                xtype: 'button',
                                iconCls: 'md-icon-delete',
                                ui: 'round tool-round-md',
                                tooltip: {
                                    anchorToTarget: true,
                                    html: 'Remove access',
                                    align: 'bc-tc?',
                                    showDelay: 0,
                                    hideDelay: 0,
                                    dismissDelay: 0,
                                    allowOver: false,
                                    closeAction: 'destroy',
                                },
                                handler: 'removeAgent',
                            },
                        ],
                    },
                },
            ],
        },
    ],
    bbar: {
        items: [
            '->',
            {
                xtype: 'button',
                text: 'Cancel',
                margin: '0 8',
                handler: 'comfirmCancel',
            },
            {
                xtype: 'button',
                text: 'Share',
                enableToggle: true,
                ui: 'action loading',
                bind: {
                    text: '{confirmButtonText}',
                    disabled: '{!changes}',
                },
                handler: 'saveChanges',
            },
        ],
    },
});
