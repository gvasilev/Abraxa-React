Ext.define('Abraxa.model.portcall.PortcallPrincipal', {
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
            name: 'assignee',
            type: 'auto',
            mapping: function (data) {
                if (data && data.assignee) {
                    return {
                        id: data.assignee.id,
                        first_name: data.assignee.first_name,
                        last_name: data.assignee.last_name,
                        full_name: data.assignee.first_name + ' ' + data.assignee.last_name,
                        profile_image: data.assignee.profile_image,
                    };
                }
                return {
                    id: null,
                    first_name: AbraxaConstants.placeholders.emptyValue,
                    last_name: '',
                    full_name: '',
                    profile_image: null,
                };
            },
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
            dateFormat: 'd M - H:m',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'port_atd',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
            dateWriteFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'port_ETD_ATD',
            mapping: function (data) {
                let eta = AbraxaConstants.placeholders.emptySpan;

                if (data && data.port_etd) {
                    eta = Abraxa.utils.Functions.createPlaceHolders(
                        Abraxa.utils.Functions.formatStringToDate(
                            data.port_etd,
                            AbraxaConstants.formatters.date.dayMonHyphenTime24
                        ),
                        'span'
                    );
                }
                if (data && data.port_atd) {
                    eta = Abraxa.utils.Functions.createPlaceHolders(
                        Abraxa.utils.Functions.formatStringToDate(
                            data.port_atd,
                            AbraxaConstants.formatters.date.dayMonHyphenTime24
                        ),
                        'strong'
                    );
                }
                return eta;
            },
        },
        {
            name: 'port_ETA_ATA',
            mapping: function (data) {
                let eta = AbraxaConstants.placeholders.emptySpan;
                if (data && data.port_eta) {
                    eta = Abraxa.utils.Functions.createPlaceHolders(
                        Abraxa.utils.Functions.formatStringToDate(
                            data.port_eta,
                            AbraxaConstants.formatters.date.dayMonHyphenTime24
                        ),
                        'span'
                    );
                }
                if (data && data.port_ata) {
                    eta = Abraxa.utils.Functions.createPlaceHolders(
                        Abraxa.utils.Functions.formatStringToDate(
                            data.port_ata,
                            AbraxaConstants.formatters.date.dayMonHyphenTime24
                        ),
                        'strong'
                    );
                }
                return eta;
            },
        },
        {
            name: 'latest_event',
            mapping: function (data) {
                let event_name = AbraxaConstants.placeholders.emptySpan;
                let category = '';
                if (data.sof && data.sof[0] && data.sof[0].events && data.sof[0].events[0]) {
                    event_name = data.sof[0].events[0].event_name || AbraxaConstants.placeholders.emptySpan;
                    category = data.sof[0].events[0].event_category || '';
                }

                return { name: event_name, category: category };
            },
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
        },
        {
            name: 'port_name',
            type: 'auto',
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
            name: 'vessel',
            depends: 'voyage',
            persist: false,
            mapping: function (data) {
                if (data && data.voyage && data.voyage.vessel) {
                    return {
                        id: data.voyage.id || '',
                        name: data.voyage.vessel.name || AbraxaConstants.placeholders.emptyValue,
                    };
                } else {
                    return {
                        id: '',
                        name: AbraxaConstants.placeholders.emptyValue,
                    };
                }
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
            persist: false,
            mapping: function (data) {
                return data.nomination && data.nomination.port_function
                    ? data.nomination.port_function
                    : AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            name: 'voyage_number',
            depends: ['updated_at'],
            persist: false,
            mapping: function (data) {
                if (data && data.nomination) return data.nomination.voyage_number;
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
            name: 'cargo_quantity',
            persist: false,
            mapping: function (data) {
                let cargoes = [];
                let str = '';
                let label_str = '';
                let firstCargoId = null;
                if (data && data.cargoes && data.cargoes.length > 0) {
                    cargoes = data.cargoes.map((cargo) => ({
                        commodity: cargo.cargo_commodity ? cargo.cargo_commodity.name : null,
                        id: cargo.cargo_commodity ? cargo.cargo_commodity.id : null,
                        quantity: cargo.quantity ? cargo.quantity : cargo.bl_quantity,
                        function: cargo.function,
                        unit: cargo.unit,
                    }));
                    cargoes.forEach(function (cargo, index) {
                        if (cargo) {
                            if (cargo.function) {
                                switch (cargo.function) {
                                    case 'Loading':
                                        str = 'L';
                                        break;
                                    case 'Discharging':
                                        str = 'D';
                                        break;
                                    case 'Transshipment':
                                        str = 'TS';
                                        break;
                                    case 'Lightering':
                                        str = 'LT';
                                        break;

                                    default:
                                        break;
                                }
                            }
                            if (index == 0) {
                                firstCargoId = cargo.id;
                                label_str +=
                                    '<div class="a-cargo-item"><div class="a-cargo-title"><span>' +
                                    Ext.util.Format.number(cargo.quantity, '0,000.000') +
                                    ' ' +
                                    cargo.unit +
                                    '</span><span class="a-function a-function-sm function-' +
                                    cargo.function +
                                    '"  data-qtip="' +
                                    cargo.function +
                                    '"data-qalign="bc-tc" data-qanchor="true">' +
                                    str +
                                    '</span></div></div>' +
                                    '<div class="a-commodity a-link">' +
                                    cargo.commodity +
                                    '</div>';
                            } else if (index == 1) {
                                label_str =
                                    '<div  class="a-val-link more">Multiple' +
                                    '&nbsp;<span class="sm-title">(' +
                                    cargoes.length +
                                    ')</div>';
                            }
                        }
                    });
                } else {
                    return { quantity: AbraxaConstants.placeholders.emptySpan };
                }
                return {
                    cargoes: cargoes,
                    quantity:
                        '<div class="quantity" id="' +
                        firstCargoId +
                        '""data-qalign="bc-tc" data-qanchor="true" data-qshowdelay="0" data-qhideDelay="500">' +
                        label_str +
                        '<div/>',
                };
            },
        },
        {
            name: 'appointing_party',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                if (data && data.nomination && data.nomination.appointing_party_id) {
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
                if (data && data.nomination && data.nomination.appointing_party_name) {
                    return data.nomination.appointing_party_name;
                }
                return AbraxaConstants.placeholders.emptyValue;
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
                if (data && data.nomination && data.nomination.nominating_party_id) {
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
                return AbraxaConstants.placeholders.emptyValue;
            },
            convert: function (val, record) {
                if (record && record.getNomination()) return record.getNomination().get('nopminating_party_name');
            },
        },
        {
            name: 'port_stay',
            mapping: function (data) {
                if (data.port_ata === null || data.port_atd === null) return AbraxaConstants.placeholders.emptyValue;
                const durationInMilliseconds = data.port_atd - data.port_ata;

                const days = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24));
                const hours = Math.floor((durationInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

                return (days ? days + 'days' : '') + (hours ? hours + 'hrs' : '') + (minutes ? minutes + 'min' : '');
            },
        },
        {
            name: 'status_string',
            type: 'string',
        },
        {
            name: 'lead_agent',
            depends: 'updated_at',
            persist: false,
            mapping: function (data) {
                return {
                    org_name:
                        data.nomination && data.nomination.lead_agent_name ? data.nomination.lead_agent_name : null,
                    org_id: data.nomination && data.nomination.lead_agent_id ? data.nomination.lead_agent_id : null,
                    org_email:
                        data.nomination && data.nomination.lead_agent_email ? data.nomination.lead_agent_email : null,
                };
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
                if (data && data.nomination && data.nomination.sub_agent_id) {
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

                return AbraxaConstants.placeholders.emptyValue;
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
                if (data && data.nomination) return data.nomination.port_function;
                return AbraxaConstants.placeholders.emptyValue;
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
                if (data && data.assignee) return data.assignee.first_name[0] + '. ' + data.assignee.last_name;
                return AbraxaConstants.placeholders.emptyValue;
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
                if (data && data.nomination) return data.nomination.agency_type_id;
                return AbraxaConstants.placeholders.emptyValue;
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
            name: 'port_etb',
            mapping: function (data) {
                let etb = AbraxaConstants.placeholders.emptySpan;
                if (data && data.berths && data.berths.length > 0) {
                    let currentBerth = data.berths.find((berth) => berth.is_current);
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
