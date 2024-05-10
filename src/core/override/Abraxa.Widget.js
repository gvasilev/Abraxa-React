function sanitizeHTML(html) {
    const regex =
        /(on|ON|oN|On)([A-Z]|[a-z])*=[a-z]*\('[a-zA-Z0-9]+'\)|(on|ON|oN|On)([A-Z]|[a-z])*=[a-z]*\([a-zA-Z0-9]+\)|(<(script|style|iframe|link|embed)>([\s\S]*?)<\/(script|style|iframe|link|embed)>)/gi;

    // Fix UI breaking bug when html is not a string, but instanceof Date (as real life example)
    let stringifiedHtml = html && typeof html.toString === 'function' ? html.toString() : '';

    const sanitizedHTML = stringifiedHtml.replace(regex, '');

    return sanitizedHTML;
}

function replaceString(obj) {
    if (typeof obj === 'string') {
        return sanitizeHTML(obj);
    } else if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
            obj[i] = replaceString(obj[i]);
        }
    } else if (obj instanceof Date) {
        // Fix UI breaking bug when html is not a string, but instanceof Date (as real life example)
        return sanitizeHTML(obj.toString());
    } else if (typeof obj === 'object' && obj !== null) {
        for (let key in obj) {
            obj[key] = replaceString(obj[key]);
        }
    }

    return obj;
}

Ext.define('Abraxa.Widget', {
    override: 'Ext.Widget',

    // applyValue: function (value) {
    //     if (value && isNaN(value)) {
    //         return replaceString(value);
    //     }
    //     return value;
    // },

    applyHtml: function (html) {
        if (html) {
            return sanitizeHTML(html);
        }
    },

    updateHtml: function (html) {
        let innerHtmlElement;

        if (!this.destroyed) {
            innerHtmlElement = this;
            if (Ext.isElement(html)) {
                innerHtmlElement.setHtml('');
                innerHtmlElement.append(sanitizeHTML(html));
            } else {
                innerHtmlElement.setHtml(sanitizeHTML(html));
            }
        }
    },

    setHtml: function (html) {
        if (this.el.dom) {
            this.el.dom.innerHTML = sanitizeHTML(html);
        }

        return this;
    },
});
