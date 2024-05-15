Ext.define('Abraxa.core.permissions.ObjectPermissionsToggle', {
    extend: 'Ext.field.Toggle',
    xtype: 'object.permissions.toggle',

    config: {
        slug: null,
        toggleValue: null,
        action: null,
    },

    applySlug: function (slug) {
        let store = this.upVM().get('rolePermissions');
        if (store) {
            // console.log(store);
            var action = this.getAction(),
                index = store.findBy(function (rec) {
                    return rec.get('slug') == slug;
                }),
                rec = store.getAt(index);
            if (rec) {
                rec.get(action) ? this.setValue(true) : this.setValue(false);
            } else {
                this.setValue(false);
            }
        }
        return slug;
    },

    applyToggleValue: function (store) {
        if (store) {
            // console.log(store);
            var action = this.getAction(),
                slug = this.getSlug(),
                index = store.findBy(function (rec) {
                    return rec.get('slug') == slug;
                }),
                rec = store.getAt(index);
            if (rec) {
                rec.get(action) ? this.setValue(true) : this.setValue(false);
            } else {
                this.setValue(false);
            }
        }
    },

    updateManualValue: function (value, oldValue) {
        var me = this,
            active = me.getActiveLabel(),
            inactive = me.getInactiveLabel();

        if (active || inactive) {
            me.setLabel(value ? active : inactive);
        }

        me.updateManualToogle([value, oldValue]);
    },

    updateManualToogle: function (value, oldValue) {
        var me = this;
        if (value !== oldValue) {
            me.updateFieldValue(value, oldValue);
        }
        me.setDirty(me.isDirty());
    },

    // setToggleChecked: function (store) {
    //     if (store) {
    //         // console.log(store);
    //         var action = this.getAction(),
    //             slug = this.getSlug(),
    //             index = store.findBy(function (rec) {
    //                 return (rec.get('slug') == slug);
    //             }),
    //             rec = store.getAt(index);
    //         if (rec) {
    //             // console.log('has rec');
    //             rec.get(action) ? this.setValue(true) : this.setValue(false);
    //         } else {
    //             this.setValue(false);
    //         }
    //     }
    // },

    updateFieldValue: function (value, oldValue) {
        var me = this,
            rawToValue;

        // Don't try to validate the field if the value transitions between empty values (null,
        // undefined, '', etc.). This can happen after initialization when binding value to an
        // empty record field (e.g while building a creation form, which is initially empty).
        if (!(Ext.isEmpty(value) && Ext.isEmpty(oldValue))) {
            me.validate();
        }

        if (value !== oldValue) {
            rawToValue = me.rawToValue(me.processRawValue(me.getRawValue()));

            if (!Ext.isEmpty(rawToValue, true) && String(value) !== String(rawToValue)) {
                me._value = value = rawToValue;
            }

            if (!me.isConfiguring) {
                me.fireEvent('change', me, value, oldValue);
            }
        }

        me.setDirty(me.isDirty());
    },
});
