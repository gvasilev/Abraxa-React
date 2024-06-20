Ext.define('Abraxa.controller.TariffTableController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.tariffTableController',
    init: function () {
        /* Set up the controller for the Main View */
        /* Then set up a listener for user updates. */
        // this.subscribe('updateOfferDataFields', this.parseOfferDataFields, this);
    },

    prepareTableData: function (record) {
        let view = this.getView(),
            data = record.getData(),
            vesselParams = [],
            nomenclatures = [],
            dataFields = [],
            variables = [],
            store = Ext.create('Ext.data.TreeStore', {
                defaultRootProperty: 'items',
            });

        Ext.each(data.vesselParams, function (rec) {
            vesselParams.push({
                text: rec,
                leaf: true,
                type: 'vessel_param',
                title: 'Vessel param',
            });
        });

        Ext.each(data.nomenclatures, function (rec) {
            nomenclatures.push({
                text: rec,
                leaf: true,
                type: 'nomenclature',
                title: 'Nomenclature',
            });
        });

        Ext.each(data.dataFields, function (rec) {
            dataFields.push({
                text: rec,
                leaf: true,
                type: 'data_field',
                title: 'Data field',
            });
        });

        Ext.each(data.variables, function (rec) {
            variables.push({
                text: rec,
                leaf: true,
                type: 'formula',
                title: 'Variable',
            });
        });

        let root = {
            text: 'Data',
            items: [
                {
                    text: 'Vessel parameters',
                    type: 'vessel_param',
                    items: vesselParams,
                },
                {
                    text: 'Nomenclatures',
                    type: 'nomenclature',
                    items: nomenclatures,
                },
                {
                    text: 'Data fields',
                    type: 'data_field',
                    items: dataFields,
                },
                {
                    text: 'Variables',
                    type: 'formula',
                    items: variables,
                },
            ],
        };
        store.setRoot(root);
        this.getView().lookupViewModel().set('XsourceStore', store);
        this.getView().lookupViewModel().set('YsourceStore', store);
    },

    uploadFile: function (button, filePath, importPath, vm) {
        let files = button.getFiles();
        if (!files || files.length == 0) return; // make sure we got something
        // Let's read content as file
        let fd = new FormData(),
            totalSize = files[0].size,
            me = this;
        fd.append('tableData', files[0]);
        fd.append('section', me.section);

        if (totalSize > 10 * 1024 * 1024) {
            Ext.create('Ext.MessageBox', {
                ui: 'warning',
                title: 'Upload Cancelled',
                innerCls: 'a-bgr-white',
                message:
                    'Your file(s) payload size (' +
                    (totalSize / 1024 / 1024).toFixed(2) +
                    ' MB) <br /> is exceeding the maximum allowed size (10 MB) per upload. </br>' +
                    '<br/>Please try uploading on smaller chunks, or reduce the size of your files <br />',
                width: 500,
                dataTitle: 'Warning',
                modal: true,
                draggable: false,
                bbar: {
                    manageBorders: false,
                    items: [
                        '->',
                        {
                            xtype: 'button',
                            ui: 'action',
                            text: 'Ok',
                            handler: function () {
                                this.up('dialog').destroy();
                            },
                        },
                    ],
                },
            }).show();
            return;
        }

        Ext.Ajax.request({
            url: Env.ApiEndpoint + importPath,
            rawData: fd,
            headers: {
                'Content-Type': null,
            },
            success: function (response) {
                vm.get('rows').reload();
                vm.get('columns').reload();
                vm.get('tarifftable').reload();
            },
        });
    },
});
