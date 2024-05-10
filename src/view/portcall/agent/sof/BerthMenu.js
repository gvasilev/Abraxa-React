Ext.define('Abraxa.view.portcall.sof.BerthMenu', {
    extend: 'Ext.dataview.List',
    xtype: 'ops.berth.menu',
    cls: 'a-sub-tabs a-berth-menu berth_selection_menu',
    reference: 'activeBerth',
    subObject: 'berth',
    deselectable: false,
    itemTpl: '<i class="md-icon-outlined x-list-sortablehandle grabbable"></i><span class="a-sub-name">{name}</span>',
    id: 'berthListMenu',
    infinite: false,
    slug: 'portcallOpsBerths',
    bind: {
        permission: '{userPermissions}',
    },
    variableHeights: false,
    // itemsFocusable: true,
    minHeight: 48,
    maxHeight: 600,
    itemConfig: {
        viewModel: {
            formulas: {
                berth_sequence: {
                    bind: {
                        bindTo: '{berths}',
                        deep: true,
                    },
                    get: function (store) {
                        if (store) {
                            let store = this.get('berths');
                            count = store.indexOf(this.get('record')) + 1;

                            return 'Berth ' + count;
                        }
                    },
                },
                selectFirst: {
                    bind: {
                        bindTo: '{opsMenu.selection.tab}',
                        deep: true,
                    },
                    get: function (tab) {
                        if (tab && tab == 'berths') {
                            let alreadySelected = this.get('activeBerth.selection'),
                                store = this.get('berths');

                            if (!alreadySelected && store.getCount()) {
                                Ext.getCmp('berthListMenu').select(0);
                            }
                        } else {
                            Ext.getCmp('berthListMenu').deselectAll();
                        }
                    },
                },
            },
        },
        bind: {
            cls: '{record.is_current ? "a-current-berth" : ""}',
            tooltip: {
                html: '{opsLeftMenu.userCls ? "" : record.name}',
                showDelay: 0,
                hideDelay: 0,
                dismissDelay: 0,
                allowOver: false,
                closeAction: 'destroy',
                align: 'bc-tc?',
                anchor: true,
                // bottom: 0,
            },
        },
    },
    listeners: {
        refresh: function () {
            let alreadySelected = this.upVM().get('activeBerth.selection'),
                store = this.upVM().get('berths');
            if (alreadySelected && store.getCount()) {
                let record = store.findRecord('berth_id', alreadySelected.get('berth_id'), 0, false, false, true);
                if (record) {
                    Ext.getCmp('berthListMenu').select(store.indexOf(record));
                } else {
                    Ext.getCmp('berthListMenu').select(store.getAt(0));
                }
            } else if (store && store.getCount()) {
                Ext.getCmp('berthListMenu').select(store.getAt(0));
            }
        },
    },
});
