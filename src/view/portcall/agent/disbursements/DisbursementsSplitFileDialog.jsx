Ext.define('Abraxa.view.portcall.disbursements.DisbursementsSplitFileDialog', {
    xtype: 'split.files.dialog',
    extend: 'Ext.Dialog',
    title: 'Split',
    caller: null,
    files: null,
    rec: null,
    mydata: [],
    domEl: [],
    closable: true,
    layout: 'fit',
    ui: 'type3',
    cls: 'a-dialog-split',
    width: 420,
    manageBorders: false,
    viewModel: {
        stores: {
            files: {
                data: [],
                proxy: {
                    type: 'memory',
                },
            },
        },
    },

    listeners: {
        initialize: function () {
            var vm = this.getVM(),
                files = this.files,
                data = this.mydata;

            vm.get('files').add(data);
        },
    },

    items: [
        {
            xtype: 'formpanel',
            padding: 0,
            layout: 'vbox',
            defaults: {
                ui: 'classic',
            },
            items: [
                {
                    margin: 0,
                    html: [
                        'Some of your files that you are about to upload could be split in individual pages.<br />',
                        ' Please check those which you want to be splitted in the process of uploading per page',
                    ].join('<br />'),
                },
                {
                    margin: '16 0',
                    xtype: 'componentdataview',
                    bind: {
                        store: '{files}',
                    },
                    itemConfig: {
                        viewModel: true,
                        xtype: 'checkbox',
                        ui: 'large',
                        bodyAlign: 'start',
                        bind: {
                            boxLabel: '{record.name} ({record.numberOfPages} Pages)',
                            checked: '{record.split}',
                        },
                    },
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
    buttons: {
        ok: {
            weight: 2,
            text: 'Continue',
            ui: 'action',
            handler: function () {
                var files = this.up('dialog').files;
                var mydata = this.up('dialog').getVM().get('files');
                var domEl = this.up('dialog').domEl;
                var rec = this.up('dialog').rec;
                for (var i = 0; i < files.length; i++) {
                    var record = mydata.findRecord('id', i);
                    if (record) {
                        var checked = record.get('split');
                    } else {
                        var checked = false;
                    }
                    //21FEB2019
                    files.item(i).split = checked;
                }
                if (rec) {
                    this.up('dialog').caller.upload(files, domEl, rec);
                } else {
                    this.up('dialog').caller.upload(files, domEl);
                }
                this.up('dialog').destroy();
            },
        },
        cancel: {
            weight: 1,
            text: 'Cancel',
            margin: '0 8 0 0',
            ui: 'default',
            handler: function () {
                var element = this.up('dialog').domEl;
                if (element.xtype == 'filebutton') {
                    //ext component
                    element.setValue(null);
                } else {
                    document.querySelector("input[type='file']").value = '';
                }
                this.up('dialog').destroy();
            },
        },
    },
});
