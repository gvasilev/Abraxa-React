Ext.define('Abraxa.core.components.combo.Objects', {
    extend: 'Ext.field.Select',
    xtype: 'objects.combo',
    queryMode: 'local',
    displayField: 'name',
    valueField: 'id',
    store: [],
    cls: 'a-object-combo',
    placeholder: 'Object',
    bind: {
        store: '{objects}',
    },
    width: 130,
    floatedPicker: {
        cls: 'a-picker-small',
    },
    itemTpl:
        '<div class="combo-item hbox">' +
        '<div class="mini-icon round" data-type="{abbr}"><i class="{icon} md-18"></i></div>' +
        '<div>{name:capitalize()}</div>' +
        '</div>',
    listeners: {
        select: function (cmp, value) {
            let type = value.get('abbr');
            this.beforeInputElement.set({
                'data-type': type,
            });
        },
    },
});
