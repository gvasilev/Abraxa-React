Ext.define('Abraxa.view.inquiry.appoint.AppointList', {
    extend: 'Ext.Dialog',
    testId: 'inquiryAppointList',
    closable: true,
    draggable: false,
    title: '<div class="a-badge a-badge-master"><i class="material-icons-outlined">done_all</i></div>Appoint',
    width: 720,
    minHeight: '520',
    maxHeight: '80%',
    cls: 'a-dialog-create a-dialog-has-icon',
    padding: 0,
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    items: [
        {
            xtype: 'form.error',
            testId: 'inquiryAppointListError',
            hidden: true,
            margin: 0,
            padding: 8,
            showAnimation: 'fadeIn',
        },
        {
            xtype: 'container',
            items: [
                {
                    xtype: 'div',
                    cls: 'fw-b',
                    padding: '8 0 24 24',
                    html: 'Please select a disbursement for transfer to your new port call',
                },
            ],
        },
        {
            xtype: 'grid',
            flex: 1,
            scrollable: true,
            cls: 'a-disbursements-grid a-offset-grid abraxa-grid',
            hideHeaders: true,
            selectable: {
                headerCheckbox: false,
                mode: 'multi',
                checkbox: true,
                checkboxDefaults: {
                    xtype: 'selectioncolumn',
                    text: null,
                    dataIndex: '',
                    cell: {
                        hideMode: 'opacity',
                    },
                    width: 58,
                },
            },
            bind: {
                store: '{inquiryOffers}',
            },
            itemConfig: {
                height: 56,
            },
            columns: [
                {
                    text: 'Proforma',
                    dataIndex: 'name',
                    cell: {
                        encodeHtml: false,
                    },
                    flex: 1,
                    renderer: function (val, record) {
                        const calculationId = record.get('pc_calculation_id') ? 1 : 0;
                        if (val) {
                            // return '<div class="hbox"><div class="a-badge a-badge-billing"><i class="md-icon-outlined">account_balance_wallet</i></div><div class="ml-12"><div class="text-truncate fw-b">' + val + '</div></div></div>';
                            return (
                                `<div data-calculationId=${calculationId} class="a-disbursement-name"><span class="file-icon-badge file-icon-x32" data-type="pda" data-icon="money"></span><div class="ml-12 text-truncate"><a class="fw-b cursor-pointer proforma_link" href="javascript:void(0);">` +
                                val +
                                '</a><div class="sm-title text-truncate">' +
                                record.get('group_id') +
                                '</div></div></div>'
                            );
                        }
                        return AbraxaConstants.placeholders.emptyValue;
                    },
                },
                {
                    text: 'Total',
                    dataIndex: 'total_costs',
                    minWidth: 140,
                    align: 'right',
                    cell: {
                        encodeHtml: false,
                        zeroValue: '<span class="a-cell-placeholder">---</span>',
                    },
                    renderer: function (value, record) {
                        if (value) {
                            return (
                                record.get('currency') +
                                ' <span class="fw-b">' +
                                Ext.util.Format.number(value, '0,000.00') +
                                '</span>'
                            );
                        }
                    },
                },
                {
                    text: 'Port',
                    dataIndex: 'port_id',
                    minWidth: 140,
                    cell: {
                        encodeHtml: false,
                    },
                    renderer: function (value, record) {
                        if (value) {
                            let inquiryPortStore = this.up('grid').upVM().get('object_record').ports();
                            let port = inquiryPortStore.getById(value);
                            if (port) {
                                return port.get('name');
                            } else {
                                return AbraxaConstants.placeholders.emptyValue;
                            }
                        } else {
                            return AbraxaConstants.placeholders.emptyValue;
                        }
                    },
                },
                {
                    dataIndex: 'status',
                    minWidth: 180,
                    text: 'Status',
                    cell: {
                        cls: 'expand',
                        bodyCls: 'a-cell-status',
                        encodeHtml: false,
                    },
                    renderer: function (value, record) {
                        if (record.get('status')) {
                            return (
                                '<div class="a-status-badge a-status-md status-' +
                                record.get('status') +
                                '"><span class="text-truncate">' +
                                Ext.String.capitalize(record.get('status')) +
                                '</span></div>'
                            );
                        } else {
                            return '';
                        }
                    },
                },
            ],
        },
    ],
    bbar: {
        items: [
            '->',
            {
                xtype: 'button',
                margin: '0 8 0 0',
                text: 'Cancel',
                testId: 'inquiryAppointListCancelBtn',
                handler: function () {
                    this.up('dialog').destroy();
                },
            },
            {
                xtype: 'button',
                ui: 'accent',
                text: 'Appoint',
                testId: 'inquiryAppointListAppointBtn',
                handler: function (cmp) {
                    let currentUser = cmp.upVM().get('currentUser'),
                        grid = cmp.up('dialog').down('grid'),
                        selectedOffers = grid.getSelections(),
                        inquiry = cmp.upVM().get('inquiry'),
                        cargoStore = inquiry.cargoes(),
                        attachmentStore = inquiry.attachments(),
                        cargoes = [],
                        attachments = [],
                        inquiryAttachments = [],
                        firstPort = inquiry.ports().first();
                    cargoStore.each(function (record) {
                        let cargo = record.getData();
                        cargoes.push(cargo);
                    });
                    attachmentStore.each(function (record) {
                        attachments.push({
                            ext: record.getDocument().get('extension'),
                            firstName: record.getDocument().get('name'),
                            file: record.getDocument(),
                            size: record.getDocument().get('size'),
                            attachment_id: record.get('id'),
                        });
                        inquiryAttachments.push(record.get('id'));
                    });
                    if (!selectedOffers.length) {
                        cmp.up('dialog')
                            .down('form\\.error')
                            .setHtml('Please select at least one estimate')
                            .show()
                            .addCls('error');
                    } else {
                        cmp.up('dialog').down('form\\.error').hide();
                        Ext.create('Abraxa.view.inquiry.appoint.CreateAppointment', {
                            header: {
                                bind: {
                                    title: '{headerTitle}',
                                },
                            },
                            viewModel: {
                                parent: cmp.upVM(),
                                links: {
                                    object_record: {
                                        type: 'Abraxa.model.portcall.Portcall',
                                        create: {
                                            assigned_to: currentUser.get('id'),
                                            port_eta: inquiry.get('port_eta'),
                                            port_id: firstPort.get('id'),
                                            port_name: firstPort.get('name'),
                                            inquiry_attachments: inquiryAttachments,
                                            offers: Ext.Array.pluck(selectedOffers, 'id'),
                                        },
                                    },
                                    voyage_data: {
                                        type: 'Abraxa.model.voyage.Voyage',
                                        create: {
                                            id: inquiry.getVoyage().get('id'),
                                            vessel_imo: inquiry.getVoyage().get('vessel').imo,
                                            vessel_name: inquiry.getVoyage().get('vessel').name,
                                        },
                                    },
                                    nomination: {
                                        type: 'Abraxa.model.nomination.Nomination',
                                        create: {
                                            company_role: 'lead agent',
                                            appointing_party_id: inquiry.get('requesting_party_id'),
                                            appointing_party_name: inquiry.get('requesting_party_name'),
                                            appointing_party_email: inquiry.get('requesting_party_email'),
                                            voyage_number: inquiry.get('voyage_number'),
                                            date_received: new Date(),
                                            port_function: inquiry.get('port_function'),
                                            agency_type_id: inquiry.get('agency_type_id'),
                                            agency_type_name: inquiry.get('agency_type_name'),
                                        },
                                    },
                                    instruction: {
                                        type: 'Abraxa.model.portcall.Instruction',
                                        create: {
                                            object_id: 3,
                                        },
                                    },
                                },
                                stores: {
                                    suggestedOrganizations: Ext.create('Ext.data.Store'),
                                    files: Ext.create('Ext.data.Store', {
                                        data: attachments,
                                    }),
                                    templates: {
                                        type: 'templates',
                                        autoLoad: false,
                                    },
                                    taskTemplates: {
                                        source: '{templates}',
                                        filters: [
                                            {
                                                property: 'type',
                                                operator: '=',
                                                value: 'task',
                                                exactMatch: true,
                                            },
                                        ],
                                    },
                                    sofTemplates: {
                                        source: '{templates}',
                                        filters: [
                                            {
                                                property: 'type',
                                                operator: '=',
                                                value: 'sof',
                                                exactMatch: true,
                                            },
                                        ],
                                    },
                                    disbursementTemplates: {
                                        source: '{templates}',
                                        filters: [
                                            {
                                                property: 'type',
                                                operator: '=',
                                                value: 'disbursement',
                                                exactMatch: true,
                                            },
                                        ],
                                    },
                                },
                                data: {
                                    object_id: 3,
                                    editMode: false,
                                    visibleInstruction: false,
                                    visibleTemplates: false,
                                    visibleDistriGroups: false,
                                    portcallStore: cmp.upVM().get('portcalls'),
                                    hubStructure: false,
                                    fromPortcall: true,
                                    inquiryCargoes: cargoes,
                                    inquiry: inquiry,
                                },
                                formulas: {
                                    distribution_groups: {
                                        bind: {
                                            bindTo: '{object_record.distribution_groups}',
                                            deep: true,
                                        },
                                        get: function (store) {
                                            return store;
                                        },
                                    },
                                    showInstructions: {
                                        bind: {
                                            bindTo: '{instruction.text}',
                                            deep: true,
                                        },
                                        get: function (text) {
                                            if (text && text.length > 0) {
                                                return false;
                                            } else {
                                                return true;
                                            }
                                        },
                                    },
                                    showFiles: {
                                        bind: {
                                            filesCount: '{files.count}',
                                            editMode: '{editMode}',
                                        },
                                        get: function (data) {
                                            if (data) {
                                                if (data.editMode) {
                                                    return true;
                                                } else {
                                                    if (data.filesCount === 0) {
                                                        return true;
                                                    }
                                                }
                                                return false;
                                            }
                                        },
                                    },
                                    assignedToImage: {
                                        bind: {
                                            bindTo: '{usersCombo.selection}',
                                            deep: true,
                                        },
                                        get: function (selection) {
                                            if (selection) {
                                                if (selection.get('profile_image')) {
                                                    let userImage = selection.get('profile_image');
                                                    return (
                                                        '<div class="a-person a-icon-round">' +
                                                        '<img class="a-profile-image a-user" src="' +
                                                        userImage +
                                                        '" width="24" alt="" />' +
                                                        '</div>'
                                                    );
                                                } else {
                                                    return (
                                                        '<div class="a-person a-icon-round"><span class="a-int a-user">' +
                                                        selection.get('first_name')[0] +
                                                        selection.get('last_name')[0] +
                                                        '</span></div>'
                                                    );
                                                }
                                            }
                                            return '<div class="a-field-icon icon-person icon-rounded"><div class="x-before-input-el"></div></div>';
                                        },
                                    },
                                    dragListeners: {
                                        bind: {
                                            bindTo: '{userPermissions}',
                                            deeP: true,
                                        },
                                        get: function (store) {
                                            if (store && Object.keys(store).length > 0) {
                                                let record = store['portcallDocumentUpload'];
                                                if (record && record.edit) {
                                                    return {
                                                        element: 'element',
                                                        drop: 'onDrop',
                                                        dragleave: 'onDragLeaveListItem',
                                                        dragover: 'onDragOverListItem',
                                                    };
                                                } else {
                                                    return {};
                                                }
                                            } else {
                                                return {};
                                            }
                                        },
                                    },
                                    headerTitle: {
                                        bind: {
                                            instructions: '{visibleInstruction}',
                                            templates: '{visibleTemplates}',
                                            dist_group: '{visibleDistriGroups}',
                                        },
                                        get: function (data) {
                                            if (data) {
                                                if (data.instructions) {
                                                    return '<span class="a-dialog-instructions-title">Voyage instructions</span>';
                                                }
                                                if (data.templates) {
                                                    return '<span class="a-dialog-instructions-title">Advanced</span>';
                                                }
                                                if (data.dist_group) {
                                                    return '<span class="a-dialog-instructions-title">Distribution groups</span>';
                                                }
                                            }
                                            return '<div class="a-badge a-badge-portcall"><i class="md-icon-business-center md-icon-outlined"></i></div>Create Port call';
                                        },
                                    },
                                    suggestedOrganizationsRequest: {
                                        bind: {
                                            bindTo: '{object_record.port_id}',
                                        },
                                        get: async function (port_id) {
                                            let vm = this,
                                                filter = [
                                                    {
                                                        property: 'port_id',
                                                        value: port_id,
                                                        operator: '=',
                                                    },
                                                ];
                                            if (port_id) {
                                                Ext.Ajax.request({
                                                    url: Env.ApiEndpoint + 'suggested-organizations',
                                                    method: 'GET',
                                                    params: {
                                                        filter: JSON.stringify(filter),
                                                    },
                                                    success: function (response) {
                                                        if (response) {
                                                            vm.get('suggestedOrganizations').add(
                                                                Ext.decode(response.responseText)
                                                            );
                                                        }
                                                    },
                                                    failure: function failure(response) {},
                                                });
                                            }
                                        },
                                    },
                                    setPortcallCargoes: {
                                        bind: {
                                            bindTo: '{inquiryCargoes}',
                                        },
                                        get: function (cargoes) {
                                            if (cargoes && cargoes.length) {
                                                this.get('object_record').cargoes().setData(cargoes);
                                            }
                                        },
                                    },
                                },
                            },
                        }).show();
                        cmp.up('dialog').hide();
                    }
                },
            },
        ],
    },
});
