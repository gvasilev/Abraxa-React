Ext.define('Abraxa.CellEditing', {
    override: 'Ext.grid.CellEditor',

    onFocusLeave: function (e) {
        var me = this,
            location = me.$activeLocation,
            row = location && location.row,
            grid = me.editingPlugin.getGrid();

        if (grid) {
            // FocusLeave result of destruction. Must not do anything.
            if (!me.editingPlugin.getGrid().destroying) {
                if (me.isCancelling) {
                    me.cancelEdit();
                } else {
                    me.completeEdit(
                        /* remainVisible = */
                        false,
                        /* followItem = */
                        row && e && row.isAncestor(e.fromComponent) && row.isAncestor(e.toComponent)
                    );
                }
            }
        } else {
            me.cancelEdit();
        }
        me.isCancelling = false;
    },

    startEdit: function (location, value, doFocus) {
        var me = this,
            cell,
            el,
            row,
            grid,
            result;

        if (location && location.cell) {
            cell = location.cell;
            el = cell.el;
            value = value != null ? value : location.cell._record.get(cell.dataIndex);
            // at this point we dont have focused el, so the location passed
            // as first param is our best idea of a location (will only be used
            // in the beforestart / start events).
            me.$activeLocation = location;

            // VERY important for focus management.
            // We must have an upward ownership link so that onFocusLeave
            // bubbles correctly.
            // This link must never be severed - it just is updated on each edit.
            me.ownerCmp = cell;

            // CellEditors are positioned and fitted within the cell using their CSS rules.
            me.render(el);

            me.callParent([location, value, doFocus]);

            // Superclass events may veto edit start.
            // If we are editing, set up our context.
            if (me.editing) {
                me.$activeRow = row = location.row;
                me.$activeGrid = grid = row.grid;
                me.editingPlugin.editing = true;
                // here we update the activeLocation to be used by the remaining events
                me.editingPlugin.location =
                    me.$activeLocation =
                    result =
                        new Ext.grid.Location(grid, me.getField().getFocusEl());
                me.editingPlugin.activeEditor = me;
                grid.stickItem(row, {
                    autoPin: me.getAutoPin(),
                });
            } else {
                // If the event was canceled during beforestartedit,
                // we should clear the location.
                me.$activeLocation = null;
            }
        }

        return result;
    },

    onEditComplete: function (remainVisible, cancelling, followItem) {
        var me = this,
            location = me.$activeLocation,
            value = me.getValue(),
            record,
            dataIndex,
            row,
            grid,
            sticky;

        me.callParent([remainVisible, cancelling, followItem]);
        if (location && location.row) {
            followItem = followItem || remainVisible;

            grid = location.row.grid;

            // If we are not coming from a cancelEdit, and the field's changed
            // then update the record.
            if (!cancelling && value !== me.startValue) {
                record = location.cell._record;
                dataIndex = location.cell.dataIndex;

                if (record) {
                    record.set(dataIndex, value);

                    // The row may change due to auto sorting, so bring it into view
                    // and refresh the location
                    if (followItem && grid) {
                        grid.ensureVisible(location.record);
                    }

                    location.refresh();
                }
            }

            if (!followItem) {
                row = location.row;
                sticky = !!row.$sticky;

                if (sticky && grid) {
                    grid.stickItem(row, null);
                }

                me.$stickyVisibility = me.$activeLocation = me.$activeRow = me.$activeGrid = null;
                me.editingPlugin.editing = false;
                me.editingPlugin.location = me.editingPlugin.activeEditor = null;
            }
        }
    },
});
