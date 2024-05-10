Ext.define('Abraxa.view.settings.system.Ports', {
    extend: 'Ext.Container',
    xtype: 'settings.system.ports',
    cls: 'a-bnc-main',
    items: [
        {
            xtype: 'container',
            docked: 'top',
            layout: {
                type: 'hbox',
                pack: 'space-between',
            },
            items: [
                {
                    xtype: 'div',
                    cls: 'sm-heading',
                    html: '<h5>Ports served</h5>',
                },
                {
                    xtype: 'button',
                    text: 'Add Port',
                    ui: 'normal small',
                    height: 28,
                    iconCls: 'md-icon-add',
                    margin: 8,
                    handler: function (btn, e) {
                        let portsserved = this.upVM().get('portsServed');
                        let dialog = Ext.create('Abraxa.view.settings.ports.AddPort', {
                            viewModel: {
                                data: {
                                    record: new Abraxa.model.common.PortServed(),
                                },
                                stores: {
                                    portsserved: portsserved,
                                },
                            },
                        });
                        dialog.show();
                    },
                },
            ],
        },
        {
            xtype: 'abraxa.panel',
            title: 'Ports served',
            scrollable: true,
            shadow: false,
            header: false,
            padding: 0,
            bodyPadding: 0,
            itemId: 'portServedList',
            flex: 9,
            showAnimation: {
                type: 'slide',
                direction: 'right',
            },
            // margin: "8 8 16 16",
            items: [
                {
                    xtype: 'list',
                    emptyText: 'No records available',
                    flex: 1,
                    rowLines: true,
                    minHeight: 400,
                    ui: 'list-bordered last',
                    cls: 'a-related-ports',
                    itemTpl:
                        '<div class="a-list-port"><i class="material-icons">location_on</i>{port_info.name}</div> <div class="a-list-imo">{port_info.code}</div>',
                    bind: {
                        store: {
                            bindTo: '{portsServed}',
                            deep: true,
                        },
                    },
                    style: 'background:#fff;',
                    grouped: false,
                    striped: false,
                    reference: 'settingsPortsGrid',
                    publishes: 'selection',
                    // listeners: {
                    //     itemtap: function (list, index, item, record) {
                    //         var me = this;
                    //         var vm = me.upVM();
                    //         var berthsStore = vm.get('portBerthsStore');
                    //         berthsStore.load({
                    //             params: {
                    //                 portId: record.data.port_id
                    //             },
                    //             callback: function (records, operation, success) {
                    //                 Ext.ComponentQuery.query('#portServedList')[0].hide();
                    //                 Ext.ComponentQuery.query('settings\\.system\\.ports\\.berths')[0].show();
                    //             }
                    //         });
                    //     }
                    // }
                },
            ],
        },

        // {
        //     xtype: 'settings.system.ports.berths',
        //     showAnimation: 'slide',
        //     flex: 1,
        //     hidden: true
        // }
    ],
});
