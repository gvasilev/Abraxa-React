Ext.define('Abraxa.view.voyages.VoyagesEditMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'voyages.edit.menu',
    ui: 'dropdown',
    minWidth: 120,
    items: [
        {
            text: 'Edit',
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('inquiry_record');
                Ext.create('Abraxa.view.voyages.create.VoyagesCreateDialog', {
                    title: 'Edit inquiry',
                    viewModel: {
                        stores: {
                            functionStore: {
                                fields: ['function'],
                                data: [
                                    {
                                        id: 1,
                                        function: 'Appointing',
                                    },
                                    {
                                        id: 4,
                                        function: 'Other',
                                    },
                                ],
                            },
                        },
                        data: {
                            object_id: 4,
                            editMode: true,
                            organizations: vm.get('organizations'),
                            voyage: record,
                            inquiry: record.getInquiry(),
                        },
                    },
                }).show();
            },
        },
        {
            text: 'Assign to',
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('inquiry_record');
                Ext.create('Abraxa.view.inquiries.InquiriesAssignTo', {
                    viewModel: {
                        parent: vm,
                        data: {
                            record: record.copy(),
                            inquiry_record: record,
                        },
                    },
                }).show();
            },
        },
        {
            text: 'Invite',
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('inquiry_record'),
                    editDialog = Ext.create('Abraxa.view.voyages.create.VoyagesCreateDialog', {
                        title: 'Edit inquiry',
                        viewModel: {
                            stores: {
                                functionStore: {
                                    fields: ['function'],
                                    data: [
                                        {
                                            id: 1,
                                            function: 'Appointing',
                                        },
                                        {
                                            id: 4,
                                            function: 'Other',
                                        },
                                    ],
                                },
                            },
                            data: {
                                object_id: 4,
                                editMode: true,
                                organizations: vm.get('organizations'),
                                voyage: record,
                                inquiry: record.getInquiry(),
                            },
                        },
                    });
                editDialog.down('[cls~=inquiry_create_card]').setActiveItem(1);
                editDialog.show();
            },
        },
        {
            text: 'Archive',
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('inquiry_record'),
                    call_from_grid = vm.get('call_from_grid');
                Ext.create('Abraxa.view.inquiries.InquiriesArchive', {
                    viewModel: {
                        parent: vm,
                        data: {
                            inquiryRecord: record,
                            call_from_grid: call_from_grid,
                        },
                    },
                }).show();
            },
        },
        {
            text: 'Delete',
            ui: 'decline',
            separator: true,
            handler: function (me) {
                let vm = me.upVM(),
                    record = vm.get('inquiry_record'),
                    call_from_grid = vm.get('call_from_grid'),
                    voyages = vm.get('voyages'),
                    inquiry_archived = vm.get('inquiryArchived'),
                    is_archived = vm.get('is_archived');
                Ext.Msg.confirm('Delete', 'Are you sure you want to permanently delete this Inquiry?', function (btn) {
                    if (btn === 'yes') {
                        if (call_from_grid) {
                            if (is_archived) {
                                inquiry_archived.remove(record);
                                inquiry_archived.sync({
                                    success: function () {
                                        Ext.toast('Record deleted', 2500);
                                    },
                                });
                            } else {
                                voyages.remove(record);
                                voyages.sync({
                                    success: function () {
                                        Ext.toast('Record deleted', 2500);
                                    },
                                });
                            }
                        } else {
                            record.erase({
                                success: function (record, operation) {
                                    Ext.toast('Record deleted', 2500);
                                    window.location.hash = 'inquiries';
                                },
                            });
                        }
                    }
                });
            },
        },
    ],
});
