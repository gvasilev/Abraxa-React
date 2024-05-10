Ext.define('Abraxa.core.components.combo.AbraxaTimeZoneCombo', {
    extend: 'Ext.form.field.ComboBox',
    // extend: 'Abraxa.core.components.combo.Generic',
    xtype: 'timezone.combo',
    label: 'Choose timezone',
    selectable: true,
    forceSelection: true,
    // editable: false,
    placeholder: 'Search timezone',
    itemTpl: new Ext.XTemplate(
        '<div class="combo-item">' +
            '<div class="sm-icon"><img src="https://static.abraxa.com/flags/1x1/{flag_name}.svg" style="height: 16px; width: 16px; border-radius:50%;"/></div>' +
            '<label class="sm-type">{timezone}</label>' +
            '<div class="sm-value">{[this.getGMT(values.timezone)]}</div>' +
            '</div>',
        {
            getGMT: function (timezone) {
                return moment.tz(timezone).format('UTC Z');
            },
        }
    ),
    displayTpl: new Ext.XTemplate('{timezone} ({[this.getGMT(values.timezone)]})', {
        getGMT: function (timezone) {
            return moment.tz(timezone).format('UTC Z');
        },
    }),
    valueField: 'id',
    displayField: 'timezone',
    store: {
        type: 'common.timezones',
    },
    queryMode: 'local',
    onInput: function (e) {
        var me = this,
            value = me.inputElement.dom.value,
            store = me.getStore();
        store.clearFilter();
        if (me.getSelection()) {
            store.addFilter(
                new Ext.data.Query({
                    source: 'timezone like "' + me.getSelection().get('timezone').replace('/', ' ') + '"',
                })
            );
            me.expand();
        } else {
            store.addFilter(
                new Ext.data.Query({
                    source: 'timezone like "' + value.replace('/', ' ') + '"',
                })
            );
            me.expand();
        }
    },
});
