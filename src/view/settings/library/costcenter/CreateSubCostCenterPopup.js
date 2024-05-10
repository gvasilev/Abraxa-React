Ext.define('Abraxa.view.settings.library.cost_center.CreateSubCostCenterPopup', {
    xtype: 'CreateSubCostCenterPopup',
    extend: 'Ext.Dialog',
    controller: 'CostCenterController',
    cls: 'a-dialog-create a-dialog-has-icon',
    title: '<div class="a-badge a-badge-default"><i class="md-icon-outlined">finance_chip</i></div>Create sub-cost center',
    closable: true,
    draggable: false,
    width: 480,
    padding: '0 24 24',
    buttons: {
        ok: {
            text: 'Create',
            ui: 'action loading',
            enableToggle: true,
            reference: 'saveSubCostCenterButton',
            publishes: 'pressed',
            bind: {
                text: '{saveSubCostCenterButton.pressed ? "Saving..." : "Create"}',
                disabled: '{saveSubCostCenterButton.pressed}',
            },
            handler: 'createSubCostCenter',
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
                    placeholder: 'Enter sub-cost center name',
                    required: true,
                    name: 'sub_cost_center_name',
                    bind: {
                        value: '{subCostCenter.name}',
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
                    label: 'Sub-cost center ID',
                    labelAlign: 'left',
                    ui: 'hovered-border classic',
                    name: 'cost_center_id',
                    cls: 'a-field-icon icon-short icon-rounded',
                    placeholder: 'Sub-cost center ID',
                    bind: {
                        value: '{subCostCenter.reference_id}',
                    },
                },
            ],
        },
    ],
});
