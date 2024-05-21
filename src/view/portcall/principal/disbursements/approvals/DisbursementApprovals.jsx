Ext.define('Abraxa.view.portcall.principal.disbursements.approvals.DisbursementApprovals', {
    extend: 'Ext.Container',
    xtype: 'DisbursementApprovals',
    padding: '16 24',
    items: [
        {
            xtype: 'container',
            docked: 'top',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-titlebar a-bb-100',
                    minHeight: 64,
                    items: [
                        {
                            xtype: 'title',
                            bind: {
                                title: '<span>Approval flow</span>',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-disbursement-flow-list a-flow-list-first',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-disbursement-flow-list-item',
                    layout: 'hbox',
                    hidden: true,
                    bind: {
                        hidden: '{!disbursementApproval || (disbursementApproval && disbursementApproval.current_approval_data.approval_request.status === "canceled")}',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-disbursement-flow-item-icon a-icon-submitted',
                            html: '<i class="md-icon"></i>',
                        },
                        {
                            xtype: 'container',
                            width: 480,
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'hbox',
                                    bind: {
                                        html: '<div class="a-badge a-badge-portcall mr-12"><i class="md-icon-business-center md-icon-outlined"></i></div><span class="a-link mr-6">{disbursementApproval.from_company.name}</span><span class="fw-b mr-6">submitted</span> for approval',
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-approval-flow-comment',
                                    bind: {
                                        hidden: '{disbursementApproval.current_approval_data.first_request.notes.create ? false : true}',
                                        html: '<i class="md-icon">short_text</i><span class="a-approval-text">{disbursementApproval.current_approval_data.first_request.notes.create}</span>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            width: 160,
                            bind: {
                                html: '<span class="a-status-badge a-status-md status-submitted">Submitted</span>',
                            },
                        },
                        {
                            xtype: 'div',
                            bind: {
                                html: '<div class="a-cell-date fs-13 hbox"><i class="md-icon-outlined md-16 mr-6">calendar_today</i>{disbursementApproval.current_approval_data.first_request.created_at:date("d M -  H:i")}</div>',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'abraxa.componentdataview',
            hidden: true,
            cls: 'a-disbursement-flow-list',
            bind: {
                hidden: '{!disbursementApproval && !disbursementApproval.current_approval_data.history}',
                store: '{disbursementApproval.current_approval_data.history}',
            },
            itemConfig: {
                viewModel: {
                    formulas: {
                        approvalIndex: {
                            bind: {
                                bindTo: '{record}',
                            },
                            get: function (record) {
                                let store = record.store;
                                return store.indexOf(record) + 1;
                            },
                        },
                    },
                },
                items: [
                    {
                        xtype: 'container',
                        cls: 'a-disbursement-flow-list-item',
                        layout: 'hbox',
                        hidden: true,
                        bind: {
                            hidden: '{approvalIndex === 1}',
                        },
                        items: [
                            {
                                xtype: 'div',
                                cls: 'a-disbursement-flow-item-icon a-icon-submitted',
                                html: '<i class="md-icon"></i>',
                            },
                            {
                                xtype: 'container',
                                width: 480,
                                items: [
                                    {
                                        xtype: 'div',
                                        cls: 'hbox',
                                        bind: {
                                            html: '<div class="a-badge a-badge-portcall mr-12"><i class="md-icon-business-center md-icon-outlined"></i></div><span class="a-link mr-6">{record.approval_request.from_company.name}</span><span class="fw-b mr-6"> re-submitted</span> for approval',
                                        },
                                    },
                                    {
                                        xtype: 'div',
                                        cls: 'a-approval-flow-comment',
                                        bind: {
                                            hidden: '{record.approval_request.notes ? false : true}',
                                            html: '<i class="md-icon">short_text</i><span class="a-approval-text">{record.approval_request.notes}</span>',
                                        },
                                    },
                                ],
                            },
                            {
                                xtype: 'div',
                                width: 160,
                                bind: {
                                    html: '<span class="a-status-badge a-status-md status-submitted">Submitted</span>',
                                },
                            },
                            {
                                xtype: 'div',
                                bind: {
                                    html: '<div class="a-cell-date fs-13 hbox"><i class="md-icon-outlined md-16 mr-6">calendar_today</i>{record.approval_request.created_at:date("d M -  H:i")}</div>',
                                },
                            },
                        ],
                    },
                    {
                        xtype: 'list',
                        cls: 'a-bgr-transparent',
                        store: [],
                        bind: {
                            store: '{record.entries}',
                            // hidden: '{disbursementApproval.current_approval_data.auto_approve}',
                        },
                        itemConfig: {
                            xtype: 'container',
                            cls: 'a-disbursement-flow-list-item',
                            viewModel: {
                                formulas: {
                                    index: {
                                        bind: {
                                            bindTo: '{record}',
                                        },
                                        get: function (record) {
                                            let store = record.store;
                                            function ordinal_suffix_of(i) {
                                                var j = i % 10,
                                                    k = i % 100;
                                                if (j == 1 && k != 11) {
                                                    return i + 'st';
                                                }
                                                if (j == 2 && k != 12) {
                                                    return i + 'nd';
                                                }
                                                if (j == 3 && k != 13) {
                                                    return i + 'rd';
                                                }
                                                return i + 'th';
                                            }

                                            return ordinal_suffix_of(store.indexOf(record) + 1);
                                        },
                                    },
                                },
                            },
                            layout: 'hbox',
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'a-disbursement-flow-item-icon',
                                    html: '<i class="md-icon"></i>',
                                    bind: {
                                        cls: 'a-disbursement-flow-item-icon a-icon-{record.status}',
                                    },
                                },
                                {
                                    xtype: 'container',
                                    width: 480,
                                    hidden: true,
                                    bind: {
                                        hidden: '{record.user ? false : true}',
                                    },
                                    items: [
                                        {
                                            xtype: 'container',
                                            layout: {
                                                type: 'hbox',
                                                align: 'middle',
                                                pack: 'start',
                                            },
                                            items: [
                                                {
                                                    xtype: 'public.updated.by',
                                                    cls: 'a-approval-flow-user',
                                                    bind: {
                                                        data: {
                                                            user: '{record.user}',
                                                            updated_at: false,
                                                            show_user_name: true,
                                                        },
                                                    },
                                                },
                                                {
                                                    xtype: 'div',
                                                    bind: {
                                                        html: '<span class="mr-6 c-grey">&nbsp;({record.role.name})</span><span class="fw-b {record.status === "approved" ? "c-green" : "c-red"} ">{record.status}</span><span> as <span class="c-grey text-underline">{index} approver</span></span>',
                                                    },
                                                },
                                            ],
                                        },
                                        {
                                            xtype: 'div',
                                            hidden: true,
                                            bind: {
                                                hidden: '{record.notes ? false : true}',
                                                html: '<i class="md-icon">short_text</i><span class="a-approval-text">{record.notes}</span>',
                                            },
                                            cls: 'a-approval-flow-comment',
                                        },
                                    ],
                                },
                                {
                                    xtype: 'div',
                                    width: 160,
                                    bind: {
                                        html: '<span class="a-status-badge a-status-md status-{record.status}">{record.status:capitalize}</span>',
                                    },
                                },
                                {
                                    xtype: 'div',
                                    bind: {
                                        html: '<div class="a-cell-date fs-13 hbox"><i class="md-icon-outlined md-16 mr-6">calendar_today</i>{record.created_at:date("d M -  H:i")}</div>',
                                    },
                                },
                            ],
                        },
                    },
                    {
                        xtype: 'container',
                        cls: 'a-disbursement-flow-list-item',
                        layout: 'hbox',
                        hidden: true,
                        bind: {
                            hidden: '{!disbursementApproval.current_approval_data.auto_approve}',
                        },
                        items: [
                            {
                                xtype: 'div',
                                cls: 'a-disbursement-flow-item-icon a-icon-approved',
                                html: '<i class="md-icon"></i>',
                            },
                            {
                                xtype: 'div',
                                width: 480,
                                cls: 'hbox',
                                bind: {
                                    html: '<div class="a-person"><i class="md-icon-outlined">autoplay</i></div><span class="fw-b mr-6">Approved</span> automatically',
                                },
                            },
                            {
                                xtype: 'div',
                                width: 160,
                                bind: {
                                    html: '<span class="a-status-badge a-status-md status-approved">Approved</span>',
                                },
                            },
                            {
                                xtype: 'div',
                                bind: {
                                    html: '<div class="a-cell-date fs-13 hbox"><i class="md-icon-outlined md-16 mr-6">calendar_today</i>{disbursementApproval.created_at:date("d M -  H:i")}</div>',
                                },
                            },
                        ],
                    },
                ],
            },
        },
        {
            xtype: 'container',
            hidden: true,
            cls: 'a-disbursement-flow-list a-flow-list-last',
            bind: {
                hidden: '{!disbursementApproval || (disbursementApproval && disbursementApproval.current_approval_data.approval_request.status === "canceled")}',
            },
            items: [
                {
                    xtype: 'container',
                    cls: 'a-disbursement-flow-list-item',
                    layout: 'hbox',
                    bind: {
                        hidden: '{disbursementApproval.current_approval_data.first_request.created_at === disbursementApproval.current_approval_data.approval_request.created_at}',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-disbursement-flow-item-icon a-icon-submitted',
                            html: '<i class="md-icon"></i>',
                        },
                        {
                            xtype: 'container',
                            width: 480,
                            items: [
                                {
                                    xtype: 'div',
                                    cls: 'hbox',
                                    bind: {
                                        html: '<div class="a-badge a-badge-portcall mr-12"><i class="md-icon-business-center md-icon-outlined"></i></div><span class="a-link mr-6">{disbursementApproval.from_company.name}</span><span class="fw-b mr-6">re-submitted</span> for approval',
                                    },
                                },
                                {
                                    xtype: 'div',
                                    cls: 'a-approval-flow-comment',
                                    bind: {
                                        hidden: '{disbursementApproval.notes ? false : true}',
                                        html: '<i class="md-icon">short_text</i><span class="a-approval-text">{disbursementApproval.notes.create}</span>',
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'div',
                            width: 160,
                            bind: {
                                html: '<span class="a-status-badge a-status-md status-submitted">Submitted</span>',
                            },
                        },
                        {
                            xtype: 'div',
                            bind: {
                                html: '<div class="a-cell-date fs-13 hbox"><i class="md-icon-outlined md-16 mr-6">calendar_today</i>{disbursementApproval.created_at:date("d M -  H:i")}</div>',
                            },
                        },
                    ],
                },
                {
                    xtype: 'list',
                    cls: 'a-bgr-transparent',
                    store: [],
                    hidden: true,
                    bind: {
                        store: '{disbursementApproval.current_approval_data.timeline}',
                        hidden: '{disbursementApproval.current_approval_data.auto_approve}',
                    },
                    itemConfig: {
                        xtype: 'container',
                        cls: 'a-disbursement-flow-list-item',
                        viewModel: {
                            formulas: {
                                role: {
                                    bind: {
                                        bindTo: '{record}',
                                    },
                                    get: function (record) {
                                        if (record.get('roles')[0]) return record.get('roles')[0];

                                        return {
                                            name: 'Any role',
                                        };
                                    },
                                },
                                user: {
                                    bind: {
                                        bindTo: '{record.approvalEntry}',
                                    },
                                    get: function (record) {
                                        if (record) {
                                            return record.user;
                                        }
                                    },
                                },
                                index: {
                                    bind: {
                                        bindTo: '{record}',
                                    },
                                    get: function (record) {
                                        let store = record.store;
                                        function ordinal_suffix_of(i) {
                                            var j = i % 10,
                                                k = i % 100;
                                            if (j == 1 && k != 11) {
                                                return i + 'st';
                                            }
                                            if (j == 2 && k != 12) {
                                                return i + 'nd';
                                            }
                                            if (j == 3 && k != 13) {
                                                return i + 'rd';
                                            }
                                            return i + 'th';
                                        }

                                        return ordinal_suffix_of(store.indexOf(record) + 1);
                                    },
                                },
                            },
                        },
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'div',
                                cls: 'a-disbursement-flow-item-icon',
                                html: '<i class="md-icon"></i>',
                                bind: {
                                    cls: 'a-disbursement-flow-item-icon a-icon-{record.status}',
                                },
                            },
                            {
                                xtype: 'container',
                                width: 480,
                                hidden: true,
                                bind: {
                                    hidden: '{record.approvalEntry ? true : false}',
                                },
                                items: [
                                    {
                                        xtype: 'div',
                                        cls: 'hbox',
                                        bind: {
                                            html: '<div class="a-person"><i class="md-icon-outlined">manage_accounts</i></div>Pending approval from&nbsp;<span class="mr-6 fw-b">{role.name}</span>',
                                        },
                                    },
                                ],
                            },
                            {
                                xtype: 'container',
                                width: 480,
                                hidden: true,
                                bind: {
                                    hidden: '{record.approvalEntry ? false : true}',
                                },
                                items: [
                                    {
                                        xtype: 'container',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                            pack: 'start',
                                        },
                                        items: [
                                            {
                                                xtype: 'public.updated.by',
                                                cls: 'a-approval-flow-user',
                                                bind: {
                                                    data: {
                                                        user: '{record.approvalEntry.user}',
                                                        updated_at: false,
                                                        show_user_name: true,
                                                    },
                                                },
                                            },
                                            {
                                                xtype: 'div',
                                                bind: {
                                                    html: '<span class="mr-6 c-grey">&nbsp;({role.name})</span><span class="fw-b {record.status === "approved" ? "c-green" : "c-red"} ">{record.status}</span><span class="{disbursementApproval.current_approval_data.timeline.length > 1 ? "" : "d-none"}"> as <span class="c-grey text-underline">{index} approver</span></span>',
                                                },
                                            },
                                        ],
                                    },
                                    {
                                        xtype: 'div',
                                        hidden: true,
                                        bind: {
                                            hidden: '{record.approvalEntry.notes ? false : true}',
                                            html: '<i class="md-icon">short_text</i><span class="a-approval-text">{record.approvalEntry.notes}</span>',
                                        },
                                        cls: 'a-approval-flow-comment',
                                    },
                                ],
                            },
                            {
                                xtype: 'div',
                                width: 160,
                                bind: {
                                    html: '<span class="a-status-badge a-status-md status-{record.status}">{record.status:capitalize}</span>',
                                },
                            },
                            {
                                xtype: 'div',
                                hidden: true,
                                bind: {
                                    hidden: '{record.approvalEntry ? false : true}',
                                    html: '<div class="a-cell-date fs-13 hbox"><i class="md-icon-outlined md-16 mr-6">calendar_today</i>{record.approvalEntry.created_at:date("d M -  H:i")}</div>',
                                },
                            },
                        ],
                    },
                },
                {
                    xtype: 'container',
                    cls: 'a-disbursement-flow-list-item',
                    layout: 'hbox',
                    hidden: true,
                    bind: {
                        hidden: '{!disbursementApproval.current_approval_data.auto_approve}',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-disbursement-flow-item-icon a-icon-approved',
                            html: '<i class="md-icon"></i>',
                        },
                        {
                            xtype: 'div',
                            width: 480,
                            cls: 'hbox',
                            bind: {
                                html: '<div class="a-person"><i class="md-icon-outlined">autoplay</i></div><span class="fw-b mr-6">Approved</span> automatically',
                            },
                        },
                        {
                            xtype: 'div',
                            width: 160,
                            bind: {
                                html: '<span class="a-status-badge a-status-md status-approved">Approved</span>',
                            },
                        },
                        {
                            xtype: 'div',
                            bind: {
                                html: '<div class="a-cell-date fs-13 hbox"><i class="md-icon-outlined md-16 mr-6">calendar_today</i>{disbursementApproval.updated_at:date("d M -  H:i")}</div>',
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'text-center',
            padding: '16 0',
            layout: {
                type: 'vbox',
                align: 'middle',
                pack: 'center',
            },
            hidden: false,
            bind: {
                hidden: '{disbursementApproval ? (disbursementApproval.current_approval_data.approval_request.status === "canceled" ? false : true) : false}',
            },
            items: [
                {
                    xtype: 'image',
                    margin: '16 0',
                    width: 220,
                    height: 100,
                    src: 'https://static.abraxa.com/images/a-no-image-mon.svg',
                },
                {
                    xtype: 'div',
                    cls: 'c-blue-grey',
                    html: 'No approval requests yet',
                },
            ],
        },
    ],
});
