import '../../common/button/GridFiltersButton.jsx';
import '../../../core/components/AbraxaCountryCombo.jsx';
Ext.define('Abraxa.view.cdb.company.CompaniesGrid', {
    extend: 'Ext.grid.Grid',
    xtype: 'companiesgrid',
    cls: 'abraxa-grid a-companies-grid',
    itemId: 'companies-grid',
    ui: 'bordered',
    stateful: ['plugins', 'columns', 'filters'],
    plugins: {
        gridfilterbar: {
            hidden: true,
            stateful: true,
        },
        gridviewoptions: true,
        pagingtoolbar: {
            classCls: 'a-bt-100 a-wps-paging-toolbar',
            pageSize: 50,
            loadPages: true,
            toolbar: {
                bordered: true,
                nextButton: {
                    ui: 'tool-sm round',
                },
                prevButton: {
                    ui: 'tool-sm round',
                },
                listeners: {
                    initialize: function () {
                        this.add({
                            xtype: 'div',
                            margin: '0 16',
                            cls: 'sm-title',
                            bind: {
                                html: '<strong>{totalCdbRecords}</strong> records',
                            },
                        });
                        this.add({
                            xtype: 'div',
                            width: '60%',
                        });
                    },
                },
            },
        },
    },
    reference: 'companiesGrid',
    store: [],
    bind: {
        store: '{organizationsCdbGrid}',
    },
    emptyText: {
        xtype: 'container',
        zIndex: 999,
        layout: {
            type: 'vbox',
        },
        centered: true,
        items: [
            {
                xtype: 'div',
                html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-23973 -22522)"><g transform="translate(23139 22177)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"/></g><path d="M41.751,8.834H6.417A4.43,4.43,0,0,0,2,13.25v26.5a4.43,4.43,0,0,0,4.417,4.417H41.751a4.43,4.43,0,0,0,4.417-4.417V13.25A4.43,4.43,0,0,0,41.751,8.834Zm0,30.918H6.417V13.25H41.751ZM6.417,0H41.751V4.417H6.417Zm0,48.585H41.751V53H6.417ZM24.084,26.5a5.521,5.521,0,1,0-5.521-5.521A5.523,5.523,0,0,0,24.084,26.5Zm0-7.729a2.208,2.208,0,1,1-2.208,2.208A2.215,2.215,0,0,1,24.084,18.772ZM35.126,35.313c0-4.616-7.31-6.6-11.042-6.6s-11.042,1.988-11.042,6.6v2.23H35.126ZM17.039,34.23a12.376,12.376,0,0,1,14.112,0Z" transform="translate(24010.916 22557)" fill="#c8d4e6"/></g></svg><div class="a-no-content-txt">No companies available</div></div>',
            },
            {
                xtype: 'button',
                text: 'Company',
                testId: 'companiesGridAddCompanyButton',
                cls: 'a-no-content-btn',
                ui: 'normal-light medium',
                iconCls: 'md-icon-add',
                hideMode: 'opacity',
                slug: 'cdbCreate',
                bind: {
                    permission: '{userPermissions}',
                },
                handler: function (btn, e) {
                    let companyRecordsStore = this.upVM().get('organizations');
                    mixpanel.track('+ Company button clicked (CDB)');
                    Ext.create('Abraxa.view.cdb.forms.AddOrganization', {
                        viewModel: {
                            parent: this.upVM(),
                            data: {
                                is_created: true,
                                selectedCompany: new Abraxa.model.company.Company({}),
                            },
                            stores: {
                                parentCompanyStore: companyRecordsStore,
                            },
                        },
                    }).show();
                },
            },
        ],
    },
    emptyTextDefaults: {
        xtype: 'emptytext',
        cls: 'a-empty-text',
    },
    stateId: 'cdbGrid',
    reference: 'companyGrid',
    grouped: false,
    enableColumnMove: false,
    groupHeader: {
        tpl: '{name}',
        disabled: true,
        style: 'pointer-events:none;',
    },
    keyMapEnabled: true,
    keyMap: {
        scope: 'this',
        ESC: function () {
            Ext.ComponentQuery.query('[xtype=company\\.editpanel]')[0].removeCls('a-right-container-full');
            // Ext.ComponentQuery.query('[xtype=company\\.editpanel]')[0].find('detailsContainer').hide();
            Ext.ComponentQuery.query('[xtype=company\\.editpanel]')[0].hide();
            Ext.ComponentQuery.query('[xtype=company\\.editpanel]')[0].getVM().set('view_details', false);
        },
    },
    itemConfig: {
        viewModel: {
            formulas: {
                badgeRenderer: {
                    bind: {
                        bindTo: '{record.types}',
                    },
                    get: function (types) {
                        if (types && types.length) {
                            const pluck = (arr, key) => arr.map((i) => i[key]);
                            const arr = pluck(types, 'type');
                            if (arr.length) {
                                const arr2 = pluck(arr, 'org_t_name');
                                return arr2.join(', ');
                            }
                        }
                    },
                },
            },
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
    columns: [
        {
            sortable: false,
            menuDisabled: true,
            hideable: false,
            resizable: false,
            editable: false,
            ignore: true,
            dataIndex: 'is_verified',
            width: 64,
            slug: 'cdbCompliance',
            cls: 'a-column-compliance',
            bind: {
                permission: '{userPermissions}',
            },
            cell: {
                width: 64,
                cls: 'a-cell-compliance',
                encodeHtml: false,
            },
            filterType: {
                type: 'string',
                operator: '=',
                operators: ['='],
                fieldDefaults: {
                    xtype: 'selectfield',
                    cls: 'a-filter-compliance',
                    encodeHtml: true,
                    ui: 'classic',
                    valueField: 'id',
                    displayField: 'name',
                    displayTpl: '{name}',
                    floatedPicker: {
                        cls: 'a-compliance-menu',
                        minWidth: 160,
                    },
                    itemTpl: '<div class="hbox">{html}{displayName}</div>',
                    queryMode: 'local',
                    clearable: false,
                    viewModel: {
                        data: {
                            html: '<div class="a-innerhtml-value">All</div>',
                        },
                    },
                    bind: {
                        html: '{html}',
                        store: [
                            {
                                id: 'All',
                                name: '',
                                html: '<div>All</div>',
                            },
                            {
                                id: 'not verified',
                                name: '',
                                displayName: 'Not verified',
                                html: '<div class="a-verification a-not-verified"><i class="a-verification-icon md-icon-outlined"></i></div>',
                            },
                            {
                                id: 'pending',
                                name: '',
                                displayName: 'Pending',
                                html: '<div class="a-verification a-pending"><i class="a-verification-icon md-icon-outlined"></i></div>',
                            },
                            {
                                id: 'blocked',
                                name: '',
                                displayName: 'Blocked',
                                html: '<div class="a-verification a-blocked"><i class="a-verification-icon md-icon-outlined"></i></div>',
                            },
                            {
                                id: 'verified',
                                name: '',
                                displayName: 'Verified',
                                html: '<div class="a-verification a-verified"><i class="a-verification-icon md-icon-outlined"></i></div>',
                            },
                        ],
                    },
                    listeners: {
                        select: function (field, newValue) {
                            if (newValue.data.id === 'All') field.clearValue();

                            this.getViewModel().set({
                                html: '<div class="a-innerhtml-value">' + newValue.data.html + '</div>',
                            });
                        },
                    },
                },
            },
            renderer: function (val, record) {
                if (val) {
                    return (
                        "<div data-qtip=\"<span class='text-capitalize'>" +
                        val +
                        '</span>" data-qalign="bc-tc" data-qanchor="true" class="a-verification a-' +
                        val +
                        '"><i class="md-icon a-verification-icon ' +
                        (val != 'verified' ? 'md-icon-outlined' : '') +
                        '"></i></div>'
                    );
                }
                return '<div class="a-verification a-not-verified"><i class="a-verification-icon md-icon-outlined"></i></div>';
            },
        },
        {
            text: 'Company',
            dataIndex: 'org_name',
            minWidth: 280,
            flex: 1,
            cell: {
                cls: 'a-cell-company',
                height: 58,
                encodeHtml: false,
                listeners: {
                    click: {
                        element: 'element',
                        delegate: 'a.company_name',
                        fn: function fn() {
                            this.component.up('grid').deselectAll();
                            Ext.getCmp('main-viewport')
                                .getController()
                                .redirectTo('company/' + this.component.getRecord().get('org_id'));
                        },
                    },
                },
            },
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                operator: 'like',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Name',
                    // any Ext.form.field.Text configs accepted
                },
            },
            renderer: function (val, selection) {
                let cls = '';
                if (selection.get('org_validated')) {
                    cls = '<i class="material-icons md-16 c-green">verified_user</i>';
                }
                return ['<a href="javascript:void(0)" class="fw-b fs-16 company_name">' + val + '</a>'].join('');
            },
            grouper: {
                groupFn: function (record) {
                    return record.get('abbr');
                },
            },
        },
        {
            text: 'Status',
            dataIndex: 'credit_rating',
            minWidth: 180,
            cell: {
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'string',
                operator: '=',
                // optional configs
                operators: ['='],
                fieldDefaults: {
                    xtype: 'selectfield',
                    ui: 'classic',
                    placeholder: 'Choose',
                    valueField: 'id',
                    displayField: 'name',
                    queryMode: 'local',
                    clearable: true,
                    bind: {
                        store: '{creditRatings}',
                    },
                },
            },
            renderer: function (val, record) {
                if (val) {
                    let first = record.get('rating').name;
                    return (
                        '<div class="a-status-badge a-status-md a-has-icon status-' +
                        first.split(' ')[0] +
                        '"><i class="material-icons a-status-icon fs-16">star</i>' +
                        first +
                        '</div>'
                    );
                }
            },
        },
        {
            text: 'Type',
            dataIndex: 'types',
            minWidth: 160,
            cell: {
                cls: 'a-cell-label',
                encodeHtml: false,
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
            filterType: {
                // required configs
                type: 'string',
                operator: '=',
                dataIndex: 'org_type_id',
                // optional configs
                operators: ['='],
                fieldDefaults: {
                    xtype: 'selectfield',
                    ui: 'classic',
                    placeholder: 'Choose',
                    valueField: 'org_t_id',
                    displayField: 'org_t_name',
                    queryMode: 'local',
                    clearable: true,
                    bind: {
                        store: '{types}',
                    },
                },
            },
            renderer: function (tags) {
                if (tags && tags.length) {
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
                    if (tags[0])
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
            grouper: {
                groupFn: function (record) {
                    let val = record.get('types');
                    if (val) {
                        let store = Ext.ComponentQuery.query('[itemId=cdbMainView]')[0].getVM().get('types'),
                            record,
                            type,
                            result = '';
                        if (val.length > 1) {
                            //multuple values
                            Ext.each(val, function (value, index) {
                                record = store.findRecord('org_t_id', value.org_type_id, 0, false, false, true);
                                if (record) {
                                    type = record.get('org_t_name');
                                    if (type) {
                                        result +=
                                            '<span class="a-label-badge label-default label-' +
                                            type +
                                            '">' +
                                            type +
                                            '</span>';
                                    }
                                }
                            });
                            return result;
                        } else {
                            //single
                            record = store.findRecord('org_t_id', val.org_type_id, 0, false, false, true);
                            if (record) {
                                type = record.get('org_t_name');
                            }
                            return '<span class="a-label-badge label-default label-' + type + '">' + type + '</span>';
                        }
                    }
                },
            },
        },
        {
            text: 'Email',
            dataIndex: 'org_email',
            minWidth: 280,
            cell: {
                cls: 'a-cell-email',
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                operator: 'like',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'Email',
                    // any Ext.form.field.Text configs accepted
                },
            },
            renderer: function (val) {
                return val
                    ? '<div class="a-email d-flex"><i class="md-icon-outlined md-18">mail</i><span class="text-truncate">' +
                          val +
                          '</span></div>'
                    : '';
            },
        },
        {
            text: 'Phone',
            dataIndex: 'org_phone',
            minWidth: 220,
            cell: {
                cls: 'a-cell-phone',
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'string',
                // optional configs
                operator: 'like',
                operators: ['like'],
                fieldDefaults: {
                    ui: 'classic',
                    placeholder: 'phone',
                    // any Ext.form.field.Text configs accepted
                },
            },
            renderer: function (val) {
                return val ? '<div class="a-phone"><i class="md-icon-outlined md-18">phone</i> ' + val + '</div>' : '';
            },
        },
        {
            text: 'Country',
            dataIndex: 'org_country',
            minWidth: 220,
            cell: {
                cls: 'a-cell-country',
                encodeHtml: false,
            },
            filterType: {
                // required configs
                type: 'string',
                operator: '=',
                // optional configs
                operators: ['='],
                fieldDefaults: {
                    xtype: 'country.combo',
                    ui: 'classic',
                    placeholder: 'Search',
                    clearable: true,
                    label: null,
                    triggers: {
                        expand: null,
                        search: {
                            side: 'right',
                            iconCls: 'md-icon-search',
                            style: 'padding-right: 8px;',
                        },
                    },
                },
            },
            renderer: function (val) {
                if (!val) return '';
                let store = this.upVM().get('countryStore');
                if (store) {
                    var record = store.getById(val),
                        country_name = AbraxaConstants.placeholders.emptyValue,
                        flag = '<span class="a-no-flag"></span>';
                    if (record) {
                        country_name = record.get('country_name');
                        if (record.get('country_code')) {
                            flag =
                                '<img height="24" class="a-img-round" src="' +
                                AbraxaConstants.urls.staticAbraxa +
                                'flags/1x1/' +
                                record.get('country_code').toLowerCase() +
                                '.svg">';
                        }
                    }
                    return '<div class="a-country">' + flag + '' + country_name + '</div>';
                }
            },
            grouper: {
                groupFn: function (record) {
                    let val = record.get('org_country');
                    if (val) {
                        let store = Ext.ComponentQuery.query('[itemId=cdbMainView]')[0].getVM().get('countryStore');
                        if (store) {
                            var record = store.findRecord('id', val, 0, false, false, true);
                            if (record) {
                                var country_name = record.get('country_name');
                            }
                            return country_name;
                        }
                    }
                },
            },
        },
        {
            text: 'Created by',
            minWidth: 110,
            hidden: true,
            flex: 1,
            cell: {
                cls: 'a-cell-date',
                encodeHtml: false,
                xtype: 'widgetcell',
                widget: {
                    xtype: 'public.updated.by',
                    padding: '0 12',
                    cls: 'no_show',
                    bind: {
                        data: {
                            user: '{record.created_by_user}',
                            updated_at: '{record.created_at}',
                        },
                    },
                },
            },
        },
        {
            dataIndex: '',
            minWidth: 110,
            // maxWidth: 110,
            flex: 1,
            sortable: false,
            menuDisabled: true,
            resizable: false,
            hideable: false,
            editable: false,
            ignore: true,
            cell: {
                cls: 'no_expand a_grid_action a-cell-more',
                align: 'right',
                toolDefaults: {
                    zone: 'end',
                },
                tools: [
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-more-horiz',
                        ui: 'tool-md round',
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'More actions',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        handler: function handler(owner, tool, e) {
                            let record = owner.toolOwner.getRecord(),
                                vm = this.up('grid').upVM();
                            Ext.create('Abraxa.view.cdb.company.CompanyEditMenu', {
                                viewModel: {
                                    parent: vm,
                                    data: {
                                        selectedCompany: record,
                                    },
                                },
                            }).showBy(this);
                        },
                    },
                    {
                        xtype: 'button',
                        iconCls: 'md-icon-navigate-next',
                        ui: 'tool-sm round normal raised',
                        tooltip: {
                            anchorToTarget: true,
                            align: 'bc-tc?',
                            html: 'View details',
                            showDelay: 0,
                            hideDelay: 0,
                            dismissDelay: 0,
                            closeAction: 'destroy',
                        },
                        handler: function (owner, tool, e) {
                            let record = owner.toolOwner.getRecord();
                            this.find('companies-grid').deselectAll();
                            Ext.getCmp('main-viewport')
                                .getController()
                                .redirectTo('company/' + record.get('org_id'));
                            let storeCompanies = this.upVM().get('organizations');
                            storeCompanies.clearFilter();
                        },
                    },
                ],
            },
        },
    ],
    items: [
        {
            xtype: 'container',
            height: 65,
            cls: 'a-titlebar a-bb-100',
            docked: 'top',
            items: [
                {
                    xtype: 'button',
                    text: 'Company',
                    testId: 'companiesGridAddCompanyButtonSmall',
                    iconCls: 'md-icon-add',
                    hideMode: 'opacity',
                    slug: 'cdbCreate',
                    skipEditPermission: true,
                    bind: {
                        permission: '{userPermissions}',
                    },
                    ui: 'action small',
                    handler: function (btn, e) {
                        let companyRecordsStore = this.upVM().get('organizations');
                        mixpanel.track('+ Company button clicked (CDB)');
                        Ext.create('Abraxa.view.cdb.forms.AddOrganization', {
                            viewModel: {
                                parent: this.upVM(),
                                data: {
                                    is_created: true,
                                    // Relates to DEV-3089: It seems {} in new Abraxa.model.company.Company({}) fixes EXT bug
                                    // with record not always marked as dirty on edit of binded fields
                                    selectedCompany: new Abraxa.model.company.Company({}),
                                },
                                stores: {
                                    parentCompanyStore: companyRecordsStore,
                                },
                            },
                        }).show();
                    },
                },
                {
                    xtype: 'container',
                    items: [
                        {
                            itemId: 'companies-search-field',
                            xtype: 'searchfield',
                            ui: 'hovered-underline',
                            cls: 'a-field-icon icon-search',
                            width: 280,
                            style: 'padding-bottom: 0;',
                            margin: 0,
                            placeholder: 'Search by company or client ID',
                            clearable: true,
                            listeners: {
                                change: function (field, newValue, oldValue, eOpts) {
                                    var storeCompanies = field.up('grid').getStore();
                                    if (newValue === '') storeCompanies.removeFilter('search');
                                },
                                action: function (me, newValue, oldValue, eOpts) {
                                    var query = this.getValue().toLowerCase();
                                    const storeCompanies = this.up('grid').getStore();
                                    storeCompanies.removeFilter('search');
                                    if (query.length > 2) {
                                        storeCompanies.addFilter({
                                            id: 'search',
                                            property: 'search',
                                            operator: '=',
                                            value: query,
                                            exactMatch: true,
                                        });
                                    }
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'a-tools',
                    items: [
                        {
                            xtype: 'GridFiltersButton',
                            gridItemId: 'companies-grid',
                        },
                        {
                            xtype: 'button',
                            margin: '0 0 0 8',
                            ui: 'tool-text-sm',
                            iconCls: 'md-icon-outlined md-icon-settings',
                            text: 'Customize',
                            handler: function () {
                                this.find('companies-grid').getPlugin('gridviewoptions').showViewOptions();
                            },
                        },
                    ],
                },
            ],
        },
    ],
    listeners: {
        // painted: function () {
        //     let storeCompanies = this.upVM().get('organizations');
        //     storeCompanies.clearFilter();
        // },
        childtap: function (item, location, eOpts) {
            let record = location.record;
            if (record && location.source.target.tagName == 'BUTTON') {
                return false;
            }
        },
        childdoubletap: function (item, location, eOpts) {
            let record = location.record;
            if (record && location.source.target.tagName != 'BUTTON') {
                Ext.getCmp('main-viewport')
                    .getController()
                    .redirectTo('company/' + record.get('org_id'));
                this.deselectAll();
                let storeCompanies = this.upVM().get('organizations');
                storeCompanies.clearFilter();
                // let editPanel = this.find('company-editpanel');
                // if (!editPanel.isVisible()) {
                //     editPanel.show();
                // }
            }
        },
        // childmouseenter: function (item, location) {
        //     location.column.getDataIndex();
        //     if (location.column.getDataIndex() == 'types') {
        //         var label_str = '';
        //         types = location.record.data.types;
        //         var selected = Ext.getCmp(location.cell.getId());
        //         if (types && types.length > 1) {
        //             let store = this.upVM().get('types');
        //             types.forEach(function (element) {
        //                 if (element != '') {
        //                     let record = store.findRecord('org_t_id', element.org_type_id, 0, false, false, true);
        //                     if (record) {
        //                         label_str +=
        //                             '<span class="mr-4 a-status-badge rounded status-' +
        //                             record.get('org_t_name').trim().toLowerCase() +
        //                             '">' +
        //                             record.get('org_t_name').trim() +
        //                             '</span>';
        //                     }
        //                 }
        //             });
        //             let tipExist = Ext.getCmp('companyLabelTooltip');
        //             if (tipExist) {
        //                 tipExist.destroy();
        //             }
        //             var tip = Ext.create('Ext.tip.ToolTip', {
        //                 target: selected,
        //                 delegate: '.pedence',
        //                 ui: 'info-card',
        //                 manageBorders: false,
        //                 anchorToTarget: true,
        //                 id: 'companyLabelTooltip',
        //                 autoDestroy: true,
        //                 anchor: true,
        //                 autoHide: true,
        //                 closable: true,
        //                 showOnTap: true,
        //                 dismissDelay: 0,
        //                 showDelay: 0,
        //                 title: 'Multiple labels',
        //                 html: label_str,
        //             });
        //         }
        //     }
        // },
    },
});
