Ext.define('Abraxa.view.portcall.documents.DocumentApprovalsViewDialog', {
    extend: 'Ext.Dialog',
    xtype: 'document.approvals.wiew.dialog',
    width: 580,
    minHeight: 540,
    closable: true,
    draggable: false,
    scrollable: true,
    cls: 'a-approvals-dialog',
    bind: {
        title: 'Approval requests <span class="c-blue-grey fs-16 fw-n">({record.name})</span>',
    },
    items: [
        {
            xtype: 'div',
            cls: 'text-center',
            margin: '0 0 24 0',
            bind: {
                hidden: '{record.approvals.count ? false : true}',
                html: '<div><svg class="а-donut" width="62px" height="62px" viewBox="0 0 42 42"><circle class="а-donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"></circle> <circle class="а-donut-circle" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#C8D4E6" stroke-width="1.5"></circle> <circle class="a-donut-indicator" data-value="{approvalGraph.percentage}" stroke="{approvalGraph.stroke}" stroke-width="2" style="stroke-dasharray: 100, 100; stroke-dashoffset: {approvalGraph.strokeOffset}; stroke: {approvalGraph.stroke};" fill="transparent" r="15.91549430918954" cx="21" cy="21" /> <g class="a-donut-text"><text x="50%" y="50%" class="а-donut-number">{approvalGraph.approved_count}/{approvalGraph.total}</text></g></svg></div><div class="mt-8"><span class="c-blue-grey">Requested by</span> <a href="javascript:void(0);">{leadAgent.name}</a></div>',
            },
        },
        {
            xtype: 'abraxa.formlist',
            cls: 'a-documents-approvals-list',
            bind: {
                store: '{approvals}',
            },
            variableHeights: true,
            groupHeader: {
                tpl: new Ext.XTemplate('<div>{[this.memberName(values.children[0].data)]}</div>', {
                    memberName: function (record) {
                        let store = Ext.ComponentQuery.query(Ext.getCmp('main-viewport').upVM().get('currentUser').get('company').type + 'portcall\\.main')[0]
                                .upVM()
                                .get('members'),
                            member = store.getById(record.member_id);
                        return (
                            '<div class="party-item"><div class="sm-function"><i class="md-icon md-18">business</i></div><a href="javascript:void(0);" class="sm-company fw-b">' +
                            member.get('org_name') +
                            '</a><div class="sm-type">' +
                            member.get('org_email') +
                            '</div></div>'
                        );
                    },
                }),
            },
            itemConfig: {
                viewModel: {
                    formulas: {
                        member: {
                            bind: {
                                bindTo: '{record}',
                                deep: true,
                            },
                            get: function (record) {
                                let store = this.get('members'),
                                    member = store.getById(record.get('member_id'));
                                return member;
                            },
                        },
                        icon: {
                            bind: {
                                bindTo: '{record}',
                                deep: true,
                            },
                            get: function (record) {
                                if (record) {
                                    let status = record.get('status'),
                                        icon = 'help_outline',
                                        color = '#b0bec5';

                                    switch (status) {
                                        case 'approved':
                                            icon = 'check_circle';
                                            color = '#22b14c';
                                            break;
                                        case 'rejected':
                                            icon = 'cancel';
                                            color = '#e91e63';
                                            break;
                                    }

                                    return {
                                        icon: icon,
                                        color: color,
                                    };
                                }
                            },
                        },
                    },
                },
                xtype: 'container',
                cls: 'a-approval-item',
                flex: 1,
                items: [
                    {
                        xtype: 'container',
                        margin: '0',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        items: [
                            {
                                xtype: 'displayfield',
                                labelAlign: 'top',
                                flex: 1,
                                bind: {
                                    hidden: '{record.rejected_reason || record.comment ? false : true}',
                                    value: '{record.rejected_reason || record.comment}',
                                    cls: 'a-approval-note a-approval-reason {record.status}',
                                },
                            },
                            {
                                xtype: 'displayfield',
                                labelAlign: 'top',
                                flex: 1,
                                hidden: true,
                                encodeHtml: false,
                                bind: {
                                    hidden: '{!record.rejected_reason && !record.comment ? false : true}',
                                    value: '<i style="color: #b0bec5">{record.status:capitalize}</i>',
                                    cls: 'a-approval-note a-approval-reason {record.status}',
                                },
                            },
                            {
                                xtype: 'div',
                                cls: 'a-date',
                                bind: {
                                    hidden: '{record.status == "pending"}',
                                    html: '<span>{record.updated_at:date("d M y - H:i")}</span>',
                                },
                            },
                            {
                                xtype: 'button',
                                ui: 'danger-light small',
                                hidden: true,
                                bind: {
                                    hidden: '{nonEditable || record.status != "pending" ? true : false}',
                                },
                                text: 'Cancel request',
                                margin: '14 14 0 0',
                                arrow: false,
                                handler: function (me) {
                                    let record = me.upVM().get('record'),
                                        store = me.upVM().get('approvals'),
                                        dialog = me.up('dialog');

                                    Ext.Msg.confirm(
                                        'Confirmation',
                                        'Are you sure you want to cancel the request?',
                                        function (answer) {
                                            if (answer == 'yes') {
                                                record.set('status', 'canceled');

                                                store.sync({
                                                    success: function () {
                                                        Ext.toast('Record updated');
                                                        if (!store.getCount()) dialog.destroy();

                                                        me.upVM().get('object_record').load();
                                                    },
                                                });
                                            }
                                        },
                                        this,
                                        [
                                            {
                                                xtype: 'button',
                                                itemId: 'no',
                                                margin: '0 8 0 0',
                                                text: 'No',
                                            },
                                            {
                                                xtype: 'button',
                                                itemId: 'yes',
                                                ui: 'decline alt',
                                                text: 'Cancel',
                                            },
                                        ]
                                    );
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ],
});
