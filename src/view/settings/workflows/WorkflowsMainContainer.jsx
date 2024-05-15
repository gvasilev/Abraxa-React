Ext.define('Abraxa.view.settings.workflows.WorkflowsMainContainer', {
    extend: 'Ext.Container',
    xtype: 'settings.workflows.main.container',
    layout: 'vbox',
    flex: 1,
    scrollable: true,
    items: [
        {
            xtype: 'container',
            layout: 'vbox',
            flex: 1,
            items: [
                {
                    xtype: 'container',
                    cls: 'a-settings-main',
                    layout: 'vbox',
                    flex: 1,
                    items: [
                        {
                            xtype: 'container',
                            items: [
                                {
                                    xtype: 'div',
                                    html: '<h1 class="fw-n">Approval rules settings</h1>',
                                },
                                {
                                    xtype: 'div',
                                    html: '<p class="text-info">Setup and customize powerful multi-layer approval rules in order to accommodate your internal organizational processes.</p>',
                                },
                                {
                                    xtype: 'div',
                                    margin: '16 0',
                                    html: '<hr>',
                                },
                                {
                                    xtype: 'button',
                                    text: 'Workflow',
                                    ui: 'action small',
                                    iconCls: 'md-icon-add',
                                    bind: {
                                        permission: '{userPermissions}',
                                    },
                                    handler: function (btn, e) {
                                        Ext.create('Abraxa.view.settings.workflows.CreateWorkflow', {
                                            viewModel: {
                                                parent: btn.upVM(),
                                                data: {
                                                    isEdit: false,
                                                },
                                                links: {
                                                    workflow: {
                                                        type: 'Abraxa.model.settings.workflows.Workflow',
                                                        create: {
                                                            type: 'disbursement',
                                                        },
                                                    },
                                                },
                                                stores: {
                                                    approvals: Ext.create('Ext.data.Store', {
                                                        proxy: {
                                                            type: 'memory',
                                                        },
                                                        data: [
                                                            {
                                                                roles: null,
                                                                override: false,
                                                            },
                                                        ],
                                                    }),
                                                },
                                            },
                                        }).show();
                                    },
                                },
                                {
                                    xtype: 'container',
                                    layout: 'vbox',
                                    flex: 1,
                                    cls: 'a-workflows-list',
                                    scrollable: true,
                                    items: [
                                        {
                                            xtype: 'list',
                                            bind: {
                                                store: '{workflows}',
                                            },
                                            itemConfig: {
                                                viewModel: true,
                                                xtype: 'container',
                                                cls: 'a-bordered-list a-workflow-list-item',
                                                layout: {
                                                    type: 'hbox',
                                                    align: 'middle',
                                                    pack: 'space-between',
                                                },
                                                items: [
                                                    {
                                                        xtype: 'container',
                                                        cls: 'a-workflow-name-container',
                                                        layout: {
                                                            type: 'hbox',
                                                            align: 'middle',
                                                        },
                                                        items: [
                                                            {
                                                                xtype: 'div',
                                                                cls: 'a-badge a-badge-bg-green-50 a-badge-x32 mr-16',
                                                                html: '<i class="md-icon md-20">rebase</i>',
                                                            },
                                                            {
                                                                xtype: 'div',
                                                                cls: 'a-workflow-name',
                                                                bind: {
                                                                    html: '<div><a class="fs-16 fw-b edit_workflow" href="javascript:void(0);">{record.name}</a></div><div class="sm-title">{record.rules_count} rules applied</div>',
                                                                },
                                                                listeners: {
                                                                    click: {
                                                                        element: 'element',
                                                                        delegate: 'a.edit_workflow',
                                                                        fn: function fn(element, htmlEl, c) {
                                                                            let cmp = this.component;
                                                                            let vm = cmp.upVM();
                                                                            let workflow = vm.get('record');
                                                                            Ext.create(
                                                                                'Abraxa.view.settings.workflows.CreateWorkflow',
                                                                                {
                                                                                    viewModel: {
                                                                                        parent: cmp.upVM(),
                                                                                        data: {
                                                                                            workflow: workflow,
                                                                                            isEdit: true,
                                                                                        },
                                                                                        stores: {
                                                                                            approvals: Ext.create(
                                                                                                'Ext.data.Store',
                                                                                                {
                                                                                                    proxy: {
                                                                                                        type: 'memory',
                                                                                                    },
                                                                                                    data: workflow.get(
                                                                                                        'approvers'
                                                                                                    ),
                                                                                                }
                                                                                            ),
                                                                                        },
                                                                                    },
                                                                                }
                                                                            ).show();
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                        ],
                                                    },
                                                    {
                                                        xtype: 'container',
                                                        cls: 'a-workflow-info-actions-container',
                                                        layout: {
                                                            type: 'hbox',
                                                            align: 'middle',
                                                            pack: 'end',
                                                        },
                                                        items: [
                                                            {
                                                                xtype: 'public.updated.by',
                                                                cls: 'a-workflow-updated hbox',
                                                                bind: {
                                                                    data: {
                                                                        user: '{record.updated_by}',
                                                                        updated_at: '{record.updated_at}',
                                                                    },
                                                                },
                                                            },
                                                            // {
                                                            //     xtype: 'div',
                                                            //     cls: 'a-workflow-updated hbox',
                                                            //     bind: {
                                                            //         html: '<div class="a-person a-icon-round"><img height="30" src="https://static.abraxa.com/images/profile/DPN.jpg"></div><div class="a-date">{record.updatedOn}</div>'
                                                            //     }
                                                            // },
                                                            {
                                                                xtype: 'div',
                                                                cls: 'a-sep-action',
                                                            },
                                                            {
                                                                xtype: 'checkboxfield',
                                                                ui: 'switch icon',
                                                                label: false,
                                                                bind: {
                                                                    checked: '{record.is_enabled}',
                                                                    tooltip: {
                                                                        anchorToTarget: true,
                                                                        anchor: true,
                                                                        align: 'bc-tc?',
                                                                        showDelay: 0,
                                                                        hideDelay: 0,
                                                                        dismissDelay: 0,
                                                                        allowOver: false,
                                                                        closeAction: 'destroy',
                                                                        html: '{record.is_enabled ? "Deactivate" : "Activate"}',
                                                                    },
                                                                    listeners: {
                                                                        change: function (me, newValue) {
                                                                            let workflow = me.upVM().get('record');
                                                                            workflow.set('is_enabled', newValue);
                                                                            if (workflow.dirty) {
                                                                                workflow.save({
                                                                                    success: function () {
                                                                                        Ext.toast(
                                                                                            'Record updated',
                                                                                            1000
                                                                                        );
                                                                                    },
                                                                                    failure: function (batch) {
                                                                                        workflow.reject();
                                                                                        let response =
                                                                                            batch.operations[0].error
                                                                                                .response.responseJson;
                                                                                        Ext.Msg.alert(
                                                                                            'Something went wrong',
                                                                                            response.message
                                                                                        );
                                                                                    },
                                                                                });
                                                                            }
                                                                        },
                                                                    },
                                                                },
                                                            },
                                                            {
                                                                xtype: 'button',
                                                                ui: 'tool round',
                                                                iconCls: 'md-icon md-icon-delete',
                                                                tooltip: {
                                                                    anchorToTarget: true,
                                                                    anchor: true,
                                                                    html: 'Delete',
                                                                    align: 'bc-tc?',
                                                                    showDelay: 0,
                                                                    hideDelay: 0,
                                                                    dismissDelay: 0,
                                                                    allowOver: false,
                                                                    closeAction: 'destroy',
                                                                },
                                                                handler: function (me) {
                                                                    let workflow = me.upVM().get('record'),
                                                                        workflows = me.upVM().get('workflows');
                                                                    Ext.Msg.confirm(
                                                                        'Delete',
                                                                        'Are you sure you would like to delete this row?',
                                                                        function (answer) {
                                                                            if (answer != 'yes') return;
                                                                            workflows.remove(workflow);
                                                                            workflows.sync({
                                                                                success: function () {
                                                                                    Ext.toast('Record updated');
                                                                                },
                                                                                failure: function (batch) {
                                                                                    let response =
                                                                                        batch.operations[0].error
                                                                                            .response.responseJson;
                                                                                    Ext.Msg.alert(
                                                                                        'Warning',
                                                                                        response.message
                                                                                    );
                                                                                    // workflows.add(workflow);
                                                                                    workflows.rejectChanges();
                                                                                },
                                                                            });
                                                                        },
                                                                        this,
                                                                        [
                                                                            {
                                                                                xtype: 'button',
                                                                                itemId: 'no',
                                                                                margin: '0 8 0 0',
                                                                                text: 'Cancel',
                                                                            },
                                                                            {
                                                                                xtype: 'button',
                                                                                itemId: 'yes',
                                                                                ui: 'decline alt',
                                                                                text: 'Delete',
                                                                            },
                                                                        ]
                                                                    );
                                                                },
                                                            },
                                                        ],
                                                    },
                                                ],
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});
