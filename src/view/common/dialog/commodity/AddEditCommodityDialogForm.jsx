Ext.define('Abraxa.view.common.dialog.common.AddEditCommodityDialogForm', {
    extend: 'Ext.Dialog',
    xtype: 'addeditcommodity.dialog.form',
    cls: 'a-dialog-color a-dialog-commodity a-dialog-edit-commodity',
    ui: 'dialog-md type3',
    minWidth: '960',
    maxWidth: '960',
    margin: 0,
    padding: 0,

    buttons: {
        edit: {
            weight: 2,
            ui: 'action',
            bind: {
                text: '{action == "create" ? "Create" : "Save"}',
            },
            handler: function () {
                // standard button (see below)
                var me = this;
                var action = me.upVM().get('action');
                var storesToReload = me.upVM().get('storesToReload');
                var form = Ext.ComponentQuery.query('#commodityFormAddEditItemId')[0];
                // Record
                var commodity = me.upVM().get('commodity');

                if (form.validate()) {
                    if (action == 'create') {
                        var element = Ext.ComponentQuery.query('#imgFieldCommodity')[0];

                        var uploadFiles = element.getFiles();
                        file = null;
                        var fd = new FormData();
                        fd.append('files', uploadFiles[0]);
                        file = fd;

                        Ext.Ajax.request({
                            url: Env.ApiEndpoint + 'companies/commodities',
                            method: 'POST',
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                                'Content-Type': 'application/json',
                            },
                            jsonData: commodity,
                            success: function (response) {
                                var responseData = JSON.parse(response.responseText);

                                var commodity_id = responseData.id;
                                if (element.getFiles().length > 0) {
                                    Ext.Ajax.request({
                                        url: Env.ApiEndpoint + 'companies/commodity_upload_image/' + commodity_id,
                                        method: 'POST',
                                        rawData: file,
                                        headers: {
                                            Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                                            'Content-Type': null,
                                        },
                                        success: function (response) {
                                            var commoditiesGrid = Ext.ComponentQuery.query('#commoditiesGridItemId')[0];
                                            if (commoditiesGrid !== undefined && commoditiesGrid !== null) {
                                                commoditiesGrid.getStore().reload();
                                            }

                                            if (storesToReload !== undefined && storesToReload !== null) {
                                                for (let i = 0; i < storesToReload.length; i++) {
                                                    storesToReload[i].reload();
                                                }
                                            }
                                            Ext.toast('Record created');
                                            me.up('dialog').destroy();
                                        },
                                    });
                                } else {
                                    var commoditiesGrid = Ext.ComponentQuery.query('#commoditiesGridItemId')[0];
                                    if (commoditiesGrid !== undefined && commoditiesGrid !== null) {
                                        commoditiesGrid.getStore().reload();
                                    }

                                    if (storesToReload !== undefined && storesToReload !== null) {
                                        for (let i = 0; i < storesToReload.length; i++) {
                                            storesToReload[i].reload();
                                        }
                                    }
                                    Ext.toast('Record created');
                                    me.up('dialog').destroy();
                                }
                            },
                        });
                    } else {
                        var commoditiesGrid = Ext.ComponentQuery.query('#commoditiesGridItemId')[0];
                        var store = me.upVM().get('companyCommodities');
                        Ext.Ajax.request({
                            url: Env.ApiEndpoint + 'companies/commodities',
                            method: 'PATCH',
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                                'Content-Type': 'application/json',
                            },
                            jsonData: commodity,
                            success: function (response) {
                                var responseData = JSON.parse(response.responseText);
                                me.up('dialog').destroy();

                                var commoditiesGrid = Ext.ComponentQuery.query('#commoditiesGridItemId')[0];
                                if (commoditiesGrid !== undefined && commoditiesGrid !== null) {
                                    commoditiesGrid.getStore().reload();
                                }

                                if (storesToReload !== undefined && storesToReload !== null) {
                                    for (let i = 0; i < storesToReload.length; i++) {
                                        storesToReload[i].reload();
                                    }
                                }

                                Ext.toast('Record updated');
                            },
                        });
                    }
                } else {
                    Ext.Msg.alert('Something went wrong', 'Check for required fields!');
                }
            },
        },
        close: {
            ui: 'default',
            margin: '0 8 0 0',
            weight: 1,
            handler: function () {
                // standard button (see below)
                this.up('dialog').destroy();
            },
        },
    },
    viewModel: {
        data: {
            action: 'create',
            title: 'Add commodity',
            commodity: null,
        },
    },
    tbar: {
        ui: 'toolbar-panel-top',
        layout: {
            type: 'hbox',
            align: 'middle',
        },
        items: [
            {
                xtype: 'div',
                minWidth: 360,
            },
            {
                xtype: 'div',
                flex: 1,
            },
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'middle',
                },
                items: [
                    {
                        xtype: 'button',
                        iconCls: 'x-tool-type-maximize',
                        ui: 'round tool-round',
                        handler: function () {
                            if (!this.up('dialog').getMaximized()) {
                                this.up('dialog').setMaximized(true);
                                this.setIconCls('x-tool-type-restore');
                            } else {
                                this.up('dialog').setMaximized(false);
                                this.setIconCls('x-tool-type-maximize');
                            }
                        },
                    },
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-close',
                        ui: 'round tool-round',
                        handler: function () {
                            this.up('dialog').destroy();
                        },
                    },
                ],
            },
        ],
    },
    items: [
        {
            xtype: 'formpanel',
            padding: 0,
            height: '100%',
            itemId: 'commodityFormAddEditItemId',
            layout: {
                type: 'hbox',
                align: 'stretch',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-dialog-bgr',
                    items: [
                        {
                            xtype: 'container',
                            cls: 'a-edit-vessel-image',
                            items: [
                                {
                                    xtype: 'image',
                                    itemId: 'imageHeadCommodity',
                                    cls: 'a-edit-image-placeholder',
                                    align: 'stretch',
                                    layout: 'fit',
                                    minHeight: 196,
                                    flex: 1,
                                    bind: {
                                        src: '{commodity.image_url != "" ? commodity.image_url : null}',
                                    },
                                    tooltip: {
                                        anchorToTarget: true,
                                        html: 'Click to upload image',
                                        align: 'b50-b50',
                                        showDelay: 0,
                                        hideDelay: 0,
                                        dismissDelay: 0,
                                        allowOver: false,
                                        closeAction: 'destroy',
                                    },
                                    listeners: {
                                        click: {
                                            element: 'element',
                                            fn: function (item, el, eOpts) {
                                                var me = this;

                                                var fileinput = Ext.ComponentQuery.query('#imgFieldCommodity')[0];
                                                fileinput.el.query('input[name=commodityfileimage]')[0].click();
                                            },
                                        },
                                    },
                                },
                                {
                                    xtype: 'filefield',
                                    ui: 'default',
                                    cls: 'a-edit-user-image',
                                    accept: 'image',
                                    hidden: true,
                                    name: 'commodityfileimage',
                                    itemId: 'imgFieldCommodity',
                                    listeners: {
                                        change: function (element) {
                                            var form = Ext.ComponentQuery.query('#commodityFormAddEditItemId')[0];
                                            var dialog = form.up('dialog');

                                            var files = event.target.files;

                                            self = this; // the controller
                                            if (!files || files.length == 0) return; // make sure we got something
                                            // Let's read content as file
                                            var reader = new FileReader();
                                            reader.onload = function (e) {
                                                // image content is in e.target.result
                                                // we can then put it into img.src, for example
                                                //element.find('imageHeadVessel').setSrc(e.target.result);
                                                Ext.ComponentQuery.query('#imageHeadCommodity')[0].setSrc(
                                                    e.target.result
                                                );
                                            };

                                            var uploadFiles = element.getFiles();
                                            file = null;
                                            var fd = new FormData();
                                            fd.append('files', uploadFiles[0]);
                                            file = fd;

                                            if (dialog.getViewModel().get('action') == 'edit') {
                                                Ext.Ajax.request({
                                                    url:
                                                        Env.ApiEndpoint +
                                                        'companies/commodity_upload_image/' +
                                                        dialog.getViewModel().get('commodity').id,
                                                    method: 'POST',
                                                    rawData: file,
                                                    headers: {
                                                        Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                                                        'Content-Type': null,
                                                    },
                                                    success: function (response) {
                                                        var responseData = JSON.parse(response.responseText);
                                                        dialog.upVM().get('commodity').image_url =
                                                            responseData.image_url;
                                                        Ext.toast('Record updated');
                                                    },
                                                });
                                            }

                                            reader.readAsDataURL(files[0]);
                                        },
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'fieldcontainer',
                            margin: '16 0 0 0',
                            defaults: {
                                xtype: 'containerfield',
                                margin: '6 0',
                                width: '100%',
                                defaults: {
                                    xtype: 'textfield',
                                    ui: 'hovered-underline',
                                    labelAlign: 'top',
                                    clearable: false,
                                    labelAlign: 'left',
                                    cls: 'col-12',
                                    renderer: function (value) {
                                        if (value) {
                                            return value;
                                        } else {
                                            return AbraxaConstants.placeholders.emptyValue;
                                        }
                                    },
                                },
                            },
                            items: [
                                {
                                    layout: 'vbox',
                                    items: [
                                        {
                                            label: 'Commodity',
                                            ui: 'field-xl no-border hovered-underline',
                                            placeholder: 'Enter commodity',
                                            labelAlign: 'top',
                                            bind: {
                                                value: '{commodity.name}',
                                            },
                                            value: '',
                                            required: true,
                                        },
                                        {
                                            xtype: 'combobox',
                                            label: 'Form',
                                            displayField: 'name',
                                            valueField: 'name',
                                            queryMode: 'local',
                                            displayTpl: '{name:capitalize}',
                                            itemTpl: '{name:capitalize}',
                                            store: {
                                                type: 'commoditytypes',
                                            },
                                            bind: {
                                                value: '{commodity.type}',
                                            },
                                            value: 'bulk',
                                        },
                                        {
                                            label: 'UN Number',
                                            placeholder: 'UN number',
                                            bind: {
                                                value: '{commodity.un_number}',
                                            },
                                            value: null,
                                        },
                                        {
                                            label: 'Angle of repose',
                                            placeholder: 'Angle of repose',
                                            bind: {
                                                value: '{commodity.angle_of_repose}',
                                            },
                                            value: null,
                                        },
                                        {
                                            label: 'SF m3/mt (from)',
                                            placeholder: '00.00',
                                            bind: {
                                                value: '{commodity.sf_from}',
                                            },
                                            value: null,
                                        },
                                        {
                                            label: 'SF m3/mt (to)',
                                            placeholder: '00.00',
                                            bind: {
                                                value: '{commodity.sf_to}',
                                            },
                                            value: null,
                                        },
                                        {
                                            label: 'Humidity Moisture % (from)',
                                            placeholder: '00.00',
                                            bind: {
                                                value: '{commodity.humidity_moisture_from}',
                                            },
                                            value: null,
                                        },
                                        {
                                            label: 'Humidity Moisture % (to)',
                                            placeholder: '00.00',
                                            bind: {
                                                value: '{commodity.humidity_moisture_to}',
                                            },
                                            value: null,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'container',
                    margin: '8 32 0 32',
                    flex: 8,
                    layou: 'vbox',
                    items: [
                        {
                            xtype: 'container',
                            flex: 1,
                            items: [
                                {
                                    xtype: 'div',
                                    html: '<h2>Description</h2>',
                                },
                                {
                                    xtype: 'container',
                                    cls: 'border-radius bordered',
                                    items: [
                                        {
                                            xtype: 'froalaeditor',
                                            ui: 'light',
                                            cls: 'voyageInstructionsEdtior',
                                            scrollable: true,
                                            shadow: false,
                                            border: false,
                                            flex: 1,
                                            minHeight: 250,
                                            maxHeight: 250,
                                            height: '100%',
                                            editor: {
                                                attribution: false,
                                                quickInsertEnabled: false,
                                                theme: 'royal',
                                                imagePaste: false,
                                                toolbarButtons: {
                                                    moreText: {
                                                        buttons: [
                                                            'bold',
                                                            'italic',
                                                            'underline',
                                                            'strikeThrough',
                                                            'subscript',
                                                            'superscript',
                                                            'fontFamily',
                                                            'fontSize',
                                                            'textColor',
                                                            'backgroundColor',
                                                            'clearFormatting',
                                                        ],
                                                    },
                                                    moreParagraph: {
                                                        buttons: [
                                                            'alignLeft',
                                                            'alignCenter',
                                                            'formatOLSimple',
                                                            'alignRight',
                                                            'alignJustify',
                                                            'formatOL',
                                                            'formatUL',
                                                            'outdent',
                                                            'indent',
                                                            'quote',
                                                        ],
                                                    },
                                                },
                                            },
                                            bind: {
                                                value: '{commodity.description}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            margin: '16 0 0 0',
                            flex: 1,
                            items: [
                                {
                                    xtype: 'div',
                                    html: '<h2>Risk factors</h2>',
                                },
                                {
                                    xtype: 'container',
                                    items: [
                                        {
                                            xtype: 'textareafield',
                                            ui: 'no-border no-underline',
                                            cls: 'a-field-icon icon-short',
                                            label: false,
                                            minHeight: 150,
                                            placeholder: 'Enter risk factors',
                                            bind: {
                                                value: '{commodity.risk_factors}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
    listeners: {
        painted: function (dialog, el, eOpts) {
            var vm = dialog.getViewModel();
            if (vm.get('action') == 'create') {
                Ext.ComponentQuery.query('#imageHeadCommodity')[0].setSrc(
                    'https://static.abraxa.com/images/commodities/no-cargo-available.svg'
                );
            }
        },
    },
});
