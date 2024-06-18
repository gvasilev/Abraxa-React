Ext.define('Abraxa.BoundListNavigationModel', {
    override: 'Ext.dataview.BoundListNavigationModel',

    privates: {
        onKeyEnter: function (e) {
            var view = this.getView(),
                selectable = view.getSelectable(),
                field = view.ownerField;

            // Stop the keydown event so that an ENTER keyup does not get delivered to
            // any element which focus is transferred to in a select handler.
            e.stopEvent();

            // Handle the case where the highlighted item is already selected
            // In this case, the change event won't fire, so just collapse
            if (
                this.location &&
                !(field.getMultiSelect && field.getMultiSelect()) &&
                selectable.isSelected(this.location.record) &&
                field.collapse
            ) {
                field.collapse();
            } else {
                this.selectHighlighted(e);
            }

            // Stop propagation of the ENTER keydown event so that any Editor which owns the
            // field does not completeEdit, but we also need to still fire the specialkey
            // event for ENTER, so lets add fromBoundList to the event, and this will be
            // handled by CellEditor#onSpecialKey.
            e.fromBoundList = true;
            field.fireEvent('specialkey', field, e);

            return false;
        },
    },
});
