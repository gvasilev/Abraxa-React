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
                var action = permissions[subObject];

                if (action.can_edit) {
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
            }
        }
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
