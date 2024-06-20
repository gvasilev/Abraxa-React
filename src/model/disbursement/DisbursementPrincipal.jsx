import './Voucher';
import './Sharing';
import './DisbursementMember';
import '../approval/Approval';
import '../portcall/Note';
import '../task/Task';
import '../document/Document';
import '../portcall/Expense';

Ext.define('Abraxa.model.disbursement.DisbursementPrincipal', {
    extend: 'Ext.data.Model',
    idProperty: 'id',

    fields: [
        {
            name: 'voyage_id',
            mapping: function (data) {
                return data.portcall ? data.portcall.voyage_id : AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            name: 'vessel',
            mapping: function (data) {
                return data.portcall && data.portcall.voyage && data.portcall.voyage.vessel
                    ? data.portcall.voyage.vessel
                    : {
                          name: AbraxaConstants.placeholders.emptyValue,
                          id: null,
                      };
            },
        },
        {
            name: 'da_id',
            mapping: function (data) {
                return data.group_id ? data.group_id : AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            name: 'port',
            mapping: function (data) {
                return data.portcall && data.portcall.port_name
                    ? {
                          name: data.portcall.port_name || AbraxaConstants.placeholders.emptyValue,
                          id: data.portcall.port_id || '',
                      }
                    : { name: AbraxaConstants.placeholders.emptyValue, id: null };
            },
        },
        {
            name: 'lead_agent',
            mapping: function (data) {
                return data.portcall && data.portcall.nomination && data.portcall.nomination.lead_agent_name
                    ? { name: data.portcall.nomination.lead_agent_name, id: data.portcall.nomination.lead_agent_id }
                    : { name: AbraxaConstants.placeholders.emptyValue, id: null };
            },
        },
        {
            name: 'ETD_ATD',
            mapping: function (data) {
                let eta = AbraxaConstants.placeholders.emptySpan;
                if (data.portcall && data.portcall.port_etd) {
                    eta = Abraxa.utils.Functions.createPlaceHolders(
                        Abraxa.utils.Functions.formatStringToDate(
                            data.portcall.port_etd,
                            AbraxaConstants.formatters.date.dayMonHyphenTime24
                        ),
                        'strong'
                    );
                }
                if (data.portcall && data.portcall.port_atd) {
                    eta = Abraxa.utils.Functions.createPlaceHolders(
                        Abraxa.utils.Functions.formatStringToDate(
                            data.portcall.port_atd,
                            AbraxaConstants.formatters.date.dayMonHyphenTime24
                        ),
                        'span'
                    );
                }
                return eta;
            },
        },

        {
            name: 'id',
            type: 'integer',
            persist: false,
        },
        {
            name: 'status',
            type: 'string',
            defaultValue: 'draft',
        },
        {
            name: 'balance',
            type: 'number',
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
            convert: function (v, rec) {
                if (rec.get('show_vat') || rec.get('show_discount')) {
                    return true;
                }
                return false;
            },
        },
        {
            name: 'total_costs',
            mapping: function (data) {
                return Ext.util.Format.number(data.total_costs || 0, '0,000.00');
            },
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
            name: 'sorting_pda_total_costs',
            type: 'auto',
            mapping: function (data) {
                return data.pda && data.pda.total_costs
                    ? data.pda.total_costs
                    : data.type === 'pda'
                      ? data.total_costs
                      : 0;
            },
        },
        {
            name: 'sorting_dda_total_costs',
            type: 'auto',
            mapping: function (data) {
                return data.dda && data.dda.total_costs
                    ? data.dda.total_costs
                    : data.type === 'dda'
                      ? data.total_costs
                      : 0;
            },
        },
        {
            name: 'sorting_fda_total_costs',
            type: 'auto',
            mapping: function (data) {
                return data.fda && data.fda.total_costs
                    ? data.fda.total_costs
                    : data.type === 'fda'
                      ? data.total_costs
                      : 0;
            },
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
            mapping: function (data) {
                if (data.portcall) return Date.parse(data.portcall.port_eta);
            },
        },
        {
            name: 'portcall_etd',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                if (data.portcall) return Date.parse(data.portcall.port_etd);
            },
        },
        {
            name: 'voyage_number',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                if (data.portcall && data.portcall.nomination) return data.portcall.nomination.voyage_number;
            },
        },
        {
            name: 'agency_type',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                if (data.portcall && data.portcall.nomination) return data.portcall.nomination.agency_type_name;
            },
        },
        {
            name: 'sub_agent',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
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
            name: 'agency_balance',
            type: 'auto',
            persist: false,
        },
        {
            name: 'outgoing_payments',
            type: 'auto',
            defaultValue: 0,
            persist: false,
        },
        {
            name: 'show_variance',
            type: 'boolean',
            mapping: function (res) {
                if (res.data && res.data.show_variance) return true;
                return false;
            },
        },
        {
            name: 'client_balance',
            mapping: function (data) {
                return Ext.util.Format.number(data.client_balance || 0, '0,000.00');
            },
        },
        {
            name: 'updated_by_user',
            type: 'auto',
            persist: false,
        },
        {
            name: 'show_quantity',
            type: 'boolean',
            mapping: function (res) {
                if (res.data && res.data.show_quantity) return true;
                return false;
            },
        },
        {
            name: 'file_id', //this is used for Port call ID in disbursements grids.
            type: 'string',
            mapping: function (data) {
                return data.portcall && data.portcall.file_id
                    ? data.portcall.file_id
                    : AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            name: 'ETA_ATA',
            mapping: function (data) {
                let eta = AbraxaConstants.placeholders.emptySpan;
                if (data.portcall && data.portcall.port_eta) {
                    eta = Abraxa.utils.Functions.createPlaceHolders(
                        Abraxa.utils.Functions.formatStringToDate(
                            data.portcall.port_eta,
                            AbraxaConstants.formatters.date.dayMonHyphenTime24
                        ),
                        'strong'
                    );
                }
                if (data.portcall && data.portcall.port_ata) {
                    eta = Abraxa.utils.Functions.createPlaceHolders(
                        Abraxa.utils.Functions.formatStringToDate(
                            data.portcall.port_ata,
                            AbraxaConstants.formatters.date.dayMonHyphenTime24
                        ),
                        'span'
                    );
                }
                return eta;
            },
        },
        {
            name: 'port_eta',
            mapping: function (data) {
                let eta = AbraxaConstants.placeholders.emptySpan;
                if (data.portcall && data.portcall.port_eta) {
                    eta = Abraxa.utils.Functions.createPlaceHolders(
                        Abraxa.utils.Functions.formatStringToDate(
                            data.portcall.port_eta,
                            AbraxaConstants.formatters.date.dayMonHyphenTime24
                        ),
                        'strong'
                    );
                }
                return eta;
            },
        },
        {
            name: 'port_etb',
            mapping: function (data) {
                let etb = AbraxaConstants.placeholders.emptySpan;
                if (data.portcall && data.portcall.berths && data.portcall.berths.length > 0) {
                    let currentBerth = data.portcall.berths.find((berth) => berth.is_current);
                    if (currentBerth && currentBerth.etb) {
                        etb = Abraxa.utils.Functions.createPlaceHolders(
                            Abraxa.utils.Functions.formatStringToDate(
                                currentBerth.etb,
                                AbraxaConstants.formatters.date.dayMonHyphenTime24
                            ),
                            'strong'
                        );
                    }
                }
                return etb;
            },
        },
        {
            name: 'port_ata',
            mapping: function (data) {
                let ata = AbraxaConstants.placeholders.emptySpan;
                if (data.portcall && data.portcall.port_ata) {
                    ata = Abraxa.utils.Functions.createPlaceHolders(
                        Abraxa.utils.Functions.formatStringToDate(
                            data.portcall.port_ata,
                            AbraxaConstants.formatters.date.dayMonHyphenTime24
                        ),
                        'strong'
                    );
                }
                return ata;
            },
        },
        {
            name: 'port_atd',
            mapping: function (data) {
                let atd = AbraxaConstants.placeholders.emptySpan;
                if (data.portcall && data.portcall.port_atd) {
                    atd = Abraxa.utils.Functions.createPlaceHolders(
                        Abraxa.utils.Functions.formatStringToDate(
                            data.portcall.port_atd,
                            AbraxaConstants.formatters.date.dayMonHyphenTime24
                        ),
                        'strong'
                    );
                }
                return atd;
            },
        },
        {
            name: 'appointing_party',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                let appointingParty = {
                    org_name: null,
                    org_id: null,
                };

                if (data.portcall && data.portcall.nomination) {
                    appointingParty.org_name = data.portcall.nomination.appointing_party_name;
                    appointingParty.org_id = data.portcall.nomination.appointing_party_id;
                }
                return appointingParty;
            },
        },
        {
            name: 'nominating_party',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                let nominatingParty = {
                    org_name: null,
                    org_id: null,
                };

                if (data.portcall && data.portcall.nomination) {
                    nominatingParty.org_name = data.portcall.nomination.nominating_party_name;
                    nominatingParty.org_id = data.portcall.nomination.nominating_party_id;
                }
                return nominatingParty;
            },
        },
        {
            name: 'refund',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                let total = 0;
                if (data && data.account && data.account.payments && data.account.payments.length > 0) {
                    const account = data.account;
                    account.payments.forEach(function (payment) {
                        if (payment.kind === 'outgoing' && payment.to_org_id === account.org_id) {
                            total += parseFloat(payment.calculated_amount);
                        }
                    });
                }
                return Ext.util.Format.number(total, '0,000.00');
            },
        },
        {
            name: 'my_payments',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                let total = 0;
                if (data && data.account && data.account.payments && data.account.payments.length > 0) {
                    const account = data.account,
                        record = data;
                    account.payments.forEach(function (payment) {
                        if (
                            payment.from_org_id === account.org_id &&
                            payment.paymentable_type === record.model_name &&
                            payment.paymentable_id === record.id
                        ) {
                            total += parseFloat(payment.calculated_amount);
                        }
                    });
                }
                return Ext.util.Format.number(total, '0,000.00');
            },
        },
        {
            name: 'balance',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                let balance = 0;
                if (data && data.account) {
                    balance = data.account.balance;
                }
                return Ext.util.Format.number(balance, '0,000.00');
            },
        },
    ],
    hasMany: [
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
