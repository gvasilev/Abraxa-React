Ext.define('Abraxa.view.settings.library.vessels.AddVessel', {
    extend: 'Ext.Dialog',
    xtype: 'settings.library.vessels.add',
    ui: 'dialog-md type3',
    cls: 'a-dialog-color a-dialog-vessel a-dialog-edit-vessel',
    controller: 'vessels.vesselcontroller',
    minWidth: '1180',
    maxHeight: '90%',
    margin: 0,
    padding: 0,
    buttons: {
        save: {
            ui: 'action',
            weight: 2,
            bind: {
                text: 'Save',
            },
            handler: 'onCreate',
        },
        close: {
            margin: '0 8 0 0',
            text: 'Cancel',
            weight: 1,
            handler: function () {
                // standard button (see below)
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
                xtype: 'container',
                flex: 1,
                layout: {
                    type: 'hbox',
                    pack: 'center',
                },
                items: [
                    {
                        xtype: 'tabbar',
                        activeTab: 0,
                        items: [
                            {
                                title: 'Main Details',
                            },
                            {
                                title: 'Technical',
                            },
                            {
                                title: 'Management',
                            },
                        ],
                        listeners: {
                            activeTabchange: function () {
                                var activeTab = this.getActiveTab();
                                var tabBar = this.up('dialog').down('vessel\\.dialog\\.infoform');
                                tabBar.setActiveItem(this.items.indexOf(activeTab));
                            },
                        },
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
            reference: 'vesselForm',
            layout: {
                type: 'hbox',
                align: 'stretch',
            },
            items: [
                //BASIC FORM (left)
                {
                    xtype: 'container',
                    cls: 'a-dialog-bgr',
                    minHeight: 800,
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    scrollable: true,
                    items: [
                        // Vessel photo
                        {
                            xtype: 'container',
                            cls: 'a-edit-vessel-image',
                            items: [
                                {
                                    xtype: 'filefield',
                                    ui: 'default',
                                    cls: 'a-edit-user-image',
                                    accept: 'image',
                                    hidden: true,
                                    name: 'vesselfileimage',
                                    itemId: 'imgFieldVessel',
                                    listeners: {
                                        change: function (me, newValue) {
                                            if (newValue) {
                                                var uploadController = me.up('dialog').getController(),
                                                    record = me.upVM().get('vessel');
                                                uploadController.onFileChange(this, record);
                                            }
                                        },
                                    },
                                },
                                {
                                    xtype: 'image',
                                    itemId: 'imageHeadVessel',
                                    cls: 'a-edit-image-placeholder',
                                    align: 'stretch',
                                    layout: 'fit',
                                    minHeight: 196,
                                    flex: 1,
                                    style: {
                                        'background-size': 'cover !important;',
                                    },
                                    bind: {
                                        src: '{vesselImg}',
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
                                                var fileinput = Ext.ComponentQuery.query('#imgFieldVessel')[0];
                                                fileinput.el.query('input[name=vesselfileimage]')[0].click();
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                        // Main fields
                        {
                            xtype: 'fieldcontainer',
                            layout: 'vbox',
                            defaults: {
                                xtype: 'containerfield',
                                margin: '6 0',
                                defaults: {
                                    // xtype: 'displayfield',
                                    ui: 'hovered-underline',
                                    clearable: false,
                                    labelAlign: 'top',
                                    cls: 'col-6',
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
                                // Name, Flag
                                {
                                    items: [
                                        {
                                            label: 'Name',
                                            placeholder: 'Vessel name',
                                            cls: 'col-12',
                                            ui: 'field-xl no-border hovered-underline',
                                            xtype: 'textfield',
                                            maxLength: 30,
                                            bind: {
                                                value: '{vessel.name}',
                                            },
                                            required: true,
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'Flag',
                                            cls: 'col-12',
                                            xtype: 'country.combo',
                                            triggers: {
                                                search: false,
                                            },
                                            bind: {
                                                value: '{vessel.flag}',
                                            },
                                        },
                                    ],
                                },
                                // Type, Year
                                {
                                    items: [
                                        {
                                            label: 'Type',
                                            xtype: 'vesseltype.combo',
                                            padding: '0 6 0 0',
                                            bind: {
                                                value: '{vessel.general_type_id}',
                                            },
                                            value: 10,
                                        },
                                        {
                                            label: 'Year',
                                            itemId: 'builtYearItemId',
                                            xtype: 'datefield',
                                            placeholder: 'MM/YY',
                                            dateFormat: 'm/y',
                                            altFormats: 'm/Y|' + 'm/Y|' + 'm|' + 'm|' + 'my|',
                                            maxLength: 10,
                                            bind: {
                                                value: '{vessel.built}',
                                            },
                                        },
                                    ],
                                },
                                // IMO, Call sign
                                {
                                    items: [
                                        {
                                            label: 'Imo',
                                            xtype: 'textfield',
                                            padding: '0 6 0 0',
                                            required: true,
                                            bind: {
                                                value: '{vessel.imo}',
                                                disabled: '{duplicate ? true:false}',
                                            },
                                            listeners: {
                                                painted: function (me) {
                                                    me.setError(null);
                                                },
                                            },
                                        },
                                        {
                                            label: 'Call sign',

                                            xtype: 'textfield',
                                            maxLength: 25,
                                            bind: {
                                                value: '{vessel.call_sign}',
                                            },
                                        },
                                    ],
                                },
                                // Dwt, MMSI
                                {
                                    items: [
                                        {
                                            label: 'Dwt',
                                            xtype: 'numberfield',
                                            maxLength: 10,
                                            padding: '0 6 0 0',
                                            bind: {
                                                value: '{vessel.dwt}',
                                            },
                                        },
                                        {
                                            label: 'MMSI',
                                            xtype: 'numberfield',
                                            maxLength: 9,
                                            bind: {
                                                value: '{vessel.mmsi}',
                                            },
                                        },
                                    ],
                                },
                                // GT, Length (bp)
                                {
                                    items: [
                                        {
                                            label: 'Gt',
                                            xtype: 'numberfield',
                                            maxLength: 10,
                                            padding: '0 6 0 0',
                                            bind: {
                                                value: '{vessel.gt}',
                                            },
                                        },
                                        {
                                            label: 'Length (bp)',
                                            xtype: 'numberfield',
                                            maxLength: 10,
                                            bind: {
                                                value: '{vessel.lbp}',
                                            },
                                        },
                                    ],
                                },
                                // Nt, Loa
                                {
                                    items: [
                                        {
                                            label: 'Nt',
                                            xtype: 'numberfield',
                                            maxLength: 10,
                                            padding: '0 6 0 0',
                                            bind: {
                                                value: '{vessel.nt}',
                                            },
                                        },
                                        {
                                            label: 'Loa',
                                            xtype: 'numberfield',
                                            maxLength: 10,
                                            bind: {
                                                value: '{vessel.loa}',
                                            },
                                        },
                                    ],
                                },
                                // Draft, Beam
                                {
                                    items: [
                                        {
                                            label: 'Draft',
                                            xtype: 'numberfield',
                                            maxLength: 10,
                                            padding: '0 6 0 0',
                                            bind: {
                                                value: '{vessel.draft}',
                                            },
                                        },
                                        {
                                            label: 'Beam',
                                            xtype: 'numberfield',
                                            maxLength: 10,
                                            bind: {
                                                value: '{vessel.beam}',
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },

                {
                    xtype: 'vessel.dialog.infoform',
                    flex: 8,
                },
            ],
        },
    ],
});
