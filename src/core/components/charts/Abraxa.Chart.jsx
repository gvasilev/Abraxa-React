import '../../mixins/Abraxa.fusioncharts.Mixin';

Ext.define('Abraxa.Chart', {
    extend: 'Ext.Component',
    xtype: 'fusionchart',
    mixins: {
        fusionchart: 'Abraxa.fusioncharts.Mixin',
    },
    autoShow: true,
    element: {
        reference: 'element',
        children: [
            {
                reference: 'chartElement',
                classList: [Ext.baseCSSPrefix + 'fusionchart'],
            },
        ],
    },
    initialize: function () {
        this.on(
            'activate',
            function () {
                var container = this.getParent().el;
                if (container) {
                    let me = this,
                        chart = me.getFusionChart();
                    if (chart && chart.containerHidden) {
                        chart.render(this.chartElement.component.getFusionChartDomElement().id);
                    }
                }
            },
            this
        );
    },
    // twoWayBindable: ['data'],
    defaultBindProperty: 'data',
    getFusionChartDomElement: function () {
        return this.chartElement.dom;
    },

    // doDestroy: function () {
    //     var me = this;

    //     me.setData(null);
    //     if (me.getFusionChart()) me.getFusionChart().dispose();
    //     this.destroy();
    //     console.log('doDestroy', arguments);
    // },

    updateValue: function (value) {
        this.mixins.fusionchart.updateValue.call(this, value);
    },

    updateDisabled: function (disabled) {
        this.mixins.fusionchart.updateDisabled.call(this, disabled);
    },

    updateData: function (data) {
        this.mixins.fusionchart.updateData.call(this, data);
    },
});
