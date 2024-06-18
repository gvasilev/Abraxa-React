import './Server';
import './Rest';

Ext.define('Nishilua.data.proxy.Rest', {
    override: 'Ext.data.proxy.Rest',
    compatibility: ['6.0.1.250', '6.2.0.981'],
    buildUrl: function(c) {
        var b = this,
            a = this.callParent(arguments);
        if (!b.getAppendId()) {
            params = c.getParams();
            if (params) {
                delete params[b.getIdParam()];
            }
        }
        return a;
    },
});
Ext.define('Nishilua.data.proxy.Server', {
    override: 'Ext.data.proxy.Server',
    compatibility: ['6.0.1.250', '6.2.0.981'],
    placeholdersRe: /\${([^}]*)}/g,
    buildUrl: function(c) {
        var b = this,
            a = b.getUrl(c),
            e = b._findPlaceholderKeys(a),
            d = c.getParams();
        e.forEach(function(g) {
            var f = this._findValue(d, g);
            if (Ext.isDefined(f)) {
                a = a.replace('${' + g + '}', encodeURIComponent(f), 'g');
            }
        }, this);
        c.setUrl(a);
        e.forEach(function(f) {
            var g = f.split('.');
            delete d[g[0]];
        }, this);
        b.callParent([c]);
        a = b.getUrl(c);
        return a;
    },
    _findValue: function(d, c) {
        var b = c.split('.'),
            e = b.length;
        for (var a = 0; a < e; a++) {
            if (d === null || d === undefined) {
                return undefined;
            } else {
                d = d[b[a]];
            }
        }
        return d;
    },
    _findPlaceholderKeys: function(c) {
        var b,
            a = [];
        while ((b = this.placeholdersRe.exec(c)) !== null) {
            a.push(b);
        }
        return Ext.Array.pluck(a, '1');
    },
});
