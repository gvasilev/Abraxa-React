import Column2D from "fusioncharts/fusioncharts.charts";

import '../../mixins/Abraxa.fusioncharts.Mixin.jsx';
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

    doDestroy: function () {
        var me = this;

        me.setData(null);
        if (me.getFusionChart()) me.getFusionChart().dispose();

        me.callParent();
    },

    updateValue: function (value) {
        this.mixins.fusionchart.updateValue.call(this, value);
    },

    updateDisabled: function (disabled) {
        this.mixins.fusionchart.updateDisabled.call(this, disabled);
    },

    updateData: function (data) {
        this.mixins.fusionchart.updateData.call(this, data);
    },
    privates: {
        // // Overrides a private method in Ext.mixin.Observable
        // doAddListener: function (ename) {
        //     var me = this,
        //         result;
        //     result = me.callParent(arguments);
        //     this.mixins.froalaeditor.handleAddListener.call(this, ename);
        //     return result;
        // },
        // // Overrides a private method in Ext.mixin.Observable
        // doRemoveListener: function (ename) {
        //     var me = this,
        //         result;
        //     result = me.callParent(arguments);
        //     this.mixins.froalaeditor.handleRemoveListener.call(this, ename);
        //     return result;
        // }
    },
    // listeners: {
    //     resize: function (chart, width, height) {
    //         if (chart.getFusionChart()) {
    //             console.log(chart.getFusionChart());
    //             chart.getFusionChart().resizeTo(width, height);
    //         }
    //     },
    // },
});
