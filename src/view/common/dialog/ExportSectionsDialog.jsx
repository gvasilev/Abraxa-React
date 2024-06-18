Ext.define('Abraxa.view.common.dialog.common.ExportSectionsDialog', {
    extend: 'Ext.Dialog',
    xtype: 'sections.dialog',
    ui: 'dialog-md type3',
    cls: 'a-dialog-success',
    testId: 'sectionsDialog',
    margin: 0,
    title: 'Export to PDF',
    padding: '0 8',
    closable: true,
    draggable: false,
    manageBorders: false,
    minWidth: 420,
    maxWidth: 420,
    minHeight: 280,
    items: [
        {
            xtype: 'formpanel',
            padding: '0 16',
            items: [
                {
                    xtype: 'div',
                    margin: '16 0',
                    html: '<div class="fs-16 fw-b">Choose a section to include</div>',
                },
                {
                    xtype: 'container',
                    padding: '0 0 12 0',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            ui: 'large',
                            boxLabel: 'General',
                            labelAlign: 'right',
                            name: 'general',
                            margin: '0',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '0 0 12 0',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    slug: 'portcallSofExport',
                    subObject: 'sof',
                    bind: {
                        permission: '{userPermissions}',
                        objectPermission: '{objectPermissions}',
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            ui: 'large',
                            boxLabel: 'SOF',
                            labelAlign: 'right',
                            name: 'sof',
                            margin: '0',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '0 0 12 0',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    subObject: 'supply',
                    bind: {
                        objectPermission: '{objectPermissions}',
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            ui: 'large',
                            boxLabel: 'Supplies',
                            labelAlign: 'right',
                            name: 'supplies',
                            margin: '0',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '0 0 12 0',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    subObject: 'crewing',
                    bind: {
                        objectPermission: '{objectPermissions}',
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            ui: 'large',
                            boxLabel: 'Crewing',
                            labelAlign: 'right',
                            name: 'crewing',
                            margin: '0',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    padding: '0 0 12 0',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            ui: 'large',
                            // slug: 'portcallSofExport',
                            // subObject: 'sof',
                            // bind: {
                            //     permission: '{userPermissions}',
                            //     objectPermission: '{objectPermissions}'
                            // },
                            boxLabel: 'Tasks',
                            labelAlign: 'right',
                            name: 'tasks',
                            margin: '0',
                        },
                    ],
                },
                {
                    xtype: 'container',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'checkbox',
                            ui: 'large',
                            // slug: 'portcallSofExport',
                            // subObject: 'sof',
                            // bind: {
                            //     permission: '{userPermissions}',
                            //     objectPermission: '{objectPermissions}'
                            // },
                            boxLabel: 'Notes',
                            labelAlign: 'right',
                            name: 'notes',
                            margin: '0',
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
            xtype: 'container',
            itemId: 'errorLine',
            hidden: true,
            left: 16,
            html: '<div class="col"><div class="alert-warning alert-danger"><i class="material-icons md-18 md-icon-info red"></i>Please select at least one section.</div></div>',
            showAnimation: {
                type: 'popIn',
                direction: 'right',
            },
        },
        {
            text: 'Export',
            testId: 'sectionsDialogExportBtn',
            weight: 2,
            enableToggle: true,
            ui: 'action loading',
            handler: function () {
                var dialog = this.up('dialog'),
                    buttons = dialog.queryById('errorLine'),
                    vm = dialog.getVM(),
                    record = vm.get('record'),
                    form = dialog.down('formpanel');
                if (form.validate()) {
                    let values = form.getValues(),
                        sections = [],
                        oneRequired = true;
                    Ext.Object.each(values, function (key, value) {
                        if (value) {
                            oneRequired = false;
                            sections.push(key);
                        }
                    });
                    if (oneRequired) {
                        buttons.show();
                    } else {
                        buttons.hide();
                        Abraxa.export.portcall(record.get('id'), sections, dialog);
                    }
                } else {
                    buttons.show();
                }
            },
        },
        {
            text: 'Cancel',
            testId: 'sectionsDialogCancelBtn',
            weight: 1,
            margin: '0 8 0 0',
            ui: 'default',
            handler: function () {
                this.up('dialog').destroy();
            },
        },
    ],
});
