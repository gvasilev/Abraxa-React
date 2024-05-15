import '../model/common/Company.jsx';
import '../store/document/Document.jsx';
import '../view/documents/DocumentDialog.jsx';
Ext.define('Abraxa.controller.AbraxaController', {
    extend: 'Ext.app.Controller',

    previewFile: function (cmp, selectedFile, store, attachment = null, publicBucket = false) {
        var documentStore = Ext.create('Abraxa.store.document.Document');

        documentStore.add(store);

        let vm = cmp.upVM(),
            dialog = Ext.create('Abraxa.view.documents.DocumentDialog', {
                viewModel: {
                    data: {
                        documentForSelect: selectedFile,
                        selectedDocuments: documentStore,
                        needsPanel: false,
                        object_record: vm.get('object_record'),
                        isReadOnly: true,
                        nonEditable: vm.get('isDocumentReadOnly') || null,
                        attachment: attachment,
                    },
                    formulas: {
                        selectedDocument: {
                            bind: {
                                bindTo: '{documentsList.selection}',
                            },
                            get: function (record) {
                                return record;
                            },
                        },
                        loadDodument: {
                            bind: {
                                bindTo: '{selectedDocument.id}',
                                // deep: true
                            },
                            get: function (id) {
                                let record = this.get('selectedDocument');
                                if (record) {
                                    // Ext.ComponentQuery.query('[cls~=pdf-preview]')[0].setMasked(true);
                                    var me = this;
                                    let file = record,
                                        pdf = record.get('pdf') ? true : false;
                                    const url = `${Env.ApiEndpoint}get_pdf/${record.get('id')}${
                                        publicBucket ? '/' + publicBucket : ''
                                    }`;
                                    me.getView().getController().loadDocument(url);

                                    // if (!pdf) {
                                    //     record.loadPDF2().then(function (blob) {
                                    //         let test = {
                                    //             blob: blob,
                                    //             name: record.get('name') + '.' + file.get('extension'),
                                    //         };
                                    //         me.getView().getController().loadDocument(test);
                                    //     });
                                    // } else {
                                    //     // console.log('this fucks it up');
                                    //     let blob = record.get('pdf');
                                    //     let test = {
                                    //         blob: blob,
                                    //         name: record.get('name') + '.' + file.get('extension'),
                                    //     };
                                    //     me.getView().getController().loadDocument(test);
                                    // }
                                }
                            },
                        },
                    },
                },
            });
        dialog.show();
    },

    /**
     * Need to pass invitation model instantion
     */
    showInviteDialog(invitation) {
        if (invitation) {
            let mainVM = Ext.getCmp('main-viewport').getViewModel(),
                dialog = Ext.create('Abraxa.view.invitations.invite.InvitationMainDialog', {
                    viewModel: {
                        parent: mainVM,
                    },
                }),
                bodyItem = dialog.getItems().getAt(0),
                vm = bodyItem.getVM();
            vm.set('invitation', invitation);
            dialog.show();
        }
    },

    showPortDialogById(portId) {
        if (portId) {
            let porstsServed = Ext.getCmp('main-viewport').getViewModel().get('portsServed'),
                portsServedRecord = porstsServed.findRecord('port_id', portId),
                mainVM = Ext.getCmp('main-viewport').getViewModel(),
                portDialog = Ext.create('Abraxa.view.common.dialog.PortMain'),
                portDialogVM = portDialog.getVM(),
                portModel = new Abraxa.model.common.Port({
                    id: portId,
                });
            portDialog.show();
            portDialog.setMasked({
                xtype: 'loadmask',
                style: {
                    zIndex: 9999,
                },
            });
            portModel.load({
                success: function () {
                    portDialogVM.set('port', portModel);
                    portDialogVM.set('currentUserType', mainVM.get('currentUserType'));
                    if (portsServedRecord) {
                        portDialogVM.set('getIsPortServed', true);
                    }
                    portDialog.setMasked(false);
                },
            });
        }
    },
    showBerthDialogById(berthId) {
        if (berthId) {
            let berthDialog = Ext.create('Abraxa.view.common.dialog.berth.BerthDialog'),
                mainVM = Ext.getCmp('main-viewport').getViewModel(),
                berthModel = new Abraxa.model.directory.Berths({
                    id: berthId,
                });
            berthDialog.show();
            berthDialog.setMasked({
                xtype: 'loadmask',
                style: {
                    zIndex: 9999,
                },
            });
            berthModel.load({
                success: function () {
                    berthDialog.getVM().set('berth', berthModel);
                    berthDialog.getVM().set('currentUserType', mainVM.get('currentUserType'));
                    berthDialog.setMasked(false);
                },
            });
        }
    },
    showPortDialogByName(portName) {
        if (portName) {
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'ports?' + 'query=' + portName,
                method: 'GET',
                disableCaching: false,
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                    'Content-Type': null,
                },
                success: function (response) {
                    var obj = Ext.decode(response.responseText);
                    let porstsServed = Ext.getCmp('main-viewport').getViewModel().get('portsServed'),
                        portsServedRecord = porstsServed.findRecord('port_id', obj[0].port_id),
                        portDialog = Ext.create('Abraxa.view.common.dialog.PortMain'),
                        portDialogVM = portDialog.getVM();
                    portModel = new Abraxa.model.common.Port({
                        id: obj[0].port_id,
                    });
                    portModel.load({
                        success: function () {
                            portDialogVM.set('record', portModel);
                            if (portsServedRecord) {
                                portDialogVM.set('getIsPortServed', true);
                            }
                            portDialog.show();
                        },
                    });
                },
                failure: function failure(response) {},
            });
        }
    },
    showVesselDialog(imo) {
        if (imo) {
            Ext.create('Abraxa.view.common.dialog.Vessel', {
                viewModel: {
                    parent: Ext.getCmp('main-viewport').getViewModel(),
                    data: {
                        id: imo,
                    },
                    stores: {
                        vesselData: {
                            type: 'vesselmodal',
                            autoLoad: true,
                            proxy: {
                                extraParams: {
                                    id: '{id}',
                                },
                            },
                            updateProxy: function (proxy) {
                                if (proxy) {
                                    proxy.onAfter(
                                        'extraparamschanged',
                                        function () {
                                            if (this.getProxy().getExtraParams().id) this.load();
                                        },
                                        this
                                    );
                                }
                            },
                        },
                    },
                    formulas: {
                        vessel: {
                            bind: {
                                bindTo: '{vesselData}',
                                deep: true,
                            },
                            get: function (store) {
                                return store.getAt(0);
                            },
                        },
                        hideEditVessel: {
                            bind: {
                                bindTo: '{vessel}',
                                deep: true,
                            },
                            get: function (record) {
                                if (record) {
                                    if (record.get('company_id') == 0) {
                                        return true;
                                    } else if (
                                        record.get('company_id') &&
                                        record.get('company_id') != this.get('currentUser').get('current_company_id')
                                    ) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }
                            },
                        },
                        flag: {
                            bind: {
                                bindTo: '{vessel.flags.country_code}',
                                deep: true,
                            },
                            get: function (flag) {
                                if (flag) {
                                    return (
                                        AbraxaConstants.urls.staticAbraxa + 'flags/1x1/' + flag.toLowerCase() + '.svg'
                                    );
                                }
                            },
                        },
                        vesselImg: {
                            bind: {
                                bindTo: '{vessel}',
                                deep: true,
                            },
                            get: function (vessel) {
                                if (vessel) {
                                    if (vessel.get('vessel_img')) {
                                        return vessel.get('vessel_img');
                                    }
                                    return ' //static.abraxa.com/ships/' + vessel.get('imo') + '.jpg';
                                }
                            },
                        },
                    },
                },
            }).show();
        }
    },
    showTenantByEmail(email, element) {
        if (email) {
            if (!Ext.getCmp('tenantTooltip')) {
                Ext.Ajax.request({
                    url: Env.ApiEndpoint + 'get_tenant',
                    jsonData: {
                        email: email,
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'POST',
                    success: function success(response) {
                        var obj = Ext.decode(response.responseText);
                        if (obj[0]) {
                            Ext.create('Abraxa.view.common.tooltips.TenantToolTip', {
                                id: 'tenantTooltip',
                                viewModel: {
                                    data: {
                                        record: obj[0],
                                        clickedElement: element.target,
                                    },
                                },
                                data: obj[0],
                            }).showBy(element, 'bc-tc?');
                        }
                    },
                    failure: function failure(response) {},
                });
            }
        }
    },
    showCargoesTooltip(cargoes, element) {
        if (!Ext.getCmp('cargoesTooltip')) {
            Ext.create('Abraxa.view.common.tooltips.CargoesTooltip', {
                viewModel: {
                    parent: Ext.getCmp('main-viewport').lookupViewModel(),
                    data: {
                        cargoes: cargoes,
                        clickedElement: element.target,
                    },
                },
            }).showBy(element, 'bc-tc?');
        }
    },
    showAgentTooltip(org_id, element) {
        if (org_id) {
            if (Ext.getCmp('agentTooltip')) {
                Ext.getCmp('agentTooltip').destroy();
            }
            if (!Ext.getCmp('agentTooltip')) {
                const index = Ext.getStore('agentsStore').find('id', org_id);
                const record = Ext.getStore('agentsStore').getAt(index);
                if (!record) return;
                Ext.create('Abraxa.view.common.tooltips.AgentTooltip', {
                    viewModel: {
                        parent: Ext.getCmp('main-viewport').lookupViewModel(),
                        data: {
                            record: record.getData(),
                            clickedElement: element.target,
                        },
                    },
                }).showBy(element, 'bc-tc?');
            }
        }
    },
    showOrganizationTooltip(org_id, element) {
        if (org_id) {
            if (Ext.getCmp('companyTooltip')) {
                Ext.getCmp('companyTooltip').destroy();
            }
            if (!Ext.getCmp('companyTooltip')) {
                let record = Ext.create('Abraxa.model.company.Company', {
                    org_id: org_id,
                });
                record.load({
                    success: function () {
                        Ext.create('Abraxa.view.common.tooltips.CompanyToolTip', {
                            viewModel: {
                                parent: Ext.getCmp('main-viewport').lookupViewModel(),
                                data: {
                                    record: record.getData(),
                                    clickedElement: element.target,
                                },
                            },
                        }).showBy(element, 'bc-tc?');
                    },
                });
            }
        }
    },
    parseMomentDate(date, format) {
        let company = Ext.getCmp('main-viewport').getViewModel().get('currentUser').getCompany();
        if (company && company.get('timezone_id')) {
            if (company.get('timezone').timezone && moment(date).isValid()) {
                return moment(date).tz(company.get('timezone').timezone).format(format);
            }
        } else {
            if (moment(date).isValid()) {
                return moment(date).format(format);
            }
        }
        return AbraxaConstants.placeholders.emptyValue;
    },

    createCompanyModel(company) {
        let model = new Abraxa.model.common.Company(Object.assign({}, company));
        if (company.currencies) {
            model.currencies().setData(company.currencies);
        }
        if (company.email_settings) {
            model.email_settings().setData(company.email_settings);
        }
        if (company.offices) {
            model.offices().setData(company.offices);
        }
        if (company.currencies) {
            model.currencies().setData(company.currencies);
        }
        if (company.banks) {
            model.banks().setData(company.banks);
        }
        return model;
    },

    createPayment(params) {
        let dialog = Ext.create('Abraxa.view.portcall.payments.CreatePayment', {
            viewModel: {
                parent: params.vm,
                data: {
                    selectedAccount: params.account,
                },
                stores: {
                    paymentsPerAccount: {
                        source: '{payments}',
                        filters: '{paymentsPerAccountFilter}',
                    },
                    filtedPayments: {
                        source: '{paymentsPerAccount}',
                        filters: '{paymentsFilter}',
                    },
                    incomingPayments: {
                        source: '{paymentsPerAccount}',
                        filters: [
                            {
                                property: 'kind',
                                value: 'incoming',
                            },
                        ],
                    },
                    outgoingPayments: {
                        source: '{paymentsPerAccount}',
                        filters: [
                            {
                                property: 'kind',
                                value: 'outgoing',
                            },
                        ],
                    },
                    accountAgreements: {
                        source: '{agreements}',
                        filters: '{agreementsFilter}',
                    },
                },
                formulas: {
                    paymentsFilter: {
                        bind: {
                            bindTo: '{paymentsMenu.selection}',
                            deep: true,
                        },
                        get: function (record) {
                            if (record) {
                                let store = this.get('filtedPayments');
                                if (store) store.clearFilter();
                                return function (rec) {
                                    let conditon = null;
                                    switch (record.get('tab')) {
                                        case 'transactions':
                                            let statuses = ['incoming', 'outgoing'];
                                            conditon =
                                                Ext.Array.contains(statuses, rec.get('kind')) &&
                                                rec.get('status') != 'draft';
                                            break;
                                        case 'requested_payments':
                                            conditon = rec.get('kind') == 'requested' && rec.get('status') != 'draft';
                                            break;
                                        case 'drafts':
                                            conditon = rec.get('status') == 'draft';
                                            break;

                                        default:
                                            conditon = false;
                                            break;
                                    }
                                    return conditon;
                                };
                            } else {
                                return function (item) {
                                    return false;
                                };
                            }
                        },
                    },
                    paymentsPerAccountFilter: {
                        bind: {
                            bindTo: '{accountMainCombo.selection.org_id}',
                            deep: true,
                        },
                        get: function (org_id) {
                            let store = this.get('paymentsPerAccount');
                            if (store) store.clearFilter();
                            if (org_id) {
                                return function (rec) {
                                    if (rec.get('org_id') == org_id) {
                                        return true;
                                    }
                                };
                            } else {
                                return function (item) {
                                    return true;
                                };
                            }
                        },
                    },
                    totalIncomingPayments: {
                        bind: {
                            bindTo: '{incomingPayments}',
                            deep: true,
                        },
                        get: function (store) {
                            let total = 0;
                            if (store) {
                                total = store.sum('calculated_amount');
                            }
                            return total;
                        },
                    },
                    totalOutgoingPayments: {
                        bind: {
                            bindTo: '{outgoingPayments}',
                            deep: true,
                        },
                        get: function (store) {
                            let total = 0;
                            if (store) {
                                total = store.sum('calculated_amount');
                            }
                            return total;
                        },
                    },
                    balance: {
                        bind: {
                            incoming: '{totalIncomingPayments}',
                            outgoing: '{totalOutgoingPayments}',
                        },
                        get: function (data) {
                            let balance = 0;
                            if (data) {
                                balance = data.incoming - data.outgoing;
                            }
                            return balance;
                        },
                    },
                    agreementsFilter: {
                        bind: {
                            bindTo: '{accountMainCombo.selection}',
                            deep: true,
                        },
                        get: function (record) {
                            if (record) {
                                let store = this.get('accountAgreements'),
                                    port_id = this.get('object_record.port_id'),
                                    port_function = this.get('object_record.port_function');

                                if (store) store.clearFilter();

                                return function (rec) {
                                    if (rec.get('organization_org_id') == record.get('org_id')) {
                                        let agreementable = rec.get('agreementable'),
                                            port_array = agreementable ? agreementable.port_ids : null;

                                        if (agreementable) {
                                            if (port_array) {
                                                if (
                                                    port_array.includes(port_id) &&
                                                    agreementable.port_function == port_function
                                                ) {
                                                    return true;
                                                } else {
                                                    return false;
                                                }
                                            } else {
                                                return true;
                                            }
                                        }
                                        return true;
                                    }
                                };
                            } else {
                                return function (item) {
                                    return false;
                                };
                            }
                        },
                    },
                    account: {
                        bind: {
                            bindTo: '{accountMainCombo.selection}',
                            deep: true,
                        },
                        get: function (record) {
                            return record;
                        },
                    },
                },
            },
        });
        dialog.show(null);
    },
    getExchange(base_currency, target_currency = null) {
        if (base_currency) {
            let params = {
                from: base_currency,
            };
            if (target_currency) {
                params.to = target_currency;
            }
            return new Ext.Promise(function (resolve, reject) {
                Ext.Ajax.request({
                    url: Env.ApiEndpoint + 'exchange_rates',
                    params: params,
                    disableCaching: false,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    method: 'GET',
                    success: function (response, opts) {
                        var result = JSON.parse(response.responseText);
                        resolve(result);
                    },
                });
            });
        }
    },

    addPayment(target, payment) {
        let title = '',
            editMode = false;
        switch (payment.get('kind')) {
            case 'incoming':
                title =
                    '<div class="a-badge a-badge-incoming"><i class="md-icon-outlined md-icon-add c-green-500"></i></div>Incoming payment';
                break;
            case 'outgoing':
                title =
                    '<div class="a-badge a-badge-outgoing"><i class="md-icon-outlined md-icon-remove c-red"></i></div>Outgoing payment';

                break;
            case 'requested':
                title =
                    '<div class="a-badge a-badge-requested"><i class="md-icon-outlined md-icon-inventory c-yellow-500"></i></div>Request payment';
                break;
            default:
                break;
        }
        files = null;
        if (Ext.isNumber(payment.get('id'))) {
            editMode = true;
            files = payment.attachments();
        } else {
            files = Ext.create('Ext.data.Store');
        }
        let dialog = Ext.create('Abraxa.view.portcall.payments.PaymentsDialog', {
            title: title,
            viewModel: {
                parent: target.upVM(),
                data: {
                    editMode: editMode,
                    payment: payment,
                    files: files,
                },
                stores: {
                    paymentAgreements: {
                        source: '{agreements}',
                        filters: '{agreementsFilter}',
                    },
                },
                formulas: {
                    paymentContent: {
                        bind: {
                            bindTo: '{payment.kind}',
                            deep: true,
                        },
                        get: function (kind) {
                            if (kind == 'incoming') {
                                return {
                                    xtype: 'incoming.form.content',
                                };
                            }
                            if (kind == 'outgoing') {
                                return {
                                    xtype: 'outgoing.form.content',
                                };
                            }
                            if (kind == 'requested') {
                                return {
                                    xtype: 'request.form.content',
                                };
                            }
                        },
                    },
                    showFiles: {
                        bind: {
                            bindTo: '{files.count}',
                            deep: true,
                        },
                        get: function (count) {
                            if (count) {
                                return false;
                            }
                            return true;
                        },
                    },
                    agreementsFilter: {
                        bind: {
                            bindTo: '{payment.org_id}',
                            deep: true,
                        },
                        get: function (org_id) {
                            if (org_id) {
                                let store = this.get('paymentAgreements'),
                                    port_id = this.get('object_record.port_id'),
                                    port_function = this.get('object_record.port_function');

                                if (store) store.clearFilter();

                                return function (rec) {
                                    if (rec.get('organization_org_id') == org_id) {
                                        let agreementable = rec.get('agreementable'),
                                            port_array = agreementable ? agreementable.port_ids : null;

                                        if (agreementable) {
                                            if (port_array) {
                                                if (
                                                    port_array.includes(port_id) &&
                                                    agreementable.port_function == port_function
                                                ) {
                                                    return true;
                                                } else {
                                                    return false;
                                                }
                                            } else {
                                                return true;
                                            }
                                        }
                                        return true;
                                    }
                                };
                            } else {
                                return function (item) {
                                    return false;
                                };
                            }
                        },
                    },
                    showExchangeRate: {
                        bind: {
                            payment_currency: '{payment.currency}',
                            account_currency: '{billingParty.selection.account_currency}',
                        },
                        get: function (data) {
                            if (data.payment_currency && data.account_currency) {
                                if (data.payment_currency != data.account_currency) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }
                            return true;
                        },
                    },
                    outgoingBanksStore: {
                        bind: {
                            bindTo: '{outgoingPayment.selection.virtual_accounts}',
                            deep: true,
                        },
                        get: function (store) {
                            if (store) {
                                store.setGrouper({
                                    groupFn: function (record) {
                                        return record.get('type');
                                    },
                                });
                                store.setRemoteFilter(false);
                                store.addFilter({
                                    filterFn: function (record) {
                                        return record.get('disabled') == 0;
                                    },
                                });
                                return store;
                            }
                            return new Ext.data.Store({
                                id: 'emptyStore',
                                proxy: {
                                    type: 'memory',
                                },
                            });
                        },
                    },
                    incomingBanksStore: {
                        bind: {
                            bindTo: '{paymentFrom.selection.virtual_accounts}',
                            deep: true,
                        },
                        get: function (store) {
                            if (store) {
                                store.setGrouper({
                                    groupFn: function (record) {
                                        return record.get('type');
                                    },
                                });
                                store.setRemoteFilter(false);
                                store.addFilter({
                                    filterFn: function (record) {
                                        return record.get('disabled') == 0;
                                    },
                                });
                                return store;
                            }
                            return new Ext.data.Store({
                                id: 'emptyStore',
                                proxy: {
                                    type: 'memory',
                                },
                            });
                        },
                    },
                    hideDraftButton: {
                        bind: {
                            bindTo: '{payment}',
                            deep: true,
                        },
                        get: function (payment) {
                            if (payment) {
                                if (Ext.isNumber(payment.get('id')) && payment.get('status') == 'draft') {
                                    return true;
                                }
                            }
                            return false;
                        },
                    },
                },
            },
        });
        dialog.show();
    },

    searchItem(item) {
        let str = '';
        iterate(item);

        function iterate(obj) {
            for (var property in obj) {
                if (obj.hasOwnProperty(property)) {
                    if (typeof obj[property] == 'object') {
                        iterate(obj[property]);
                    } else {
                        if (property != 'model_name') {
                            if (typeof obj[property] == 'string') {
                                str = str + '-' + obj[property].toLowerCase();
                            } else {
                                str = str + '-' + obj[property];
                            }
                        }
                    }
                }
            }
        }
        return str;
    },

    //return first met parrent controller
    getParentController: function (component, viewModel) {
        const parent = component ? component.up() : viewModel.getView();
        if (parent) {
            const controller = parent.getController();
            if (controller) {
                return controller;
            } else {
                return this.getParentController(parent);
            }
        } else {
            return null;
        }
    },

    setInstructionTitleOrDescription: function (instruction) {
        if (instruction) {
            const titleLabel = 'title';
            const descriptionLabel = 'description';
            let title = instruction.get(titleLabel);
            let description = instruction.get(descriptionLabel);
            if (!title && description && description.length > 0) {
                instruction.set(titleLabel, AbraxaConstants.placeholders.emptyValue);
            }
            if (!description && title && title.length > 0) {
                instruction.set(descriptionLabel, AbraxaConstants.placeholders.emptyValue);
            }
        }
    },
});
