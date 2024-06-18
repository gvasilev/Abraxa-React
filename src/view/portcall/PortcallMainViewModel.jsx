import '../../store/portcalls/Statuses';
import '../../store/common/port/Terminals';
import '../../store/common/port/Berths';
import '../../store/sof/DefaultEvents';
import '../../store/common/DefaultExpenseItems';
import '../../store/chatter/Messages';

Ext.define('Abraxa.view.portcall.PortcallMainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.portcall-viewmodel',
    data: {
        berthColors: ['#00608E', '#207FAE', '#489cc7', '#8FC3DD'],
        showChatMenu: true,
        isLoading: false,
        refreshFolderCount: new Date(),
    },
    stores: {
        suggestedOrganizations: Ext.create('Ext.data.Store'),
        opsSections: {
            data: [
                {
                    html: '<i class="md-icon-outlined">anchor</i><span>General</span>',
                    tab: 'port_info',
                    cls: 'chameleon_portcall_ops_general_tab',
                    title: 'General information',
                    subObject: 'general',
                },
                {
                    html: '<i class="md-icon-outlined">place</i><span>Berths</span>',
                    tab: 'berths',
                    cls: 'chameleon_portcall_ops_berths_tab',
                    title: 'Berth information',
                    subObject: 'berth',
                },
                {
                    html: '<i class="md-icon-outlined">timer</i><span>SOF</span>',
                    tab: 'sof',
                    cls: 'chameleon_portcall_ops_sof_tab',
                    title: 'Statement of facts',
                    subObject: 'sof',
                },
                {
                    html: '<i class="md-icon-outlined">speed</i><span>Progress</span>',
                    tab: 'cargo_progress',
                    cls: 'chameleon_portcall_ops_progress_tab',
                    title: 'Cargo progress',
                    subObject: 'progress',
                },
            ],
        },
        husbandrySections: {
            data: [
                {
                    html: '<i class="md-icon-outlined" data-qtip="Services" data-qalign="bc-tc" data-qanchor="true">layers</i><span>Services</span>',
                    tab: 'services',
                    title: 'Services',
                    slug: 'supply',
                    subObject: 'supply',
                },
                {
                    html: '<i class="md-icon-outlined" data-qtip="Crewing" data-qalign="bc-tc" data-qanchor="true">supervisor_account</i><span>Crewing</span>',
                    tab: 'crewing',
                    title: 'Crewing',
                    slug: 'crewing',
                    subObject: 'crewing',
                },
            ],
        },
        portcallAgentStatus: {
            type: 'portcall.statuses',
            autoLoad: true,
            filters: [
                {
                    property: 'is_archive',
                    operator: '=',
                    value: 0,
                    exactMatch: true,
                },
            ],
        },
        terminals: {
            type: 'port.terminals',
            autoLoad: true,
            proxy: {
                extraParams: {
                    port_id: '{object_record.port_id}',
                },
            },
            updateProxy: function (proxy) {
                if (proxy) {
                    if (proxy) {
                        proxy.onAfter(
                            'extraparamschanged',
                            function () {
                                if (this.getProxy().getExtraParams().port_id) this.load();
                            },
                            this
                        );
                    }
                }
            },
        },
        berthsStore: {
            type: 'port.berths',
            autoLoad: true,
            proxy: {
                extraParams: {
                    port_id: '{object_record.port_id}',
                },
            },
            updateProxy: function (proxy) {
                if (proxy) {
                    proxy.onAfter(
                        'extraparamschanged',
                        function () {
                            if (this.getProxy().getExtraParams().port_id) this.load();
                        },
                        this
                    );
                }
            },
        },
        defaultGeneralEvents: {
            type: 'sof-general-events',
            autoLoad: true,
            proxy: {
                extraParams: {
                    appointmentId: '{routeParams}',
                },
            },
            updateProxy: function (proxy) {
                if (proxy) {
                    proxy.onAfter(
                        'extraparamschanged',
                        function () {
                            if (this.getProxy().getExtraParams().appointmentId) this.load();
                        },
                        this
                    );
                }
            },
        },
        defaultExpenseItems: {
            type: 'default-expense-items',
            autoLoad: true,
        },
        defaultBunkers: {
            source: '{defaultExpenseItems}',
            filters: [
                {
                    filterFn: function (record) {
                        if (record.get('default_expense_item_type_id') == 9) {
                            return true;
                        }
                    },
                },
            ],
        },
        chatter_messages: {
            type: 'chatter-messages',
            autoLoad: true,
            proxy: {
                extraParams: {
                    portcall_id: '{object_record.id}',
                },
            },
            updateProxy: function (proxy) {
                if (proxy) {
                    proxy.onAfter(
                        'extraparamschanged',
                        function () {
                            if (this.getProxy().getExtraParams().portcall_id) this.load();
                        },
                        this
                    );
                }
            },
            // listeners: {
            //     load: function () {
            //         let chatList = Ext.ComponentQuery.query('chatter\\.messages')[0],
            //             lastRecord = this.last();

            //         chatList.refresh();

            //         if (lastRecord)
            //             chatList.scrollToRecord(lastRecord);

            //     },
            //     add: function (store, records) {
            //         let chatList = Ext.ComponentQuery.query('chatter\\.messages')[0],
            //             record = records[0],
            //             currentUser = Ext.getCmp('main-viewport').getVM().get('currentUser');

            //         if (record.get('created_by') != currentUser.get('id')) {
            //             chatList.refresh();
            //             chatList.scrollToRecord(record);
            //         }
            //     }
            // },
            // filters: [{
            //     id: 'receiver',
            //     filterFn: function (record) {
            //         if (record.get('receiver_id') == null) {
            //             return true;
            //         }
            //     }
            // }]
        },
        members: {
            source: '{object_record.members}',
            extraParams: {
                portcall_id: '{object_record.id}',
            },
            listeners: {
                beforesync: function (store) {
                    let object_record = Ext.ComponentQuery.query(
                        Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
                    )[0]
                        .upVM()
                        .get('object_record');
                    if (object_record) object_record.set('updated_at', new Date());
                },
            },
        },
        cargoes: {
            source: '{object_record.nomination.cargoes}',
            extraParams: {
                portcall_id: '{object_record.id}',
            },
            listeners: {
                beforesync: function (store) {
                    let object_record = Ext.ComponentQuery.query(
                        Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
                    )[0]
                        .upVM()
                        .get('object_record');
                    if (object_record) object_record.set('updated_at', new Date());
                },
            },
        },
        cargoOps: {
            source: '{object_record.cargo_ops}',
            extraParams: {
                portcall_id: '{object_record.id}',
            },
            listeners: {
                beforesync: function (store) {
                    let object_record = Ext.ComponentQuery.query(
                        Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
                    )[0]
                        .upVM()
                        .get('object_record');
                    if (object_record) object_record.set('updated_at', new Date());
                },
            },
        },
        berths: {
            source: '{object_record.berths}',
            extraParams: {
                portlog_id: '{object_record.id}',
            },
            listeners: {
                load: function () {
                    this.each(function (record, index) {
                        record.set('berth_sequence', 'Berth' + (index + 1));
                    });
                },
            },
            listeners: {
                beforesync: function (store) {
                    let object_record = Ext.ComponentQuery.query(
                        Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
                    )[0]
                        .upVM()
                        .get('object_record');
                    if (object_record) object_record.set('updated_at', new Date());
                },
            },
        },
        disbursements: {
            source: '{object_record.disbursements}',
            sorters: [
                {
                    property: 'id',
                    direction: 'DESC',
                },
            ],
            listeners: {
                beforesync: function (store) {
                    let object_record = Ext.ComponentQuery.query(
                        Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
                    )[0]
                        .upVM()
                        .get('object_record');
                    if (object_record) object_record.set('updated_at', new Date());
                },
            },
        },
        masters: {
            source: '{object_record.masters}',
            extraParams: {
                voyage_id: '{object_record.voyage_id}',
            },
            listeners: {
                beforesync: function (store) {
                    let object_record = Ext.ComponentQuery.query(
                        Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
                    )[0]
                        .upVM()
                        .get('object_record');
                    if (object_record) object_record.set('updated_at', new Date());
                },
            },
        },
        folders: {
            source: '{object_record.folders}',
            // extraParams: {
            //     object_meta_id: '{object_record.id}'
            // },
            listeners: {
                beforesync: function (store) {
                    let object_record = Ext.ComponentQuery.query(
                        Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
                    )[0]
                        .upVM()
                        .get('object_record');
                    if (object_record) object_record.set('updated_at', new Date());
                },
            },
        },
        distribution_groups: {
            source: '{object_record.distribution_groups}',
            extraParams: {
                portcall_id: '{object_record.id}',
            },
            listeners: {
                beforesync: function (store) {
                    let object_record = Ext.ComponentQuery.query(
                        Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
                    )[0]
                        .upVM()
                        .get('object_record');
                    if (object_record) object_record.set('updated_at', new Date());
                },
            },
        },
        amails: {
            source: '{object_record.amails}',
            extraParams: {
                object_id: 3,
                object_meta_id: '{object_record.id}',
            },
            listeners: {
                beforesync: function (store) {
                    let object_record = Ext.ComponentQuery.query(
                        Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
                    )[0]
                        .upVM()
                        .get('object_record');
                    if (object_record) object_record.set('updated_at', new Date());
                },
            },
        },
        crewings: {
            source: '{object_record.crewings}',
            extraParams: {
                portcall_id: '{object_record.id}',
            },
            listeners: {
                beforesync: function (store) {
                    let object_record = Ext.ComponentQuery.query(
                        Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
                    )[0]
                        .upVM()
                        .get('object_record');
                    if (object_record) object_record.set('updated_at', new Date());
                },
            },
        },
        expenses: {
            source: '{object_record.expenses}',
            extraParams: {
                portcall_id: '{object_record.id}',
            },
            listeners: {
                beforesync: function (store) {
                    let object_record = Ext.ComponentQuery.query(
                        Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
                    )[0]
                        .upVM()
                        .get('object_record');
                    if (object_record) object_record.set('updated_at', new Date());
                },
            },
        },
        accounts: {
            source: '{object_record.accounts}',
            listeners: {
                beforesync: function (store) {
                    let object_record = Ext.ComponentQuery.query(
                        Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
                    )[0]
                        .upVM()
                        .get('object_record');
                    if (object_record) object_record.set('updated_at', new Date());
                },
            },
        },
        supplies: {
            source: '{expenses}',
            grouper: {
                groupFn: function (record) {
                    return record.get('account_name');
                },
            },
            filters: [
                function (item) {
                    return !item.phantom && item.get('default_expense_item_id');
                },
            ],
        },
        recieptExpenses: {
            source: '{expenses}',
            filters: [
                {
                    filterFn: function (record) {
                        if (record.get('default_expense_item_id')) {
                            return true;
                        }
                    },
                },
            ],
        },
        paymentTerms: {
            type: 'payment.terms',
        },
        vouchers: {
            source: '{object_record.vouchers}',
            extraParams: {
                portcall_id: '{object_record.id}',
            },
            filters: [
                {
                    filterFn: function (record) {
                        // Avoid displaying vouchers which were not deleted, but their documents were deleted
                        return record.get('document') !== null;
                    },
                },
            ],
            listeners: {
                beforesync: function (store) {
                    let object_record = Ext.ComponentQuery.query(
                        Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
                    )[0]
                        .upVM()
                        .get('object_record');
                    if (object_record) object_record.set('updated_at', new Date());
                },
            },
        },
        payments: {
            type: 'payments',
            proxy: {
                api: {
                    //This is override read url for payments store, to reload only payments for this portcall,
                    //not all of them
                    read: Env.ApiEndpoint + 'portcall/' + '{object_record.id}' + '/payments',
                },
            },
            pageSize: null,
            autoLoad: true,
            listeners: {
                beforesync: function (store) {
                    let object_record = Ext.ComponentQuery.query(
                        Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
                    )[0]
                        .upVM()
                        .get('object_record');
                    if (object_record) object_record.set('updated_at', new Date());
                },
                add: {
                    fn: function (store, record, index) {
                        let object_record = Ext.ComponentQuery.query(
                            Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type +
                                'portcall\\.main'
                        )[0]
                            .upVM()
                            .get('object_record');
                        if (object_record) object_record.set('updated_at', new Date());
                    },
                },
            },
        },
        documents: {
            source: '{object_record.documents}',
        },
        instructions: {
            source: '{object_record.instructions}',
            extraParams: {
                object_meta_id: '{object_record.id}',
                object_id: 3,
            },
            listeners: {
                beforesync: function (store) {
                    let object_record = Ext.ComponentQuery.query(
                        Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main'
                    )[0]
                        .upVM()
                        .get('object_record');
                    if (object_record) object_record.set('updated_at', new Date());
                },
            },
        },
        disbursementGrouping: {
            source: '{object_record.disbursements}',
            sorters: [
                {
                    property: 'id',
                    direction: 'DESC',
                },
            ],
            grouper: {
                groupFn: function (record) {
                    return record.get('group_id');
                },
            },
        },
    },
    formulas: {
        portCallRecord: {
            bind: {
                bindTo: '{portcallMainViewAgent.record}',
            },
            get: function (record) {
                return record;
            },
        },
        object_record: {
            bind: {
                bindTo: '{portcallMainViewAgent.record}',
                deep: true,
            },
            get: function (record) {
                return record;
            },
        },
        doDefaults: {
            bind: {
                bindTo: '{object_record.id}',
                // deep: true,
            },
            get: function (rec) {
                if (rec) {
                    var mainVM = Ext.getCmp('main-viewport').getVM(),
                        recentlyOpened = this.get('recentlyOpened'),
                        object_record = this.get('object_record'),
                        recentExists = null;

                    recentlyOpened.add({
                        object_id: 3,
                        object_meta_id: object_record.get('id'),
                        hash: mainVM.get('routeHash') + '/' + object_record.get('id'),
                        watching: null,
                    });

                    // Ext.ComponentQuery.query('chatter\\.input')[0].show();
                    recentlyOpened.sync({
                        success: function () {
                            Ext.getCmp('main-viewport').setMasked(false);
                            recentlyOpened.load();
                        },
                    });
                    // mainVM.set('object_record', rec);
                    if (
                        Ext.ComponentQuery.query('[cls=ops_menu]')[0] &&
                        Ext.ComponentQuery.query('[cls=ops_menu]')[0].getStore() &&
                        Ext.ComponentQuery.query('[cls=ops_menu]')[0].getStore().count()
                    )
                        Ext.ComponentQuery.query('[cls=ops_menu]')[0].select(0);

                    if (
                        Ext.ComponentQuery.query('[cls=husbandry_menu]')[0] &&
                        Ext.ComponentQuery.query('[cls=husbandry_menu]')[0].getStore() &&
                        Ext.ComponentQuery.query('[cls=husbandry_menu]')[0].getStore().count()
                    )
                        Ext.ComponentQuery.query('[cls=husbandry_menu]')[0].select(0);

                    return rec;
                }
            },
        },
        is_owner: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    //add check if parent ID doesn't exists
                    //only datached portcalls have parent_id's
                    if (
                        record.get('company_id') == this.get('currentUser').get('current_company_id') &&
                        !record.get('parent_id')
                    )
                        return true;

                    return false;
                }
            },
        },
        nonEditable: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (record) {
                if (record && this.get('currentUser')) {
                    if (
                        record.get('company_id') != this.get('currentUser').get('current_company_id') ||
                        record.get('is_archived') ||
                        record.get('parent_id')
                    )
                        return true;

                    return false;
                }
            },
        },
        chatMembers: {
            bind: {
                bindTo: '{chatter_messages}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    let chatMembers = [];
                }
            },
        },
        members_without_admin: {
            bind: {
                bindTo: '{members}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    return store.queryBy(function (rec, id) {
                        return !rec.get('is_owner') && rec.get('role') != 'limited access';
                    }).items;
                }
            },
        },
        activePortcallTab: {
            bind: {
                bindTo: '{routeExtraParams}',
                deep: true,
            },
            get: function (tab) {
                switch (tab) {
                    case 'appointment':
                        tab = 1;
                        break;
                    case 'ops':
                        tab = 2;
                        break;
                    case 'documents':
                        tab = 3;
                        break;
                    case 'husbandry':
                        tab = 4;
                        break;
                    case 'disbursements':
                        tab = 5;
                        break;
                    case 'payments':
                        tab = 6;
                        break;
                    case 'kpis':
                        tab = 7;
                        break;
                    default:
                        tab = 0;
                }
                var mainVM = Ext.getCmp('main-viewport').getVM();
                mainVM.set('activePortcallTab', tab);
            },
        },
        voyage: {
            bind: {
                bindTo: '{object_record.voyage}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    return record;
                }
            },
        },
        leadAgent: {
            bind: {
                bindTo: '{object_record.lead_agent}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    return record;
                }
            },
        },
        events: {
            bind: {
                bindTo: '{object_record.sof.count}',
                deep: true,
            },
            get: function (count) {
                let vm = this;
                if (count) {
                    let me = this,
                        record = this.get('object_record'),
                        sof = record.sof().getData().getAt(0),
                        store = sof.events();

                    store.getProxy().setExtraParams({
                        sof_id: sof.get('id'),
                    });
                    store.getProxy().setBatchActions(true);
                    store.getProxy().getWriter().setAllowSingle(false);
                    store.setSorters([
                        {
                            sorterFn: function (record1, record2) {
                                var firstDate = record1.get('event_date'),
                                    firstTime = record1.get('event_from'),
                                    secondDate = record2.get('event_date'),
                                    secondTime = record2.get('event_from');

                                if (firstDate && !firstTime) {
                                    firstTime = moment('23:59', 'HH:mm')._d;
                                }

                                if (secondDate && !secondTime) {
                                    secondTime = moment('23:59', 'HH:mm')._d;
                                }

                                if (moment(firstDate).isValid() || moment(firstTime).isValid()) {
                                    var date1 = moment(
                                        moment(firstDate).format('YYYY-MM-DD') + ' ' + moment(firstTime).format('HH:mm')
                                    )._d;
                                } else {
                                    var date1 = new Date('2050-11-11 00:00');
                                }

                                if (moment(secondDate).isValid() || moment(secondTime).isValid()) {
                                    var date2 = moment(
                                        moment(secondDate).format('YYYY-MM-DD') +
                                            ' ' +
                                            moment(secondTime).format('HH:mm')
                                    )._d;
                                } else {
                                    var date2 = new Date('2050-11-11 00:00');
                                }

                                return new Date(date1) - new Date(date2);
                            },
                            direction: 'ASC',
                        },
                        {
                            property: 'id',
                            direction: 'ASC',
                        },
                    ]);
                    store.on('beforesync', function () {
                        Abraxa.sof.checkForTriggersAndUpdate(me.getView(), store);
                        //bug reload store chained for object_record like berths store
                        // record.set('updated_at', new Date());
                        // record.set('user', vm.get('currentUser').getData());
                    });
                    return store;
                }
            },
        },
        prospects: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (object_record) {
                if (object_record && this.get('object_id') == 3) {
                    let berths = object_record.berths();

                    let prospects = [],
                        cargoStore = object_record.cargoes(),
                        sof = object_record.sof().getData().getAt(0),
                        sofEvents = sof.events();

                    berths.each(function (record) {
                        let berthData = record.getData(),
                            berthCargoes = [],
                            cargoes = cargoStore.queryBy(function (rec, id) {
                                return rec.get('da_berth_id') == berthData.id;
                            }).items;

                        Ext.Array.each(cargoes, function (cargo) {
                            berthCargoes.push(cargo.getData());
                        });
                        berthData.cargoes = berthCargoes;
                        let recordExists = sofEvents.findRecord('da_berth_id', berthData.id, 0, false, false, true);
                        if (!recordExists) prospects.push(berthData);
                    });
                    var sorted = prospects.sort(
                        (a, b) => (a.etb != null ? a.etb : Infinity) - (b.etb != null ? b.etb : Infinity)
                    );
                    return sorted;
                }
            },
        },
        sortedEvents: {
            bind: {
                bindTo: '{events}',
                deep: true,
            },
            get: function (store) {
                var sorted = [];
                if (store) {
                    var berthId = null;
                    var newStore = {
                        berth_id: null,
                        events: [],
                    };
                    store.each(function (record, index) {
                        if (record.get('event_date') && record.get('event_from')) {
                            record.data.showDate = true;
                            if (index != 0) {
                                record.data.showDate = false;
                                let previousEvent = store.getAt(index - 1);
                                if (record.get('event_date') && previousEvent.get('event_date')) {
                                    if (record.get('event_date').getTime() != previousEvent.get('event_date').getTime())
                                        record.data.showDate = true;
                                }
                            }

                            if (record.get('da_berth_id')) {
                                var record_berth_id = record.get('da_berth_id');
                                if (record_berth_id == berthId) {
                                    newStore.events.push(record);
                                    newStore.berth_id = record_berth_id;
                                } else {
                                    if (newStore.events.length) {
                                        sorted.push(newStore);
                                    }
                                    newStore = {
                                        berth_id: null,
                                        events: [],
                                    };

                                    berthId = record_berth_id;
                                    newStore.berth_id = record_berth_id;
                                    newStore.events.push(record);
                                }
                            } else {
                                if (newStore.events.length) {
                                    sorted.push(newStore);
                                    newStore = {
                                        berth_id: null,
                                        events: [],
                                    };
                                }
                                berthId = 0;
                                newStore.berth_id = null;
                                newStore.events.push(record);
                                sorted.push(newStore);
                                newStore = {
                                    berth_id: null,
                                    events: [],
                                };
                            }
                        }
                    });
                }
                if (newStore && newStore.events.length) sorted.push(newStore);

                return sorted;
            },
        },
        new_kpi: {
            bind: {
                events: '{sortedEvents}',
                berths: '{berths}',
            },
            get: function (data) {
                var vm = this;
                let store = data.events;
                if (store) {
                    var total = moment.duration(0),
                        totalWorked = moment.duration(0),
                        totalWaiting = moment.duration(0),
                        totalShifting = moment.duration(0),
                        totalStopped = moment.duration(0),
                        totalMisc = moment.duration(0),
                        totalBerthNonCargo = moment.duration(0),
                        totalBerthWaiting = moment.duration(0),
                        totalBerthShifting = moment.duration(0),
                        totalBerthStopped = moment.duration(0),
                        totalBerthWorked = moment.duration(0),
                        totalBerthMisc = moment.duration(0),
                        totalCargoOperationTime = moment.duration(0),
                        berthStay = moment.duration(0),
                        totalTime = moment.duration(),
                        firstDate = null,
                        lastDate = null,
                        berthStats = [],
                        berthIndex = 0,
                        stoppedRecords = [],
                        workedRecords = [],
                        waitingRecords = [],
                        miscRecords = [],
                        shiftingRecords = [];

                    let record_count = 1;
                    Ext.each(store, function (section) {
                        Ext.each(section.events, function (record, idx) {
                            var event_from = moment.utc(
                                    moment(record.get('event_date')).format('YYYY-MM-DD') +
                                        ' ' +
                                        moment(record.get('event_from')).format('HH:mm')
                                ),
                                event_to = moment.utc(
                                    moment(record.get('event_date')).format('YYYY-MM-DD') +
                                        ' ' +
                                        moment(record.get('event_to')).format('HH:mm')
                                );
                            if (event_from.isValid() && event_to.isValid()) {
                                if (event_to.hours() === 0) event_to.endOf('day').add(1, 'minute');

                                total.add(moment.duration(event_to.diff(event_from)).asMinutes(), 'minutes');
                                switch (record.get('default_sof_event_category_id')) {
                                    case 4:
                                        totalWorked.add(
                                            moment.duration(event_to.diff(event_from)).asMinutes(),
                                            'minutes'
                                        );
                                        workedRecords.push(record);
                                        break;
                                    case 5:
                                        totalStopped.add(
                                            moment.duration(event_to.diff(event_from)).asMinutes(),
                                            'minutes'
                                        );
                                        stoppedRecords.push(record);
                                        break;
                                    case 3:
                                        totalShifting.add(
                                            moment.duration(event_to.diff(event_from)).asMinutes(),
                                            'minutes'
                                        );
                                        shiftingRecords.push(record);
                                        break;
                                    case 2:
                                        totalWaiting.add(
                                            moment.duration(event_to.diff(event_from)).asMinutes(),
                                            'minutes'
                                        );
                                        waitingRecords.push(record);
                                        break;
                                    case 6:
                                        totalMisc.add(
                                            moment.duration(event_to.diff(event_from)).asMinutes(),
                                            'minutes'
                                        );
                                        miscRecords.push(record);
                                        break;
                                }
                            }
                            if (event_from.isValid()) {
                                if (record_count == 1) {
                                    firstDate = event_from;
                                }
                                if (event_to.isValid()) {
                                    lastDate = event_to;
                                } else {
                                    lastDate = event_from;
                                }
                            }
                            record_count++;
                        });
                        if (firstDate && lastDate) {
                            totalTime = moment.duration(lastDate.diff(firstDate));
                        }
                        if (section.berth_id) {
                            var etbDate,
                                etcDate,
                                firstEvent,
                                lastEvent,
                                berthWorked = moment.duration(0),
                                berthWaiting = moment.duration(0),
                                berthMisc = moment.duration(0),
                                berthShifting = moment.duration(0),
                                berthStopped = moment.duration(0),
                                berthTotal = moment.duration(0),
                                berthNonCargo = moment.duration(0),
                                berthName = vm.get('berths').findRecord('id', section.berth_id)
                                    ? vm.get('berths').findRecord('id', section.berth_id).get('name')
                                    : '',
                                berthStoppedRecords = [],
                                berthWaitingRecords = [],
                                berthShiftingRecords = [],
                                berthWorkedRecords = [],
                                berthMiscRecords = [];

                            Ext.each(section.events, function (record) {
                                var event_from = moment.utc(
                                        moment(record.get('event_date')).format('YYYY-MM-DD') +
                                            ' ' +
                                            moment(record.get('event_from')).format('HH:mm')
                                    ),
                                    event_to = moment.utc(
                                        moment(record.get('event_date')).format('YYYY-MM-DD') +
                                            ' ' +
                                            moment(record.get('event_to')).format('HH:mm')
                                    );

                                if (event_from.isValid() && event_to.isValid()) {
                                    //TO-DO: Fix SOF Calculation
                                    switch (record.get('default_sof_event_category_id')) {
                                        case 4:
                                            totalBerthWorked.add(
                                                moment.duration(event_to.diff(event_from)).asMinutes(),
                                                'minutes'
                                            );
                                            berthWorked.add(
                                                moment.duration(event_to.diff(event_from)).asMinutes(),
                                                'minutes'
                                            );
                                            berthWorkedRecords.push(record.getData());
                                            break;
                                        case 5:
                                            totalBerthStopped.add(
                                                moment.duration(event_to.diff(event_from)).asMinutes(),
                                                'minutes'
                                            );
                                            berthStopped.add(
                                                moment.duration(event_to.diff(event_from)).asMinutes(),
                                                'minutes'
                                            );
                                            berthStoppedRecords.push(record.getData());
                                            break;
                                        case 3:
                                            totalBerthShifting.add(
                                                moment.duration(event_to.diff(event_from)).asMinutes(),
                                                'minutes'
                                            );
                                            berthShifting.add(
                                                moment.duration(event_to.diff(event_from)).asMinutes(),
                                                'minutes'
                                            );
                                            berthShiftingRecords.push(record.getData());
                                            break;
                                        case 2:
                                            totalBerthWaiting.add(
                                                moment.duration(event_to.diff(event_from)).asMinutes(),
                                                'minutes'
                                            );
                                            berthWaiting.add(
                                                moment.duration(event_to.diff(event_from)).asMinutes(),
                                                'minutes'
                                            );
                                            berthWaitingRecords.push(record.getData());
                                            break;
                                        case 6:
                                            totalBerthMisc.add(
                                                moment.duration(event_to.diff(event_from)).asMinutes(),
                                                'minutes'
                                            );
                                            berthMisc.add(
                                                moment.duration(event_to.diff(event_from)).asMinutes(),
                                                'minutes'
                                            );
                                            berthMiscRecords.push(record.getData());
                                            break;
                                    }
                                }
                            });
                            let berth_event_count = 1;
                            Ext.each(section.events, function (berthEvent) {
                                let eventDate = moment.utc(
                                    moment(berthEvent.get('event_date')).format('YYYY-MM-DD') +
                                        ' ' +
                                        moment(berthEvent.get('event_from')).format('HH:mm')
                                );

                                if (eventDate.isValid()) {
                                    if (berthEvent.get('triggered_berths_dates') == 'etc') etcDate = eventDate;

                                    if (berthEvent.get('event_triggers_ops')) {
                                        etbDate = eventDate;
                                    }
                                    if (berth_event_count == 1) {
                                        firstEvent = eventDate;
                                    } else {
                                        lastEvent = moment.utc(
                                            moment(berthEvent.get('event_date')).format('YYYY-MM-DD') +
                                                ' ' +
                                                moment(
                                                    berthEvent.get('event_to')
                                                        ? berthEvent.get('event_to')
                                                        : berthEvent.get('event_from')
                                                ).format('HH:mm')
                                        );
                                    }
                                }
                                berth_event_count++;
                                if (etbDate && etcDate) {
                                    totalBerthWorked.add(moment.duration(etcDate.diff(etbDate)).asMinutes(), 'minutes');
                                    berthWorked.add(moment.duration(etcDate.diff(etbDate)).asMinutes(), 'minutes');
                                    Ext.each(section.events, function (berthEvent2) {
                                        if (
                                            berthEvent2.get('default_sof_event_category_id') != 1 ||
                                            berthEvent2.get('default_sof_event_category_id') != 5
                                        ) {
                                            var event_from = moment.utc(
                                                    moment(berthEvent2.get('event_date')).format('YYYY-MM-DD') +
                                                        ' ' +
                                                        moment(berthEvent2.get('event_from')).format('HH:mm')
                                                ),
                                                event_to = moment.utc(
                                                    moment(berthEvent2.get('event_date')).format('YYYY-MM-DD') +
                                                        ' ' +
                                                        moment(berthEvent2.get('event_to')).format('HH:mm')
                                                );

                                            if (event_from.isValid() && event_to.isValid()) {
                                                if (event_from >= etbDate && event_to <= etcDate) {
                                                    berthNonCargo.add(
                                                        moment.duration(event_to.diff(event_from)).asMinutes(),
                                                        'minutes'
                                                    );
                                                    totalBerthNonCargo.add(
                                                        moment.duration(event_to.diff(event_from)).asMinutes(),
                                                        'minutes'
                                                    );
                                                }
                                            }
                                        }
                                    });
                                    etbDate = null;
                                    etcDate = null;
                                }
                            });
                            if (firstEvent && lastEvent) {
                                berthStay.add(moment.duration(lastEvent.diff(firstEvent)).asMinutes(), 'minutes');
                                berthTotal.add(moment.duration(lastEvent.diff(firstEvent)).asMinutes(), 'minutes');
                                firstEvent = null;
                                lastEvent = null;
                            }
                            if (berthTotal) {
                                var berthCargoOps = moment.duration(
                                        berthWorked.asMinutes() - berthNonCargo.asMinutes(),
                                        'minutes'
                                    ),
                                    berthIdle = moment.duration(
                                        berthTotal.asMinutes() -
                                            (berthCargoOps.asMinutes() +
                                                berthStopped.asMinutes() +
                                                berthWaiting.asMinutes() +
                                                berthShifting.asMinutes() +
                                                berthMisc.asMinutes()),
                                        'minutes'
                                    ),
                                    berthCargoOpsDuration =
                                        berthCargoOps.days() +
                                        'd : ' +
                                        berthCargoOps.hours() +
                                        'h : ' +
                                        berthCargoOps.minutes() +
                                        'm ',
                                    berthStoppedDuration =
                                        berthStopped.days() +
                                        'd : ' +
                                        berthStopped.hours() +
                                        'h : ' +
                                        berthStopped.minutes() +
                                        'm ',
                                    berthWorkedDuration =
                                        berthWorked.days() +
                                        'd : ' +
                                        berthWorked.hours() +
                                        'h : ' +
                                        berthWorked.minutes() +
                                        'm ',
                                    berthWaitingDuration =
                                        berthWaiting.days() +
                                        'd : ' +
                                        berthWaiting.hours() +
                                        'h : ' +
                                        berthWaiting.minutes() +
                                        'm ',
                                    berthShiftingDuration =
                                        berthShifting.days() +
                                        'd : ' +
                                        berthShifting.hours() +
                                        'h : ' +
                                        berthShifting.minutes() +
                                        'm',
                                    berthMiscDuration =
                                        berthMisc.days() +
                                        'd : ' +
                                        berthMisc.hours() +
                                        'h : ' +
                                        berthMisc.minutes() +
                                        'm',
                                    berthStayDuration =
                                        berthTotal.days() +
                                        'd : ' +
                                        berthTotal.hours() +
                                        'h : ' +
                                        berthTotal.minutes() +
                                        'm',
                                    idleDuration =
                                        berthIdle.days() +
                                        'd : ' +
                                        berthIdle.hours() +
                                        'h : ' +
                                        berthIdle.minutes() +
                                        'm';

                                var berthData = [],
                                    berthColors = [];

                                if (berthWorked.asMinutes() > 0) {
                                    berthData.push({
                                        name: 'Cargo Ops',
                                        label: 'Cargo Ops',
                                        result: Math.round((berthWorked.asMinutes() / berthTotal.asMinutes()) * 100),
                                        value: Math.round((berthWorked.asMinutes() / berthTotal.asMinutes()) * 100),
                                        duration: berthWorkedDuration,
                                        events: berthWorkedRecords,
                                        type: 'worked',
                                        color: '#22B14C',
                                    });
                                    berthColors.push('#22B14C');
                                }
                                if (berthStopped.asMinutes() > 0) {
                                    berthData.push({
                                        name: 'Stopped',
                                        label: 'Stopped',
                                        result: Math.round((berthStopped.asMinutes() / berthTotal.asMinutes()) * 100),
                                        value: Math.round((berthStopped.asMinutes() / berthTotal.asMinutes()) * 100),
                                        duration: berthStoppedDuration,
                                        type: 'stopped',
                                        color: '#ee5b42',
                                        events: berthStoppedRecords,
                                        berth_id: section.berth_id,
                                    });
                                    berthColors.push('#ee5b42');
                                }
                                if (berthWaiting.asMinutes() > 0) {
                                    berthData.push({
                                        name: 'Waiting',
                                        label: 'Waiting',
                                        result: Math.round((berthWaiting.asMinutes() / berthTotal.asMinutes()) * 100),
                                        value: Math.round((berthWaiting.asMinutes() / berthTotal.asMinutes()) * 100),
                                        duration: berthWaitingDuration,
                                        type: 'waiting',
                                        color: '#f3c46b',
                                        events: berthWaitingRecords,
                                        berth_id: section.berth_id,
                                    });
                                    berthColors.push('#f3c46b');
                                }
                                if (berthShifting.asMinutes() > 0) {
                                    berthData.push({
                                        name: 'Shifting',
                                        label: 'Shifting',
                                        result: Math.round((berthShifting.asMinutes() / berthTotal.asMinutes()) * 100),
                                        value: Math.round((berthShifting.asMinutes() / berthTotal.asMinutes()) * 100),
                                        duration: berthShiftingDuration,
                                        type: 'shifting',
                                        color: '#a87aa8',
                                        events: berthShiftingRecords,
                                        berth_id: section.berth_id,
                                    });
                                    berthColors.push('#a87aa8');
                                }
                                if (berthMisc.asMinutes() > 0) {
                                    berthData.push({
                                        name: 'Miscellaneous',
                                        result: Math.round((berthMisc.asMinutes() / berthTotal.asMinutes()) * 100),
                                        value: Math.round((berthMisc.asMinutes() / berthTotal.asMinutes()) * 100),
                                        duration: berthMiscDuration,
                                        type: 'misc',
                                        color: '#37a8b5',
                                        events: berthMiscRecords,
                                        berth_id: section.berth_id,
                                    });
                                    berthColors.push('#a87aa8');
                                }
                                if (berthIdle.asMinutes() > 0) {
                                    berthData.push({
                                        name: 'Idle',
                                        label: 'Idle',
                                        result: Math.round((berthIdle.asMinutes() / berthTotal.asMinutes()) * 100),
                                        value: Math.round((berthIdle.asMinutes() / berthTotal.asMinutes()) * 100),
                                        duration: idleDuration,
                                        type: 'idle',
                                        color: '#F0CBCB',
                                    });
                                    berthColors.push('#F0CBCB');
                                }
                                var color = vm.get('berthColors')[berthIndex];
                                berthStats.push({
                                    label: berthName,
                                    berth_id: section.berth_id,
                                    data: berthData,
                                    value: berthTotal.asMinutes(),
                                    duration: berthStayDuration,
                                    color: color,
                                    colors: berthColors,
                                });
                                berthIndex++;
                            }
                        }
                    });
                    if (total) {
                        var totalStoppedMinutes = totalStopped.asMinutes(),
                            totalShiftingMinutes = totalShifting.asMinutes(),
                            totalMiscMinutes = totalMisc.asMinutes(),
                            totalWaitingMinutes = totalWaiting.asMinutes(),
                            berthStayMinutes = berthStay.asMinutes(),
                            totalCargoOps = moment.duration(
                                totalBerthWorked.asMinutes() - totalBerthNonCargo.asMinutes(),
                                'minutes'
                            ),
                            totalCargoOpsMinutes = totalCargoOps.asMinutes(),
                            totalBerthShiftingMinutes = totalBerthShifting.asMinutes(),
                            totalBerthWaitingMinutes = totalBerthWaiting.asMinutes(),
                            totalBerthStoppedMinutes = totalBerthStopped.asMinutes(),
                            totalBerthMiscMinutes = totalBerthMisc.asMinutes(),
                            idle = moment.duration(
                                berthStayMinutes -
                                    (totalCargoOpsMinutes +
                                        totalBerthShiftingMinutes +
                                        totalBerthStoppedMinutes +
                                        totalBerthWaitingMinutes +
                                        totalBerthMiscMinutes),
                                'minutes'
                            ),
                            idleMinutes = idle.asMinutes(),
                            otherTime = moment.duration(
                                totalTime.asMinutes() -
                                    (totalWaitingMinutes +
                                        totalShiftingMinutes +
                                        totalStoppedMinutes +
                                        totalCargoOpsMinutes +
                                        idleMinutes +
                                        totalMiscMinutes),
                                'minutes'
                            ),
                            otherTimeMinutes = otherTime.asMinutes(),
                            totalMinutes = totalTime.asMinutes(),
                            portStay = totalTime,
                            otherStay = moment.duration(portStay.asMinutes() - berthStayMinutes, 'minutes'),
                            portStayDuration =
                                portStay.days() + 'd : ' + portStay.hours() + 'h : ' + portStay.minutes() + 'm ',
                            otherStayDuration =
                                otherStay.days() + 'd : ' + otherStay.hours() + 'h : ' + otherStay.minutes() + 'm ',
                            otherTimeDuration =
                                otherTime.days() + 'd : ' + otherTime.hours() + 'h : ' + otherTime.minutes() + 'm ',
                            idleDuration = idle.days() + 'd : ' + idle.hours() + 'h : ' + idle.minutes() + 'm ',
                            berthStayDuration =
                                berthStay.days() + 'd : ' + berthStay.hours() + 'h : ' + berthStay.minutes() + 'm ',
                            totalCargoOpsDuration =
                                totalCargoOps.days() +
                                'd : ' +
                                totalCargoOps.hours() +
                                'h : ' +
                                totalCargoOps.minutes() +
                                'm ',
                            waitingDuration =
                                totalWaiting.days() +
                                'd : ' +
                                totalWaiting.hours() +
                                'h : ' +
                                totalWaiting.minutes() +
                                'm ',
                            shiftingDuration =
                                totalShifting.days() +
                                'd : ' +
                                totalShifting.hours() +
                                'h : ' +
                                totalShifting.minutes() +
                                'm ',
                            miscDuration =
                                totalMisc.days() + 'd : ' + totalMisc.hours() + 'h : ' + totalMisc.minutes() + 'm ',
                            stoppedDuration =
                                totalStopped.days() +
                                'd : ' +
                                totalStopped.hours() +
                                'h : ' +
                                totalStopped.minutes() +
                                'm ',
                            workedDuration =
                                totalWorked.days() +
                                'd : ' +
                                totalWorked.hours() +
                                'h : ' +
                                totalWorked.minutes() +
                                'm ';
                    }

                    var statsData = [],
                        colors = [],
                        sparklineValues = [],
                        portEvents = [];

                    if (totalCargoOpsMinutes > 0) {
                        sparklineValues.push(Math.round((totalCargoOpsMinutes / totalMinutes) * 100));
                        statsData.push({
                            label: 'Cargo Ops',
                            value: Math.round((totalCargoOpsMinutes / totalMinutes) * 100),
                            duration: totalCargoOpsDuration,
                            type: 'worked',
                            color: '#22B14C',
                        });
                        portEvents.push({
                            name: 'Worked',
                            events: workedRecords,
                            result: Math.round((totalCargoOpsMinutes / totalMinutes) * 100),
                            duration: totalCargoOpsDuration,
                            color: '#22B14C',
                            type: 'worked',
                        });
                        colors.push('#22B14C');
                    }
                    if (totalStoppedMinutes > 0) {
                        sparklineValues.push(Math.round((totalStoppedMinutes / totalMinutes) * 100));
                        statsData.push({
                            label: 'Stopped',
                            value: Math.round((totalStoppedMinutes / totalMinutes) * 100),
                            duration: stoppedDuration,
                            type: 'stopped',
                            color: '#ee5b42',
                            // data: JSON.stringify(stoppedRecords)
                            // data: stoppedRecords
                        });
                        portEvents.push({
                            name: 'Stopped',
                            events: stoppedRecords,
                            result: Math.round((totalStoppedMinutes / totalMinutes) * 100),
                            duration: stoppedDuration,
                            color: '#ee5b42',
                            type: 'stopped',
                        });
                        colors.push('#ee5b42');
                    }

                    if (totalWaitingMinutes > 0) {
                        sparklineValues.push(Math.round((totalWaitingMinutes / totalMinutes) * 100));
                        statsData.push({
                            label: 'Waiting',
                            value: Math.round((totalWaitingMinutes / totalMinutes) * 100),
                            duration: waitingDuration,
                            type: 'waiting',
                            color: '#f3c46b',
                            // events: waitingRecords
                        });
                        portEvents.push({
                            name: 'Waiting',
                            events: waitingRecords,
                            duration: waitingDuration,
                            color: '#f3c46b',
                            type: 'waiting',
                            result: Math.round((totalWaitingMinutes / totalMinutes) * 100),
                        });
                        colors.push('#f3c46b');
                    }

                    if (totalShiftingMinutes > 0) {
                        sparklineValues.push(Math.round((totalShiftingMinutes / totalMinutes) * 100));
                        statsData.push({
                            label: 'Shifting',
                            value: Math.round((totalShiftingMinutes / totalMinutes) * 100),
                            duration: shiftingDuration,
                            type: 'shifting',
                            color: '#a87aa8',
                            // events: shiftingRecords
                        });
                        portEvents.push({
                            name: 'Shifting',
                            events: shiftingRecords,
                            result: Math.round((totalShiftingMinutes / totalMinutes) * 100),
                            duration: shiftingDuration,
                            type: 'shifting',
                            color: '#a87aa8',
                        });
                        colors.push('#a87aa8');
                    }

                    if (totalMiscMinutes > 0) {
                        sparklineValues.push(Math.round((totalMiscMinutes / totalMinutes) * 100));
                        statsData.push({
                            label: 'Miscellaneous ',
                            value: Math.round((totalMiscMinutes / totalMinutes) * 100),
                            duration: miscDuration,
                            type: 'misc',
                            color: '#37a8b5',
                            // events: shiftingRecords
                        });
                        portEvents.push({
                            name: 'Miscellaneous',
                            events: miscRecords,
                            result: Math.round((totalMiscMinutes / totalMinutes) * 100),
                            duration: miscDuration,
                            type: 'misc',
                            color: '#37a8b5',
                        });
                        colors.push('#37a8b5');
                    }

                    if (idleMinutes > 0) {
                        sparklineValues.push(Math.round((idleMinutes / totalMinutes) * 100));
                        statsData.push({
                            label: 'Idle',
                            value: Math.round((idleMinutes / totalMinutes) * 100),
                            duration: idleDuration,
                            type: 'idle',
                            color: '#F0CBCB',
                        });
                        portEvents.push({
                            name: 'Idle',
                            events: [],
                            result: Math.round((idleMinutes / totalMinutes) * 100),
                            duration: idleDuration,
                            type: 'idle',
                            color: '#F0CBCB',
                        });
                        colors.push('#F0CBCB');
                    }
                    if (otherTimeMinutes > 0) {
                        sparklineValues.push(Math.round((otherTimeMinutes / totalMinutes) * 100));
                        statsData.push({
                            label: 'Other',
                            value: Math.round((otherTimeMinutes / totalMinutes) * 100),
                            duration: otherTimeDuration,
                            type: 'other',
                            color: '#b0bec5',
                        });
                        portEvents.push({
                            name: 'Other',
                            events: [],
                            result: Math.round((otherTimeMinutes / totalMinutes) * 100),
                            duration: otherTimeDuration,
                            type: 'other',
                            color: '#b0bec5',
                        });
                        colors.push('#b0bec5');
                    }

                    if (berthStats.length) {
                        Ext.each(berthStats, function (berthStat) {
                            berthStat.value = Math.round((berthStat.value / berthStay.asMinutes()) * 100);
                            berthStat.result = berthStat.value;
                        });
                    }

                    var stats = {
                        portStay: portStayDuration,
                        portEstimate: portStay,
                        berthStay: berthStayDuration,
                        otherStay: otherStayDuration,
                        data: statsData,
                        portEvents: portEvents,
                        colors: colors,
                        berthStats: berthStats,
                        sof_id: this.get('selectedSof'),
                        berthColors: vm.get('berthColors'),
                        cargo_ops: {
                            title: workedDuration,
                            color: '#22B14C',
                        },
                        stoppages: {
                            title: stoppedDuration,
                            color: '#ee5b42',
                        },
                        waiting: {
                            title: waitingDuration,
                            color: '#f3c46b',
                        },
                        shifting: {
                            title: shiftingDuration,
                            color: '#a87aa8',
                        },
                        misc: {
                            title: miscDuration,
                            color: '#37a8b5',
                        },
                    };
                    // if (sparklineValues.length && Ext.ComponentQuery.query('[cls~=kpi-sparkline-container]')[0].getHidden() == true) {
                    //     Ext.ComponentQuery.query('[cls=kpi-sparkline]')[0].setSliceColors(colors);
                    //     Ext.ComponentQuery.query('[cls=kpi-sparkline]')[0].setValues(sparklineValues);
                    //     Ext.ComponentQuery.query('[cls~=kpi-sparkline-container]')[0].show();
                    // } else {
                    //     Ext.ComponentQuery.query('[cls~=kpi-sparkline-container]')[0].hide();
                    // }
                    return stats;
                }
            },
        },
        gridEditor: {
            bind: {
                bindTo: '{nonEditable}',
                deep: true,
            },
            get: function (id) {
                if (!id) {
                    return {
                        gridcellediting: {
                            selectOnEdit: true,
                            triggerEvent: 'click',
                        },
                    };
                }
                return null;
            },
        },
        cargoProgressEditor: {
            bind: {
                bindTo: '{objectPermissions}',
                deep: true,
            },
            get: function (objectPermissions) {
                let nonEditable = this.get('nonEditable');
                let store = this.get('userPermissions'),
                    result = null;
                if (!nonEditable) {
                    if (store && Object.keys(store).length > 0) {
                        let record = store['portcallOpsCargoProgress'];
                        if (record && record.edit) {
                            result = {
                                gridcellediting: {
                                    selectOnEdit: true,
                                    triggerEvent: 'tap',
                                },
                            };
                        } else {
                            result = null;
                        }
                    }
                } else {
                    if (objectPermissions && objectPermissions['progress']) {
                        if (objectPermissions['progress'].can_edit) {
                            result = {
                                gridcellediting: {
                                    selectOnEdit: true,
                                    triggerEvent: 'tap',
                                },
                            };
                        }
                        if (store && Object.keys(store).length > 0) {
                            let record = store['progress'];
                            if (record && !record.edit) {
                                result = null;
                            }
                        }
                    }
                }
                return result;
            },
        },
        documentsEditable: {
            bind: {
                bindTo: '{objectPermissions}',
                deep: true,
            },
            get: function (objectPermissions) {
                let nonEditable = this.get('nonEditable');
                let store = this.get('userPermissions'),
                    result = {};
                if (!nonEditable) {
                    if (store && Object.keys(store).length > 0) {
                        let record = store['portcallDocuments'];
                        if (record && record.edit) {
                            result = {
                                element: 'element',
                                drop: 'onDrop',
                                dragleave: 'onDragLeaveListItem',
                                dragover: 'onDragOverListItem',
                            };
                        } else {
                            result = {};
                        }
                    }
                } else {
                    if (objectPermissions && objectPermissions['documents']) {
                        if (objectPermissions['documents'].can_edit) {
                            result = {
                                element: 'element',
                                drop: 'onDrop',
                                dragleave: 'onDragLeaveListItem',
                                dragover: 'onDragOverListItem',
                            };
                        }
                        if (store && Object.keys(store).length > 0) {
                            let record = store['documents'];
                            if (record && !record.edit) {
                                result = {};
                            }
                        }
                    }
                }
                return result;
            },
        },
        currentBerth: {
            bind: {
                bindTo: '{berths}',
                deep: true,
            },
            get: function (store) {
                if (store && store.count()) {
                    let record = store.findRecord('is_current', 1);
                    if (record) {
                        return record.get('id');
                    } else {
                        let data = store.getData().getAt(0);
                        if (data) return data.id;
                    }
                }
            },
        },
        firstEtb: {
            bind: {
                bindTo: '{berths}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    let data = store.getData().getAt(0);
                    if (data) {
                        if (data.get('etb'))
                            return '<span>ETB:</span> ' + moment(data.get('etb')).format('ddd Do MMM - H:mm');

                        return '<span>ETB:</span> ---';
                    }
                }
            },
        },
        estimatedBerthStay: {
            bind: {
                bindTo: '{currentBerthSelection.selection}',
                deep: true,
            },
            get: function (record) {
                if (record && record.get('etb') && record.get('etd')) {
                    let duration = moment.duration(moment(record.get('etd')).diff(moment(record.get('etb'))));
                    return duration.days() + ' days : ' + duration.hours() + ' hrs';
                }
                return '-- : --';
            },
        },
        berthETB: {
            bind: {
                bindTo: '{currentBerthSelection.selection}',
                deep: true,
            },
            get: function (record) {
                if (record && record.get('etb')) {
                    return moment(record.get('etb')).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        berthETD: {
            bind: {
                bindTo: '{currentBerthSelection.selection}',
                deep: true,
            },
            get: function (record) {
                if (record && record.get('etd')) {
                    return moment(record.get('etd')).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        membersPerSection: {
            bind: {
                bindTo: '{members}',
                deep: true,
            },
            get: function (members) {
                if (members) {
                    let parsed = {
                        general: [],
                        appointment: [],
                        berth: [],
                        sof: [],
                        progress: [],
                        supply: [],
                        crewing: [],
                        documents: [],
                        disbursements: [],
                        accounts: [],
                        kpis: [],
                    };
                    members.each(function (member) {
                        let permissions = member.permissions();
                        permissions.each(function (record) {
                            if (parsed[record.get('sub_object_slug')])
                                parsed[record.get('sub_object_slug')].push(member);
                        });
                    });
                    return parsed;
                }
            },
        },
        master: {
            bind: {
                bindTo: '{masters}',
                deep: true,
            },
            get: function (store) {
                if (store && this.get('object_record')) {
                    if (!store.count())
                        store.add({
                            masterable_id: this.get('object_record').get('id'),
                            masterable_type: this.get('object_record').get('model_name'),
                        });

                    return store.getData().getAt(0);
                }
            },
        },
        notes: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    let store = record.notes();
                    store.setRemoteFilter(false);
                    store.getProxy().setExtraParams({
                        object_id: 3,
                        object_meta_id: record.get('id'),
                    });
                    store.sort({
                        property: 'id',
                        direction: 'ASC',
                    });
                    store.addFilter({
                        id: 1000,
                        filterFn: function (record) {
                            return !record.phantom;
                        },
                    });

                    return store;
                }
            },
        },
        tasks: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    let store = record.tasks();
                    var mainVM = Ext.getCmp('main-viewport').getVM();
                    store.clearFilter();
                    store.setRemoteFilter(false);
                    mainVM.set('tasks', store);
                }
            },
        },
        member: {
            bind: {
                bindTo: '{members}',
                deep: true,
            },
            get: AbraxaFunctions.getCurrentPortcallMember,
        },
        recordOwner: {
            bind: {
                bindTo: '{members}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    let member = store.queryBy(function (rec, id) {
                        return !rec.get('tenant_id') && !rec.get('invitation_id');
                    }).items[0];

                    return member;
                }
            },
        },
        portcallPermissions: {
            bind: {
                bindTo: '{member}',
                deep: true,
            },
            get: function (member) {
                let mainVM = Ext.getCmp('main-viewport').getVM();
                if (member) {
                    let permissions = member.permissions(),
                        object_permissions = {};

                    permissions.each(function (record) {
                        let slug = record.get('sub_object_slug');
                        object_permissions[slug] = {
                            can_edit: record.get('can_edit'),
                        };
                    });
                    return mainVM.set('objectPermissions', object_permissions);
                } else {
                    return mainVM.set('objectPermissions', null);
                }
            },
        },
        portcallSections: {
            bind: {
                bindTo: '{objectPermissions}',
                deep: true,
            },
            get: function (records) {
                let mainVM = Ext.getCmp('main-viewport').getVM();

                let perms = {
                    accounts: false,
                    appointment: false,
                    disbursements: false,
                    documents: false,
                    husbandry: false,
                    kpis: false,
                    ops: false,
                    overview: false,
                };

                let keys = records && Object.keys(records);

                // If no keys selected: only the overview tab is visible (overview: false)
                if (keys && keys.length >= 0) {
                    perms.accounts = !keys.filter((element) => ['accounts'].includes(element)).length;
                    perms.appointment = !keys.filter((element) => ['appointment'].includes(element)).length;
                    perms.disbursements = !keys.filter((element) => ['disbursements'].includes(element)).length;
                    perms.documents = !keys.filter((element) => ['documents'].includes(element)).length;
                    perms.husbandry = !keys.filter((element) => ['supply', 'crewing'].includes(element)).length;
                    perms.kpis = !keys.filter((element) => ['kpis'].includes(element)).length;
                    perms.ops = !keys.filter((element) => ['general', 'berth', 'sof', 'progress'].includes(element))
                        .length;
                }
                mainVM.set('hideSections', perms);
            },
        },
        opsSectionsFilter: {
            bind: {
                bindTo: '{objectPermissions}',
                deep: true,
            },
            get: function (permissions) {
                let store = this.get('opsSections');
                if (permissions) {
                    if (store) store.clearFilter();

                    store.filter(function (rec) {
                        return Object.keys(permissions).includes(rec.get('subObject'));
                    });

                    if (store.count()) {
                        if (!this.get('selectedOpsSection')) {
                            Ext.ComponentQuery.query('[cls=ops_menu]')[0].select(0);
                        } else {
                            Ext.ComponentQuery.query('[cls=ops_menu]')[0].select(this.get('selectedOpsSection'));
                        }
                    }
                } else {
                    if (store) store.clearFilter();
                }
            },
        },
        husbandrySectionsFilter: {
            bind: {
                bindTo: '{objectPermissions}',
                deep: true,
            },
            get: function (permissions) {
                let store = this.get('husbandrySections');
                if (permissions) {
                    if (store) store.clearFilter();

                    store.filter(function (rec) {
                        return Object.keys(permissions).includes(rec.get('subObject'));
                    });
                    if (store.count()) {
                        if (!this.get('selectedHusbandrySection')) {
                            Ext.ComponentQuery.query('[cls=husbandry_menu]')[0].select(0);
                        } else {
                            Ext.ComponentQuery.query('[cls=husbandry_menu]')[0].select(
                                this.get('selectedHusbandrySection')
                            );
                        }
                    }
                } else {
                    if (store) store.clearFilter();
                }
            },
        },
        etaCountDown: {
            bind: {
                bindTo: '{object_record.port_eta}',
                deep: true,
            },
            get: function (date) {
                let me = this;
                if (date && me) {
                    let portCallTimer;
                    var countDownDate = new Date(date).getTime();
                    if (typeof portCallTimer !== 'undefined') {
                        clearInterval(portCallTimer);
                    }
                    // Update the count down every 1 second
                    portCallTimer = setInterval(function () {
                        // Get today's date and time
                        var now = new Date().getTime();

                        // Find the distance between now and the count down date
                        var distance = countDownDate - now;

                        // Time calculations for days, hours, minutes and seconds
                        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
                        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                        // // Display the result in the element with id="demo"
                        // document.getElementById("demo").innerHTML = days + "d " + hours + "h " +
                        //     minutes + "m " + seconds + "s ";

                        // If the count down is finished, write some text
                        if (distance < 0) {
                            clearInterval(portCallTimer);
                            if (me.data) {
                                me.set('countdown', 'Vessel has arrived');
                            }
                            return;
                        }

                        if (portCallTimer && me && !me.destroying) {
                            me.set(
                                'countdown',
                                '<span>' +
                                    days +
                                    '<em>days</em></span>' +
                                    '<span>' +
                                    hours +
                                    '<em>hrs</em></span>' +
                                    '<span>' +
                                    minutes +
                                    '<em>mins</em></span>'
                            );
                        }
                    }, 1000);
                }
            },
        },
        etaRendererDate: {
            bind: {
                bindTo: '{object_record.port_eta}',
                deep: true,
            },
            get: function (date) {
                if (date) {
                    return moment(date).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        etaOrAta: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    let ATA = record.get('port_ata'),
                        ETA = record.get('port_eta');

                    if (ATA) {
                        return '<span>ATA:</span> ' + moment(ATA).format('ddd Do MMM - H:mm');
                    } else if (ETA) {
                        return '<span>ETA:</span> ' + moment(ETA).format('ddd Do MMM - H:mm');
                    } else {
                        return '<span>ETA:</span> ---';
                    }
                }
            },
        },
        etdOrAtd: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    let ATD = record.get('port_atd'),
                        ETD = record.get('port_etd');

                    if (ATD) {
                        return '<span>ATD:</span> ' + moment(ATD).format('ddd Do MMM - H:mm');
                    } else if (ETD) {
                        return '<span>ETD:</span> ' + moment(ETD).format('ddd Do MMM - H:mm');
                    } else {
                        return '<span>ETD:</span> ---';
                    }
                }
            },
        },
        readOnly: {
            bind: {
                bindTo: '{object_record.members}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    let member_id = this.get('object_record').get('member_id'),
                        member = store.queryBy(function (rec, id) {
                            return rec.get('id') == member_id;
                        }).items[0];

                    if (member) {
                        if (member.get('role') == 'limited access') {
                            this.get('object_record').set('read_only', true);
                        } else {
                            this.get('object_record').set('read_only', false);
                        }
                    }
                }
            },
        },
        vessel: {
            bind: {
                bindTo: '{object_record.voyage}',
                deep: true,
            },
            get: function (voyage) {
                if (voyage) {
                    if (voyage.get('custom_vessel')) {
                        return voyage.get('custom_vessel');
                    } else {
                        return voyage.get('vessel');
                    }
                }
            },
        },
        vesselImage: {
            bind: {
                bindTo: '{vessel}',
                deep: true,
            },
            get: function (vessel) {
                if (vessel) {
                    if (vessel.company_id && vessel.vessel_img) {
                        return vessel.vessel_img;
                    } else {
                        return AbraxaConstants.urls.staticAbraxa + 'ships/' + vessel.imo + '.jpg';
                    }
                }
            },
        },
        cargoesChange: {
            bind: {
                bindTo: '{cargoes}',
                deep: true,
            },
            get: function (store) {
                if (store && store.isLoaded()) {
                    return Date.now();
                }
                return false;
            },
        },
        cargoOpsChange: {
            bind: {
                bindTo: '{cargoOps}',
                deep: true,
            },
            get: function (store) {
                if (store && store.isLoaded()) {
                    return Date.now();
                }
                return false;
            },
        },
        cargoesTotal: {
            bind: {
                cargo_ops: '{cargoOpsChange}',
                cargoes: '{cargoesChange}',
            },
            get: function (stores) {
                let data = [];
                if (stores.cargo_ops && stores.cargoes) {
                    let cargoes = this.get('cargoes').getRange(),
                        store = this.get('cargoOps');
                    Ext.Array.each(cargoes, function (value) {
                        let result = {};
                        result.commodity = value.get('commodity');
                        result.cargo_id = value.get('id');
                        result.unit = value.get('unit');
                        result.quantity = value.get('quantity');
                        result.function = value.get('function');
                        result.function_abbr = value.get('function_abbr');
                        let filtered = store.queryBy(function (rec, id) {
                            return rec.get('cargo_id') == value.get('id');
                        }).items;
                        if (filtered.length > 0) {
                            var sum = filtered.reduce(function (a, b) {
                                return a + b.get('handled');
                            }, 0);
                            filtered.sort(function (a, b) {
                                return a.get('date') - b.get('date');
                            });
                            result.sum = sum;
                            if (filtered.length == 1) {
                                result.days = 0;
                            } else {
                                let first = filtered[0],
                                    last = filtered.pop();
                                var duration = moment.duration(
                                    moment(last.get('date')).diff(moment(first.get('date')))
                                );
                                result.days = numeral(duration.asDays()).format('0.[0]');
                            }
                        } else {
                            result.sum = 0;
                            result.days = 0;
                            result.unit = null;
                        }
                        data.push(result);
                    });
                }
                return data;
            },
        },
        loadCargoChart: {
            bind: {
                bindTo: '{object_record}',
            },
            get: function (record) {
                if (
                    record &&
                    record.get('id') &&
                    Ext.isNumber(parseInt(record.get('id'))) &&
                    record.$className == 'Abraxa.model.portcall.Portcall'
                ) {
                    let chart = Ext.ComponentQuery.query('[itemId=cargoChart]')[0];
                    //dirty hack to set proxy on expenses
                    //sometimes bug in focus leave in disb grid
                    //DEV-694 IN JIR-a
                    // if (this.get('expenses')) {
                    //     this.get('expenses').getProxy().setExtraParams({
                    //         portcall_id: record.get('id')
                    //     });
                    // }
                    if (chart) {
                        let fusionchart = chart.getFusionChart();
                        Ext.Ajax.request({
                            url: Env.ApiEndpoint + 'kpi/cargo/3/' + record.get('id'),
                            method: 'GET',
                            success: function (response) {
                                if (response) {
                                    var obj = Ext.decode(response.responseText);
                                    if (fusionchart && !fusionchart.disposed) {
                                        if (obj) {
                                            fusionchart.setJSONData(obj);
                                        }
                                    }
                                }
                            },
                            failure: function failure(response) {},
                        });
                    }
                }
            },
        },
        loadProspectsChart: {
            bind: {
                bindTo: '{object_record}',
            },
            get: function (record) {
                if (
                    record &&
                    record.get('id') &&
                    Ext.isNumber(parseInt(record.get('id'))) &&
                    record.$className == 'Abraxa.model.portcall.Portcall'
                ) {
                    let chart = Ext.ComponentQuery.query('[itemId=prospectChart]')[0];
                    if (chart) {
                        let fusionchart = chart.getFusionChart();
                        Ext.Ajax.request({
                            url: Env.ApiEndpoint + 'kpi/portcall-prospects/' + record.get('id'),
                            method: 'GET',
                            success: function (response) {
                                var obj = Ext.decode(response.responseText);
                                if (fusionchart && !fusionchart.disposed) {
                                    if (obj) {
                                        fusionchart.setJSONData(obj);
                                    }
                                }
                            },
                            failure: function failure(response) {},
                        });
                    }
                }
            },
        },
        vesselTitle: {
            bind: {
                bindTo: '{vessel}',
                deep: true,
            },
            get: function (vessel) {
                if (vessel) {
                    let flag = null,
                        voyage = this.get('object_record').getVoyage();

                    if (voyage && vessel && vessel.flags && vessel.flags.country_code) {
                        flag =
                            'src="' +
                            AbraxaConstants.urls.staticAbraxa +
                            'flags/1x1/' +
                            vessel.flags.country_code.toLocaleLowerCase() +
                            '.svg"';
                    }
                    return (
                        '<img height=24" ' +
                        flag +
                        '  title="" alt=""/><div><div class="vessel-imo">IMO: ' +
                        vessel.imo +
                        '</div><a href="javascript:void(0);" class="vessel-name vessel">' +
                        voyage.get('vessel_name') +
                        '</a></div>'
                    );
                }
            },
        },
        editableSupplyPermissions: {
            bind: {
                bindTo: '{objectPermissions}',
                deep: true,
            },
            get: function (permissions) {
                if (permissions) {
                    let generalPermission = Object.keys(permissions).includes('supply');
                    if (generalPermission) {
                        if (permissions['supply'] && !permissions['supply'].can_edit) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
                return true;
            },
        },
        editableDisbursementPermissions: {
            bind: {
                bindTo: '{objectPermissions}',
                deep: true,
            },
            get: function (permissions) {
                if (permissions) {
                    let generalPermission = Object.keys(permissions).includes('supply');
                    if (generalPermission) {
                        if (permissions['disbursements'] && !permissions['disbursements'].can_edit) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
                return true;
            },
        },
        totalCargoes: {
            bind: {
                bindTo: '{object_record.cargoes}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    let unit = '',
                        quantity = 0,
                        cargo_unit = store.collect('unit');

                    if (cargo_unit.length) {
                        if (cargo_unit.length > 1) {
                            unit = '';
                        } else {
                            unit = cargo_unit[0];
                        }
                    }
                    store.each(function (value) {
                        quantity += parseInt(value.get('quantity'));
                    });
                    if (quantity) {
                        quantity = numeral(quantity).format('0,0.[000]');
                    } else {
                        quantity = AbraxaConstants.placeholders.emptyValue;
                    }
                    return quantity + ' ' + unit;
                }
            },
        },
        totalCargoOps: {
            bind: {
                bindTo: '{cargoOps}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    let unit = '',
                        quantity = 0,
                        cargo_unit = store.collect('handled_unit');
                    if (cargo_unit.length) {
                        if (cargo_unit.length > 1) {
                            unit = '';
                        } else {
                            unit = cargo_unit[0];
                        }
                    }
                    store.each(function (value) {
                        quantity += parseInt(value.get('handled'));
                    });
                    if (quantity) {
                        quantity = numeral(quantity).format('0,0.[000]');
                    } else {
                        quantity = AbraxaConstants.placeholders.emptyValue;
                    }
                    return quantity + ' ' + unit;
                }
            },
        },
        portFunction: {
            bind: {
                bindTo: '{object_record.nomination}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    return record.get('port_function');
                }
            },
        },
        // hideInstructions: {
        //     bind: {
        //         bindTo: '{instructions}',
        //         deep: true
        //     },
        //     get: function (instructions) {
        //         if (instructions) {
        //             if (!instructions.get('title') && !instructions.get('text')) {
        //                 return true;
        //             }
        //         }
        //         return false;
        //     }
        // },
        dateReceived: {
            bind: {
                bindTo: '{object_record.nomination.date_received}',
                deep: true,
            },
            get: function (date) {
                if (date) {
                    return moment(date).format(AbraxaConstants.formatters.date.dayMonYearHyphenTime24);
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        relatedObjects: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (rec) {
                let data = [];
                if (rec) {
                    let vouchers = this.get('vouchers'),
                        disbursements = this.get('disbursements');

                    if (vouchers && vouchers.count()) {
                        vouchers.each(function (rec) {
                            data.push(rec);
                        });
                    }
                    if (disbursements && disbursements.count()) {
                        disbursements.each(function (rec) {
                            data.push(rec);
                        });
                    }
                }
                return data;
            },
        },
        suggestedOrganizationsRequest: {
            bind: {
                bindTo: '{object_record.port_id}',
            },
            get: async function (port_id) {
                let vm = this,
                    filter = [
                        {
                            property: 'port_id',
                            value: port_id,
                            operator: '=',
                        },
                    ];
                if (port_id) {
                    Ext.Ajax.request({
                        url: Env.ApiEndpoint + 'suggested-organizations',
                        method: 'GET',
                        params: {
                            filter: JSON.stringify(filter),
                        },
                        success: function (response) {
                            if (response) {
                                vm.get('suggestedOrganizations').add(Ext.decode(response.responseText));
                            }
                        },
                        failure: function failure(response) {},
                    });
                }
            },
        },
        crewingsRealCount: {
            bind: {
                bindTo: '{crewings}',
                deep: true,
            },
            get: function (store) {
                return store
                    .queryBy(function (rec) {
                        return rec;
                    })
                    .getCount();
            },
        },
        assignTo: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    if (record.get('assigned_to')) {
                        let storeUsers = this.get('users');
                        let recordUser = storeUsers.findRecord('id', record.get('assigned_to'));
                        if (recordUser) {
                            var assigned_to = recordUser.get('first_name')[0] + '. ' + recordUser.get('last_name');
                            let str = '<span class="a-int">' + recordUser.get('abbr') + '</span>';
                            if (recordUser.get('profile_image') && recordUser.get('profile_image') != '') {
                                let img = recordUser.get('profile_image');
                                str =
                                    '<img data-id="last_updated_by_appointments" class="a-profile-image" height="24" src="' +
                                    img +
                                    '">';
                            }

                            return (
                                '<div class="a-person a-icon-round">' +
                                str +
                                ' ' +
                                '<a class="a-person a_grid_action person_details" href="javascript:void(0)">' +
                                assigned_to +
                                '</a></div>'
                            );
                        } else {
                            return AbraxaConstants.placeholders.emptyValue;
                        }
                    }
                }
            },
        },
        sofEventsPlugins: {
            bind: {
                bindTo: '{nonEditable}',
                deep: true,
            },
            get: function (nonEditable) {
                let result = false,
                    store = this.get('userPermissions'),
                    objectPermissions = this.get('objectPermissions');

                if (!nonEditable) {
                    if (store && Object.keys(store).length > 0) {
                        let record = store['portcallOpsSof'];
                        if (record && record.edit) {
                            return ['sofrowedit', 'gridexporter'];
                        } else {
                            return null;
                        }
                    }
                } else {
                    if (objectPermissions && objectPermissions['sof']) {
                        if (objectPermissions['sof'].can_edit) {
                            result = ['sofrowedit', 'gridexporter'];
                        }
                        if (store && Object.keys(store).length > 0) {
                            let record = store['sof'];
                            if (record && !record.edit) {
                                result = null;
                            }
                        }
                    }
                }
                return result;
            },
        },
        subObjects: {
            bind: {
                bindTo: '{object_record.updated_at}',
                deep: true,
            },
            get: function (date) {
                if (date) {
                    let record = this.get('object_record'),
                        data = [];

                    if (record) {
                        switch (this.get('routeHash')) {
                            case '#portcall':
                                let cargoes = record.cargoes(),
                                    berths = record.berths(),
                                    crewings = record.crewings(),
                                    folders = record.folders(),
                                    expenses = record.expenses(),
                                    payments = record.payments(),
                                    disbursements = record.disbursements(),
                                    docs = record.documents();

                                docs.each(function (document, index) {
                                    let doc = document.getData();
                                    doc.name = document.get('name');
                                    doc.type = 'file';
                                    doc.subOject = 'portcallDocuments';
                                    doc.icon = 'md-icon-description';
                                    doc.model = doc.model_name;
                                    doc.subobject_id = doc.id;
                                    data.push(doc);
                                });

                                cargoes.each(function (record, index) {
                                    let cargo = record.getData();

                                    cargo.name = cargo.commodity;
                                    cargo.type = 'cargo';
                                    cargo.subOject = 'portcallAppointmentCargo';
                                    cargo.icon = 'abraxa-icon-cargo';
                                    cargo.model = 'App\\Models\\Cargo\\Cargo';
                                    cargo.subobject_id = cargo.id;
                                    data.push(cargo);
                                });

                                berths.each(function (record, index) {
                                    var berth = record.getData();
                                    berth.name = berth.name;
                                    berth.type = 'berth';
                                    berth.subOject = 'portcallOpsBerths';
                                    berth.icon = 'md-icon-outlined md-icon-place';
                                    berth.model = 'App\\Models\\Berth\\Berth';
                                    berth.subobject_id = berth.id;
                                    data.push(berth);
                                });

                                crewings.each(function (record, index) {
                                    var crew = record.getData();
                                    crew.name = crew.name;
                                    crew.icon = 'md-icon-person';
                                    crew.type = 'user';
                                    crew.subOject = 'portcallCrewing';
                                    crew.model = crew.model_name;
                                    crew.subobject_id = crew.id;
                                    data.push(crew);
                                });

                                disbursements.each(function (record, index) {
                                    var disbursement = record.getData();
                                    disbursement.name = disbursement.name;
                                    disbursement.icon = 'md-icon-attach-money';
                                    disbursement.type = 'disbursement';
                                    disbursement.subOject = 'portcallDisbursements';
                                    disbursement.model = disbursement.model_name;
                                    disbursement.subobject_id = disbursement.id;

                                    data.push(disbursement);
                                });

                                payments.each(function (record, index) {
                                    var payment = record.getData();
                                    payment.subOject = 'portcallPayments';
                                    payment.model = payment.model_name;
                                    switch (payment.kind) {
                                        case 'incoming':
                                            payment.name = 'Incoming payment from ' + payment.org_name;
                                            payment.icon = 'md-icon-outlined md-icon-add';
                                            break;
                                        case 'outgoing':
                                            payment.name = 'Outgoing payment to ' + payment.org_name;
                                            payment.icon = 'md-icon-outlined md-icon-remove';
                                            break;
                                        case 'requested':
                                            payment.name = 'Request payment from ' + payment.org_name;
                                            payment.icon = 'md-icon-outlined md-icon-inventory';
                                            break;
                                        default:
                                            break;
                                    }
                                    payment.subobject_id = payment.id;
                                    payment.type = payment.kind;

                                    data.push(payment);
                                });

                                expenses.each(function (record, index) {
                                    let expense = record.getData();
                                    // switch (supply.type) {
                                    //     case 'services':
                                    //         supply.icon = 'abraxa-icon-atm';
                                    //         supply.type = 'service';
                                    //         supply.subOject = 'supply';
                                    //         break;
                                    //     case 'supplies':
                                    //         supply.icon = 'abraxa-icon-layers';
                                    //         supply.type = 'supply';
                                    //         supply.subOject = 'supply';
                                    //         break;
                                    //     case 'disposal':
                                    //         supply.icon = 'abraxa-icon-recycle';
                                    //         supply.type = 'disposal';
                                    //         supply.subOject = 'supply';
                                    //         break;
                                    //     case 'bunkers':
                                    //         supply.icon = 'abraxa-icon-oil';
                                    //         supply.type = 'bunker';
                                    //         supply.subOject = 'supply';
                                    //         break;
                                    //     default:
                                    //         // code block
                                    // }
                                    if (expense.default_expense_item_id) {
                                        expense.name = expense.default_expense_item.name;
                                        expense.model = expense.model_name;
                                        expense.icon = 'abraxa-icon-layers';
                                        expense.type = 'service';
                                        expense.subOject = 'portcallServices';
                                        expense.subobject_id = expense.id;
                                        data.push(expense);
                                    }
                                });
                                break;
                            case '#company':
                                let contacts = record.contacts(),
                                    documents = record.attachments();

                                contacts.each(function (record, index) {
                                    let contact = record.getData();

                                    contact.name = contact.contact_first_name + ' ' + contact.contact_last_name;
                                    contact.type = 'user';
                                    contact.subOject = 'cdbContacts';
                                    contact.icon = 'md-icon-person';
                                    contact.model = 'App\\Models\\Organization\\Contact';
                                    contact.subobject_id = contact.contact_id;
                                    contact.id = contact.contact_id;
                                    data.push(contact);
                                });
                                documents.each(function (document, index) {
                                    let doc = document.getData();
                                    doc.name = document.get('name');
                                    doc.type = 'file';
                                    doc.subOject = 'cdbFiles';
                                    doc.icon = 'md-icon-description';
                                    doc.model = doc.model_name;
                                    doc.subobject_id = doc.id;
                                    data.push(doc);
                                });
                                break;
                        }
                    }
                    return data;
                }
            },
        },
        editableAppointingParty: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (portcall) {
                let store = this.get('userPermissions'),
                    nonEditable = this.get('nonEditable'),
                    objectPermissions = this.get('objectPermissions'),
                    result = false;
                if (portcall && portcall.get('originated_by')) {
                    return true;
                } else {
                    if (!nonEditable) {
                        if (store && Object.keys(store).length > 0) {
                            let record = store['portcallAppointmentNominationInfo'];
                            if (record && record.edit) {
                                result = false;
                            } else {
                                result = true;
                            }
                        }
                    } else {
                        if (objectPermissions && objectPermissions['appointment']) {
                            if (objectPermissions['appointment'].can_edit) {
                                if (store && Object.keys(store).length > 0) {
                                    let record = store['portcallAppointmentNominationInfo'];
                                    if (record && !record.edit) {
                                        result = true;
                                    } else {
                                        result = false;
                                    }
                                }
                            }
                        }
                    }
                }
                return result;
            },
        },
        editableVoyageNumber: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (portcall) {
                let store = this.get('userPermissions'),
                    nonEditable = this.get('nonEditable'),
                    objectPermissions = this.get('objectPermissions'),
                    result = false;
                if (portcall && portcall.get('originated_by')) {
                    return true;
                } else {
                    if (!nonEditable) {
                        if (store && Object.keys(store).length > 0) {
                            let record = store['portcallNominationVoyageNumber'];
                            if (record && record.edit) {
                                result = false;
                            } else {
                                result = true;
                            }
                        }
                    } else {
                        if (objectPermissions && objectPermissions['appointment']) {
                            if (objectPermissions['appointment'].can_edit) {
                                if (store && Object.keys(store).length > 0) {
                                    let record = store['portcallNominationVoyageNumber'];
                                    if (record && !record.edit) {
                                        result = true;
                                    } else {
                                        result = false;
                                    }
                                }
                            }
                        }
                    }
                }
                return result;
            },
        },
        editableDataReceived: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (portcall) {
                let store = this.get('userPermissions'),
                    nonEditable = this.get('nonEditable'),
                    objectPermissions = this.get('objectPermissions'),
                    result = false;
                if (portcall && portcall.get('originated_by')) {
                    return true;
                } else {
                    if (!nonEditable) {
                        if (store && Object.keys(store).length > 0) {
                            let record = store['portcallNominationDateReceived'];
                            if (record && record.edit) {
                                result = false;
                            } else {
                                result = true;
                            }
                        }
                    } else {
                        if (objectPermissions && objectPermissions['appointment']) {
                            if (objectPermissions['appointment'].can_edit) {
                                if (store && Object.keys(store).length > 0) {
                                    let record = store['portcallNominationDateReceived'];
                                    if (record && !record.edit) {
                                        result = true;
                                    } else {
                                        result = false;
                                    }
                                }
                            }
                        }
                    }
                }
                return result;
            },
        },
        editablePortFunction: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (portcall) {
                let store = this.get('userPermissions'),
                    nonEditable = this.get('nonEditable'),
                    objectPermissions = this.get('objectPermissions'),
                    result = false;
                if (portcall && portcall.get('originated_by')) {
                    return true;
                } else {
                    if (!nonEditable) {
                        if (store && Object.keys(store).length > 0) {
                            let record = store['portcallAppointmentNominationInfo'];
                            if (record && record.edit) {
                                result = false;
                            } else {
                                result = true;
                            }
                        }
                    } else {
                        if (objectPermissions && objectPermissions['appointment']) {
                            if (objectPermissions['appointment'].can_edit) {
                                if (store && Object.keys(store).length > 0) {
                                    let record = store['portcallAppointmentNominationInfo'];
                                    if (record && !record.edit) {
                                        result = true;
                                    } else {
                                        result = false;
                                    }
                                }
                            }
                        }
                    }
                }
                return result;
            },
        },
        editableAgencyType: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (portcall) {
                let store = this.get('userPermissions'),
                    nonEditable = this.get('nonEditable'),
                    objectPermissions = this.get('objectPermissions'),
                    result = false;
                if (portcall && portcall.get('originated_by')) {
                    return true;
                } else {
                    if (!nonEditable) {
                        if (store && Object.keys(store).length > 0) {
                            let record = store['portcallAppointmentNominationInfo'];
                            if (record && record.edit) {
                                result = false;
                            } else {
                                result = true;
                            }
                        }
                    } else {
                        if (objectPermissions && objectPermissions['appointment']) {
                            if (objectPermissions['appointment'].can_edit) {
                                if (store && Object.keys(store).length > 0) {
                                    let record = store['portcallAppointmentNominationInfo'];
                                    if (record && !record.edit) {
                                        result = true;
                                    } else {
                                        result = false;
                                    }
                                }
                            }
                        }
                    }
                }
                return result;
            },
        },
        editableVesselName: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (portcall) {
                let store = this.get('userPermissions'),
                    nonEditable = this.get('nonEditable'),
                    objectPermissions = this.get('objectPermissions'),
                    result = false;
                if (portcall && portcall.get('originated_by')) {
                    return true;
                } else {
                    if (!nonEditable) {
                        if (store && Object.keys(store).length > 0) {
                            let record = store['portcall'];
                            if (record && record.edit) {
                                result = false;
                            } else {
                                result = true;
                            }
                        }
                    } else {
                        if (objectPermissions && objectPermissions['appointment']) {
                            if (objectPermissions['appointment'].can_edit) {
                                if (store && Object.keys(store).length > 0) {
                                    let record = store['portcall'];
                                    if (record && !record.edit) {
                                        result = true;
                                    } else {
                                        result = false;
                                    }
                                }
                            }
                        }
                    }
                }
                return result;
            },
        },
        editablePortName: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (portcall) {
                let store = this.get('userPermissions'),
                    nonEditable = this.get('nonEditable'),
                    objectPermissions = this.get('objectPermissions'),
                    result = false;
                if (portcall && portcall.get('originated_by')) {
                    return true;
                } else {
                    if (!nonEditable) {
                        if (store && Object.keys(store).length > 0) {
                            let record = store['portcallAppointmentGeneralInfo'];
                            if (record && record.edit) {
                                result = false;
                            } else {
                                result = true;
                            }
                        }
                    } else {
                        if (objectPermissions && objectPermissions['appointment']) {
                            if (objectPermissions['appointment'].can_edit) {
                                if (store && Object.keys(store).length > 0) {
                                    let record = store['portcallAppointmentGeneralInfo'];
                                    if (record && !record.edit) {
                                        result = true;
                                    } else {
                                        result = false;
                                    }
                                }
                            }
                        }
                    }
                }
                return result;
            },
        },
    },
});
