Ext.define('Abraxa.view.settings.library.cost_center.CreateCostCenterPopup', {
    xtype: 'CreateCostCenterPopup',
    extend: 'Ext.Dialog',
    controller: 'CostCenterController',
    cls: 'a-dialog-create a-dialog-has-icon',
    title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">finance_chip</i></div>Create cost center',
    closable: true,
    draggable: false,
    width: 480,
    padding: '0 24 24',
    buttons: {
        ok: {
            text: 'Create',
            ui: 'action loading',
            enableToggle: true,
            reference: 'saveCostCenterAssignmentButton',
            publishes: 'pressed',
            bind: {
                text: '{saveCostCenterAssignmentButton.pressed ? "Saving..." : "Create"}',
                disabled: '{saveCostCenterAssignmentButton.pressed}',
            },
            handler: 'createCostCenter',
        },
        cancel: {
            text: 'Cancel',
            margin: '0 8',
            handler: function () {
                this.up('dialog').destroy();
            },
        },
    },
    items: [
        {
            xtype: 'formpanel',
            items: [
                {
                    xtype: 'textfield',
                    ui: 'field-xl no-border',
                    label: false,
                    placeholder: 'Enter cost center name',
                    required: true,
                    name: 'cost_center_name',
                    bind: {
                        value: '{costCenter.name}',
                    },
                    listeners: {
                        painted: function () {
                            this.setError(false);
                            this.focus();
                        },
                    },
                },
                {
                    xtype: 'textfield',
                    label: 'Cost center ID',
                    labelAlign: 'left',
                    ui: 'hovered-border classic',
                    name: 'cost_center_id',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'Cost center ID',
                    bind: {
                        value: '{costCenter.reference_id}',
                    },
                },
            ],
        },
    ],
});
