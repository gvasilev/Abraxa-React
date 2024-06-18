Ext.define('Abraxa.view.cdb.forms.FormAddNewRating', {
    xtype: 'company.create.rating',
    extend: 'Ext.Dialog',
    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',
    title: 'Create rating',
    ui: 'dialog-sm type3',
    manageBorders: false,
    closable: true,
    centered: true,
    width: 360,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    scrollable: true,
    defaults: {
        labelWidth: 60,
        labelSeparator: '',
        ui: 'classic',
        labelAlign: 'top',
    },
    items: [
        {
            xtype: 'formpanel',
            padding: 0,
            items: [
                {
                    xtype: 'textfield',
                    label: 'Rating',
                    required: true,
                    ui: 'classic hovered-border',
                    cls: 'a-field-icon icon-label icon-rounded',
                    clearable: false,
                    placeholder: 'Enter name',
                    labelAlign: 'top',
                    maxRows: 8,
                    bind: '{record.name}',
                },
            ],
        },
    ],
    buttonToolbar: {
        xtype: 'toolbar',
        docked: 'bottom',
        ui: 'toolbar-panel-bottom',
        border: true,
    },

    buttons: [
        {
            text: 'Cancel',
            margin: '0 8 0 0',
            handler: function () {
                this.up('dialog').destroy();
            },
            ui: 'default',
        },
        {
            text: 'Create',
            ui: 'action',
            handler: function (item, el) {
                let me = this,
                    dialog = this.up('dialog'),
                    record = dialog.getViewModel().get('record'),
                    store = dialog.getViewModel().get('store'),
                    form = dialog.down('formpanel');

                if (form.validate()) {
                    record.save({
                        success: function () {
                            store.add(record);
                            Ext.toast('Record updated', 1000);
                            dialog.destroy();
                        },
                    });
                }
            },
        },
    ],
});
