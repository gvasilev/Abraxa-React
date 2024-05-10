Ext.define('Abraxa.view.common.dialog.Vessel', {
    extend: 'Ext.Dialog',
    xtype: 'common.dialog.vessel',
    itemId: 'vesselDialog',
    testId: 'commonDialogVesel',
    ui: 'dialog-md type3',
    cls: 'a-dialog-color a-dialog-vessel',
    minWidth: '1180',
    maxHeight: '90%',
    margin: 0,
    padding: 0,
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
                        cls: 'a-dialog-tabs',
                        animateIndicator: false,
                        activeTab: 0,
                        defaults: {
                            ui: 'tab-main',
                            ripple: false,
                        },
                        items: [
                            {
                                title: 'Main details',
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
                                var tabBar = this.up('dialog').down('vessel\\.dialog\\.info');
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
                        xtype: 'tool',
                        ui: 'tool-md',
                        iconCls: 'md-icon-edit',
                        hidden: true,
                        bind: {
                            hidden: '{vessel.company_id ? false:true}',
                        },
                        tooltip: {
                            anchorToTarget: true,
                            html: 'Edit',
                            align: 'bc-tc?',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            allowOver: false,
                            closeAction: 'destroy',
                        },
                        handler: function (btn, e) {
                            let me = this,
                                record = me.upVM().get('vessel');
                            let dialog = Ext.create('Abraxa.view.settings.library.vessels.AddVessel', {
                                viewModel: {
                                    parent: btn.upVM(),
                                    data: {
                                        vessel: record,
                                        file: null,
                                        editMode: true,
                                        duplicate: true,
                                    },
                                    formulas: {
                                        vesselImg: {
                                            bind: {
                                                bindTo: '{vessel}',
                                                deep: true,
                                            },
                                            get: function (vessel) {
                                                if (vessel) {
                                                    if (vessel.get('vessel_img')) {
                                                        return vessel.get('vessel_img');
                                                    }
                                                    return ' //static.abraxa.com/ships/' + vessel.get('imo') + '.jpg';
                                                }
                                            },
                                        },
                                    },
                                },
                            });
                            dialog.show();
                        },
                    },
                    {
                        xtype: 'tool',
                        ui: 'tool-md',
                        iconCls: 'md-icon-close',
                        testId: 'commonDialogVesselCloseTool',
                        tooltip: {
                            anchorToTarget: true,
                            html: 'Close',
                            align: 'bc-tc?',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            allowOver: false,
                            closeAction: 'destroy',
                        },
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
            xtype: 'container',
            maxHeight: '85vh',
            layout: 'hbox',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-dialog-bgr',
                    layout: {
                        type: 'vbox',
                        align: 'stretch',
                    },
                    scrollable: true,
                    items: [
                        {
                            xtype: 'image',
                            align: 'stretch',
                            layout: 'fit',
                            minHeight: 196,
                            maxHeight: 196,
                            // flex: 1,
                            bind: {
                                src: '{vesselImg}',
                            },
                        },
                        {
                            xtype: 'container',
                            scrollable: true,
                            flex: 1,
                            defaults: {
                                xtype: 'container',
                                layout: 'hbox',
                                margin: '12 0',
                                defaults: {
                                    xtype: 'displayfield',
                                    ui: 'default',
                                    encodeHtml: false,
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
                                {
                                    items: [
                                        {
                                            labelAlign: 'top',
                                            ui: 'field-xl',
                                            cls: 'col-12',
                                            margin: '0 0 12 0',
                                            bind: {
                                                label: 'Vessel',
                                                value: '<div class="hbox"><img data-qtip="{vessel.flags.country_code:lowercase}" data-qalign="bc-tc" height="24" class="a-img-round mr-16" src="{flag}" alt="" />{vessel.name}</div>',
                                            },
                                        },
                                        {
                                            xtype: 'div',
                                            right: 0,
                                            hidden: true,
                                            bind: {
                                                hidden: '{vessel.compliance ? false : true}',
                                            },
                                            cls: 'a-status-badge a-has-icon c-white status-Good',
                                            html: '<i class="material-icons a-status-icon">check</i>OFAC',
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'Type',
                                            bind: {
                                                value: '{vessel.vessel_type}',
                                            },
                                        },
                                        {
                                            label: 'Year',
                                            bind: {
                                                value: '{vessel.built}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'IMO',
                                            bind: {
                                                value: '{vessel.imo}',
                                            },
                                        },
                                        {
                                            label: 'Call sign',
                                            bind: {
                                                value: '{vessel.call_sign}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'DWT',
                                            bind: {
                                                value: '{vessel.dwt}',
                                            },
                                        },
                                        {
                                            label: 'MMSI',
                                            bind: {
                                                value: '{vessel.mmsi}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'GT',
                                            bind: {
                                                value: '{vessel.gt}',
                                            },
                                        },
                                        {
                                            label: 'Length (bp)',
                                            bind: {
                                                value: '{vessel.lbp}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'NT',
                                            bind: {
                                                value: '{vessel.nt}',
                                            },
                                        },
                                        {
                                            label: 'LOA',
                                            bind: {
                                                value: '{vessel.loa}',
                                            },
                                        },
                                    ],
                                },
                                {
                                    items: [
                                        {
                                            label: 'Draft',
                                            bind: {
                                                value: '{vessel.draft}',
                                            },
                                        },
                                        {
                                            label: 'Beam',
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
                    xtype: 'vessel.dialog.info',
                    flex: 8,
                },
            ],
        },
    ],
});
