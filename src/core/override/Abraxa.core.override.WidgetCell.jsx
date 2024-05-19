Ext.define('Abraxa.core.override.WidgetCell', {
    override: 'Ext.grid.cell.Widget',
    config: {
        permission: null,
        objectPermission: null,
        slug: null,
        subObject: null,
    },

    applyObjectPermission: function (permissions) {
        let subObject = this.getSubObject();
        if (subObject && permissions) {
            if (permissions[subObject]) {
                // this.setBind({
                //     permissions: null
                // });
                var action = permissions[subObject];
                // if (this.getXTypes().indexOf('commodity.combo') > -1)
                // console.log(this, action);

                if (action.can_edit) {
                    // if (this.getXTypes().indexOf('field') > -1 && this.getBaseCls() != 'x-formpanel') {
                    //     this.setBind({
                    //         readOnly: null
                    //     });
                    //     this.setBind({
                    //         ui: null
                    //     });
                    //     this.setUi(this.config.ui);
                    //     this.setReadOnly(false);
                    // }
                    this.setBind({
                        cls: null,
                    });
                    this.removeCls('hidden');
                }
            } else {
                // this.hide();
                this.setBind({
                    hidden: null,
                });
                this.hide();
                // if (this.getXTypes().indexOf('gridcolumn') > -1) {
                //     this.setHidden(true);
                //     this.setHideable(false);
                // }
            }
        }
        // this.setBind(this.getBind());
    },
    applyPermission: function (permissions) {
        let slug = this.getSlug();
        if (slug) {
            if (permissions[slug]) {
                var action = permissions[slug];
                if (!action.edit && this.getXTypes().indexOf('tab') == -1) {
                    this.setBind({
                        disabled: null,
                    });
                    if (!this.skipEditPermission) {
                        this.setDisabled(true);
                    } else {
                        this.setBind({
                            hidden: null,
                        });
                        this.hide();
                    }
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
            }
        }
    },

    applySlug: function (slug) {
        return slug;
    },

    applySubObject: function (subObject) {
        return subObject;
    },
});
