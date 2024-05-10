Ext.define('Abraxa.view.settings.users_teams.roles.ObjectTabs', {
    extend: 'Ext.tab.Bar',
    xtype: 'object.tabs',

    requires: ['Ext.data.StoreManager'],

    config: {
        titleField: 'title',
        store: null,
        emptyState: null,
        storeEventListeners: {
            add: 'onStoreAdd',
            beforeload: 'onStoreBeforeLoad',
            clear: 'onStoreClear',
            load: 'onStoreLoad',
            refresh: 'onStoreRefresh',
            remove: 'onStoreRemove',
            update: 'onStoreUpdate',
            // check derived classes before adding new event handlers
        },

        scrollToTopOnRefresh: true,
    },

    privates: {
        attachStoreEvents: function (store, listeners) {
            this.storeListeners = store.on(listeners);
        },

        handleBeforeLoad: function () {
            return true;
        },

        bindStore: function (store) {
            this._trueStore = store;
            this.dataRange = store.createActiveRange();
        },
        syncEmptyState: function () {
            var me = this,
                store = me.store,
                empty = !store || (!store.getCount() && me.getEmptyText()),
                emptyTextCmp = me.emptyTextCmp;

            if (!empty) {
                me.onDataRefresh(store);
            } else if ((me.hasLoadedStore || !me.getDeferEmptyText()) && !(store && store.hasPendingLoad())) {
                emptyTextCmp = emptyTextCmp || me.getEmptyTextCmp();
                emptyTextCmp.show();
            }

            me.setEmptyState(empty);

            return empty;
        },

        runRefresh: function () {
            var me = this,
                store = me.store;
            me.syncEmptyState();
            // Ignore TreeStore loading state. They kick off loads while
            // content is still perfecty valid and renderable.
            if (store && !me.isConfiguring && (store.isTreeStore || !store.hasPendingLoad())) {
                me.fireEventedAction('refresh', [me], 'doRefresh', me, true);
            }
        },
    },

    applyStore: function (store) {
        var ret = store ? Ext.data.StoreManager.lookup(store) : null;
        this.store = this._trueStore = ret;
        this.onDataRefresh(ret);
        return ret;
    },

    refresh: function () {
        this.whenVisible('runRefresh');
    },

    onStoreUpdate: function (store, record, type, modifiedFieldNames, info) {
        this.onDataRefresh(store);
    },

    onStoreAdd: function () {
        this.syncEmptyState();
    },

    onStoreBeforeLoad: function () {
        this.handleBeforeLoad();
    },

    onStoreClear: function () {
        this.doClear();
    },
    onStoreLoad: function () {
        this.hasLoadedStore = true;
        this.syncEmptyState();
    },

    onStoreRefresh: function () {
        this.refresh();
    },

    onStoreRemove: function () {
        this.syncEmptyState();
    },

    onDataRefresh: function (store) {
        var me = this;
        if (store) {
            store.each(function (record) {
                var tab = me.getTabByRecord(record);
                if (!tab) {
                    me.add({
                        id: 'tab-' + record.get('id'),
                        title: record.getObject().get('name'),
                        activeRecordId: record.getObject().get('name'),
                        object_record: record,
                    });
                }
            });

            if (!me.getActiveTab()) {
                me.setActiveTab(0);
            }
        }
    },

    getTabByRecord: function (record) {
        var items = this.items,
            me = this,
            titleField = me.getTitleField(),
            tab;
        items.each(function (item) {
            if (item.getTitle() === record.getObject().get('name')) {
                tab = item;
                return false;
            }
        });
        return tab;
    },
});
