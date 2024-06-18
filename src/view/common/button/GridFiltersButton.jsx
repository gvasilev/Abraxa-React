import '../../../core/plugins/GridStatefulFilterBar';

Ext.define('Abraxa.view.common.button.GridFiltersButton', {
    extend: 'Ext.Container',
    xtype: 'GridFiltersButton',

    // TODO: Refactor GridFilterButton config, ViewModel and functionality
    // JIRA task: CORE-2705
    setGridItemId: function(itemId) {
        this.getViewModel().set('gridItemId', itemId);
        this.config.gridItemId = itemId;
    },

    setExcludedFilters: function(filters) {
        this.config.excludedFilterIds = filters;
    },

    setStateOfButtons: function(count, button, closeButton, grid) {
        if (count > 0) {
            button.setText('Filter ' + '<em>' + count + '</em>');
            closeButton.setHidden(false);
        } else {
            closeButton.setHidden(true);
            const filterBar = grid.findPlugin('gridfilterbar');
            if (filterBar) {
                if (filterBar.getBar().getHidden()) button.setPressed(false);
            }

            button.setText('Filter');
        }
        if (button.getPressed()) {
            closeButton.setPressed(true);
        } else {
            closeButton.setPressed(false);
        }
    },
    viewModel: {
        gridItemId: null,
        formulas: {
            setCounter: {
                bind: {
                    bindTo: '{gridItemId}',
                    deep: true,
                },
                get: function(gridItemId) {
                    const button = this.getView().down('[itemId=filterButton]');
                    const closeButton = this.getView().down('[itemId=closeButton]');

                    if (!gridItemId) return;
                    const grid = this.getView().find(gridItemId);

                    if (!grid || !grid.getPlugin('gridfilterbar')) return;

                    const excludedFilters = grid.getPlugin('gridfilterbar').getNonStatefulFilters();
                    const store = grid.getStore();
                    let count = 0;
                    if (!store) return;
                    store.getFilters().each((filter) => {
                        // count is the counter in the Filter button
                        if (!excludedFilters.includes(filter.getId())) count++;
                    });

                    this.getView().setStateOfButtons(count, button, closeButton, grid);

                    if (!button.getPressed()) {
                        const grid = this.getView().find(gridItemId);
                        grid.hideFilterBar();
                    }
                },
            },
        },
    },
    config: {
        gridItemId: null,
    },

    items: [
        {
            xtype: 'button',
            ui: 'tool-text-sm',
            itemId: 'filterButton',
            enableToggle: true,
            iconCls: 'md-icon-filter-alt md-icon-outlined',
            margin: '0 0 0 8',
            text: 'Filter',
            cls: 'a-has-counter',

            handler: function(button) {
                const gridItemId = button.up('container').config.gridItemId;
                const grid = button.find(gridItemId);

                if (!grid || !grid.getPlugin('gridfilterbar')) return;

                const pressed = button.getPressed();
                const closeButton = button.up('container').down('[itemId=closeButton]');
                const container = button.up('container');
                const excludedFilters = grid.getPlugin('gridfilterbar').getNonStatefulFilters();
                const store = grid.getStore();
                let count = 0;
                const loadStore = () => {
                    count = 0;
                    store.getFilters().each((filter) => {
                        if (!excludedFilters.includes(filter.getId())) count++;
                    });
                    container.setStateOfButtons(count, button, closeButton, grid);
                };

                if (pressed) {
                    store.on('load', loadStore);
                    closeButton.setPressed(true);
                    grid.showFilterBar();
                } else {
                    store.removeListener('load', loadStore);
                    grid.hideFilterBar();
                    closeButton.setPressed(false);
                }
            },
        },
        {
            xtype: 'button',
            ui: 'tool-text-sm',
            hidden: true,
            itemId: 'closeButton',
            enableToggle: true,
            style: {
                marginLeft: '-8px',
            },
            tooltip: {
                anchor: true,
                align: 'bc-tc?',
                html: 'Clear filters',
                showDelay: 0,
                hideDelay: 0,
            },
            iconCls: 'md-icon-close md-icon-outlined',

            handler: function(button) {
                const filterButton = button.up('container').down('[itemId=filterButton]');
                const gridItemId = button.up('container').config.gridItemId;
                const grid = button.find(gridItemId);

                if (!grid || !grid.getPlugin('gridfilterbar')) return;

                filterButton.setText('Filter');
                filterButton.setPressed(false);
                button.setHidden(true);
                grid.hideFilterBar();
                grid.getPlugin('gridfilterbar')
                    .getBar()
                    .items.items.forEach((item) => {
                    if (item.getValue && item.getValue() !== null) {
                        item.setValue(null);
                    }
                });
            },
        },
    ],

    listeners: {
        painted: function() {
            const buttons = this.query('button');

            this.element.el.on('mouseover', () => {
                buttons.forEach((button) => {
                    button.addCls('x-hovered');
                });
            });

            this.element.el.on('mouseleave', () => {
                buttons.forEach((button) => {
                    button.removeCls('x-hovered');
                });
            });
        },
    },
});
