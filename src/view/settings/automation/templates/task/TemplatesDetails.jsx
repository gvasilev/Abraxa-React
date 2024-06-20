import './TaskItemsGrid';
import '../sof/SofItemsGrid';
import '../disbursement/DisbursementItemsGrid';

Ext.define('Abraxa.view.settings.templates.task.TemplatesDetails', {
    extend: 'Ext.Container',
    xtype: 'settings.templates.details',
    testId: 'settingsTemplatesTaskDetails',
    cls: 'a-settings-main needs_hide',
    scrollable: true,
    hideMode: 'offsets',
    itemId: 'templateDetails',
    hidden: true,
    flex: 1,
    layout: 'vbox',
    items: [
        {
            xtype: 'abraxa.titlebar',
            padding: 0,
            margin: '0 -12',
            bind: {
                title: '<div class="hbox"><span class="mr-4">{templateTitle}</span></div>',
            },
            items: [
                {
                    xtype: 'button',
                    margin: '0 16 0 0',
                    align: 'left',
                    iconCls: 'md-icon-keyboard-backspace',
                    testId: 'templatesTaskDetailsBackToTemplatesBtn',
                    ui: 'round default',
                    handler: function () {
                        let upContainer = Ext.ComponentQuery.query('[itemId=automationMainContainer]')[0],
                            downContainer = Ext.ComponentQuery.query('[itemId=templateDetails]')[0];
                        downContainer.setHidden(true);
                        upContainer.setHidden(false);
                    },
                },
            ],
        },
        {
            xtype: 'textfield',
            clearable: false,
            maxWidth: '50%',
            ui: 'field-xl no-border classic',
            label: false,
            placeholder: 'Enter template name',
            testId: 'templatesTaskDetailsTemplateNameField',
            bind: {
                value: '{templatesGrid.selection.name}',
            },
            required: true,
            listeners: {
                painted: function (me) {
                    me.focus();
                },
                blur: function (me) {
                    let record = me.upVM().get('templatesGrid.selection');
                    if (record && record.dirty) {
                        record.save({
                            success: function () {
                                Ext.toast('Record updated', 1000);
                            },
                        });
                    }
                },
            },
        },
        {
            xtype: 'textareafield',
            maxWidth: '50%',
            ui: 'no-border no-underline',
            cls: 'a-field-icon icon-short',
            placeholder: 'Enter description (optional)',
            testId: 'templatesTaskDetailsDescriptionField',
            bind: {
                value: '{templatesGrid.selection.description}',
            },
            listeners: {
                blur: function (me) {
                    let record = me.upVM().get('templatesGrid.selection');
                    if (record && record.dirty) {
                        record.save({
                            success: function () {
                                Ext.toast('Record updated', 1000);
                            },
                        });
                    }
                },
            },
        },
        {
            xtype: 'div',
            margin: '16 0 0 0',
            html: '<hr>',
        },
        {
            xtype: 'selectfield',
            label: 'Office',
            labelAlign: 'left',
            testId: 'templatesTaskDetailsOfficeField',
            valueField: 'id',
            displayField: 'office_name',
            cls: 'a-field-icon icon-rounded icon-business-center',
            queryMode: 'local',
            editable: false,
            placeholder: 'Choose an office',
            bind: {
                store: '{offices}',
                value: '{templatesGrid.selection.office_id}',
            },
            floatedPicker: {
                listeners: {
                    select: function (me, selection) {
                        const record = me.upVM().get('templatesGrid.selection');
                        const templatesStore = me.upVM().get('templates');
                        record.set('office_name', selection.get('office_name'));
                        templatesStore.sync({
                            success: function () {
                                Ext.toast(AbraxaConstants.messages.updateRecord, 1000);
                            },
                        });
                    },
                },
            },
        },
        {
            xtype: 'div',
            margin: '16 0 0 0',
            html: '<hr>',
        },
        {
            //task items grid
            xtype: 'settings.automation.tasks.items.grid',
            bind: {
                hidden: '{templatesTabs.activeTabIndex == 0 ? false:true}',
            },
            flex: 1,
        },
        {
            //sof items grid
            xtype: 'settings.automation.sof.items.grid',
            bind: {
                hidden: '{templatesTabs.activeTabIndex == 1 ? false:true}',
            },
            flex: 1,
        },
        {
            xtype: 'settings.automation.disbursement.items.grid',
            bind: {
                hidden: '{templatesTabs.activeTabIndex == 2 ? false:true}',
            },
            flex: 1,
        },
    ],
    listeners: {
        beforeshow: function (me) {
            const grid = me.lookupController().lookupReference('templatesGrid');
            const store = grid.getStore();
            const viewModel = me.upVM();
            if (store.isGrouped() === true) {
                // Remove grouping temporaly to avoid bug when TemplatesDetails is shown
                // but the grid in the background regroups and loses the chosen record.
                viewModel.set('groupedInitial', true);
                store.setGrouper(null);
                grid.setGrouped(false);
            } else {
                viewModel.set('groupedInitial', false);
            }
        },
        hide: function (me) {
            const viewModel = me.upVM();
            const grid = me.lookupController().lookupReference('templatesGrid');
            const store = grid.getStore();
            if (viewModel.get('groupedInitial') === true) {
                // Restore original grouping after TemplatesDetails is hidden, if it was removed.
                store.setGrouper({
                    property: 'office_name',
                });
                grid.setGrouped(true);
            }
        },
    },
});
