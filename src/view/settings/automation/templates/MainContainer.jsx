import './TemplatesGrid';

Ext.define('Abraxa.view.settings.automation.templates.MainContainer', {
    extend: 'Ext.Container',
    xtype: 'settings.automation.templates.main.container',
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
                                    html: '<h1 class="fw-n">Templates settings</h1>',
                                },
                                {
                                    xtype: 'div',
                                    cls: 'w-50',
                                    html: '<p class="text-info">Create and manage your templates in order to speed your repeatable work.</p>',
                                },
                                {
                                    xtype: 'div',
                                    margin: '16 0',
                                    html: '<hr>',
                                },
                                {
                                    xtype: 'container',
                                    layout: {
                                        type: 'hbox',
                                        align: 'middle',
                                        pack: 'space-between',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            testId: 'addTemplateBtnRulesAndTeamsSettingsTestId',
                                            text: 'Template',
                                            ui: 'action small',
                                            hideMode: 'opacity',
                                            iconCls: 'md-icon-add',
                                            slug: 'settingsTemplateCreate',
                                            bind: {
                                                permission: '{userPermissions}',
                                                hidden: '{templates.count ? false : true}',
                                            },
                                            handler: function (me) {
                                                let currentUserPlan = me.upVM().get('currentUserPlan');
                                                if (currentUserPlan == 'starter') {
                                                    Ext.create('Abraxa.view.main.UpgradeDialog').show();
                                                } else {
                                                    let type = this.upVM().get('templatesTabs').activeTab.type;
                                                    mixpanel.track('Template ' + type + ' - button');
                                                    Ext.create(
                                                        'Abraxa.view.settings.automation.templates.AddEditTemplate',
                                                        {
                                                            viewModel: {
                                                                parent: me.upVM(),
                                                                data: {
                                                                    title:
                                                                        'Create <span class="a-fix-' +
                                                                        type +
                                                                        '">&nbsp;' +
                                                                        type +
                                                                        '&nbsp;</span> template',
                                                                    editMode: false,
                                                                    record: Ext.create(
                                                                        'Abraxa.model.template.Template',
                                                                        {
                                                                            type: type,
                                                                        }
                                                                    ),
                                                                },
                                                            },
                                                        }
                                                    ).show();
                                                }
                                            },
                                        },
                                        {
                                            xtype: 'container',
                                            style: {
                                                borderRadius: '5%',
                                            },
                                            layout: 'hbox',
                                            items: [
                                                {
                                                    xtype: 'splitbutton',
                                                    text: 'Filter',
                                                    ui: 'tool-text-sm filter md-icon-filter-alt md-icon-outlined',
                                                    enableToggle: true,
                                                    margin: '0 0 0 8',
                                                    handler: function () {
                                                        this.showMenu();
                                                    },
                                                    arrowHandler: function () {
                                                        let button = this,
                                                            arrowCls = this.splitArrowElement.hasCls('x-arrow-el'),
                                                            gridStore = Ext.ComponentQuery.query(
                                                                '[xtype=settings\\.automation\\.templates\\.grid]'
                                                            )[0].getStore();
                                                        if (!arrowCls) {
                                                            let selected = Ext.ComponentQuery.query(
                                                                'menucheckitem[cls~=checkedTemplateItem][checked="true"]'
                                                            );
                                                            Ext.each(selected, function (value, index) {
                                                                value.setChecked(false);
                                                            });
                                                            button.setText('Filter');
                                                            button.splitArrowElement.removeCls('md-icon-close');
                                                            button.splitArrowElement.addCls('x-arrow-el');
                                                            button.removeCls('active');
                                                            gridStore.removeFilter(5555);
                                                        }
                                                    },
                                                    menu: {
                                                        listeners: {
                                                            painted: function (me) {
                                                                me.removeAll(true);
                                                                let gridStore = Ext.ComponentQuery.query(
                                                                        '[xtype=settings\\.automation\\.templates\\.grid]'
                                                                    )[0].getStore(),
                                                                    menuItems = [],
                                                                    button = me.up('button'),
                                                                    availableOffices = me
                                                                        .upVM()
                                                                        .get('offices')
                                                                        .getData()
                                                                        .getRange();
                                                                gridStore.removeFilter(5555);
                                                                Ext.each(availableOffices, function (office) {
                                                                    let menuItem = {
                                                                        xtype: 'menucheckitem',
                                                                        padding: '0 16',
                                                                        cls: 'checkedTemplateItem',
                                                                        text: office.get('office_name'),
                                                                        officeId: office.get('id'),
                                                                        listeners: {
                                                                            checkchange: function (cmp, checked) {
                                                                                let selected = Ext.ComponentQuery.query(
                                                                                    'menucheckitem[cls~=checkedTemplateItem][checked="true"]'
                                                                                );

                                                                                let selectedIds = [];
                                                                                Ext.Array.each(
                                                                                    selected,
                                                                                    function (checkedTemplate) {
                                                                                        selectedIds.push(
                                                                                            checkedTemplate.officeId
                                                                                        );
                                                                                    }
                                                                                );
                                                                                if (
                                                                                    selectedIds &&
                                                                                    selectedIds.length > 0
                                                                                ) {
                                                                                    gridStore.addFilter({
                                                                                        id: 5555,
                                                                                        filterFn: function (item) {
                                                                                            if (
                                                                                                Ext.Array.contains(
                                                                                                    selectedIds,
                                                                                                    item.get(
                                                                                                        'office_id'
                                                                                                    )
                                                                                                )
                                                                                            ) {
                                                                                                return item;
                                                                                            } else {
                                                                                                return false;
                                                                                            }
                                                                                        },
                                                                                    });
                                                                                    button.setText(
                                                                                        selected[0].getText()
                                                                                    );

                                                                                    if (selected.length > 1) {
                                                                                        button.setText(
                                                                                            selected[0].getText() +
                                                                                                ' +' +
                                                                                                (selected.length - 1)
                                                                                        );
                                                                                    }
                                                                                    button.splitArrowElement.removeCls(
                                                                                        'x-arrow-el'
                                                                                    );
                                                                                    button.splitArrowElement.addCls(
                                                                                        'md-icon-close'
                                                                                    );
                                                                                    button.addCls('active');
                                                                                } else {
                                                                                    button.setText('Filter');
                                                                                    button.splitArrowElement.removeCls(
                                                                                        'md-icon-close'
                                                                                    );
                                                                                    button.splitArrowElement.addCls(
                                                                                        'x-arrow-el'
                                                                                    );
                                                                                    button.removeCls('active');
                                                                                    gridStore.removeFilter(5555);
                                                                                }
                                                                            },
                                                                        },
                                                                    };
                                                                    menuItems.push(menuItem);
                                                                });
                                                                me.setItems(menuItems);
                                                            },
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'settings.automation.templates.grid',
                            flex: 1,
                            showNoPermissions: true,
                            slug: 'settingsTemplate',
                            bind: {
                                permission: '{userPermissions}',
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
