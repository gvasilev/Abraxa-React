var tooltipTimeOut;

Ext.define('Abraxa.view.common.tooltips.AbraxaTooltip', {
    extend: 'Ext.tip.ToolTip',
    xtype: 'abraxa.tooltip',
    anchorToTarget: true,
    anchor: true,
    autoHide: false,
    closable: true,
    autoDestroy: true,
    dismissDelay: 1500,
    showOnTap: true,
    closeAction: 'destroy',
    ui: 'card',

    listeners: {
        hide: function () {
            this.destroy();
        },
        beforeshow: function () {
            //$('.tooltip').remove();
        },
        show: function (tip) {
            var currentTarget = tip.getViewModel().getData().clickedElement;
            var tipTarget = tip.el.dom;
            //var timeOut = tip.getViewModel().getData().timeOutToHide;

            tipTarget.addEventListener('mouseover', function () {
                clearTimeout(tooltipTimeOut);
            });

            tipTarget.addEventListener('mouseleave', function () {
                setTimeout(function () {
                    tip.destroy();
                }, 1000);
            });

            // currentTarget.addEventListener("mouseleave", function () {
            //     tooltipTimeOut = setTimeout(function () {
            //         tip.destroy();
            //     }, 1000);
            // });
        },
    },
});
