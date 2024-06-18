Ext.define('Abraxa.Field', {
    override: 'Ext.field.Text',
    stripCharsRe: /<[^>]+>/g,
    validateOnInit: 'none',

    updateAutoComplete: function (value) {
        this.setInputAttribute('autocomplete', value ? 'on' : 'none');
    },
});
