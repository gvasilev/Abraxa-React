import '../voyage/Voyage.jsx';
import './Instruction.jsx';
import '../nomination/Nomination.jsx';
import '../cargo/Cargo.jsx';
import '../berth/Berth.jsx';
import '../sof/SOF.jsx';
import './CargoOps.jsx';
import './Bunkers.jsx';
import './Expense.jsx';
import '../husbandry/Crewing.jsx';
import '../disbursement/Disbursement.jsx';
import '../invitation/Invitation.jsx';
import '../adocs/DocumentFolder.jsx';
import './Member.jsx';
import './Master.jsx';
import './Note.jsx';
import '../task/Task.jsx';
import '../distributionGroup/DistributionGroup.jsx';
import '../amail/Amail.jsx';
import '../account/Account.jsx';
import '../disbursement/Voucher.jsx';
import '../payment/Payment.jsx';
import '../document/Document.jsx';
Ext.define('Abraxa.model.portcall.Portcall', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'voyage_id',
        },
        {
            name: 'da_inquiry_id',
            type: 'auto',
        },
        {
            name: 'status_id',
            type: 'auto',
        },
        {
            name: 'port_eta',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'port_ata',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'port_etd',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'port_atd',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'assigned_to',
            type: 'auto',
        },
        {
            name: 'person_in_charge',
            type: 'auto',
        },
        {
            name: 'created_at',
            type: 'auto',
        },
        {
            name: 'updated_at',
            type: 'auto',
            persist: false,
        },
        {
            name: 'last_published',
            type: 'auto',
        },
        {
            name: 'port_id',
            type: 'auto',
            mapping: function (data) {
                if (data) {
                    if (data.port) {
                        return data.port.id;
                    } else if (data.port_id) {
                        return data.port_id;
                    }
                }
                return null;
            },
        },
        {
            name: 'port_name',
            type: 'auto',
            mapping: function (data) {
                if (data) {
                    if (data.port) {
                        return data.port.name;
                    } else if (data.port_name) {
                        return data.port_name;
                    }
                }
                return null;
            },
        },
        {
            name: 'previous_port',
            type: 'auto',
        },
        {
            name: 'previous_port',
            type: 'auto',
        },
        {
            name: 'next_port_eta',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'voyage',
            type: 'auto',
        },
        {
            name: 'berths',
            type: 'auto',
        },
        {
            name: 'nomination',
            type: 'auto',
        },
        {
            name: 'is_archived',
            type: 'number',
            mapping: function (data) {
                if (data && data.archived_at) {
                    return 1;
                }
                return 0;
            },
        },
        {
            name: 'pre_arrival_submitted',
            type: 'number',
        },
        {
            name: 'notify',
            type: 'auto',
        },
        {
            name: 'agency_type',
            defaultValue: 'charterer nominated',
        },
        {
            name: 'arrival_ps',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'departure_ps',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'documents',
            type: 'auto',
        },
        {
            name: 'needs_publish',
            defaultValue: false,
            persist: false,
        },
        {
            name: 'read_only',
            defaultValue: false,
            persist: false,
        },
        {
            name: 'vessel_name',
            depends: 'voyage',
            persist: false,
            mapping: function (data) {
                if (data && data.voyage) return data.voyage.vessel_name;
            },
        },
        {
            name: 'vessel_name_id',
            depends: 'voyage',
            persist: false,
            mapping: function (data) {
                if (data && data.voyage) return data.voyage.vessel_name;
            },
        },
        {
            name: 'file_id',
            depends: 'voyage',
        },
        {
            name: 'current_berth',
            depends: 'berths',
            persist: false,
            mapping: function (data) {
                let currentBerth = null;
                Ext.each(data.berths, function (rec) {
                    if (rec.is_current) currentBerth = rec;
                });
                if (currentBerth) return currentBerth.name;
            },
        },
        {
            name: 'port_function',
            depends: ['updated_at'],
            // persist: false,
            mapping: function (data) {
                if (data.nomination) return data.nomination.port_function;
            },
        },
        {
            name: 'voyage_number',
            depends: ['updated_at'],
            persist: false,
            mapping: function (data) {
                if (data.nomination) return data.nomination.voyage_number;
            },
            convert: function (val, record) {
                if (record && record.getNomination()) return record.getNomination().get('voyage_number');
            },
        },
        {
            name: 'search_index',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                if (data) {
                    return this.buildSearchIndex(data);
                }
            },
        },
        {
            name: 'status_name',
            mapping: function (data) {
                if (data && data.status_data) {
                    return data.status_data.name;
                }
            },
        },
        {
            name: 'cargo_string',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                if (data && data.cargoes && data.cargoes.length) {
                    let cargo_names = data.cargoes.map(function (value) {
                        return value.commodity;
                    });
                    return this.buildSearchIndex(cargo_names);
                }
            },
        },
        {
            name: 'appointing_party',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                if (data.nomination && data.nomination.appointing_party_id) {
                    return {
                        org_name: data.nomination.appointing_party_name,
                        org_id: data.nomination.appointing_party_id,
                        org_email: data.nomination.appointing_party_email,
                    };
                }
            },
            convert: function (val, record) {
                if (record && record.getNomination() && record.getNomination().get('appointing_party_id')) {
                    return {
                        org_name: record.getNomination().get('appointing_party_name'),
                        org_id: record.getNomination().get('appointing_party_id'),
                        org_email: record.getNomination().get('appointing_party_email'),
                    };
                }
            },
        },
        {
            name: 'appointing_party_name',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                if (data.nomination && data.nomination.appointing_party_name) {
                    return data.nomination.appointing_party_name;
                }
            },
            convert: function (val, record) {
                if (record && record.getNomination() && record.getNomination().get('appointing_party_name'))
                    return record.getNomination().get('appointing_party_name');
            },
        },
        {
            name: 'nominating_party',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                if (data.nomination && data.nomination.nominating_party_id) {
                    return {
                        org_name: data.nomination.nominating_party_name,
                        org_id: data.nomination.nominating_party_id,
                        org_email: data.nomination.nominating_party_email,
                    };
                }
            },
            convert: function (val, record) {
                if (record && record.getNomination() && record.getNomination().get('nominating_party_id')) {
                    return {
                        org_name: record.getNomination().get('nominating_party_name'),
                        org_id: record.getNomination().get('nominating_party_id'),
                        org_email: record.getNomination().get('nominating_party_email'),
                    };
                }
            },
        },
        {
            name: 'nopminating_party_name',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                if (data.nomination) {
                    return data.nomination.nominating_party_name;
                }
            },
            convert: function (val, record) {
                if (record && record.getNomination()) return record.getNomination().get('nopminating_party_name');
            },
        },
        {
            name: 'lead_agent',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                if (data.nomination && data.nomination.lead_agent_id) {
                    return {
                        org_name: data.nomination.lead_agent_name,
                        org_id: data.nomination.leading_agent_id,
                        org_email: data.nomination.lead_agent_email,
                    };
                }
            },
            convert: function (val, record) {
                if (record && record.getNomination() && record.getNomination().get('leading_agent_id')) {
                    return {
                        org_name: record.getNomination().get('lead_agent_name'),
                        org_id: record.getNomination().get('leading_agent_id'),
                        org_email: record.getNomination().get('lead_agent_email'),
                    };
                }
            },
        },
        {
            name: 'sub_agent',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                if (data.nomination && data.nomination.sub_agent_id) {
                    return {
                        org_name: data.nomination.sub_agent_name,
                        org_id: data.nomination.sub_agent_id,
                        org_email: data.nomination.sub_agent_email,
                    };
                }
            },
            convert: function (val, record) {
                if (record && record.getNomination() && record.getNomination().get('sub_agent_id')) {
                    return {
                        org_name: record.getNomination().get('sub_agent_name'),
                        org_id: record.getNomination().get('sub_agent_id'),
                        org_email: record.getNomination().get('sub_agent_email'),
                    };
                }
            },
        },
        {
            name: 'sub_agent_name',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                if (data.nomination && data.nomination.sub_agent_name) {
                    return data.nomination.sub_agent_name;
                }
            },
            convert: function (val, record) {
                if (record && record.getNomination() && record.getNomination().get('sub_agent_name'))
                    return record.getNomination().get('sub_agent_name');

                return null;
            },
        },
        {
            name: 'port_itinerary_date',
            persist: false,
            convert: function (val, record) {
                let date;

                if (record.get('port_eta')) {
                    date = record.get('port_eta');
                }
                if (record.get('port_ata')) {
                    date = record.get('port_ata');
                }
                if (record.get('port_atd')) {
                    date = record.get('port_atd');
                }
                return date;
            },
        },
        {
            name: 'port_itinerary',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                if (data.nomination) return data.nomination.port_function;
            },
            convert: function (val, record) {
                if (record && record.getNomination()) return record.getNomination().get('port_function');
            },
        },
        {
            name: 'abraxa_id',
            persist: false,
            mapping: function (data) {
                if (data.parent_id) return 'ABX-' + data.parent_id;

                return 'ABX-' + data.id;
            },
        },
        {
            name: 'assigned_to_name',
            persist: false,
            mapping: function (data) {
                if (data && data.assignee) return data.assignee.first_name[0] + data.assignee.last_name;
            },
        },
        {
            name: 'updated_by_name',
            persist: false,
            mapping: function (data) {
                if (data && data.updated_by) return data.updated_by.full_name;
            },
        },
        {
            name: 'is_watching',
            mapping: function (data) {
                if (data && data.watching) {
                    return data.watching.find((e) => e.user_id === Env.currentUser.get('id'));
                }
            },
        },
        {
            name: 'agency_type_id',
            depends: ['updated_at'],
            persist: false,
            mapping: function (data) {
                if (data.nomination) return data.nomination.agency_type_id;
            },
            convert: function (val, record) {
                if (record && record.getNomination()) return record.getNomination().get('agency_type_id');
            },
        },
        {
            name: 'status_temp_string',
            persist: false,
        },
        {
            name: 'is_checked',
            persist: false,
        },
        {
            name: 'appointmentTitle',
            persist: false,
        },
        {
            name: 'appointedAgent',
            persist: false,
        },
        {
            name: 'appointmentAccepted',
            persist: false,
        },
        {
            name: 'appointmentStatusIcon',
            persist: false,
        },
        {
            name: 'towage_to_from',
            persist: false,
            mapping: function (data) {
                if (data && data.berths && data.berths.length) {
                    let berths = data.berths;
                    let toBerths = 0;
                    let fromBerths = 0;
                    let vendors = [];
                    Ext.Array.each(berths, function (berth) {
                        if (berth.services) {
                            Ext.Array.each(berth.services, function (service) {
                                if (service.to_num) {
                                    toBerths += parseInt(service.to_num);
                                }

                                if (service.from_num) {
                                    fromBerths += parseInt(service.from_num);
                                }

                                if (!Ext.Array.contains(vendors, service.from_company_name)) {
                                    vendors.push(service.from_company_name);
                                }

                                if (!Ext.Array.contains(vendors, service.to_company_name)) {
                                    vendors.push(service.to_company_name);
                                }
                            });
                        }
                    });
                    let vendorName;
                    let cleanVendors = Ext.Array.clean(vendors);
                    if (cleanVendors && cleanVendors.length) {
                        if (cleanVendors.length > 1) {
                            vendorName = 'Multiple vendors';
                        } else {
                            vendorName = cleanVendors[0];
                        }
                    }
                    if (vendorName) {
                        return (
                            '<div class="hbox"><a class="a_grid_action towage_vendors" href="javascript:void(0)">' +
                            vendorName +
                            '</a>' +
                            ' ' +
                            '<span class="a-badge-counter-md ml-4">' +
                            toBerths +
                            ' / ' +
                            fromBerths +
                            '</span></div>'
                        );
                    }
                }
                return '<span class="a-cell-placeholder">---</span>';
            },
        },
    ],

    idProperty: 'id',
    hasOne: [
        {
            name: 'voyage',
            model: 'Abraxa.model.voyage.Voyage',
            associatedName: 'voyage',
        },
        {
            name: 'instruction',
            model: 'Abraxa.model.portcall.Instruction',
        },
        {
            name: 'nomination',
            model: 'Abraxa.model.nomination.Nomination',
            associationKey: 'nomination',
        },
    ],

    hasMany: [
        {
            name: 'cargoes',
            model: 'Abraxa.model.cargo.Cargo',
            associationKey: 'cargoes',
        },
        {
            name: 'berths',
            model: 'Abraxa.model.berth.Berth',
            associationKey: 'berths',
        },
        {
            name: 'sof',
            model: 'Abraxa.model.sof.SOF',
            associationKey: 'sof',
        },
        {
            name: 'cargo_ops',
            model: 'Abraxa.model.portcall.CargoOps',
            associationKey: 'cargo_ops',
        },
        {
            name: 'bunkers',
            model: 'Abraxa.model.portcall.Bunkers',
            associationKey: 'bunkers',
        },
        {
            name: 'expenses',
            model: 'Abraxa.model.portcall.Expense',
            associationKey: 'expenses',
        },
        {
            name: 'crewings',
            model: 'Abraxa.model.husbandry.Crewing',
            associationKey: 'crewings',
        },
        {
            name: 'disbursements',
            model: 'Abraxa.model.disbursement.Disbursement',
            associationKey: 'disbursements',
        },
        {
            name: 'invitations',
            model: 'Abraxa.model.invitation.Invitation',
            associationKey: 'invitations',
        },
        {
            name: 'folders',
            model: 'Abraxa.model.adocs.DocumentFolder',
            associationKey: 'folders',
        },
        {
            name: 'members',
            model: 'Abraxa.model.portcall.Member',
            associationKey: 'members',
        },
        {
            name: 'masters',
            model: 'Abraxa.model.portcall.Master',
            associationKey: 'masters',
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
            name: 'distribution_groups',
            model: 'Abraxa.model.distributionGroup.DistributionGroup',
            associationKey: 'distribution_groups',
        },
        {
            name: 'amails',
            model: 'Abraxa.model.amail.Amail',
            associationKey: 'amails',
        },
        {
            name: 'accounts',
            model: 'Abraxa.model.account.Account',
            associationKey: 'accounts',
        },
        {
            name: 'vouchers',
            model: 'Abraxa.model.disbursement.Voucher',
            associatedKey: 'vouchers',
        },
        {
            name: 'payments',
            model: 'Abraxa.model.payment.Payment',
            associatedKey: 'payments',
        },
        {
            name: 'documents',
            model: 'Abraxa.model.document.Document',
            associationKey: 'documents',
        },
        {
            name: 'instructions',
            model: 'Abraxa.model.portcall.Instruction',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'portcall',
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
        writer: {
            type: 'json',
            allDataOptions: {
                persist: true,
                associated: true,
            },
            partialDataOptions: {
                changes: true,
                critical: true,
                associated: true,
            },
        },
    },
});
