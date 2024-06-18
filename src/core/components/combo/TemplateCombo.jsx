Ext.define('Abraxa.core.components.combo.TemplateCombo', {
    extend: 'Ext.field.Select',
    xtype: 'template.combo',
    forceSelection: true,
    valueField: 'id',
    displayField: 'name',
    matchFieldWidth: false,
    clearable: true,
    autoFocus: false,
    queryMode: 'remote',
    templateType: null,
    cls: 'a-field-icon icon-rounded icon-business-center',
    ui: 'classic',
    placeholder: 'Choose template',
    floatedPicker: {
        cls: 'a-organization-combo',
        groupHeader: {
            tpl: new Ext.XTemplate(
                '<tpl if="name"><span class="hbox c-blue-grey"><i class="md-icon-outlined md-18 mr-8">maps_home_work</i>{name}</span><tpl else >---</tpl>'
            ),
        },
        minWidth: 320,
        weighted: true,
        viewModel: {
            data: {
                hasFilters: false,
                filterText: 'Clear filter',
            },
        },
        emptyText: {
            scrollDock: 'end',
            xtype: 'container',
            cls: 'a-bgr-transparent',
            minHeight: 300,
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'middle',
            },
            items: [
                {
                    xtype: 'div',
                    html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"> <g id="dwef" transform="translate(-9971 -18910)"> <g id="Group_14761" data-name="Group 14761" transform="translate(9137 18565)" opacity="0.6"> <circle id="Ellipse_683" data-name="Ellipse 683" cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/> </g> <g id="search_black_24dp" transform="translate(10006 18945)"> <path id="Path_10323" data-name="Path 10323" d="M31.125,27.75H29.347l-.63-.608a14.647,14.647,0,1,0-1.575,1.575l.608.63v1.777L39,42.352,42.352,39Zm-13.5,0A10.125,10.125,0,1,1,27.75,17.625,10.111,10.111,0,0,1,17.625,27.75Z" transform="translate(3.75 3.75)" fill="#c8d4e6" stroke="#f8fbfe" stroke-width="1"/> </g> </g> </svg><div class="a-no-content-txt"><div class="fs-13">No results found</div></div></div>',
                },
                {
                    xtype: 'button',
                    text: 'Clear filters',
                    cls: 'a-no-content-btn',
                    ui: 'normal-light small round outline',
                    iconCls: 'md-icon-close',
                    top: 12,
                    right: 12,
                    iconAlign: 'right',
                    tooltip: {
                        html: 'Clear filter',
                        showDelay: 0,
                        hideDelay: 0,
                        align: 'tc-bc?',
                    },
                    bind: {
                        text: '{filterText}',
                        hidden: '{hasFilters ? false : true}',
                    },
                    handler: function () {
                        let store = this.up('organization\\.combo').getPicker().getStore(),
                            listContainer = Ext.ComponentQuery.query('list\\.top\\.container')[0];

                        if (listContainer) {
                            let button = listContainer.down('splitbutton'),
                                listStore = listContainer.down('list').getStore(),
                                selected = Ext.ComponentQuery.query('menuitem[cls~=cdbFilterItem][checked="true"]');

                            Ext.each(selected, function (value, index) {
                                value.setChecked(false);
                            });
                            button.setText('Filter');
                            button.splitArrowElement.removeCls('md-icon-close');
                            button.splitArrowElement.addCls('x-arrow-el');
                            button.removeCls('active');
                            store.removeFilter('orgTypeFilter');
                            listStore.clearFilter();
                            button.getMenu().hide();
                        }
                        this.upVM().set('hasFilters', false);
                        this.upVM().set('filterText', 'Clear filter');
                    },
                },
            ],
        },
        itemConfig: {
            viewModel: true,
        },
        items: [
            {
                xtype: 'list.top.container',
                cls: 'a-organization-combo',
                scrollDock: 'start',
                items: [
                    {
                        xtype: 'container',
                        cls: 'a-bb-100',
                        padding: 12,
                        layout: {
                            type: 'hbox',
                            pack: 'space-between',
                            align: 'middle',
                        },
                        items: [
                            {
                                xtype: 'div',
                                cls: 'h5',
                                html: 'TEMPLATES',
                                hideMode: 'opacity',
                            },
                            {
                                xtype: 'splitbutton',
                                text: 'Filter',
                                ui: 'tool-text-sm filter md-icon-filter-alt md-icon-outlined filter_split_button',
                                enableToggle: true,
                                margin: '0 0 0 8',
                                handler: function () {
                                    this.showMenu();
                                },
                                arrowHandler: function (me) {
                                    let button = me,
                                        arrowCls = me.splitArrowElement.hasCls('x-arrow-el'),
                                        comboStore = me.up('template\\.combo').getStore();
                                    if (!arrowCls) {
                                        let selected = Ext.ComponentQuery.query(
                                            'menucheckitem[cls~=checkedTemplateItem][checked="true"]'
                                        );
                                        Ext.each(selected, function (value, index) {
                                            value.setChecked(false);
                                        });
                                        button.setText('Filter');
                                        button.splitArrowElement.removeCls('md-icon-close');
                                        button.splitArrowElement.addCls('x-arrow-el');
                                        button.removeCls('active');
                                        comboStore.removeFilter(5555);
                                    }
                                },
                                menu: {
                                    listeners: {
                                        painted: function (me) {
                                            me.removeAll(true);
                                            let combo = me.up('template\\.combo'),
                                                comboStore = combo.getStore(),
                                                templateOfficeIds = [],
                                                button = me.up('button'),
                                                menuItems = [],
                                                availableOffices = [],
                                                templateItems = comboStore.queryBy(function (rec, id) {
                                                    return (
                                                        rec.get('office_id') && rec.get('type') === combo.templateType
                                                    );
                                                });
                                            templateItems.each(function (template) {
                                                if (!Ext.Array.contains(templateOfficeIds, template.get('office_id'))) {
                                                    templateOfficeIds.push(template.get('office_id'));
                                                    availableOffices.push({
                                                        id: template.get('office_id'),
                                                        name: template.get('office_name'),
                                                    });
                                                }
                                            });
                                            Ext.each(availableOffices, function (office) {
                                                let checked = false;
                                                if (
                                                    button.selectedIds &&
                                                    Ext.Array.contains(button.selectedIds, office.id)
                                                ) {
                                                    checked = true;
                                                }

                                                let menuItem = {
                                                    xtype: 'menucheckitem',
                                                    padding: '0 16',
                                                    cls: 'checkedTemplateItem',
                                                    text: office.name,
                                                    officeId: office.id,
                                                    checked: checked,
                                                    listeners: {
                                                        checkchange: function (cmp, checked) {
                                                            let selected = Ext.ComponentQuery.query(
                                                                'menucheckitem[cls~=checkedTemplateItem][checked="true"]'
                                                            );
                                                            let selectedIds = [];
                                                            Ext.Array.each(selected, function (checkedTemplate) {
                                                                selectedIds.push(checkedTemplate.officeId);
                                                            });
                                                            if (selectedIds && selectedIds.length > 0) {
                                                                comboStore.addFilter({
                                                                    id: 5555,
                                                                    filterFn: function (item) {
                                                                        if (
                                                                            Ext.Array.contains(
                                                                                selectedIds,
                                                                                item.get('office_id')
                                                                            )
                                                                        ) {
                                                                            return item;
                                                                        } else {
                                                                            return false;
                                                                        }
                                                                    },
                                                                });
                                                                button.setText(selected[0].getText());

                                                                if (selected.length > 1) {
                                                                    button.setText(
                                                                        selected[0].getText() +
                                                                            ' +' +
                                                                            (selected.length - 1)
                                                                    );
                                                                }
                                                                button.splitArrowElement.removeCls('x-arrow-el');
                                                                button.splitArrowElement.addCls('md-icon-close');
                                                                button.addCls('active');
                                                                button.selectedIds = selectedIds;
                                                            } else {
                                                                button.setText('Filter');
                                                                button.splitArrowElement.removeCls('md-icon-close');
                                                                button.splitArrowElement.addCls('x-arrow-el');
                                                                button.removeCls('active');
                                                                comboStore.removeFilter(5555);
                                                                button.selectedIds = null;
                                                            }
                                                        },
                                                    },
                                                };
                                                menuItems.push(menuItem);
                                            });
                                            me.setItems(menuItems);
                                        },
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
        ],
        listeners: {
            childtap: function (list, location) {
                if (location.child.xtype == 'list.top.container') return false;
            },
        },
    },
    listeners: {
        dirtychange: function (me, dirty) {
            if (!dirty) {
                let button = Ext.ComponentQuery.query('[ui~=filter_split_button]')[0];
                if (button) {
                    button.hideMenu();
                }
            }
        },
    },
});
