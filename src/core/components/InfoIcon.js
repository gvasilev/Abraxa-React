Ext.define('Abraxa.core.components.InfoIcon', {
    extend: 'Abraxa.core.components.Div',
    xtype: 'infoicon',
    config: {
        cls: 'a-info-icon',
        html: '<i class="material-icons-outlined md-16">info</i>',
        infoText: null,
        tooltip: {
            anchor: true,
            align: 'bc-tc',
            html: null,
            showDelay: 0,
            hideDelay: 0,
        },
    },

    setInfoText: function (infoText) {
        this.getTooltip().html = infoText;
    },
});
