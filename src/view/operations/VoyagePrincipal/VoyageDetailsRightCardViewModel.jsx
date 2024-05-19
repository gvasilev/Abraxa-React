Ext.define('Abraxa.view.operations.VoyagePrincipal.VoyageDetailsRightCardViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.VoyageDetailsRightCardViewModel',
    data: {
        selectedVoyage: null,
    },
    formulas: {
        voyageItineraryPortCall: {
            bind: {
                bindTo: '{selectedVoyage}',
            },
            get: function (voyageItineraryPortCall) {
                const view = this.getView();
                const vm = this;
                view.down('tabbar').setActiveTab(0);
                view.setMasked(false);
                if (!voyageItineraryPortCall) return;

                const portcalls = voyageItineraryPortCall.portcalls().setSorters([
                    {
                        property: 'id',
                        direction: 'ASC',
                    },
                ]).data.items;
                const result = [];
                portcalls.forEach((portcall) => {
                    let cargoes = [];
                    if (portcall.cargoes().count() > 0) {
                        cargoes = portcall
                            .cargoes()
                            .getData()
                            .items.map((cargo) => ({
                                ...cargo.data,
                                name: cargo.data.commodity,
                                quantity: cargo.data.quantity,
                                unit: cargo.data.unit,
                                id: cargo.data.cargo_commodity ? cargo.data.cargo_commodity.id : null,
                            }));
                    }

                    const newStore = Ext.create('Ext.data.Store', {
                        data: [],
                    });

                    portcall
                        .sof()
                        .getData()
                        .items.forEach((el) => newStore.add(...el.events().getData().items));

                    newStore.data.sort('event_date', 'ASC');
                    const latestEvent = newStore.count() > 1 ? newStore.last().get('event_name') : null;
                    const latestEventType = newStore.count() > 1 ? newStore.last().get('type').name : null;

                   const currentUserCompanyId = vm.get('currentUser.company.id');

                    const data = portcall.data;
                    // const invitations = portcall.invitations().getData().items;
                    Object.assign(data, {
                        cargoes: cargoes,
                        currentUserCompanyId: currentUserCompanyId,
                        invitations: portcall.invitations().getData().items,
                    });

                    const transformedData = Object.keys(data).reduce((acc, key) => {
                        switch (key) {
                            case 'assigned_user':
                                acc.assignedUser = data[key];
                                break;
                            case 'port':
                                acc.portName = data[key].name;
                                acc.portCountryCode = data[key].country.country_code;
                                break;
                            case 'port_function':
                                acc.portFunction = data[key];
                                break;
                            case 'port_eta':
                                acc.portEtaDate = Ext.Date.format(
                                    data[key],
                                    AbraxaConstants.formatters.date.dayMonHyphenTime12
                                );
                                acc.portEtaHide = data[key] ? false : true;
                                break;
                            case 'port_etd':
                                acc.portEtdDate = data[key]
                                    ? Ext.Date.format(data[key], AbraxaConstants.formatters.date.dayMonHyphenTime12)
                                    : AbraxaConstants.placeholders.emptyValue;
                                acc.portEtdHide = data[key] ? false : true;
                                break;
                            case 'lead_agent':
                                const invitation = data.invitations.find(
                                    (el) => el.data.company.id === currentUserCompanyId
                                );
                                acc.appointedAgent =
                                    data.lead_agent && data.lead_agent.org_name ? data.lead_agent.org_name : '';
                                acc.hasAppointment = invitation && invitation.get('company').name ? true : false;
                                if (invitation) {
                                    switch (invitation.get('status')) {
                                        case 'Accepted':
                                            acc.appointmentTitle = 'Appointed agent';
                                            break;
                                        case 'Pending':
                                            acc.appointmentTitle = 'Pending agent';
                                            break;
                                        case 'Declined':
                                            acc.appointmentTitle = 'Rejected appointment';
                                            acc.rejected = true;
                                            break;

                                        default:
                                            break;
                                    }
                                }
                                acc.appointmentAccepted =
                                    invitation && invitation.get('status') === 'Accepted' ? true : false;
                                acc.appointmentRejected =
                                    invitation && invitation.get('status') === 'Declined' ? true : false;
                                acc.appointmentPending =
                                    invitation && invitation.get('status') === 'Pending' ? true : false;

                                break;
                            case 'voyage_status':
                                switch (data[key]) {
                                    case 'current':
                                        acc.portItineraryStatus = 'at-port';
                                        acc.portStayHide = true;
                                        acc.portArrivedHide = false;
                                        acc.portSailedHide = true;
                                        acc.portArrivedDate = Ext.Date.format(data.port_ata, 'j F - h:i');
                                        break;
                                    case 'previous':
                                        acc.portItineraryStatus = 'sailed';
                                        acc.portStayHide = false;
                                        acc.portArrivedHide = true;
                                        acc.portSailedHide = false;
                                        acc.portSailedDate = Ext.Date.format(data.port_atd, 'j F - h:i');

                                        break;
                                    case 'past':
                                        acc.portItineraryStatus = 'sailed';
                                        acc.portStayHide = false;
                                        acc.portArrivedHide = true;
                                        acc.portSailedHide = false;
                                        acc.portSailedDate = Ext.Date.format(data.port_atd, 'j F - h:i');
                                        const durationInMilliseconds = data.port_atd - data.port_ata;

                                        const days = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24));
                                        const hours = Math.floor(
                                            (durationInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
                                        );
                                        const minutes = Math.floor(
                                            (durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)
                                        );
                                        acc.portStayDays = days;
                                        acc.portStayHrs = hours;
                                        acc.portStayMins = minutes;
                                        break;
                                    case 'future':
                                        acc.portItineraryStatus = 'expected';
                                        acc.portSailedHide = true;
                                        acc.portStayHide = true;
                                        acc.portArrivedHide = true;

                                        break;

                                    default:
                                        break;
                                }

                                break;

                            case 'cargoes':
                                acc.cargo = {};
                                acc.cargo.cargoes = [];
                                acc.cargo.cargo = '<span class="a-display-label">Cargo:</span>';
                                if (data[key].length > 0) {
                                    let label_str = `<span class="a-display-value">${data[key][0].quantity} ${data[key][0].unit} - ${data[key][0].name}</span>`;
                                    if (data[key].length > 1) {
                                        label_str =
                                            '<div style= "cursor: pointer; color: #03608E" class="a-val-link">Multiple' +
                                            '&nbsp;<span class="sm-title">(' +
                                            data[key].length +
                                            ')</div>';
                                        acc.cargo.cargoes.push(...data[key]);
                                    }
                                    acc.cargo.cargo += '<div >' + label_str + '<div/>';
                                } else {
                                    acc.cargo.cargo += AbraxaConstants.placeholders.emptyValue;
                                }
                                break;
                            default:
                                break;
                        }

                        acc.id = data.id;
                        return acc;
                    }, {});
                    transformedData.portEventReason = latestEvent;
                    transformedData.portEventType = latestEventType ? latestEventType.toLowerCase() : '';
                    result.push(transformedData);
                });
                return result;
            },
        },

        activePortCallToDo: {
            bind: {
                bindTo: '{selectedVoyage}',
                deep: true,
            },
            get: function (selectedVoyage) {
                const tasks = [];
                if (selectedVoyage && selectedVoyage.tasks()) {
                    selectedVoyage
                        .tasks()
                        .getData()
                        .items.forEach((task) => {
                            if (task.get('status') !== 'completed') {
                                tasks.push(task);
                            }
                        });
                }
                return new Ext.data.Store({
                    data: tasks,
                    storeId: 'activePortCallToDo',
                });
            },
        },

        donePortCallToDo: {
            bind: {
                bindTo: '{selectedVoyage}',
                deep: true,
            },
            get: function (selectedVoyage) {
                const tasks = [];
                if (selectedVoyage && selectedVoyage.tasks()) {
                    selectedVoyage
                        .tasks()
                        .getData()
                        .items.forEach((task) => {
                            if (task.get('status') === 'completed') {
                                tasks.push(task);
                            }
                        });
                }
                return new Ext.data.Store({
                    data: tasks,
                });
            },
        },

        activePortCallCount: {
            bind: {
                bindTo: '{selectedVoyage}',
                deep: true,
            },
            get: function (selectedVoyage) {
                if (selectedVoyage && selectedVoyage.tasks()) {
                    const tasks = [];
                    selectedVoyage
                        .tasks()
                        .getData()
                        .items.forEach((task) => {
                            if (task.get('status') !== 'completed') {
                                tasks.push(task);
                            }
                        });
                    return tasks.length;
                }
                return 0;
            },
        },
    },
});
