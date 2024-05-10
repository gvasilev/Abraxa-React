Ext.define('Abraxa.view.portcall.sof.SofCategoryCombo', {
    extend: 'Ext.field.ComboBox',
    xtype: 'sof.category.combo',
    editable: false,
    queryMode: 'local',
    cls: 'sof-category-input non-editable',
    valueField: 'id',
    displayField: 'name',
    value: 1,
    itemTpl: '<div class="a-badge-sof sof-{name}">{name:capitalize()}</div>',
    matchFieldWidth: false,
    options: [
        {
            id: 1,
            name: 'event',
        },
        {
            id: 2,
            name: 'worked',
        },
        {
            id: 3,
            name: 'stopped',
        },
        {
            id: 4,
            name: 'shifting',
        },
        {
            id: 5,
            name: 'waiting',
        },
    ],
    floatedPicker: {
        width: 120,
    },
    listeners: {
        select: function (cmp, value) {
            let name = value.get('name');
            this.beforeInputElement.set({
                'data-type': name,
            });
        },
    },
});
