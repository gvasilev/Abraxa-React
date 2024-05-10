Ext.define('Abraxa.view.portcalls.principal.PortcallsPrincipalAssignTo', {
    xtype: 'portcalls.principal.form-assign-to',
    extend: 'Ext.Dialog',

    modal: true,
    draggable: false,
    floated: true,
    showAnimation: 'fadeIn',
    hideAnimation: 'fadeOut',

    title: 'Assign to',
    ui: 'type3',
    manageBorders: false,
    closable: true,
    centered: true,

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
            itemId: 'inquiry-form-assign-to-itemid',
            items: [
                {
                    xtype: 'fieldcontainer',
                    defaults: {
                        layout: 'hbox',
                        pack: 'space-between',
                    },

                    items: [
                        {
                            xtype: 'common-combo-assingtocombo',
                            cls: 'non-editable no-underline',
                            label: 'Assign to',
                            ui: 'classic',
                            flex: 1,
                            queryMode: 'local',
                            editable: false,
                            animateUnderline: false,
                            triggers: {
                                search: false,
                            },
                            bind: {
                                value: '{record.assigned_to}',
                            },
                            placeholder: 'Choose assignee',
                        },
                    ],
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
            handler: function (me) {
                let dialog = me.up('dialog'),
                    record = this.upVM().get('portcall');
                record.reject();
                dialog.destroy();
            },
            ui: 'default',
        },
        {
            text: 'Save',
            handler: function () {
                let record = this.upVM().get('portcall'),
                    dialog = this.up('dialog');
                record.save({
                    success: function (batch) {
                        Ext.toast('Record updated', 1000);
                        record.load();
                        dialog.destroy();
                    },
                    failure: function (batch) {
                        // Ext.Msg.alert('Something went wrong', 'Could not appoint this Inquiry!');
                    },
                });
            },
        },
    ],
});
