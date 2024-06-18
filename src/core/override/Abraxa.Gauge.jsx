Ext.define('Abraxa.Gauge', {
    override: 'Ext.ux.gauge.Gauge',
    // needed access to record values
    updateMaxValue: function (maxValue) {
        var me = this;

        me.interpolator.setDomain(me.getMinValue(), maxValue);

        if (!me.isConfiguring) {
            me.render();
        }

        me.writeText();
    },

    updateValueStyle: function (valueStyle) {
        var me = this,
            valueArc = Ext.fly(me.getValueArc()),
            name;

        for (name in valueStyle) {
            if (name in me.pathAttributes) {
                valueArc.setStyle(me.camelToHyphen(name), valueStyle[name]);
            } else {
                valueArc.setStyle(name, valueStyle[name]);
            }
        }

        me.writeText();
    },
});
