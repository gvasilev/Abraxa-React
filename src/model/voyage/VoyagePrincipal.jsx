function _getActivePortCall(id, portCalls) {
    if (portCalls) {
        return portCalls.find((portCall) => portCall.id === id);
    }
}
import '../inquiry/Inquiry.jsx';
import '../portcall/Portcall.jsx';
import '../invitation/Invitation.jsx';
import '../task/Task.jsx';
Ext.define('Abraxa.model.voyage.VoyagePrincipal', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'voyage_number',
            type: 'string',
        },
        {
            name: 'vessel_name',
            type: 'string',
        },
        {
            name: 'port_prefix',
            mapping: function (data) {
                const activePortCall = _getActivePortCall(data.active_portcall_id, data.portcalls);
                if (!activePortCall) return AbraxaConstants.placeholders.emptyValue;
                const statusName = activePortCall.status ? activePortCall.status.name : null;
                switch (statusName) {
                    case 'Scheduled':
                        return 'for';
                    case 'Sailed':
                        return 'from';
                    case 'enroute':
                        return 'to';

                    default:
                        return 'at';
                }
            },
        },
        {
            name: 'vessel_name_string',
            depends: 'updated_at',
            mapping: function (data) {
                if (data && data.vessel && data.vessel.name) {
                    return data.vessel.name
                        ? '<div id=' +
                              data.vessel.id +
                              ' class="a-val-link-xl vessel-name-click">' +
                              data.vessel.name +
                              '</div>'
                        : AbraxaConstants.placeholders.emptyValue;
                }

                return '<div  class="a-val-link-xl vessel-name-click">---</div>';
            },
        },
        {
            name: 'status_name', //TODO, need to be fixed after clarify the API or ask Joro Vasilev
            mapping: function (data) {
                const activePortCall = _getActivePortCall(data.active_portcall_id, data.portcalls);
                return activePortCall.status ? activePortCall.status.name : AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            name: 'appointed_status_column',
            mapping: function (data) {
                const appointedStatusObject = {
                    hasAppointment: false,
                    appointmentCompanyName: null,
                    appointmentCompanyEmail: null,
                    appointmentAccepted: null,
                    appointedStatus: null,
                    info: null,
                };
                const activePortCall = _getActivePortCall(data.active_portcall_id, data.portcalls);
                if (!activePortCall) return appointedStatusObject;
                const currentUser = Ext.Viewport.getViewModel().get('currentUser');
                const currentUserCompanyId = currentUser.get('company').id;
                const currentUserCompanyName = currentUser.get('company').name;

                const invitation = activePortCall.invitations[0];

                appointedStatusObject.hasAppointment = invitation ? true : false;

                appointedStatusObject.appointmentCompanyName =
                    invitation && activePortCall.nomination.lead_agent_name
                        ? activePortCall.nomination.lead_agent_name
                        : AbraxaConstants.placeholders.emptyValue;
                appointedStatusObject.appointmentCompanyEmail =
                    invitation && invitation.invitation_email ? invitation.invitation_email : null;
                appointedStatusObject.appointmentAccepted =
                    invitation && invitation.status === 'Accepted' ? true : false;
                appointedStatusObject.appointedStatus = invitation && invitation.status ? invitation.status : null;

                if (appointedStatusObject.appointmentAccepted && activePortCall.disbursement) {
                    const account = activePortCall.disbursement.account;
                    appointedStatusObject.appointedStatus =
                        account.funded + ' (' + account.account_currency + ' ' + account.balance + ')';
                }
                return appointedStatusObject;
            },
        },
        {
            name: 'status_string',
            mapping: function (data) {
                const activePortCall = _getActivePortCall(data.active_portcall_id, data.portcalls);
                return activePortCall.status ? activePortCall.status.string : AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            name: 'port_name',
            mapping: function (data) {
                const activePortCall = _getActivePortCall(data.active_portcall_id, data.portcalls);
                return activePortCall.port_name ? activePortCall.port_name : activePortCall.port.name;
            },
        },
        {
            name: 'port_id',
            mapping: function (data) {
                const activePortCall = _getActivePortCall(data.active_portcall_id, data.portcalls);
                return activePortCall.port ? activePortCall.port.id : null;
            },
        },
        {
            name: 'active_portcall',
            mapping: function (data) {
                const activePortCall = _getActivePortCall(data.active_portcall_id, data.portcalls);
                return activePortCall;
            },
        },
        {
            name: 'port_eta',
            mapping: function (data) {
                const activePortCall = _getActivePortCall(data.active_portcall_id, data.portcalls);
                if (!activePortCall) AbraxaConstants.placeholders.emptyValue;
                if (activePortCall && activePortCall.port_eta) {
                    return Ext.Date.format(
                        new Date(_getActivePortCall(data.active_portcall_id, data.portcalls).port_eta),
                        AbraxaConstants.formatters.date.dayMonthYearTime24Slash
                    );
                }
                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            name: 'commodity_quantity',
            mapping: function (data) {
                const activePortCall = _getActivePortCall(data.active_portcall_id, data.portcalls);
                if (!activePortCall) return;
                const cargoes = activePortCall.cargoes;
                let label_str = '';
                let id = null;

                if (cargoes && cargoes.length > 0) {
                    cargoes.forEach(function (cargo, index) {
                        if (cargo) {
                            let str = '';

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
                                if (cargo.commodity_id) {
                                    label_str +=
                                        '<div class="a-cargo-item"><div class="a-cargo-title"><span class="a-qty">' +
                                        Ext.util.Format.number(cargo.quantity, '0,000.000') +
                                        ' ' +
                                        cargo.unit +
                                        '</span><br><span class="a-val-link single" id="' +
                                        cargo.cargo_commodity.id +
                                        '">' +
                                        cargo.commodity +
                                        '</span><span class="a-function a-function-sm function-' +
                                        cargo.function +
                                        '"  data-qtip="' +
                                        cargo.function +
                                        '"data-qalign="bc-tc" data-qanchor="true">' +
                                        str +
                                        '</span></div></div>';
                                }
                            } else if (index == 1) {
                                // 'Multiple' + '&nbsp;<span class="sm-title">(' + (cargoes.length()) + ')</span>'
                                label_str =
                                    '<div  class="a-val-link">Multiple' +
                                    '&nbsp;<span class="sm-title">(' +
                                    cargoes.length +
                                    ')</div>';
                            }
                        }
                    });
                } else {
                    return { commodity_quantity: AbraxaConstants.placeholders.emptySpan, commodities: [] };
                }

                return {
                    commodities: cargoes.map((cargo) => ({
                        // ...cargo,
                        bl_unit: cargo.bl_unit ? cargo.bl_unit : null,
                        commodity: cargo.commodity ? cargo.commodity : null,
                        quantity: cargo.quantity ? cargo.quantity : null,
                        function: cargo.function ? cargo.function : null,
                        id: cargo.cargo_commodity ? cargo.cargo_commodity.id : null,
                    })),
                    commodity_quantity:
                        '<div "data-qalign="bc-tc" data-qanchor="true" data-qshowdelay="0" data-qhideDelay="500">' +
                        label_str +
                        '<div/>',
                };
            },
        },
        {
            name: 'appointed_agent', //TODO, missing data
            mapping: function (data) {
                const activePortCall = _getActivePortCall(data.active_portcall_id, data.portcalls);
                const agentName = activePortCall.nomination
                    ? activePortCall.nomination.lead_agent_name
                    : AbraxaConstants.placeholders.emptyValue;
                const agentId = activePortCall.nomination
                    ? activePortCall.nomination.lead_agent_id
                    : AbraxaConstants.placeholders.emptyValue;

                return agentName
                    ? '<div id=' + agentId + ' class="a-val-link appointed-agent-click">' + agentName + '</div>'
                    : AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            name: 'todo_count',
            mapping: function (data) {
                return data && data.tasks ? data.tasks.length : 0;
            },
        },
        {
            name: 'profile_image_url',
            mapping: function (data) {
                const activePortCall = _getActivePortCall(data.active_portcall_id, data.portcalls);
                if (data.assigned_user && data.assigned_user.profile_image) {
                    return data.assigned_user.profile_image;
                }
                return null;
            },
        },
        {
            name: 'assigned_user_name',
            mapping: function (data) {
                const activePortCall = _getActivePortCall(data.active_portcall_id, data.portcalls);
                if (data && data.assigned_user && data.assigned_user.first_name && data.assigned_user.last_name)
                    return data.assigned_user.first_name + ' ' + data.assigned_user.last_name;

                return AbraxaConstants.placeholders.emptyValue;
            },
        },
        {
            name: 'active_portcall_id',
            mapping: function (data) {
                return _getActivePortCall(data.active_portcall_id, data.portcalls).id;
            },
        },
        {
            name: 'assigned_to',
            mapping: function (data) {
                if (data && data.assigned_user) {
                    return data.assigned_user.id;
                }
            },
        },
        {
            name: 'updated_at',
            type: 'auto',
        },
        {
            name: 'company_id',
            type: 'auto',
        },
        {
            name: 'vessel_imo',
            type: 'auto',
        },
        {
            name: 'vessel_is_bowthruster_fitted',
            type: 'auto',
        },
        {
            name: 'is_dry',
            type: 'auto',
        },
        {
            name: 'voyage_number',
            type: 'auto',
        },
        {
            name: 'reference_number',
            type: 'auto',
        },
        {
            name: 'file_id',
            type: 'auto',
        },
        {
            name: 'office_id',
            type: 'auto',
        },
        {
            name: 'type_id',
            type: 'auto',
        },
        {
            name: 'cp_date',
            type: 'date',
            dateFormat: 'Y-m-d H:i:s',
        },
        {
            name: 'vessel_data',
            type: 'auto',
            critical: true,
        },
    ],
    hasMany: [
        {
            name: 'inquiries',
            model: 'Abraxa.model.inquiry.Inquiry',
            associatedKey: 'inquiries',
        },
        {
            name: 'portcalls',
            model: 'Abraxa.model.portcall.Portcall',
        },
        {
            name: 'invitations',
            model: 'Abraxa.model.invitation.Invitation',
            associatedKey: 'invitations',
        },
        {
            name: 'tasks',
            model: 'Abraxa.model.task.Task',
        },
    ],
    proxy: {
        type: 'rest',
        api: {
            read: Env.ApiEndpoint + 'voyages',
            update: Env.ApiEndpoint + 'voyages',
            create: Env.ApiEndpoint + 'voyages',
            destroy: Env.ApiEndpoint + 'voyages',
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
