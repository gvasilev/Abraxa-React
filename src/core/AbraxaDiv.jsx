Ext.define('Abraxa.core.components.Div', {
    extend: 'Ext.Component',
    xtype: 'div',

    getInnerHtmlElement: function () {
        var me = this,
            innerHtmlElement = me;

        // if (!innerHtmlElement || !innerHtmlElement.el.dom || !innerHtmlElement.el.dom.parentNode) {
        //     me.innerHtmlElement = innerHtmlElement = Ext.Element.create({
        //         cls: Ext.baseCSSPrefix + 'innerhtml'
        //     });
        //     me.getRenderTarget().appendChild(innerHtmlElement);
        // }

        return innerHtmlElement;
    },

    updateHtml: function (html) {
        var innerHtmlElement;

        if (!this.destroyed) {
            innerHtmlElement = this;
            if (Ext.isElement(html)) {
                innerHtmlElement.setHtml('');
                innerHtmlElement.append(html);
            } else {
                innerHtmlElement.setHtml(html);
            }
        }
    },

    setHtml: function (html) {
        if (this.el.dom) {
            this.el.dom.innerHTML = html;
        }

        return this;
    },
});
