import '../ListTopContainer';
Ext.define('Abraxa.core.components.combo.OrganizationCombo', {
    extend: 'Ext.field.ComboBox',
    xtype: 'organization.combo',
    forceSelection: true,
    valueField: 'org_id',
    displayField: 'org_name',
    matchFieldWidth: false,
    clearable: true,
    // autoFocusLast: false,
    // autoSelect: false,
    autoFocus: false,
    // collapseOnSelect: false,
    // bubbleDirty: false,
    // autoLoadOnValue: true,
    // queryCaching: false,
    // queryDelay: 0,
    triggerAction: 'all',
    minChars: 3,
    setCompliantOnlyCheck: function (val) {
        this.config.compliantOnlyCheck = val;
    },
    config: {
        compliantOnlyCheck: true,
    },
    store: {
        type: 'organizations.remote',
    },
    itemTpl: Ext.create(
        'Ext.XTemplate',
        '<div class="hbox"><div class="party-item a-verification a-{[this.compliant(values.compliance)]} mr-16">' +
            '<a href="javascript:void(0);" class="sm-company fw-b"><span class="text-truncate">{org_name}</span><i class="md-icon-outlined a-verification-icon a-{[this.compliantIcon(values.compliance)]} "></i></a><div class="sm-type">{org_email}</div>' +
            '</div>{[this.cargoData(values.types)]}</div>',
        {
            cargoData: function (types) {
                if (types.length) {
                    if (types.length > 1) {
                        return (
                            '<span class="a-status-badge rounded status-' +
                            types[0].type.org_t_name.toLowerCase() +
                            '">' +
                            types[0].type.org_t_name +
                            ' <em class="a-count-badge pedence">+' +
                            (types.length - 1) +
                            '</em></span>'
                        );
                    }
                    return (
                        '<span class="a-status-badge rounded status-' +
                        types[0].type.org_t_name.toLowerCase() +
                        '">' +
                        types[0].type.org_t_name +
                        '</span>'
                    );
                }

                return '';
            },
            compliant: function (compliance) {
                if (compliance && compliance.status) return compliance.status;

                return '';
            },
            compliantIcon: function (compliance) {
                if (!compliance || compliance.status != 'verified') return 'md-icon-outlined';

                return;
            },
        }
    ),
    floatedPicker: {
        cls: 'a-organization-combo',
        minWidth: 320,
        minHeight: 440,
        weighted: true,
        viewModel: {
            data: {
                hasFilters: false,
                showSuggested: false,
                filterText: 'Clear filter',
            },
        },
        requires: ['Ext.dataview.plugin.ListPaging'],
        plugins: {
            listpaging: {
                // loadMoreCmp: {
                //     xtype: 'component',
                //     cls: Ext.baseCSSPrefix + 'listpaging',
                //     scrollDock: 'end',
                //     hidden: true,
                //     inheritUi: true,
                //     text: '<a class="fw-b">Load more...</a>'
                // },
                noMoreRecordsText: "<span class='sm-title'></span>",
                loadMoreText: '<a class="fw-b">Load more...</a>',
            },
        },
        emptyText: {
            scrollDock: 'end',
            // top: 32,
            xtype: 'container',
            cls: 'a-bgr-transparent',
            minHeight: 300,
            layout: {
                type: 'vbox',
                align: 'stretch',
                pack: 'middle',
            },
            // centered: true,
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
            viewModel: {
                formulas: {
                    badgeRenderer: {
                        bind: {
                            bindTo: '{record.types}',
                        },
                        get: function (types) {
                            const pluck = (arr, key) => arr.map((i) => i[key]);
                            const arr = pluck(types, 'type');
                            const arr2 = pluck(arr, 'org_t_name');
                            return arr2.join(', ');
                        },
                    },
                },
            },
            bind: {
                // cls: '{record.types.length ? "a-has-type" : ""}'
            },
            listeners: {
                painted: function () {
                    new Ext.tip.ToolTip({
                        target: this,
                        delegate: '.pedence',
                        showDelay: 0,
                        hideDelay: 0,
                        dismissDelay: 0,
                        align: 'bc-tc?',
                        anchorToTarget: true,
                        anchor: true,
                        bind: {
                            html: '{badgeRenderer}',
                        },
                    });
                },
            },
        },
        listeners: {
            painted: function (me) {
                this.on('select', function (list, selection) {
                    let compliantOnly = Ext.getCmp('main-viewport')
                            .lookupViewModel()
                            .get('currentCompany')
                            .get('compliant_cdb'),
                        combo = list.ownerCmp;
                    if (Ext.isArray(selection)) {
                        selection = selection[0];
                    }

                    if (!this.up('combobox').config.compliantOnlyCheck) return;

                    if (
                        (compliantOnly && !selection.getCompliance()) ||
                        (compliantOnly &&
                            selection.getCompliance() &&
                            selection.getCompliance().get('status') != 'verified')
                    ) {
                        combo.suspendEvents();
                        Ext.create('Ext.MessageBox', {
                            ui: 'warning',
                            title: '<div class="hbox"><div class="a-badge a-badge-warning mr-16 my-8"><i class="material-icons-outlined">report_problem</i></div>Warning</div>',
                            innerCls: 'a-bgr-white',
                            message:
                                'The company is currently blocked according to your organization compliance rules.',
                            padding: '8 24 24 72',
                            width: 480,
                            dataTitle: 'Warning',
                            modal: true,
                            draggable: false,
                            bbar: {
                                manageBorders: false,
                                items: [
                                    '->',
                                    {
                                        xtype: 'button',
                                        ui: 'action',
                                        text: 'Ok',
                                        handler: function () {
                                            if (Ext.isArray(combo.getSelection())) {
                                                let newValues = Ext.Array.filter(combo.getSelection(), function (rec) {
                                                    return rec.get('org_id') != selection.get('org_id');
                                                });
                                                combo.setValue(newValues);
                                            } else {
                                                if(combo) {
                                                    combo.clearValue();
                                                }
                                            }

                                            let store = Ext.ComponentQuery.query('[cls~=invite_container]')[0]
                                                ? Ext.ComponentQuery.query('[cls~=invite_container]')[0]
                                                      .down('abraxa\\.formlist')
                                                      .getVM()
                                                      .getStore('newMembers')
                                                : null;

                                            if (store) store.remove(store.last());

                                            this.up('dialog').hide();
                                        },
                                    },
                                ],
                            },
                            listeners: {
                                painted: function () {
                                    this.on('hide', function () {
                                        combo.resumeEvents();
                                        this.destroy();
                                        // combo.focus();
                                    });
                                },
                            },
                        }).show();
                        return false;
                    }
                });
            },
            childtap: function (list, location) {
                if (location.child.xtype == 'list.top.container') return false;
            },
        },
        items: [
            {
                xtype: 'list.top.container',
                cls: 'a-organization-combo',
                scrollDock: 'start',
                // docked: 'top',
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
                                html: 'COMPANIES',
                                hideMode: 'opacity',
                                bind: {
                                    html: '{suggestedOrganizations.count && showSuggested ? "SUGGESTED" : "COMPANIES"}',
                                },
                            },
                            {
                                ui: 'filter round',
                                text: 'Filter',
                                xtype: 'splitbutton',
                                handler: function (btn) {
                                    btn.showMenu();
                                },
                                arrowHandler: function () {
                                    let button = this,
                                        arrowCls = this.splitArrowElement.hasCls('x-arrow-el'),
                                        store = this.up('organization\\.combo').getPicker().getStore(),
                                        listStore = this.up('list\\.top\\.container').down('list').getStore();

                                    if (!arrowCls) {
                                        let selected = Ext.ComponentQuery.query(
                                            'menuitem[cls~=cdbFilterItem][checked="true"]'
                                        );
                                        Ext.each(selected, function (value, index) {
                                            value.setChecked(false);
                                        });
                                        button.setText('Filter');
                                        button.splitArrowElement.removeCls('md-icon-close');
                                        button.splitArrowElement.addCls('x-arrow-el');
                                        button.removeCls('active');
                                        store.removeFilter('orgTypeFilter');
                                        listStore.removeFilter('orgTypeFilter');

                                        button.hideMenu();
                                        return;
                                    }
                                },
                                menu: {
                                    maxHeight: 300,
                                    scrollable: true,
                                    cls: 'filter-menu',
                                    defaults: {
                                        cls: 'cdbFilterItem',
                                        handler: function (me) {
                                            let button = this.up('button'),
                                                combo = me.up('organization\\.combo'),
                                                listStore = me.up('list\\.top\\.container').down('list').getStore(),
                                                store = combo.getStore(),
                                                inputValue = combo.getInputValue();

                                            button.setText(this.getText());
                                            button.getMenu().arrowCls = 'delete';
                                            button.splitArrowElement.removeCls('x-arrow-el');
                                            button.splitArrowElement.addCls('md-icon-close');
                                            button.addCls('active');

                                            store.addFilter({
                                                id: 'orgTypeFilter',
                                                property: 'org_types',
                                                operator: '=',
                                                value: me.getValue(),
                                            });

                                            listStore.addFilter({
                                                id: 'orgTypeFilter',
                                                filterFn: function (record) {
                                                    let types = record.get('types'),
                                                        shouldReturn = false;

                                                    Ext.each(types, function (type) {
                                                        if (type.org_type_id == me.getValue()) shouldReturn = true;
                                                    });

                                                    if (shouldReturn) return record;
                                                },
                                            });
                                            me.upVM().set('hasFilters', true);
                                            me.upVM().set('filterText', this.getText());
                                            this.up('button').hideMenu();
                                        },
                                    },
                                    bind: {
                                        items: '{organizationTypesFilter}',
                                    },
                                },
                            },
                        ],
                    },
                    {
                        xtype: 'list',
                        itemCls: 'a-cursor-pointer',
                        selectable: false,
                        minHeight: 42,
                        emptyText: 'Nothing to suggest',
                        ripple: false,
                        itemRipple: false,
                        itemConfig: {
                            viewModel: {},
                        },
                        // docked: 'top',
                        itemTpl: Ext.create(
                            'Ext.XTemplate',
                            '<div class="hbox"><div class="party-item a-verification a-{[this.compliant(values.compliance)]} mr-16">' +
                                '<a href="javascript:void(0);" class="sm-company fw-b"><span class="text-truncate">{org_name}</span><i class="md-icon-outlined a-verification-icon a-{[this.compliantIcon(values.compliance)]} "></i></a><div class="sm-type">{org_email}</div>' +
                                '</div>{[this.cargoData(values.types)]}</div>',
                            {
                                cargoData: function (tags) {
                                    if (tags.length) {
                                        if (tags.length > 1) {
                                            return (
                                                '<span class="a-status-badge rounded status-' +
                                                tags[0].type.org_t_name.toLowerCase() +
                                                '">' +
                                                tags[0].type.org_t_name +
                                                ' <em class="a-count-badge pedence">+' +
                                                (tags.length - 1) +
                                                '</em></span>'
                                            );
                                        }
                                        return (
                                            '<span class="a-status-badge rounded status-' +
                                            tags[0].type.org_t_name.toLowerCase() +
                                            '">' +
                                            tags[0].type.org_t_name +
                                            '</span>'
                                        );
                                    }

                                    return '';
                                },
                                compliant: function (compliance) {
                                    if (compliance && compliance.status) return compliance.status;

                                    return '';
                                },
                                compliantIcon: function (compliance) {
                                    if (!compliance || compliance.status != 'verified') return 'md-icon-outlined';

                                    return;
                                },
                            }
                        ),
                        hidden: true,
                        store: [],
                        bind: {
                            hidden: '{suggestedOrganizations.count && showSuggested ? false : true}',
                            store: '{suggestedOrganizations}',
                        },
                        listeners: {
                            painted: function () {},
                            childsingletap: function (list, location) {
                                let combo = this.up('combobox'),
                                    record = location.record;

                                combo.getStore().add(record);
                                combo.setValue(record.get('org_id'));
                                combo.setInputValue(record.get('org_name'));
                                combo.collapse();
                                combo.focus();
                            },
                        },
                    },
                    {
                        xtype: 'div',
                        padding: 12,
                        cls: 'h5 a-bt-100',
                        html: 'OTHERS',
                        hidden: true,
                        bind: {
                            hidden: '{suggestedOrganizations.count && showSuggested ? false : true}',
                        },
                    },
                ],
            },
            {
                xtype: 'container',
                docked: 'bottom',
                layout: 'hbox',
                slug: 'cdbCreate',
                cls: 'a-bt-100',
                bind: {
                    permission: '{userPermissions}',
                },
                itemId: 'addCompanyButton',
                style: 'background-color:#fff',
                items: [
                    {
                        xtype: 'button',
                        margin: 4,
                        flex: 1,
                        text: 'Add new',
                        ui: 'normal',
                        iconCls: 'md-icon-add',
                        handler: function (me) {
                            let dialog = this.up('dialog'),
                                combo = me.up('combobox'),
                                vm = me.upVM();

                            if (dialog) {
                                dialog.hide();
                            }
                            let modal = Ext.create('Abraxa.view.cdb.forms.AddOrganizationFromCombo', {
                                viewModel: {
                                    data: {
                                        targetCombo: combo,
                                        selectedCompany: new Abraxa.model.company.Company({}),
                                        typesStore: vm.get('types'),
                                        parentCompanyStore: vm.get('organizations'),
                                    },
                                },
                            });
                            // combo.getStore().clearFilter();
                            combo.getPicker().hide();
                            modal.show();
                            if (dialog) {
                                modal.on('destroy', function () {
                                    dialog.show();
                                });
                            } else {
                                modal.on('destroy', function () {
                                    combo.focus();
                                });
                            }
                        },
                    },
                ],
            },
        ],
    },
    listeners: {
        initialize: function (combo) {
            let me = this;
            combo.on('clearicontap', function (query) {
                // combo.setValue(null);
                // combo.setInputValue(null);
                combo.clearValue();
                // this.collapse();
                combo.doFilter({
                    query: this.getAllQuery(),
                    force: true, // overrides the minChars test
                });
            });

            combo.on('collapse', function () {
                let store = combo.getPicker().getStore(),
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
                    listStore.clearFilter();
                    button.getMenu().hide();
                }
            });
            combo.on('beforequery', function (query) {
                let string = query.query;

                let storeSuggested = combo.upVM().get('suggestedOrganizations');

                if (storeSuggested) {
                    if (string && string.length > 2) {
                        let regex = RegExp(string, 'i');
                        storeSuggested.addFilter({
                            id: 'queryFilter',
                            filterFn: function (item) {
                                return regex.test(item.get('org_name')) || regex.test(item.get('org_email'));
                            },
                        });
                    } else {
                        storeSuggested.removeFilter('queryFilter');
                    }
                }
            });
        },
    },
    initialize: function () {
        // this.callParent(arguments);

        this.on('beforequery', this.onBeforeQuery, this);
    },

    onBeforeQuery: function (queryPlan) {
        if (this.getQueryMode() === 'remote') {
            // Preserve the input value before triggering the query
            queryPlan.query = this.getInputValue();
        }
    },
    // realignFloatedPicker: function (picker) {
    //     picker = picker || this.getConfig('picker', false, true);

    //     if (picker && picker.isVisible()) {
    //         // If we have dropped to no items and the store is not loading, collapse field.
    //         if (!picker.getItemCount() && !picker.getStore().hasPendingLoad()) {
    //             return;
    //         }

    //         this.callParent([picker]);
    //     }
    // },
});
