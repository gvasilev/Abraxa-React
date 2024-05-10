Ext.define('Abraxa.view.cdb.company.CompanyController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.cdb.company.controller',

    init: function () {},
    saveObjectRecordOnFieldBlur: function (field) {
        if (!field || !field.upVM()) return;

        let record = field.upVM().get('object_record');

        if (!record || !record.dirty) return;

        record.save({
            success: function (record, operation) {
                Ext.toast('Record updated', 1000);
            },
            failure: function (record, response) {
                var msg =
                    response &&
                    response.error &&
                    response.error.response &&
                    response.error.response.responseJson &&
                    response.error.response.responseJson.message;

                Ext.Msg.alert('Something went wrong', msg || 'Something went wrong while updating the record.');
            },
        });
    },
    onBalanceLinkClick: function (extEvent, domEl, eOpts) {
        const controller = this;
        const cmp = controller.getView();
        if (!cmp || !cmp.upVM() || !cmp.upVM().get('object_record') || !cmp.upVM().get('object_record').get('org_id')) {
            return;
        }

        const orgId = cmp.upVM().get('object_record').get('org_id');

        const linkClicked = eOpts.delegate;
        let url = '';
        let title = '';
        if (linkClicked === 'a.appointments-link') {
            url = Env.ApiEndpoint + 'portcall/appointments/' + orgId;
            title = 'Appointments';
        } else if (linkClicked === 'a.nominations-link') {
            url = Env.ApiEndpoint + 'portcall/nominations/' + orgId;
            title = 'Nominations';
        }
        if (!url) return;

        Ext.create('Abraxa.view.cdb.company.AppointmentsDialog', {
            bind: {
                title: title + ' ({appointments.count})',
            },
            viewModel: {
                stores: {
                    appointments: {
                        type: 'CdbAppointmentsStore',
                        proxy: {
                            url: url,
                        },
                    },
                },
            },
        }).show();
    },
});
