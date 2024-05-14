import '../../../store/common/Organizations.jsx';
import '../../../store/common/OrganizationsRemote.jsx';
import '../../../store/common/City.jsx';
import '../../../store/company/CreditRatings.jsx';
import '../../../store/common/DefaultExpenseItems.jsx';
import '../../../store/company/CompanyPortcalls';
import moment from 'moment';

Ext.define('Abraxa.view.cdb.company.CompanyViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.company-viewmodel',
    data: {
        balance: null,
        months: null,
        deals: null,
        newUpdate: null,
        currentMonth: new Date().getMonth() + 1,
    },
    stores: {
        parentCompanyStore: {
            type: 'organizations.remote',
            autoLoad: true,
        },
        cityStore: {
            type: 'cityStore',
        },
        companyPortcalls: {
            type: 'company_portcalls',
            autoLoad: true,
            proxy: {
                extraParams: {
                    org_id: '{object_record.org_id}',
                    month: '{currentMonth}',
                },
            },
            updateProxy: function (proxy) {
                if (proxy) {
                    proxy.onAfter(
                        'extraparamschanged',
                        function () {
                            if (this.getProxy().getExtraParams().org_id) this.load();
                        },
                        this
                    );
                }
            },
        },
        creditRatings: {
            type: 'credit_ratings',
            autoLoad: true,
        },
        defaultExpenseItems: {
            type: 'default-expense-items',
            autoLoad: true,
        },
        phones: {
            source: '{object_record.phones}',
            extraParams: {
                org_id: '{object_record.org_id}',
            },
        },
    },
    formulas: {
        activeAppointmentsHtml: {
            bind: {
                bindTo: '{deals}',
                deep: true,
            },
            get: function (deals) {
                let count = 0;
                if (deals && deals.appointed_active) {
                    count = deals.appointed_active;
                }
                return `<strong>${count} ${AbraxaFunctions.toPlural('appointment', count, 's', 'em')}</strong>`;
            },
        },
        totalAppointmentsHtml: {
            bind: {
                bindTo: '{deals}',
                deep: true,
            },
            get: function (deals) {
                let count = 0;
                if (deals && deals.appointed_total) {
                    count = deals.appointed_total;
                }
                return `<div class="sm-title">out of <strong>${count}</strong> ${AbraxaFunctions.toPlural('appointment', count, 's', '')}</div>`;
            },
        },
        activeNominationsHtml: {
            bind: {
                bindTo: '{deals}',
                deep: true,
            },
            get: function (deals) {
                let count = 0;
                if (deals && deals.nominated_active) {
                    count = deals.nominated_active;
                }
                return `<strong>${count} ${AbraxaFunctions.toPlural('nomination', count, 's', 'em')}</strong>`;
            },
        },
        totalNominationsHtml: {
            bind: {
                bindTo: '{deals}',
                deep: true,
            },
            get: function (deals) {
                let count = 0;
                if (deals && deals.nominated_total) {
                    count = deals.nominated_total;
                }
                return `<div class="sm-title">out of <strong>${count}</strong> ${AbraxaFunctions.toPlural('nomination', count, 's', '')}</div>`;
            },
        },
        viewAllAppointmentsLinkHidden: {
            bind: {
                bindTo: '{deals}',
                deep: true,
            },
            get: function (deals) {
                return !deals || !deals.appointed_total;
            },
        },
        viewAllNominationsLinkHidden: {
            bind: {
                bindTo: '{deals}',
                deep: true,
            },
            get: function (deals) {
                return !deals || !deals.nominated_total;
            },
        },
        removeMask: {
            bind: {
                bindTo: '{object_record}',
            },
            get: function (record) {
                if (record) {
                    Ext.getCmp('main-viewport').setMasked(false);
                    if (
                        !Ext.ComponentQuery.query('[itemId=financialsMain]')[0]
                            .getVM()
                            .get('financials_menu.selection') &&
                        Ext.ComponentQuery.query('[cls~=financials_menu]')[0]
                    ) {
                        Ext.ComponentQuery.query('[cls~=financials_menu]')[0].select(0);
                    }
                    if (
                        !Ext.ComponentQuery.query('[itemId=contactsMain]')[0].getVM().get('contacts_menu.selection') &&
                        Ext.ComponentQuery.query('[cls~=contacts_menu]')[0]
                    ) {
                        Ext.ComponentQuery.query('[cls~=contacts_menu]')[0].select(0);
                    }
                    // Ext.getCmp('main-viewport').getVM().set('object_record', this.getView().getRecord());
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
                    var mainVM = Ext.getCmp('main-viewport').getVM();
                    store.setRemoteFilter(false);
                    store.getProxy().setExtraParams({
                        object_id: 2,
                        object_meta_id: record.get('org_id'),
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
                    mainVM.set('notes', store);
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
        documents: {
            bind: {
                bindTo: '{object_record.attachments}',
                deep: true,
            },
            get: function get(store) {
                if (store) {
                    return store;
                }
            },
        },
        activeCompanyTab: {
            bind: {
                bindTo: '{routeExtraParams}',
                deep: true,
            },
            get: function (tab) {
                switch (tab) {
                    case 'contacts':
                        tab = 1;
                        break;
                    case 'financial':
                        tab = 2;
                        break;
                    case 'agreements':
                        tab = 3;
                        break;
                    case 'compliance':
                        tab = 4;
                        break;
                    case 'files':
                        tab = 5;
                        break;
                    default:
                        tab = 0;
                }
                var mainVM = Ext.getCmp('main-viewport').getVM();
                mainVM.set('activeCompanyTab', tab);
                return tab;
            },
        },
        dragListeners: {
            bind: {
                bindTo: '{userPermissions}',
                deeP: true,
            },
            get: function (store) {
                if (store && Object.keys(store).length > 0) {
                    let record = store['cdbFiles'];
                    if (record && record.edit) {
                        return {
                            element: 'element',
                            drop: 'onDrop',
                            dragleave: 'onDragLeaveListItem',
                            dragover: 'onDragOverListItem',
                        };
                    } else {
                        return {};
                    }
                } else {
                    return {};
                }
            },
        },
        getBalance: {
            bind: {
                bindTo: '{object_record}',
            },
            get: function (company) {
                let me = this;
                if (company && Ext.isNumber(company.get('org_id'))) {
                    Ext.Ajax.request({
                        url: Env.ApiEndpoint + 'organizations/' + company.get('org_id') + '/balance',
                        method: 'GET',
                        success: function (response) {
                            var obj = Ext.decode(response.responseText);
                            if (me) {
                                me.set('balance', obj);
                            }
                        },
                        failure: function failure(response) {},
                    });
                }
            },
        },
        formatBalance: {
            bind: {
                bindTo: '{balance}',
                deep: true,
            },
            get: function (balance) {
                if (balance) {
                    return numeral(Math.abs(balance.total)).format('0,000');
                }
            },
        },
        balanceTotalCls: {
            bind: {
                bindTo: '{balance}',
                deep: true,
            },
            get: function (balance) {
                if (balance) {
                    if (balance.total) {
                        let currentUserType = this.get('currentUserType'),
                            colorCls = '';
                        if (currentUserType == 'agent') {
                            if (Ext.isNumber(balance.total)) {
                                if (Ext.Number.sign(balance.total) === -1) {
                                    colorCls = 'a-positive-value';
                                }
                                if (Ext.Number.sign(balance.total) === 1) {
                                    colorCls = 'a-negative-value';
                                }
                            }
                        } else {
                            if (Ext.isNumber(balance.total)) {
                                if (Ext.Number.sign(balance.total) === -1) {
                                    colorCls = 'a-negative-value';
                                }
                                if (Ext.Number.sign(balance.total) === 1) {
                                    colorCls = 'a-positive-value';
                                }
                            }
                        }
                        return colorCls;
                    }
                }
            },
        },
        balanceDebitCredit: {
            bind: {
                bindTo: '{balance}',
                deep: true,
            },
            get: function (balance) {
                if (balance) {
                    if (balance.total) {
                        let currentUserType = this.get('currentUserType'),
                            value = 'debit';
                        if (currentUserType == 'agent') {
                            if (Ext.isNumber(balance.total)) {
                                if (Ext.Number.sign(balance.total) === -1) {
                                    value = 'credit';
                                }
                            }
                        } else {
                            if (Ext.isNumber(balance.total)) {
                                if (Ext.Number.sign(balance.total) === -1) {
                                    value = 'debit';
                                } else {
                                    value = 'credit';
                                }
                            }
                        }
                        return '(' + value + ')';
                    }
                }
                return '';
            },
        },
        balanceCurrency: {
            bind: {
                bindTo: '{balance}',
                deep: true,
            },
            get: function (balance) {
                if (balance) {
                    return balance.currency.toUpperCase();
                }
            },
        },
        loadPortcallsChart: {
            bind: {
                bindTo: '{object_record}',
            },
            get: function (company) {
                let me = this;
                if (company && Ext.isNumber(company.get('org_id'))) {
                    let chart = Ext.ComponentQuery.query('[itemId=companyPortcallsChart]')[0];
                    if (chart) {
                        let fusionchart = chart.getFusionChart();
                        Ext.Ajax.request({
                            url: Env.ApiEndpoint + 'organizations/' + company.get('org_id') + '/portcalls_chart',
                            method: 'GET',
                            success: function (response) {
                                let obj = Ext.decode(response.responseText);
                                if (fusionchart && !fusionchart.disposed) {
                                    if (obj) {
                                        me.set('months', obj.months);
                                        delete obj.months;
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
        deals: {
            bind: {
                bindTo: '{object_record.deals}',
            },
            get: function (deals) {
                return deals;
            },
        },
        calcDeals: {
            bind: {
                bindTo: '{deals}',
                deep: true,
            },
            get: function (deals) {
                if (deals) {
                    let company_deals = 0,
                        percentage = 0,
                        all_deals = 0,
                        stroke,
                        strokeOffset;
                    company_deals = deals.deals;
                    all_deals = deals.all_deals;
                    percentage = 100 * (company_deals / all_deals);
                    (stroke = all_deals == all_deals ? '#22B14C' : '#FFC107'), (strokeOffset = 100);

                    if (percentage > 0) {
                        strokeOffset = 100 - percentage;
                    }
                    return {
                        total: all_deals,
                        company_deals: company_deals,
                        percentage: percentage,
                        stroke: stroke,
                        strokeOffset: strokeOffset,
                        formatPercent: parseFloat(percentage).toFixed(2) + '%',
                    };
                }
            },
        },
        periodString: {
            get: function () {
                let startOfYear = moment().startOf('year').format('MMM DD, YYYY'),
                    endOfYear = moment().endOf('year').format('MMM DD, YYYY');
                return startOfYear + ' - ' + endOfYear;
            },
        },
        reportingCurrency: {
            bind: {
                bindTo: '{object_record.preferred_currency}',
                deep: true,
            },
            get: function (currency) {
                if (currency) {
                    let companyCurrencies = this.get('companyCurrencies');
                    let currencyRecord = companyCurrencies.findRecord('currency', currency, 0, false, false, true);
                    if (currencyRecord) {
                        return currencyRecord;
                    }
                }
            },
        },
        compliance: {
            bind: {
                bindTo: '{object_record}',
            },
            get: function (record) {
                if (record && record.get('org_id')) {
                    let compliance = record.getCompliance(),
                        currentUser = this.get('currentUser');

                    if (!compliance) {
                        compliance = Ext.create('Abraxa.model.cdb.Compliance', {
                            status: 'not verified',
                            organization_id: record.get('org_id'),
                        });
                        compliance.save({
                            success: function () {
                                record.setCompliance(compliance);
                                record.set('updated_at', new Date());
                                record.set('updated_by_user', currentUser.getData());
                            },
                        });
                    } else {
                        if (
                            compliance.get('expiration_date') &&
                            compliance.get('expiration_date') <= new Date() &&
                            compliance.get('status') == 'verified'
                        ) {
                            compliance.set('status', 'not verified');
                            compliance.save({
                                success: function () {
                                    Ext.toast('Record updated');
                                },
                            });
                            Ext.create('Ext.MessageBox', {
                                ui: 'danger',
                                title: 'Compliance expiration',
                                innerCls: 'a-bgr-white',
                                message:
                                    'Your compliance check for <b>' +
                                    record.get('org_name') +
                                    '</b> has expired.<br>The client has been now moved under "Not verified" status.<br>New compliance check is now required.',
                                width: 500,
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
                                                this.up('dialog').destroy();
                                            },
                                        },
                                    ],
                                },
                            }).show();
                        }
                    }
                    return compliance;
                }
            },
        },
        updateObjectRecord: {
            bind: {
                bindTo: '{newUpdate}',
                deep: true,
            },
            get: function (update) {
                if (update) {
                    let object_record = this.get('object_record'),
                        currentUser = this.get('currentUser');
                    object_record.set('updated_by_user', currentUser.getData());
                    object_record.set('updated_at', new Date());
                    object_record.save();
                }
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
    },
});
