Ext.define('Abraxa.view.settings.library.cost_center.CostCenterDetails', {
    extend: 'Ext.Container',
    xtype: 'CostCenterDetails',
    testId: 'costCenterDetails',
    controller: 'CostCenterController',
    flex: 1,
    itemId: 'costCenterDetails',
    layout: 'vbox',
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar a-bb-100',
            docked: 'top',
            margin: '0 0 0 -24',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar',
                    minHeight: 64,
                    items: [
                        {
                            xtype: 'tool',
                            iconCls: 'md-icon-outlined md-icon-keyboard-backspace',
                            margin: '0 16 0 0',
                            ui: 'tool-md',
                            handler: function () {
                                let grid = Ext.ComponentQuery.query('CostCenterGrid')[0];
                                if (grid) {
                                    grid.deselectAll();
                                }
                            },
                        },
                        {
                            xtype: 'title',
                            bind: {
                                title: '{costCenterGrid.selection.name}',
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            iconCls: 'md-icon-outlined md-icon-delete',
                            ui: 'round tool-round-md',
                            testId: 'deleteCostCenterButton',
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Delete',
                                anchor: true,
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function (item, el, eOpts) {
                                let vm = this.upVM();
                                let store = this.find('costCenterGrid').getStore();
                                let record = vm.get('costCenterGrid.selection');
                                let container = this.find('costCenterDetails');

                                Ext.Msg.confirm(
                                    'Delete',
                                    'Are you sure you would like to delete this entry?',
                                    function (answer) {
                                        if (answer == 'yes') {
                                            container.hide();
                                            store.remove(record);
                                            store.sync({
                                                success: function (err, msg) {
                                                    Ext.toast('Record updated', 1000);
                                                },
                                                failure: function (batch) {
                                                    Ext.Msg.alert('Something went wrong', 'Could not delete record!');
                                                },
                                            });
                                        }
                                    },
                                    this,
                                    [
                                        {
                                            xtype: 'button',
                                            itemId: 'no',
                                            margin: '0 8 0 0',
                                            text: 'Cancel',
                                        },
                                        {
                                            xtype: 'button',
                                            itemId: 'yes',
                                            ui: 'decline alt',
                                            text: 'Delete',
                                        },
                                    ]
                                );
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'CostCenterTree',
        },
    ],
});
