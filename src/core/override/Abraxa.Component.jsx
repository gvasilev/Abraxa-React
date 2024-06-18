Ext.define('Abraxa.Component', {
    override: 'Ext.Component',

    getVM: function () {
        // alias for getViewModel() // global
        return this.getViewModel();
    },
    upVM: function () {
        // alias for lookupViewModel() // global
        return this.lookupViewModel();
    },
    goUp: function () {
        // quick reference to main Container of Abraxa Platform // global
        return Ext.getCmp('main-viewport');
    },
    go: function (hash) {
        // alias for quickly change location on the site
        window.location.hash = hash;
    },
    find: function (query) {
        // query by item id
        return this.goUp().queryById(query);
    },
    findInScope: function (query, scopeItemId) {
        return this.find(scopeItemId).queryById(query);
    },

    initialize: function (me) {
        if (this.testId) {
            this.el.set({
                'data-testid': this.testId,
            });
        }
    },

    config: {
        permission: null,
        objectPermission: null,
        slug: null,
        subObject: null,
        isEdited: false,
        oldBind: null,
        wasHidden: false,
        liveGridRecordId: null,
        custiomItems: null,
        customValue: '{record.name}',
        customComponentHolderId: null,
        showNoPermissions: null,
        noPermissionsContainer: {
            xtype: 'container',
            cls: 'a-no-permissions',
            padding: 16,
            flex: 1,
            // layout: {
            //     type: 'hbox',
            //     align: 'middle',
            //     pack: 'center'
            // },
            items: [
                {
                    xtype: 'div',
                    cls: 'a-no-permissions-inner',
                    html: '<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <circle cx="20" cy="20" r="20" fill="#0078D7" fill-opacity="0.08"/> <path d="M26 16H25V14C25 11.24 22.76 9 20 9C17.24 9 15 11.24 15 14V16H14C12.9 16 12 16.9 12 18V28C12 29.1 12.9 30 14 30H26C27.1 30 28 29.1 28 28V18C28 16.9 27.1 16 26 16ZM17 14C17 12.34 18.34 11 20 11C21.66 11 23 12.34 23 14V16H17V14ZM26 28H14V18H26V28ZM20 25C21.1 25 22 24.1 22 23C22 21.9 21.1 21 20 21C18.9 21 18 21.9 18 23C18 24.1 18.9 25 20 25Z" fill="#0078D7"/> </svg><div class="a-no-permissions-text">No permissions for this section</div>',
                },
            ],
        },
    },
    // TO-DO: Check if this bind is OK
    // bind: {
    //     permission: '{userPermissions}'
    // },
    applyObjectPermission: function (permissions) {
        let subObject = this.getSubObject(),
            is_archived = this.upVM().get('object_record') ? this.upVM().get('object_record').get('is_archived') : null,
            parent_id = this.upVM().get('object_record') ? this.upVM().get('object_record').get('parent_id') : null;

        if (is_archived || parent_id) return;

        if (subObject && permissions) {
            this.setOldBind(this.getBind());
            if (permissions[subObject]) {
                var action = permissions[subObject];

                if (action.can_edit) {
                    if (this.getXTypes().indexOf('field') > -1 && this.getBaseCls() != 'x-formpanel') {
                        this.setBind({
                            readOnly: null,
                        });
                        this.setBind({
                            ui: null,
                        });
                        this.setUi(this.config.ui);
                        this.setReadOnly(false);
                    }
                    this.setBind({
                        cls: null,
                    });
                    this.removeCls('hidden');
                }
            } else {
                this.setBind({
                    hidden: null,
                });
                this.setHidden(true);
                this.setWasHidden(true);
            }
        } else {
            if (this.getOldBind()) {
                this.bind = this.config.bind;
            }
            if (this.getWasHidden()) {
                this.setHidden(false);
                this.show();
                this.setWasHidden(false);
            }
            // this.setBind(this.getBind());
        }
    },
    applyPermission: function (permissions) {
        let slug = this.getSlug();
        if (slug && permissions) {
            if (permissions[slug]) {
                var action = permissions[slug];

                if (!action.edit && this.getXTypes().indexOf('tab') == -1) {
                    this.setBind({
                        disabled: null,
                    });
                    if (!this.skipEditPermission) {
                        this.setDisabled(true);
                    }
                    if (this.getXTypes().indexOf('gridcolumn') > -1) {
                        this.setEditable(false);
                    }
                }
                if (
                    this.permissionCreate &&
                    !action.create &&
                    (this.getXTypes().indexOf('button') > -1 || this.getXTypes().indexOf('menuitem') > -1)
                ) {
                    this.setDisabled(true);
                }
                if (
                    this.skipDisabledPrmission &&
                    (this.getXTypes().indexOf('button') > -1 || this.getXTypes().indexOf('menuitem') > -1)
                ) {
                    this.setDisabled(false);
                }
            } else {
                this.setBind({
                    hidden: null,
                });
                this.hide();
                if (this.getXTypes().indexOf('gridcolumn') > -1) {
                    this.setHidden(true);
                    this.setHideable(false);
                }
                if (this.getShowNoPermissions()) {
                    this.getParent().add(this.getNoPermissionsContainer());
                }
            }
        }
        // return permissions;
    },

    setCustomComponents: function (store) {
        let cmp = this;
        if (store) {
            let components = store.queryBy(function (record) {
                if (record.get('customComponentHolderId') == cmp.getCustomComponentHolderId()) return true;
            });
            if (components.length) {
                components.each(function (component) {
                    cmp.add({
                        xtype: component.get('xtype'),
                        bind: component.get('bind'),
                        userCls: 'added-custom-component',
                        listeners: {
                            added: function () {
                                this.setConfig(component.get('config'));
                            },
                        },
                    });
                });
            }
        }
    },

    restorePermission: function () {
        let permissions = this.upVM().get('userPermissions');
        this.applyPermission(permissions);
    },

    applySlug: function (slug) {
        return slug;
    },

    applyLliveGridRecordId: function (recordId) {
        return recordId;
    },

    applySubObject: function (subObject) {
        return subObject;
    },

    applyCustomComponentHolderId: function (customComponentHolderId) {
        return customComponentHolderId;
    },
});
