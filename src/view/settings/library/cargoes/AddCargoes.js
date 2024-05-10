Ext.define('Abraxa.view.settings.library.cargoes.AddCargoes', {
    extend: 'Ext.Dialog',
    xtype: 'settings.library.cargoes.add.dialog',
    cls: 'a-dialog-color a-dialog-commodity a-dialog-edit-commodity',
    ui: 'dialog-md type3',
    minWidth: '960',
    maxWidth: '960',
    margin: 0,
    padding: 0,
    controller: 'cargoes.cargocontroller',
    buttons: {
        edit: {
            weight: 2,
            ui: 'action',
            testId: 'saveCargoButtonTestIdAddCargoDialog',
            bind: {
                text: 'Save',
            },
            handler: 'onCreate',
        },
        close: {
            ui: 'default',
            margin: '0 8 0 0',
            weight: 1,
            handler: function () {
                // standard button (see below)
                let record = this.up('dialog').upVM().get('cargo');
                if (record) {
                    record.reject();
                }
                this.up('dialog').destroy();
            },
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
            xtype: 'form.error',
            hidden: true,
            margin: 0,
            padding: 8,
            showAnimation: 'fadeIn',
        },
        {
            xtype: 'formpanel',
            padding: 0,
            height: '100%',
            reference: 'createCargo',
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
                                        src: '{commodityImg}',
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
                                        change: 'onFileChange',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'container',
                            margin: '16 0 0 0',
                            layout: 'vbox',
                            flex: 1,
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
                            items: [
                                {
                                    label: 'Commodity',
                                    testId: 'commodityNameTestIdAddCargoDialog',
                                    ui: 'field-xl no-border hovered-underline',
                                    placeholder: 'Enter commodity',
                                    labelAlign: 'top',
                                    bind: {
                                        value: '{cargo.name}',
                                    },
                                    value: '',
                                    required: true,
                                },
                                {
                                    xtype: 'combobox',
                                    testId: 'commodityTypeTestIdAddCargoDialogCombo',
                                    label: 'Form',
                                    displayField: 'name',
                                    valueField: 'name',
                                    queryMode: 'local',
                                    displayTpl: '{name:capitalize}',
                                    itemTpl: '{name:capitalize}',
                                    required: true,
                                    store: {
                                        type: 'commoditytypes',
                                    },
                                    bind: {
                                        value: '{cargo.type}',
                                    },
                                },
                                {
                                    label: 'UN Number',
                                    testId: 'commodityUnNumberTestIdAddCargoDialog',
                                    placeholder: 'UN number',
                                    bind: {
                                        value: '{cargo.un_number}',
                                    },
                                    value: null,
                                },
                                {
                                    label: 'Angle of repose',
                                    testId: 'commodityAngleOfReposeTestIdAddCargoDialog',
                                    placeholder: 'Angle of repose',
                                    bind: {
                                        value: '{cargo.angle_of_repose}',
                                    },
                                    value: null,
                                },
                                {
                                    label: 'SF m3/mt (from)',
                                    testId: 'commoditySfFromTestIdAddCargoDialog',
                                    placeholder: '00.00',
                                    bind: {
                                        value: '{cargo.sf_from}',
                                    },
                                    value: null,
                                },
                                {
                                    label: 'SF m3/mt (to)',
                                    testId: 'commoditySfToTestIdAddCargoDialog',
                                    placeholder: '00.00',
                                    bind: {
                                        value: '{cargo.sf_to}',
                                    },
                                    value: null,
                                },
                                {
                                    label: 'Humidity Moisture % (from)',
                                    testId: 'commodityHumidityMoistureFromTestIdAddCargoDialog',
                                    placeholder: '00.00',
                                    bind: {
                                        value: '{cargo.humidity_moisture_from}',
                                    },
                                    value: null,
                                },
                                {
                                    label: 'Humidity Moisture % (to)',
                                    testId: 'commodityHumidityMoistureToTestIdAddCargoDialog',
                                    placeholder: '00.00',
                                    bind: {
                                        value: '{cargo.humidity_moisture_to}',
                                    },
                                    value: null,
                                },
                                {
                                    xtype: 'div',
                                    margin: '8 0',
                                    style: 'opacity: 0.4;',
                                    html: '<hr>',
                                },
                                {
                                    label: 'Reference ID',
                                    testId: 'commodityReferenceIdTestIdAddCargoDialog',
                                    placeholder: 'Reference ID',
                                    bind: {
                                        value: '{cargo.reference}',
                                    },
                                    value: null,
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
                                            testId: 'commodityDescriptionTestIdAddCargoDialog',
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
                                                value: '{cargo.description}',
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
                                            testId: 'commodityRiskFactorsTestIdAddCargoDialog',
                                            ui: 'no-border no-underline',
                                            cls: 'a-field-icon icon-short',
                                            label: false,
                                            minHeight: 150,
                                            placeholder: 'Enter risk factors',
                                            bind: {
                                                value: '{cargo.risk_factors}',
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
