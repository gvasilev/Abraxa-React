Ext.define('Abraxa.data.ChainedStore', {
    override: 'Ext.data.ChainedStore',

    sync: function (params) {
        if (this.extraParams) this.getSource().getProxy().setExtraParams(this.extraParams);

        return this.getSource().sync(params);
    },
    reload: function (params) {
        if (this.extraParams) this.getSource().getProxy().setExtraParams(this.extraParams);

        return this.getSource().reload(params);
    },
    load: function (params) {
        if (this.extraParams) this.getSource().getProxy().setExtraParams(this.extraParams);

        return this.getSource().load(params);
    },

    rejectChanges: function (params) {
        return this.getSource().rejectChanges(params);
    },
    commitChanges: function (params) {
        return this.getSource().commitChanges(params);
    },

    getAutoLoad: function () {
        if (!this.getSource()) return false;

        return this.getSource().getAutoLoad();
    },

    isLoaded: function () {
        if (!this.getSource()) return false;

        return this.getSource().isLoaded();
    },

    getProxy: function () {
        if (!this.getSource()) return false;

        return this.getSource().getProxy();
    },
});
