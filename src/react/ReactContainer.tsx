import { createRoot } from 'react-dom/client';

Ext.define('ReactContainer', {
    extend: 'Ext.Component',
    xtype: 'react-container',
    config: {
        reactComponent: null,
    },
    initialize: function () {
        this.reactRoot = createRoot(this.el.dom);
        this.reactRoot.render(this.config.reactComponent);
    },
    destroy: function() {
        if (this.reactRoot) {
            this.reactRoot.unmount();
        }
    }
});
