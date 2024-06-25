import * as React from 'react';
import { createRoot } from 'react-dom/client';

Ext.define('ReactComponent', {
    extend: 'Ext.Component',
    xtype: 'ReactComponent',
    config: {
        reactComponent: null,
        reactProps: {},
    },
    initialize: function () {
        this.reactRoot = createRoot(this.el.dom);
        this.reactRoot.render(React.createElement(this.getReactComponent(), this.getReactProps()));
    },
    destroy: function () {
       if (this.reactRoot) {
            this.reactRoot.unmount();
            this.reactRoot = null;
        }
    },
});
