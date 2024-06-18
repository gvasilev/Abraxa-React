import '../../../../core/components/combo/TemplateCombo';

Ext.define('Abraxa.view.portcalls.agent.TemplateContainer', {
    extend: 'Ext.Container',
    xtype: 'portcalls.template.container',
    cls: 'templates_container a-advanced-container',
    hidden: true,
    showAnimation: {
        type: 'slide',
        direction: 'left',
    },
    flex: 1,
    scrollable: false,
    items: [
        {
            xtype: 'container',
            padding: '0 24',
            layout: 'vbox',
            items: [
                {
                    xtype: 'container',
                    margin: '0 0 16 0',
                    cls: 'a-cargo-container',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-cargo-titlebar',
                            margin: '0 0 16 0',
                            items: [
                                {
                                    xtype: 'div',
                                    bind: {
                                        html: '<div class="a-cargo">Distribution groups</div>',
                                        cls: 'a-collapsible-title a-collapsible-trigger a-trigger-left',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            fn: function fn() {
                                                let component = this.component;
                                                component.toggleCls('is-collapsed');
                                                component
                                                    .up('container')
                                                    .up('container')
                                                    .down('[cls~=a-collapsible-container]')
                                                    .toggleCls('is-collapsed');
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            bind: {
                                cls: 'a-collapsible-container',
                            },
                            ui: 'bordered',
                            items: [
                                {
                                    xtype: 'mail.distribution.groups',
                                    margin: '0 0 0 24',
                                    cls: 'a-distribution-groups',
                                },
                                {
                                    xtype: 'container',
                                    padding: '8 36 0 36',
                                    docked: 'bottom',
                                    items: [
                                        {
                                            xtype: 'button',
                                            iconCls: 'md-icon-add',
                                            ui: 'normal small',
                                            text: 'Add group',
                                            slug: 'portcallReportAddDistributionGroup',
                                            bind: {
                                                permission: '{userPermissions}',
                                            },
                                            handler: function (me) {
                                                let object_record = me.upVM().get('object_record');
                                                Ext.create('Abraxa.view.mail.AddEditDistributionGroup', {
                                                    viewModel: {
                                                        parent: me.upVM(),
                                                        data: {
                                                            title: 'Create distribution group',
                                                            editMode: false,
                                                            fromPortcall: true,
                                                            record: Ext.create(
                                                                'Abraxa.model.distributionGroup.DistributionGroup',
                                                                {
                                                                    distributable_type: object_record.get('model_name'),
                                                                    distributable_id: object_record.get('id'),
                                                                }
                                                            ),
                                                        },
                                                    },
                                                }).show();
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'div',
                    cls: 'divider divider-offset',
                },
                {
                    xtype: 'container',
                    margin: '16 0 0 0',
                    cls: 'a-cargo-container',
                    slug: 'templateApply',
                    skipEditPermission: true,
                    bind: {
                        permission: '{userPermissions}',
                    },
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-cargo-titlebar',
                            items: [
                                {
                                    xtype: 'div',
                                    bind: {
                                        html: '<div class="a-cargo">Templates</div>',
                                        cls: 'a-collapsible-title a-collapsible-trigger a-trigger-left',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            fn: function fn() {
                                                let component = this.component;
                                                component.toggleCls('is-collapsed');
                                                component
                                                    .up('container')
                                                    .up('container')
                                                    .down('[cls~=a-collapsible-container]')
                                                    .toggleCls('is-collapsed');
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            maxWidth: 480,
                            margin: '16 42',
                            bind: {
                                cls: 'a-collapsible-container ',
                            },
                            ui: 'bordered',
                            items: [
                                {
                                    xtype: 'template.combo',
                                    placeholder: 'Choose template',
                                    templateType: 'task',
                                    labelAlign: 'left',
                                    minWidth: 250,
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    editable: false,
                                    label: 'Task template',
                                    slug: 'templateApply',
                                    bind: {
                                        store: '{taskTemplates}',
                                        permission: '{userPermissions}',
                                        value: '{object_record.task_template_id}',
                                    },
                                },
                                {
                                    xtype: 'template.combo',
                                    placeholder: 'Choose template',
                                    templateType: 'sof',
                                    minWidth: 250,
                                    editable: false,
                                    labelAlign: 'left',
                                    label: 'SOF template',
                                    ui: 'classic hovered-border',
                                    cls: 'a-field-icon icon-short icon-rounded',
                                    slug: 'templateApply',
                                    bind: {
                                        store: '{sofTemplates}',
                                        permission: '{userPermissions}',
                                        value: '{object_record.sof_template_id}',
                                    },
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
});
