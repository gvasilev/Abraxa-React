Ext.define('Abraxa.core.combo.SubObjects', {
    extend: 'Ext.field.ComboBox',
    xtype: 'subobjects.combo',
    valueField: 'id',
    displayField: 'name',
    cls: 'a-sub-objects-combo hbox',
    ui: 'classic hovered-border no-border',
    placeholder: 'Object',
    queryMode: 'local',
    flex: 1,
    forceSelection: true,
    store: [],
    itemTpl:
        '<div class="combo-item hbox">' +
        '<div class="mini-icon" data-type="{type}"><i class="md-icon-outlined {icon} md-18"></i></div>' +
        '<div>{name}</div>' +
        '</div>',
    bind: {
        store: {
            data: '{subObjects}',
        },
    },
    listeners: {
        initialize: function () {
            this.on('select', function (me, record) {
                this.beforeInputElement.set({
                    'data-type': record.get('type'),
                });
            });
            this.on('change', function (me, record) {
                if (!me.getValue()) {
                    this.beforeInputElement.set({
                        'data-type': '',
                    });
                }
            });
        },
        beforequery: function (query) {
            let store = query.combo.getStore(),
                userPermissions = Ext.getCmp('main-viewport').getViewModel().get('userPermissions'),
                nonEditable = Ext.getCmp('main-viewport').getViewModel().get('nonEditable'),
                portcallView = Ext.ComponentQuery.query('portcall\\.main')[0];
            if (portcallView) {
                let portCallVM = Ext.ComponentQuery.query('portcall\\.main')[0].upVM(),
                    objectPermissions = portCallVM.get('objectPermissions'),
                    result = null;
                if (!nonEditable) {
                    store.removeFilter(1000);
                    store.addFilter({
                        id: 1000,
                        filterFn: function (record) {
                            if (userPermissions && Object.keys(userPermissions).length > 0) {
                                let permissionRecord = userPermissions[record.get('subOject')];
                                if (permissionRecord) {
                                    return true;
                                }
                                return false;
                            }
                        },
                    });
                } else {
                    store.removeFilter(1000);
                    store.addFilter({
                        id: 1000,
                        filterFn: function (record) {
                            let result = false,
                                allowedByObjectPermission = false;
                            if (objectPermissions && Object.keys(objectPermissions).length > 0) {
                                let permissionRecord = objectPermissions[record.get('subOject')];
                                if (permissionRecord) {
                                    result = record;
                                    allowedByObjectPermission = true;
                                }
                            }
                            if (userPermissions && Object.keys(userPermissions).length > 0) {
                                let permissionRecord = userPermissions[record.get('subOject')];
                                if (permissionRecord && allowedByObjectPermission) {
                                    result = record;
                                } else {
                                    result = false;
                                }
                            }
                            return result;
                        },
                    });
                }
            } else {
                store.removeFilter(1000);
                store.addFilter({
                    id: 1000,
                    filterFn: function (record) {
                        if (userPermissions && Object.keys(userPermissions).length > 0) {
                            let permissionRecord = userPermissions[record.get('subOject')];
                            if (permissionRecord && permissionRecord.edit) {
                                return true;
                            }
                            return false;
                        }
                    },
                });
            }
        },
    },
});
