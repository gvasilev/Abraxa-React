Ext.define('Abraxa.view.main.AnnouncementController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.announcement-controller',

    init: function () {
        var bbar = this.lookup('bbar'),
            card = this.lookup('carousel').getLayout(),
            // Lazily create the Indicator (wired to the card layout)
            indicator = card.getIndicator();

        // Render it into our bottom toolbar (bbar)
        bbar.insert(1, indicator);
    },

    onPrev: function () {
        Ext.ComponentQuery.query('[cls~=announcement_carousel]')[0].getLayout().previous();
    },

    onNext: function () {
        Ext.ComponentQuery.query('[cls~=announcement_carousel]')[0].getLayout().next();
    },
});
