Ext.define('Abraxa.core.permissions.ObjectPermissionsCheckbox', {
    extend: 'Ext.menu.CheckItem',
    xtype: 'object.permissions.checkbox',
    cls: 'a-object-permissions-checkbox',
    config: {
        slug: null,
        action: null,
        toggleChecked: null,
    },

    // getChecked: function () {
    //     return !!this.inputElement.dom.checked;
    // },
    classCls: Ext.baseCSSPrefix + 'checkboxfield',
    checkedCls: Ext.baseCSSPrefix + 'checked',
    applySlug: function (slug) {
        let store = this.upVM().get('rolePermissions');
        if (store) {
            var action = this.getAction(),
                index = store.findBy(function (rec) {
                    return rec.get('slug') == slug && rec.get(action);
                }),
                rec = store.getAt(index);
            if (rec) {
                rec.get(action) ? this.setChecked(true) : this.setChecked(false);
            } else {
                this.setChecked(false);
            }
        }
        return slug;
    },

    applyToggleChecked: function (store) {
        if (store) {
            var action = this.getAction(),
                slug = this.getSlug(),
                index = store.findBy(function (rec) {
                    return rec.get('slug') == slug && rec.get(action);
                }),
                rec = store.getAt(index);
            if (rec) {
                rec.get(action) ? this.setChecked(true) : this.setChecked(false);
            } else {
                this.setChecked(false);
            }
        }
    },

    setToggleChecked: function (store) {
        if (store) {
            var action = this.getAction(),
                slug = this.getSlug(),
                index = store.findBy(function (rec) {
                    return rec.get('slug') == slug;
                }),
                rec = store.getAt(index);
            if (rec) {
                rec.get(action) ? this.setChecked(true) : this.setChecked(false);
            } else {
                this.setChecked(false);
            }
            return store;
        }
    },
});
