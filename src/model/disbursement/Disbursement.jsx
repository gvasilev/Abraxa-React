import '../account/Account';
import '../payment/Payment';
import './Voucher';
import './Sharing';
import './DisbursementMember';
import '../approval/Approval';
import '../portcall/Note';
import '../task/Task';
import '../document/Document';
import '../portcall/Expense';

Ext.define('Abraxa.model.disbursement.Disbursement', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'integer',
            persist: false,
        },
        {
            name: 'is_final',
            type: 'boolean',
        },
        {
            name: 'name',
            type: 'auto',
        },
        {
            name: 'company_id',
            type: 'auto',
        },
        {
            name: 'portcall_id',
            type: 'auto',
        },
        {
            name: 'bill_to_id',
            type: 'auto',
        },
        {
            name: 'bill_to_name',
            type: 'string',
        },
        {
            name: 'bill_to_email',
            type: 'string',
        },
        {
            name: 'status',
            type: 'string',
            defaultValue: 'draft',
        },
        {
            name: 'balance',
            type: 'float',
        },
        {
            name: 'items',
            type: 'auto',
        },
        {
            name: 'type',
            type: 'string',
        },
        {
            name: 'group_id',
            type: 'auto',
        },
        {
            name: 'calculation',
            persist: false,
            defaultValue: new Date(),
        },
        {
            name: 'ammount_requested',
            type: 'number',
        },
        {
            name: 'availableExpenses',
            persist: false,
        },
        {
            name: 'is_locked',
            type: 'boolean',
            convert: function(v, rec) {
                if (rec.get('status') != 'draft') {
                    return true;
                }
                return false;
            },

            depends: ['status'],
            persist: false,
        },
        {
            name: 'show_variance',
            type: 'boolean',
            mapping: function(res) {
                if (res.data && res.data.show_variance) return true;
                return false;
            },
        },
        {
            name: 'show_accounting',
            type: 'boolean',
        },
        {
            name: 'show_account_number',
            type: 'boolean',
        },
        {
            name: 'show_voucher',
            type: 'boolean',
        },
        {
            name: 'show_variance_comment',
            type: 'boolean',
        },
        {
            name: 'show_vat',
            type: 'boolean',
        },
        {
            name: 'show_discount',
            type: 'boolean',
        },
        {
            name: 'show_calculated_price',
            persist: false,
            depends: ['show_vat', 'show_discount'],
            type: 'boolean',
            convert: function(v, rec) {
                if (rec.get('show_vat') || rec.get('show_discount')) {
                    return true;
                }
                return false;
            },
        },
        {
            name: 'total_costs',
            type: 'float',
        },
        {
            name: 'total_payments',
            type: 'float',
            persist: false,
        },
        {
            name: 'pda',
            type: 'auto',
            persist: false,
        },
        {
            name: 'dda',
            type: 'auto',
            persist: false,
        },
        {
            name: 'tags',
            type: 'auto',
        },
        {
            name: 'show_tags',
            type: 'boolean',
        },
        {
            name: 'multi_currency',
            type: 'boolean',
            persist: false,
        },
        {
            name: 'updated_by',
            type: 'auto',
            persist: false,
        },
        {
            name: 'updated_at',
            type: 'auto',
            persist: false,
        },
        {
            name: 'approvals',
            type: 'auto',
        },
        {
            name: 'portcall_eta',
            depends: 'updated_at',
            persist: false,
            mapping: function(data) {
                if (data && data.portcall && data.portcall.port_eta) return Date.parse(data.portcall.port_eta);
            },
        },
        {
            name: 'portcall_etd',
            depends: 'updated_at',
            persist: false,
            mapping: function(data) {
                if (data && data.portcall && data.portcall.port_etd) return Date.parse(data.portcall.port_etd);
            },
        },
        {
            name: 'voyage_number',
            depends: 'updated_at',
            persist: false,
            mapping: function(data) {
                if (data && data.portcall && data.portcall.nomination && data.portcall.nomination.voyage_number)
                    return data.portcall.nomination.voyage_number;
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            name: 'agency_type',
            depends: 'updated_at',
            persist: false,
            mapping: function(data) {
                if (data && data.portcall && data.portcall.nomination && data.portcall.nomination.agency_type_name)
                    return data.portcall.nomination.agency_type_name;
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            name: 'sub_agent',
            depends: 'updated_at',
            persist: false,
            mapping: function(data) {
                let subAgent = {
                    org_name: null,
                    org_id: null,
                };

                if (data.portcall && data.portcall.nomination) {
                    subAgent.org_name = data.portcall.nomination.sub_agent_name;
                    subAgent.org_id = data.portcall.nomination.sub_agent_id;
                }
                return subAgent;
            },
        },
        {
            name: 'pda_final_price',
            depends: 'updated_at',
            persist: false,
            mapping: function(data) {
                let expenses = data.expenses;
                let total = 0;
                if (expenses) {
                    expenses.forEach(function(expense) {
                        total += parseFloat(expense.pda_final_price);
                    });
                }
                return total;
            },
        },
        {
            name: 'dda_final_price',
            depends: 'updated_at',
            persist: false,
            mapping: function(data) {
                let expenses = data.expenses;
                let total = 0;
                if (expenses) {
                    expenses.forEach(function(expense) {
                        total += parseFloat(expense.dda_final_price);
                    });
                }
                return total;
            },
        },
        {
            name: 'fda_final_price',
            depends: 'updated_at',
            persist: false,
            mapping: function(data) {
                let expenses = data.expenses;
                let total = 0;
                if (expenses) {
                    expenses.forEach(function(expense) {
                        if (expense && expense.fda_final_price) total += parseFloat(expense.fda_final_price);
                    });
                }
                return total;
            },
        },
        {
            name: 'agency_balance',
            type: 'auto',
            persist: false,
        },
        {
            name: 'outgoing_payments',
            type: 'auto',
            persist: false,
        },
        {
            name: 'received_payments',
            type: 'auto',
            persist: false,
        },
        {
            name: 'updated_by_user',
            type: 'auto',
            persist: false,
        },
        {
            name: 'show_quantity',
            type: 'boolean',
            mapping: function(res) {
                if (res.data && res.data.show_quantity) return true;
                return false;
            },
        },
    ],
    hasOne: [
        {
            name: 'account',
            model: 'Abraxa.model.account.Account',
            associationKey: 'account',
            reference: 'account_id',
        },
    ],
    hasMany: [
        {
            name: 'payments',
            model: 'Abraxa.model.payment.Payment',
        },
        {
            name: 'vouchers',
            model: 'Abraxa.model.disbursement.Voucher',
            associationKey: 'voucher',
        },
        {
            name: 'sharings',
            model: 'Abraxa.model.disbursement.Sharing',
            associationKey: 'sharings',
        },
        {
            name: 'members',
            model: 'Abraxa.model.disbursement.DisbursementMember',
            associationKey: 'members',
        },
        {
            name: 'approvals',
            model: 'Abraxa.model.approval.Approval',
            associationKey: 'approvals',
        },
        {
            name: 'notes',
            model: 'Abraxa.model.portcall.Note',
            associationKey: 'notes',
        },
        {
            name: 'tasks',
            model: 'Abraxa.model.task.Task',
            associationKey: 'tasks',
        },
        {
            name: 'documents',
            model: 'Abraxa.model.document.Document',
            associationKey: 'documents',
        },
        {
            name: 'expenses',
            model: 'Abraxa.model.portcall.Expense',
            associationKey: 'expenses',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'disbursement',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
