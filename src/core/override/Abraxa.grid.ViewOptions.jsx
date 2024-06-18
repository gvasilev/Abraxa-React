Ext.define('Abraxa.grid.ViewOptions', {
    override: 'Ext.grid.plugin.ViewOptions',
    testId: 'gridViewOptionsPlugin',

    config: {
        sheet: {
            lazy: true,
            $value: {
                xtype: 'sheet',
                cls: Ext.baseCSSPrefix + 'gridviewoptions abraxa-grid-view-options',
                items: [
                    {
                        docked: 'top',
                        xtype: 'titlebar',
                        title: 'Customize',
                        items: [
                            {
                                xtype: 'button',
                                text: 'Save',
                                testId: 'gridViewOptionsPluginSaveBtn',
                                ui: 'action',
                                align: 'right',
                                role: 'donebutton',
                            },
                        ],
                    },
                ],
                hidden: true,
                hideOnMaskTap: true,
                enter: 'right',
                exit: 'right',
                modal: true,
                right: 0,
                layout: 'fit',
                stretchY: true,
            },
        },

        /**
         * The column's configuration
         */
        columnList: {
            lazy: true,
            $value: {
                xtype: 'nestedlist',
                testId: 'gridViewOptionsNestedList',
                title: '<div class="fs-13">Drag & Drop to re-arrange the columns.</div>',
                clearSelectionOnListChange: false,
                listConfig: {
                    triggerEvent: null,
                    infinite: true,
                    mode: 'MULTI',
                    variableHeights: false,
                    scrollToTopOnRefresh: false,
                    plugins: {
                        sortablelist: {
                            source: {
                                handle: '.' + Ext.baseCSSPrefix + 'column-options-sortablehandle',
                            },
                        },
                    },
                    itemConfig: {
                        xtype: 'viewoptionslistitem',
                    },
                    itemTpl: '{text}',
                },
                store: {
                    type: 'tree',
                    fields: ['id', 'text', 'dataIndex', 'header', 'hidden', 'hideable', 'grouped', 'groupable'],
                    root: {
                        text: 'Columns',
                    },
                },
            },
        },
    },

    //Example ussage:
    // columns: [
    //     {
    //         text: 'Name',
    //         dataIndex: 'system_name',
    //         viewOptions: false,  //not set or set to true to show in view options
    //         cell: {
    //             encodeHtml: false,
    //         },
    //     },
    showViewOptions: function () {
// this.callParent(arguments);
        const columns = this.getGrid().getColumns();
        const noViewOptionsColumns = columns.filter((col) => col.viewOptions === false);
        const indexes = noViewOptionsColumns.map((col) => columns.indexOf(col));
        indexes.forEach((index) => {
            this.getColumnList().getActiveItem().getStore().removeAt(index);
        });
    },
});
