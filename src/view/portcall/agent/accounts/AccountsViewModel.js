import '../../../../store/disbursements/DefaultDisbursementTags.js';

Ext.define('Abraxa.view.portcall.accounts.AccountsViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.accounts-viewmodel',
    data: {
        selectedAccount: null,
        selectedDisbursement: null,
        showDetails: false,
        //these are properties for the cost centers combo:
        buttonIsActive: false,
        buttonName: 'Add custom cost center',
        value: null,
        addButtonDisable: true,
        isChanged: false,
        cleared: false,
    },
    stores: {
        accountDisbursements: {
            source: '{disbursements}',
            filters: '{disbursementsFilter}',
            sorters: [
                {
                    property: 'id',
                    direction: 'ASC',
                },
            ],
            grouper: {
                groupFn: function (record) {
                    return record.get('group_id');
                },
            },
        },
        accountAgreements: {
            source: '{agreements}',
            filters: '{agreementsFilter}',
        },
        disbursementItems: {
            source: '{expenses}',
            filters: '{disbursementItemsFilter}',
            sorters: [
                {
                    property: 'id',
                    direction: 'ASC',
                },
            ],
            grouper: {
                groupFn: function (record) {
                    if (record.get('default_expense_item')) {
                        return record.get('default_expense_item').category.id;
                    } else {
                        return 100;
                    }
                },
            },
            listeners: {
                beforesync: function (store) {
                    let vm = store.$binding.owner,
                        selectedAccount = vm.get('selectedAccount'),
                        disbursement = vm.get('selectedDisbursement');
                    disbursement.set('updated_by_user', vm.get('currentUser').getData());
                    selectedAccount.set('updated_by_user', vm.get('currentUser').getData());
                    disbursement.set('updated_at', new Date());
                    selectedAccount.set('updated_at', new Date());
                },
            },
        },
        accountVouchers: {
            source: '{vouchers}',
            filters: '{accountVouchersFilter}',
            listeners: {
                beforesync: function (store) {
                    let vm = store.$binding.owner,
                        selectedAccount = vm.get('selectedAccount'),
                        disbursement = vm.get('selectedDisbursement');
                    disbursement.set('updated_by_user', vm.get('currentUser').getData());
                    selectedAccount.set('updated_by_user', vm.get('currentUser').getData());
                    disbursement.set('updated_at', new Date());
                    selectedAccount.set('updated_at', new Date());
                },
            },
        },
        disbursementVouchers: {
            source: '{vouchers}',
            filters: '{disbursementVouchersFilter}',
        },
        defaultDisbursementTags: {
            type: 'default.disbursement.tags',
            autoLoad: true,
        },
        accountExpenses: {
            source: '{expenses}',
            filters: '{accountExpensesFilter}',
        },
        disbursementExpenses: {
            source: '{expenses}',
            filters: '{disbursementExpensesFilter}',
            listeners: {
                update: function (store) {
                    let vm = store.$binding.owner,
                        selectedAccount = vm.get('selectedAccount'),
                        disbursement = vm.get('selectedDisbursement');
                    disbursement.set('updated_by_user', vm.get('currentUser').getData());
                    selectedAccount.set('updated_by_user', vm.get('currentUser').getData());
                    disbursement.set('updated_at', new Date());
                    selectedAccount.set('updated_at', new Date());
                },
            },
        },
    },
    formulas: {
        disbursementsFilter: {
            bind: {
                bindTo: '{selectedAccount}',
            },
            get: function (record) {
                if (record) {
                    let store = this.get('accountDisbursements');

                    if (store) store.clearFilter();

                    return function (rec) {
                        if (rec.get('account_id') == record.get('id')) {
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
        disbursementItemsFilter: {
            bind: {
                bindTo: '{selectedDisbursement}',
            },
            get: function (record) {
                if (record) {
                    let store = this.get('disbursementItems'),
                        type = record.get('type');
                    if (store) store.clearFilter();

                    return function (rec) {
                        if (rec.get(type + '_id') == record.get('id')) {
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
        agreementsFilter: {
            bind: {
                bindTo: '{selectedAccount}',
                deep: true,
            },
            get: function (record) {
                if (record && record.isModel) {
                    let store = this.get('accountAgreements'),
                        port_id = this.get('object_record.port_id'),
                        nomination = this.get('object_record').getNomination(),
                        port_function = nomination.get('port_function'),
                        account = record,
                        total_billed_converted = account.get('total_costs');

                    if (store) store.clearFilter();

                    return function (rec) {
                        if (rec.get('organization_org_id') == record.get('org_id')) {
                            let agreementable = rec.get('agreementable'),
                                port_array = agreementable ? agreementable.port_ids : null,
                                sholdReturn = true;

                            if (agreementable && agreementable.active) {
                                if (port_array) {
                                    if (port_array.includes(port_id)) {
                                        if (agreementable.port_function) {
                                            if (agreementable.port_function == port_function) {
                                                sholdReturn = true;
                                                if (agreementable.payment_term_id) {
                                                    if (
                                                        eval(
                                                            total_billed_converted.toString() +
                                                                ' ' +
                                                                agreementable.threshold_operator +
                                                                ' ' +
                                                                agreementable.threshold_amount
                                                        )
                                                    ) {
                                                        sholdReturn = true;
                                                    } else {
                                                        sholdReturn = false;
                                                    }
                                                }
                                            } else {
                                                sholdReturn = false;
                                            }
                                        } else {
                                            sholdReturn = true;
                                            if (agreementable.payment_term_id) {
                                                if (
                                                    eval(
                                                        total_billed_converted.toString() +
                                                            ' ' +
                                                            agreementable.threshold_operator +
                                                            ' ' +
                                                            agreementable.threshold_amount
                                                    )
                                                ) {
                                                    sholdReturn = true;
                                                } else {
                                                    sholdReturn = false;
                                                }
                                            }
                                        }
                                    } else {
                                        sholdReturn = false;
                                    }
                                } else {
                                    if (agreementable.payment_term_id) {
                                        if (
                                            eval(
                                                total_billed_converted.toString() +
                                                    ' ' +
                                                    agreementable.threshold_operator +
                                                    ' ' +
                                                    agreementable.threshold_amount
                                            )
                                        ) {
                                            sholdReturn = true;
                                        } else {
                                            sholdReturn = false;
                                        }
                                    }
                                }
                            } else {
                                sholdReturn = false;
                            }
                            return sholdReturn;
                        }
                    };
                } else {
                    return function (item) {
                        return false;
                    };
                }
            },
        },
        availableExpenses: {
            bind: {
                expenses: '{expenses.count}',
                selectedDisbursement: '{disbursementsGrid.selection.calculation}',
            },
            get: function (data) {
                if (data) {
                    let disbursements = this.get('disbursements'),
                        expenses = this.get('expenses');
                    if (disbursements) {
                        disbursements.each(function (record) {
                            let records = expenses.queryBy(function (rec, id) {
                                return rec.get('account_id') == record.get('account_id') && !rec.get('disbursement_id');
                            }).items;
                            record.set('availableExpenses', records);
                        });
                    }
                }
            },
        },
        updateCalculation: {
            bind: {
                bindTo: '{expenses}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    if (this.get('disbursementsGrid.selection')) {
                        this.get('disbursementsGrid.selection').set('calculation', new Date());
                    }
                }
            },
        },
        memberCount: {
            bind: {
                members: '{membersPerSection}',
                selectedRecord: '{selectedAccount}',
            },
            get: function (data) {
                if (
                    data.members &&
                    data.selectedRecord &&
                    !Ext.Object.isEmpty(data.selectedRecord.getAssociatedData())
                ) {
                    let members = data.members['accounts'],
                        filteredMembers = [],
                        selectedRecord = data.selectedRecord;
                    if (selectedRecord.members()) {
                        selectedRecord.members().each(function (value) {
                            Ext.Array.each(members, function (val) {
                                if (val.get('id') == value.get('member_id')) {
                                    filteredMembers.push(val);
                                }
                            });
                        });

                        this.set('sectionMembers', filteredMembers);
                        this.set('memberPreviewTitle', 'ACCOUNTS');

                        return filteredMembers;
                    }
                }
            },
        },
        disbursementMemberCount: {
            bind: {
                members: '{membersPerSection}',
                selectedRecord: '{selectedDisbursement}',
            },
            get: function (data) {
                if (
                    data.members &&
                    data.selectedRecord &&
                    !Ext.Object.isEmpty(data.selectedRecord.getAssociatedData())
                ) {
                    let members = data.members['disbursements'],
                        filteredMembers = [],
                        selectedRecord = data.selectedRecord;

                    if (selectedRecord.members()) {
                        selectedRecord.members().each(function (value) {
                            Ext.Array.each(members, function (val) {
                                if (val.get('id') == value.get('member_id')) {
                                    filteredMembers.push(val);
                                }
                            });
                        });
                        this.set('disbursementSectionMembers', filteredMembers);
                        this.set('disbursementMemberPreviewTitle', 'DISBURSEMENTS');
                        return filteredMembers;
                    }
                }
            },
        },
        selectedAccount: {
            bind: {
                bindTo: '{accountsGrid.selection}',
                deep: true,
            },
            get: function (selection) {
                return selection;
            },
        },
        selectedDisbursement: {
            bind: {
                bindTo: '{disbursementsGrid.selection}',
                // deep: true
            },
            get: function (selection) {
                return selection;
            },
        },
        accountVouchersFilter: {
            bind: {
                bindTo: '{selectedAccount}',
            },
            get: function (record) {
                if (record) {
                    let store = this.get('accountVouchers');

                    if (store) store.clearFilter();

                    return function (rec) {
                        if (rec.get('account_id') == record.get('id')) {
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
        accountExpensesFilter: {
            bind: {
                bindTo: '{selectedAccount}',
            },
            get: function (record) {
                if (record) {
                    let store = this.get('accountExpenses');

                    if (store) store.clearFilter();

                    return function (rec) {
                        if (rec.get('account_id') == record.get('id')) {
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
        disbursementExpensesFilter: {
            bind: {
                bindTo: '{selectedDisbursement}',
            },
            get: function (record) {
                if (record) {
                    let store = this.get('disbursementExpenses');

                    if (store) store.clearFilter();

                    return function (rec) {
                        if (rec.get(record.get('type') + '_id') == record.get('id')) {
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
        disbursementVouchersFilter: {
            bind: {
                bindTo: '{selectedDisbursement}',
            },
            get: function (record) {
                if (record) {
                    let store = this.get('disbursementVouchers');
                    if (store) store.clearFilter();

                    return function (rec) {
                        if (rec.get('disbursement_id') == record.get('id')) {
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
        totalFinal: {
            bind: {
                bindTo: '{disbursementItems}',
                deep: true,
            },
            get: function (disbursementItems) {
                if (!disbursementItems) return 0;

                let disbursement = this.get('selectedDisbursement'),
                    isOwner = this.get('is_owner');

                if (!disbursement) return 0;

                let type = disbursement.get('type'),
                    sum = disbursementItems.sum(type + '_final_price');

                if (disbursement.get('total_costs') != Math.round(sum * 100) / 100) {
                    disbursement.set('total_costs', Math.round(sum * 100) / 100);
                    if (disbursement.dirty && isOwner) {
                        disbursement.save();
                    }
                }
                return disbursement.get('total_costs');
            },
        },
        totalAccountFinal: {
            bind: {
                bindTo: '{accountDisbursements}',
                deep: true,
            },
            get: function (disbursements) {
                let total = 0,
                    account = this.get('selectedAccount');
                if (disbursements && disbursements.count()) {
                    let disbursementsForTotal = new Ext.util.Collection(),
                        sdaDisbursements = disbursements.queryBy(function (disbursement) {
                            if (disbursement.get('status') != 'draft' && disbursement.get('type') == 'sda') {
                                return disbursement.get('account_id') == account.get('id');
                            }
                        });

                    disbursements.getGroups().each(function (group) {
                        var collection = new Ext.util.Collection();

                        group.each(function (disbursement) {
                            if (disbursement.get('type') != 'sda' && disbursement.get('status') != 'draft') {
                                collection.add(disbursement);
                            }
                        });
                        if (collection.length) disbursementsForTotal.add(collection.last());
                    });

                    sdaDisbursements.each(function (disbursement) {
                        disbursementsForTotal.add(disbursement);
                    });
                    disbursementsForTotal.each(function (disbursement) {
                        total += parseFloat(disbursement.get('total_costs'));
                    });
                    if (account && account.get('total_costs') !== total) {
                        account.set('total_costs', total);
                    }
                    if (account && account.dirty) account.save();
                }
                return total;
            },
        },
        showConvert: {
            bind: {
                bindTo: '{selectedDisbursement}',
                deep: true,
            },
            get: function (disbursement) {
                if (disbursement) {
                    let type = disbursement.get('type'),
                        has_dda = disbursement.get('dda_id'),
                        has_fda = disbursement.get('fda_id');

                    if (type == 'fda' || type == 'sda') return false;

                    if (type == 'pda' && (has_dda || has_fda)) return false;

                    if (type == 'dda' && has_fda) return false;

                    return true;
                }
            },
        },
        disableDelete: {
            bind: {
                bindTo: '{selectedDisbursement}',
                deep: true,
            },
            get: function (disbursement) {
                if (disbursement) {
                    let object_record = this.get('object_record');
                    if (object_record.get('is_archived')) {
                        return false;
                    } else {
                        let type = disbursement.get('type'),
                            has_dda = disbursement.get('dda_id'),
                            has_fda = disbursement.get('fda_id');

                        if (type == 'pda' && (has_dda || has_fda)) return false;

                        if (type == 'dda' && has_fda) return false;

                        return true;
                    }
                }
                return true;
            },
        },
        distinctDisburtsementGroups: {
            bind: {
                bindTo: '{disbursements}',
                deep: true,
            },
            get: function (store) {
                return store.collect('group_id');
            },
        },
        totalPayments: {
            bind: {
                bindTo: '{payments}',
                deep: true,
            },
            get: function (store) {
                total = 0;
                if (store) {
                    total = store.sum('calculated_amount');
                }
                return total;
            },
        },
        receivedPayments: {
            bind: {
                account: '{selectedAccount}',
                total_payment: '{totalPayments}',
            },
            get: function (data) {
                let totalReceived = 0,
                    totalOutgoing = 0;
                if (data.account) {
                    let payments = this.get('payments');
                    if (payments) {
                        let receivedPayments = payments.queryBy(function (rec, id) {
                            if (rec.get('kind') == 'incoming' && rec.get('org_id') == data.account.get('org_id')) {
                                return rec;
                            }
                        });
                        receivedPayments.each(function (rec) {
                            totalReceived += rec.get('calculated_amount');
                        });
                    }
                }
                return totalReceived;
            },
        },
        outGoingPayments: {
            bind: {
                account: '{selectedAccount}',
                total_payment: '{totalPayments}',
            },
            get: function (data) {
                let totalReceived = 0,
                    totalOutgoing = 0;
                if (data.account) {
                    let payments = this.get('payments');
                    if (payments) {
                        let outGoing = payments.queryBy(function (rec, id) {
                            if (rec.get('kind') == 'outgoing' && rec.get('to_org_id') == data.account.get('org_id')) {
                                return rec;
                            }
                        });
                        outGoing.each(function (rec) {
                            totalOutgoing += rec.get('calculated_amount');
                        });
                    }
                }
                return totalOutgoing;
            },
        },
        requestedPayments: {
            bind: {
                account: '{selectedAccount}',
                total_payment: '{totalPayments}',
            },
            get: function (data) {
                let total = 0;
                if (data.account) {
                    let payments = this.get('payments');
                    if (payments) {
                        let requestedPayments = payments.queryBy(function (rec, id) {
                            return rec.get('kind') == 'requested' && rec.get('org_id') == data.account.get('org_id');
                        });
                        requestedPayments.each(function (rec) {
                            total += rec.get('calculated_amount');
                        });
                    }
                }
                return total;
            },
        },
        balance: {
            bind: {
                totalBilled: '{totalAccountFinal}',
                totalPayments: '{receivedPayments}',
                totalOutgoing: '{outGoingPayments}',
            },
            get: function (data) {
                let account = this.get('selectedAccount');

                if (!data) {
                    return (account && account.get('balance')) || 0;
                }

                let balance = data.totalBilled - data.totalPayments + data.totalOutgoing;
                if (account) {
                    account.set('balance', balance);
                    if (account.dirty) account.save();
                }
                return balance;
            },
        },
        receivedPercent: {
            bind: {
                receivedPayments: '{receivedPayments}',
                totalAccountFinal: '{totalAccountFinal}',
            },
            get: function (data) {
                let balance = 0;
                if (data) {
                    if (data.totalAccountFinal)
                        balance = parseFloat(Math.abs(data.receivedPayments / data.totalAccountFinal) * 100).toFixed();
                }
                return balance;
            },
        },
        balancePercent: {
            bind: {
                requestedAmount: '{requestedPayments}',
                totalAccountFinal: '{totalAccountFinal}',
            },
            get: function (data) {
                let balance = 0;
                if (data) {
                    if (data.totalAccountFinal)
                        balance = parseFloat(Math.abs(data.requestedAmount / data.totalAccountFinal) * 100).toFixed();
                }
                return balance;
            },
        },
        amountToRequest: {
            bind: {
                totalBilled: '{totalAccountFinal}',
                percentage: '{selectedAccount.payment_term_value}',
            },
            get: function (data) {
                let balance = 0;
                if (data) {
                    balance = data.totalBilled * (data.percentage / 100);
                }
                return balance;
            },
        },
        requestedPercent: {
            bind: {
                totalBilled: '{totalAccountFinal}',
                totalPayments: '{receivedPayments}',
            },
            get: function (data) {
                let balance = 0;
                if (data) {
                    if (data.totalPayments)
                        balance = parseFloat(Math.abs(data.totalPayments / data.totalBilled) * 100).toFixed();
                }
                return balance;
            },
        },
        accountProgress: {
            bind: {
                bindTo: '{accountDisbursements}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    let total = store.count(),
                        draft = 0;

                    store.each(function (disbursement) {
                        if (disbursement.get('status') == 'completed' || disbursement.get('status') == 'settled')
                            draft++;
                    });

                    if (total > draft) return Math.abs(draft / total);

                    if (total > 0 && total == draft) return 1;

                    return 0;
                }
            },
        },
        multiCurrencyDisbursement: {
            bind: {
                bindTo: '{disbursementItems}',
                deep: true,
            },
            get: function (store) {
                let vm = this,
                    disbursement = vm.get('selectedDisbursement');

                if (!disbursement) return;

                let accountCurrency = vm.get('selectedAccount.account_currency'),
                    vouchers = vm.get('vouchers'),
                    multiCurrencyVouchers = 0;
                let multiCurrencyExpense = store.queryBy(function (expense) {
                    if (expense.get('disbursement_id') === disbursement.get('group_id')) {
                        multiCurrencyVouchers += vouchers.queryBy(function (voucher) {
                            if (voucher.get('expense_id') == expense.get('id')) {
                                return voucher.get('currency') != accountCurrency;
                            }
                        }).items.length;
                        return expense.get('currency') && expense.get('currency') != accountCurrency;
                    }
                }).items.length;
                if (multiCurrencyExpense || multiCurrencyVouchers) {
                    disbursement.set('multi_currency', 1);
                } else {
                    disbursement.set('multi_currency', 0);
                }
            },
        },
        totalDiscount: {
            bind: {
                bindTo: '{disbursementItems}',
                deep: true,
            },
            get: function (disbursementItems) {
                if (disbursementItems) {
                    let type = this.get('selectedDisbursement.type');

                    if (disbursementItems.sum(type + '_discount_amount')) {
                        return (
                            disbursementItems.sum(type + '_calculated_price') -
                            disbursementItems.sum(type + '_discounted_price')
                        );
                    } else {
                        return 0;
                    }
                }
            },
        },
        totalVAT: {
            bind: {
                bindTo: '{disbursementItems}',
                deep: true,
            },
            get: function (disbursementItems) {
                if (disbursementItems) {
                    let type = this.get('selectedDisbursement.type');

                    return disbursementItems.sum(type + '_discount_amount')
                        ? disbursementItems.sum(type + '_final_price') -
                              disbursementItems.sum(type + '_discounted_price')
                        : disbursementItems.sum(type + '_final_price') -
                              disbursementItems.sum(type + '_calculated_price');
                }
            },
        },
        recordForApproval: {
            bind: {
                bindTo: '{selectedDisbursement.approvals}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    let record = this.get('selectedDisbursement');
                    if (record) {
                        let file_id = record.get('id'),
                            currentUser = this.get('currentUser');
                        record_exists = store.queryBy(function (rec, id) {
                            return (
                                rec.get('to_company_id') == currentUser.get('current_company_id') &&
                                rec.get('approvable_id') == file_id &&
                                rec.get('status') == 'pending'
                            );
                        }).items;
                        if (record_exists.length) return record_exists[0];

                        return false;
                    }
                }
            },
        },
        editableDisbursementPermissions: {
            bind: {
                bindTo: '{objectPermissions}',
                deep: true,
            },
            get: function (permissions) {
                if (permissions) {
                    let generalPermission = Object.keys(permissions).includes('disbursements');
                    if (generalPermission) {
                        if (!permissions['disbursements'].can_edit) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
                return true;
            },
        },
        showBadgeForPrincipal: {
            bind: {
                editableDisbursment: '{editableDisbursementPermissions}',
                isOwner: '{is_owner}',
                disableDelete: '{disableDelete}',
            },
            get: function (data) {
                if (data.isOwner) {
                    //if is owner return true
                    //shows another badge
                    return true;
                } else {
                    if (!data.disableDelete) {
                        //return false to show badge if is not disable delete
                        return false;
                    } else if (data.editableDisbursment) {
                        //if is not disable delete and editabledisbursement hide badge
                        //button is visible on editable disbursments
                        //return true to hide badge
                        return true;
                    } else {
                        //default is hidden
                        //return true
                        return true;
                    }
                }
            },
        },
        hideDocumentButton: {
            bind: {
                bindTo: '{object_record.folders}',
            },
            get: function (foldersStore) {
                if (!foldersStore) {
                    return true;
                } else if (foldersStore.findRecord('is_default', 1) || foldersStore.findRecord('is_shared', 1)) {
                    return false;
                } else {
                    return true;
                }
            },
        },
    },
});
