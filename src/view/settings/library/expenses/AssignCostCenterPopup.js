Ext.define('Abraxa.view.settings.library.expenses.AssignCostCenterPopup', {
    xtype: 'AssignCostCenterPopup',
    extend: 'Ext.Dialog',
    width: 440,
    padding: '0 24 16 24',
    controller: 'ServiceLibraryController',
    cls: 'a-dialog-create a-dialog-has-icon',
    title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">finance_chip</i></div>Assign my cost center',
    closable: true,
    draggable: false,
    viewModel: {
        stores: {
            selectedCostCenters: {},
        },
    },
    items: [
        {
            xtype: 'div',
            cls: 'sm-text text-info mb-8',
            html: 'Choose a cost center to assign',
        },
        {
            xtype: 'list',
            cls: 'a-list',
            selectable: false,
            bind: {
                store: '{costCenterStore}',
            },
            itemConfig: {
                viewModel: true,
                xtype: 'listitem',
                cls: 'a-list-item cursor-pointer',
                tpl: '<div class="a-list-item-title">{name}</div>',
                items: [
                    {
                        xtype: 'checkbox',
                        margin: '0 12 0 0',
                        bind: {
                            checked: '{record.checked}',
                        },
                    },
                ],
            },
            listeners: {
                childtap: function (list, target, eOpts) {
                    let record = target.record,
                        selectedCostCenters = list.lookupViewModel().get('selectedCostCenters');

                    record.set('checked', !record.get('checked'));

                    if (record.get('checked')) {
                        selectedCostCenters.add(record);
                    } else {
                        selectedCostCenters.remove(record);
                    }
                },
            },
        },
    ],
    buttons: {
        ok: {
            text: 'Assign',
            ui: 'action loading',
            enableToggle: true,
            reference: 'saveCostCenterAssignmentButton',
            publishes: 'pressed',
            bind: {
                text: '{saveCostCenterAssignmentButton.pressed ? "Saving..." : "Assign"}',
                disabled: '{!selectedCostCenters.count || saveCostCenterAssignmentButton.pressed}',
            },
            handler: 'saveCostCenterAssignment',
        },
        cancel: {
            text: 'Cancel',
            margin: '0 8',
            handler: function () {
                this.up('dialog').destroy();
            },
        },
    },
});
