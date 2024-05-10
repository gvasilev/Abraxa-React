Ext.define('Abraxa.core.ComponentDataview', {
    extend: 'Ext.dataview.Component',
    xtype: 'abraxa.componentdataview',
    focusable: false,
    itemsFocusable: false,
    navigationModel: {
        type: 'null',
    },
    onFocusEnter: Ext.emptyFn,
    onFocusLeave: Ext.emptyFn,
    selectable: false,
    ripple: false,
    itemRipple: false,
});
