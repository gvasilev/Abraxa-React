import './DocumentsEditButton';
import '../../../adocs/CreateDocumentPopup';
import '../../../approval/SendForApprovalDialog';
//import '../../../../core/override/Abraxa.Gauge';

Ext.define('Abraxa.view.portcall.documents.DocumentsList', {
    extend: 'Ext.dataview.List',
    xtype: 'documents.list',
    testId: 'documentsList',
    id: 'documentList',
    controller: 'documents.controller',
    reference: 'documentList',
    cls: 'documents_list',
    flex: 1,
    infinite: false,
    selectable: true,
    scrollable: 'y',
    requires: ['Ext.plugin.dd.DragZone', 'Ext.plugin.dd.DropZone'],
    emptyText: {
        xtype: 'container',
        zIndex: 999,
        layout: {
            type: 'vbox',
        },
        centered: true,
        items: [
            {
                xtype: 'div',
                bind: {
                    html: '<div class="a-inner"><svg xmlns="http://www.w3.org/2000/svg" width="124" height="124" viewBox="0 0 124 124"><g transform="translate(-9717 -19083)"><g transform="translate(8883 18738)" opacity="0.6"><circle cx="62" cy="62" r="62" transform="translate(834 345)" fill="#e9ecef" opacity="0.4"></circle></g><g transform="translate(9005.988 19065.16)"><path d="M776.7,44.84h-19.84a6.85,6.85,0,0,0-6.82,6.86l-.03,54.84a6.841,6.841,0,0,0,6.82,6.85h14.36v-2.5h-14.36a4.34,4.34,0,0,1-4.32-4.35l.03-54.84a4.349,4.349,0,0,1,4.32-4.36h18.8l19.1,19.1v9.98h2.5V65.41Z" fill="#c8d4e6"></path><path d="M775.662,51.64v14.8h14.8l-14.8-14.8Z" fill="#c8d4e6"></path><path d="M761.083,83.667h15.7a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652h-15.7a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,83.667Z" fill="#c8d4e6"></path><path d="M761.083,91.187h5.7a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652h-5.7a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,91.187Z" fill="#c8d4e6"></path><path d="M761.083,76.147h23.129a1.652,1.652,0,0,1,1.652,1.652h0a1.651,1.651,0,0,1-1.652,1.652H761.083a1.652,1.652,0,0,1-1.652-1.652h0A1.652,1.652,0,0,1,761.083,76.147Z" fill="#c8d4e6"></path><path d="M805.134,97.521a9.366,9.366,0,0,0-17.5-2.5,7.5,7.5,0,0,0,.813,14.95H804.7a6.232,6.232,0,0,0,.437-12.45Zm-6.687,3.7v5h-5v-5H789.7l6.25-6.25,6.25,6.25Z" fill="#c8d4e6"></path></g></g></svg><div class="a-no-content-txt">No documents available.<span class="fs-13">{!nonEditable ? "Drop files or use the button." : ""} </span></div></div>',
                },
            },
            {
                xtype: 'filebutton',
                cls: 'a-no-content-btn',
                text: 'Upload document',
                testId: 'documentListUploadDocumentButton',
                ui: 'normal-light medium',
                controller: 'document.controller',
                iconCls: 'md-icon-outlined md-icon-cloud-upload',
                name: 'files',
                slug: 'portcall',
                subObject: 'documents',
                bind: {
                    cls: 'a-no-content-btn {nonEditable ? "hidden" : ""}',
                    objectPermission: '{objectPermissions}',
                    permission: '{userPermissions}',
                },
                listeners: {
                    change: function (me, newValue) {
                        if (newValue) {
                            var files = this.getFiles(),
                                uploadController = me.getController(),
                                len = files.length;

                            for (var i = 0; i < len; i++) {
                                files.item(i).split = null;
                            }
                            uploadController.upload(files, this);
                        }
                        document.querySelector("input[type='file']").value = '';
                        me.setValue(null);
                    },
                },
            },
        ],
    },
    itemConfig: {
        viewModel: {
            stores: {
                approvals: {
                    source: '{record.approvals}',
                    groupField: 'member_id',
                    sorters: [
                        {
                            property: 'created_at',
                            direction: 'ASC',
                        },
                    ],
                    extraParams: {
                        object_id: 3,
                        object_meta_id: '{object_record.id}',
                    },
                    filters: '{approvalFilter}',
                },
            },
            formulas: {
                // NOTE (boyan): There was a problem when file data was set as a binding: Sometimes it was not displayed or displayed with delay.
                // My guess is: sometimes binded record or record properties could be initially undefined and therefore view is not refreshed.
                // Therefore I moved it as a formula. See more about this EXT.js issue in this guide: https://www.youtube.com/watch?v=WeouD3CFq1c
                documentInfoCell: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (docRec) {
                        if (!docRec) return '';

                        let fileHtml =
                            `<a class="no_show file-name-documentation-grid" href="javascript:void(0)" ` +
                            `title="${docRec.get('name')}">${docRec.get('name')}.${docRec.get('extension')}</a>`;

                        return fileHtml;
                    },
                },
                recordForApproval: {
                    bind: {
                        bindTo: '{record.approvals}',
                        deep: true,
                    },
                    get: function (store) {
                        if (store) {
                            let record = this.get('record');
                            if (record) {
                                let file_id = record.get('id'),
                                    member = this.get('member'),
                                    currentUser = this.get('currentUser'),
                                    record_exists = store.queryBy(function (rec, id) {
                                        return (
                                            rec.get('assigned_company_id') == currentUser.get('current_company_id') &&
                                            rec.get('approvable_id') == file_id &&
                                            rec.get('status') == 'pending'
                                        );
                                    }).items;
                                if (record_exists.length) return record_exists[0];

                                return false;
                            }
                        }
                    },
                },
                recordApprovals: {
                    bind: {
                        bindTo: '{record.approvals}',
                        deep: true,
                    },
                    get: function (store) {
                        if (store) {
                            let member = this.get('member'),
                                members = this.get('members'),
                                filteredApprovals = Ext.create('Ext.data.Store'),
                                currentUser = this.get('currentUser');

                            if (member) {
                                members.each(function (member) {
                                    if (member.get('tenant_id')) {
                                        let memberApproval = store
                                            .queryBy(function (approval) {
                                                return approval.get('assigned_company_id') == member.get('tenant_id');
                                            })
                                            .last();

                                        if (memberApproval) filteredApprovals.add(memberApproval);
                                    }
                                });
                            } else {
                                filteredApprovals = store;
                            }

                            let total = filteredApprovals.queryBy(function (rec) {
                                    return rec.get('status') != 'canceled';
                                }).items.length,
                                pending = filteredApprovals.queryBy(function (rec) {
                                    return rec.get('status') == 'pending';
                                }).items.length,
                                approved = filteredApprovals.queryBy(function (rec) {
                                    return rec.get('status') == 'approved';
                                }).items.length,
                                rejected = filteredApprovals.queryBy(function (rec) {
                                    return rec.get('status') == 'rejected';
                                }).items.length,
                                lastRecord = filteredApprovals.queryBy(function (rec) {
                                    return rec.get('status') != 'pending' && rec.get('status') != 'canceled';
                                }).items.length
                                    ? filteredApprovals
                                          .queryBy(function (rec) {
                                              return rec.get('status') != 'pending' && rec.get('status') != 'canceled';
                                          })
                                          .last()
                                    : null,
                                fill = approved == total ? '#22b14c' : '#ffc107',
                                data = {
                                    total: total,
                                    pending: pending,
                                    approved: approved,
                                    rejected: rejected,
                                    lastRecord: lastRecord,
                                    fill: fill,
                                    valueStyle: {
                                        outerRadius: '100%',
                                        innerRadius: '100% - 2',
                                        fill: fill,
                                    },
                                };

                            return data;
                        }
                    },
                },
                approvalFilter: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        let member = this.get('member'),
                            currentUser = this.get('currentUser');

                        if (member) {
                            return function (record) {
                                if (
                                    record.get('member_id') == member.get('id') ||
                                    record.get('company_id') == currentUser.get('current_company_id')
                                ) {
                                    return true;
                                }
                            };
                        } else {
                            return function () {
                                return true;
                            };
                        }
                    },
                },
                currentRecord: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        if (record) {
                            return record;
                        }
                    },
                },
                hasActiveAprovals: {
                    bind: {
                        bindTo: '{approvals}',
                        deep: true,
                    },
                    get: function (store) {
                        if (store) {
                            let groups = store.getGroups().items,
                                member = this.get('member'),
                                index,
                                res = false;

                            Ext.Array.each(groups, function (group) {
                                let rec = group.last();
                                if (member) {
                                    if (rec.get('member_id') == member.get('id') && rec.get('status') != 'canceled')
                                        res = true;
                                } else {
                                    if (rec.get('status') != 'canceled') res = true;
                                }
                            });
                            return res;
                        }
                    },
                },
                approvalText: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        let store = this.get('approvals');
                        if (store && record) {
                            let groups = store.getGroups().items,
                                latestRecordsPerMember = [],
                                member = this.get('member'),
                                res = false,
                                text = 'Pending approval';

                            Ext.Array.each(groups, function (group) {
                                latestRecordsPerMember.push(group.last());
                            });
                            let newStore = Ext.create('Ext.data.Store', {
                                    data: latestRecordsPerMember,
                                    sorters: [
                                        {
                                            property: 'id',
                                            direction: 'ASC',
                                        },
                                    ],
                                }),
                                realStore = record.approvals(),
                                storeCount = realStore.collect('member_id').length,
                                validApprovals = realStore.queryBy(function (approval) {
                                    return approval.get('status') != 'canceled';
                                }).items,
                                newStore2 = Ext.create('Ext.data.Store', {
                                    data: validApprovals,
                                    sorters: [
                                        {
                                            property: 'id',
                                            direction: 'ASC',
                                        },
                                    ],
                                }),
                                total = newStore.collect('member_id').length,
                                membersLastStatus = {},
                                parsemembers = newStore2.each(function (rec) {
                                    membersLastStatus[rec.get('member_id')] = rec;
                                }),
                                nowNow = Ext.create('Ext.data.Store', {
                                    data: Object.values(membersLastStatus),
                                }),
                                approved_count = nowNow.queryBy(function (rec, id) {
                                    return rec.get('status') == 'approved';
                                }).items.length,
                                rejected_count = nowNow.queryBy(function (rec, id) {
                                    return rec.get('status') == 'rejected';
                                }).items.length,
                                my_record = newStore.queryBy(function (rec, id) {
                                    return member && rec.get('member_id') == member.get('id');
                                }).items[0],
                                is_peinding = newStore.queryBy(function (rec, id) {
                                    return rec.get('status') == 'pending';
                                }).items.length,
                                latest_record = newStore.queryBy(function (rec, id) {
                                    return rec.get('status') != 'pending' && rec.get('status') != 'canceled';
                                }).items[0],
                                needsMore = approved_count == storeCount || rejected_count == storeCount ? false : true;

                            if (!is_peinding && latest_record && !my_record) {
                                if (!this.get('nonEditable')) {
                                    let member = this.get('members').queryBy(function (rec, id) {
                                        return rec.get('id') == latest_record.get('member_id');
                                    }).items[0];

                                    if (member)
                                        text =
                                            Ext.String.capitalize(latest_record.get('status')) +
                                            ' by <a href="javascript:void(0)">' +
                                            member.get('org_name') +
                                            '</a>';
                                }
                            } else if (my_record) {
                                if (my_record.get('status') == 'pending') {
                                    text = 'Pending your approval';
                                } else {
                                    text =
                                        Ext.String.capitalize(my_record.get('status')) +
                                        ' by you' +
                                        (needsMore ? ', waiting for others' : '');
                                }
                            }

                            if (approved_count == storeCount) text = 'Approved by all';

                            if (rejected_count == storeCount) text = 'Rejected by all';

                            return text;
                        }
                    },
                },
                approvalGraph: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        if (record) {
                            let originalStore = record.approvals(),
                                validApprovals = originalStore.queryBy(function (approval) {
                                    return approval.get('status') != 'canceled';
                                }).items,
                                newStore = Ext.create('Ext.data.Store', {
                                    data: validApprovals,
                                    sorters: [
                                        {
                                            property: 'id',
                                            direction: 'ASC',
                                        },
                                    ],
                                }),
                                total = newStore.collect('member_id').length,
                                membersLastStatus = {},
                                parsemembers = newStore.each(function (rec) {
                                    membersLastStatus[rec.get('member_id')] = rec;
                                }),
                                nowNow = Ext.create('Ext.data.Store', {
                                    data: Object.values(membersLastStatus),
                                }),
                                approved_count = nowNow.queryBy(function (rec, id) {
                                    return rec.get('status') == 'approved';
                                }).items.length,
                                percentage = (100 * approved_count) / total,
                                stroke = total == approved_count ? '#22B14C' : '#FFC107',
                                strokeOffset = 100;
                            if (percentage > 0) {
                                strokeOffset = 100 - percentage;
                            }

                            return {
                                total: total,
                                approved_count: approved_count,
                                percentage: percentage,
                                stroke: stroke,
                                strokeOffset: strokeOffset,
                            };
                        }
                    },
                },
                statusBtn: {
                    bind: {
                        bindTo: '{record}',
                        deep: true,
                    },
                    get: function (record) {
                        if (record) {
                            var status = record.get('status');
                            var ui = '';
                            switch (status) {
                                case 'issued':
                                    // ui = 'status normal';
                                    break;
                                case 'approved':
                                    // ui = 'status success';
                                    break;
                                case 'rejected':
                                    // ui = 'status danger';
                                    break;
                                case 'pending':
                                    // ui = 'status warning';
                                    break;
                                default:
                                // ui = 'status default';
                            }
                            return ui;
                        }
                    },
                },
            },
        },
        xtype: 'container',
        keyMapEnabled: true,
        keyMap: {
            scope: 'this',
            ESC: function () {
                let grid = Ext.ComponentQuery.query('documents\\.list')[0];

                grid.deselectAll();
            },
        },
        layout: {
            type: 'hbox',
            align: 'middle',
            pack: 'start',
        },
        cls: 'a-document-row',
        items: [
            {
                xtype: 'checkbox',
                ui: 'medium',
                cls: 'file-checkbox',
                hideMode: 'opacity',
                subObject: 'documents',
                testId: 'documentListCheckbox',
                bind: {
                    cls: '{nonEditable ? "file-checkbox" : "file-checkbox"}',
                    objectPermission: '{objectPermissions}',
                },
                listeners: {
                    change: function (me, newvalue, oldvalue) {
                        let record = this.upVM().get('record'),
                            files = Ext.ComponentQuery.query('[cls~="file-checkbox"][checked="true"]'),
                            documentList = Ext.ComponentQuery.query('documents\\.list')[0];
                        if (record) {
                            this.upVM().getParent().set('selectedFiles', files);

                            record.set('is_checked', newvalue);
                            if (newvalue == false) documentList.deselectAll();
                        }
                    },
                },
            },
            {
                xtype: 'container',
                cls: 'a-document-name',
                bind: {
                    margin: '0 16',
                },
                layout: {
                    type: 'hbox',
                    align: 'middle',
                },
                items: [
                    {
                        xtype: 'div',
                        bind: {
                            html: '<span class="file-icon-new file-icon-sm-new" data-type="{record.system_extension ? record.system_extension : record.extension}"></span>',
                        },
                    },
                    {
                        xtype: 'div',
                        cls: 'no_show',
                        bind: {
                            // html: '<a class="no_show file-name-documentation-grid" href="javascript:void(0)" title="{record.name}">{record.name}.{record.extension}</a>',
                            html: '{documentInfoCell}',
                        },
                        listeners: {
                            click: {
                                element: 'element',
                                delegate: 'a.file-name-documentation-grid',
                                fn: function fn(element, htmlEl, c) {
                                    var cmp = this.component,
                                        vm = cmp.upVM(),
                                        selectedFile = vm.get('record'),
                                        documentForSelectId = selectedFile.get('id'),
                                        documents = vm.get('filteredDocuments');

                                    let dialog = Ext.create('Abraxa.view.documents.DocumentDialog', {
                                        viewModel: {
                                            data: {
                                                documentForSelect: documents.getById(documentForSelectId),
                                                selectedDocuments: documents,
                                                needsPanel: false,
                                                members: vm.get('members'),
                                                object_record: vm.get('object_record'),
                                                nonEditable: vm.get('userPermissions').portcallDocuments.edit
                                                    ? false
                                                    : true,
                                                userPermissions: vm.get('userPermissions'),
                                            },
                                            formulas: {
                                                selectedDocument: {
                                                    bind: {
                                                        bindTo: '{documentsList.selection}',
                                                    },
                                                    get: function (record) {
                                                        return record;
                                                    },
                                                },
                                                loadDocument: {
                                                    bind: {
                                                        bindTo: '{selectedDocument.id}',
                                                    },
                                                    get: function (id) {
                                                        let record = this.get('selectedDocument');
                                                        if (record) {
                                                            Ext.ComponentQuery.query('[cls~=pdf-preview]')[0].setMasked(
                                                                true
                                                            );
                                                            var me = this;

                                                            me.getView()
                                                                .getController()
                                                                .loadDocument(
                                                                    Env.ApiEndpoint + 'get_pdf/' + record.get('id')
                                                                );
                                                        }
                                                    },
                                                },
                                            },
                                        },
                                    });
                                    dialog.show();
                                    return;
                                },
                            },
                        },
                    },
                ],
            },
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'middle',
                },
                maxHeight: 40,
                flex: 1,
                items: [
                    {
                        xtype: 'container',
                        hidden: true,
                        hideMode: 'clip',
                        bind: {
                            hidden: '{recordApprovals.total ? false : true}',
                        },
                        layout: {
                            type: 'hbox',
                            align: 'center',
                        },
                        items: [
//                            {
//                                xtype: 'gauge',
//                                cls: 'a-gauge-fix',
//                                height: 53,
//                                width: 53,
//                                minValue: 0,
//                                maxValue: 3,
//                                value: 0,
//                                bind: {
//                                    maxValue: '{recordApprovals.total}',
//                                    value: '{recordApprovals.approved}',
//                                    valueStyle: '{recordApprovals.valueStyle}',
//                                },
//                                textTpl: [
//                                    '<div class="transformer-guage-text" class="fw-b">',
//                                    '<div class="fs-11 fw-b">',
//                                    '{value}/{maxValue}',
//                                    '</div>',
//                                    '</div>',
//                                ],
//                                trackStart: 270,
//                                trackLength: 360,
//                                trackStyle: {
//                                    strokeWidth: 0,
//                                    outerRadius: '100%',
//                                    innerRadius: '100% - 2',
//                                },
//                            },
                            {
                                xtype: 'div',
                                hidden: true,
                                bind: {
                                    hidden: '{recordApprovals.total == recordApprovals.rejected ? false : true}',
                                    html: '<div><div class="fs-12 c-blue-grey">{recordApprovals.lastRecord.status:capitalize()} by all</div></div>',
                                },
                            },
                            {
                                xtype: 'div',
                                hidden: true,
                                bind: {
                                    hidden: '{recordApprovals.total == recordApprovals.approved ? false : true}',
                                    html: '<div><div class="fs-12 c-blue-grey">{recordApprovals.lastRecord.status:capitalize()} by all</div></div>',
                                },
                            },
                            {
                                xtype: 'div',
                                hidden: true,
                                bind: {
                                    hidden: '{recordApprovals.lastRecord && (recordApprovals.total != recordApprovals.approved && recordApprovals.total != recordApprovals.rejected) ? false : true}',
                                    html: '<div><div class="fs-12 c-blue-grey">{recordApprovals.lastRecord.status:capitalize()} by</div><a href="javascript:void(0)">{recordApprovals.lastRecord.company.name}</a></div>',
                                },
                            },
                            {
                                xtype: 'div',
                                hidden: true,
                                bind: {
                                    hidden: '{recordApprovals.lastRecord ? true : false}',
                                    html: '<div class="fs-12 c-blue-grey">Pending approval</div>',
                                },
                            },
                        ],
                    },
                    {
                        xtype: 'container',
                        margin: '0 16',
                        hidden: true,
                        bind: {
                            hidden: '{recordForApproval ? false : true}',
                        },
                        items: [
                            {
                                xtype: 'container',
                                layout: {
                                    type: 'hbox',
                                },
                                bind: {
                                    hidden: '{recordForApproval.status == "pending" ? false : true}',
                                },
                                items: [
                                    {
                                        xtype: 'button',
                                        ui: 'confirm alt small',
                                        text: 'Approve',
                                        testId: 'documentListApproveButton',
                                        cls: 'no_show',
                                        handler: function () {
                                            Ext.create('Abraxa.view.portcall.documents.DocumentsApproveDialog', {
                                                viewModel: {
                                                    parent: this.upVM(),
                                                },
                                            }).show();
                                        },
                                    },
                                    {
                                        xtype: 'button',
                                        margin: '0 0 0 8',
                                        ui: 'danger outlined small',
                                        text: 'Reject',
                                        testId: 'documentListRejectButton',
                                        cls: 'no_show',
                                        handler: function () {
                                            Ext.create('Abraxa.view.portcall.documents.DocumentsRejectDialog', {
                                                viewModel: {
                                                    parent: this.upVM(),
                                                },
                                            }).show();
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                bind: {
                    hidden: '{hasActiveAprovals || nonEditable ? true : false}',
                },
                items: [
                    {
                        xtype: 'button',
                        slug: 'portcallDocumentStatus',
                        testId: 'documentListStatusButton',
                        menu: {
                            defaults: {
                                handler: function (me) {
                                    let record = this.upVM().get('record'),
                                        button = me.up('button');
                                    if (button.getText() != this.getText()) {
                                        record.set('status', this.getText());
                                        record.save({
                                            success: function () {
                                                Ext.toast('Record updated.');
                                            },
                                        });
                                    }
                                },
                            },
                            items: [
                                {
                                    text: 'Draft',
                                },
                                {
                                    text: 'Final',
                                },
                                {
                                    text: 'Issued',
                                },
                                {
                                    text: 'Delivered on board',
                                },
                            ],
                        },
                        bind: {
                            cls: 'status-{record.status}',
                            text: '{record.status:capitalize}',
                            ui: '{statusBtn} status status-md',
                            hidden: '{record.status ? false : true}',
                            arrow: '{hasActiveAprovals || nonEditable ? false : true}',
                            permission: '{userPermissions}',
                        },
                    },
                ],
            },
            {
                xtype: 'container',
                bind: {
                    hidden: '{is_owner && nonEditable && selectedSection.selection.is_default ? false : true}',
                },
                items: [
                    {
                        bind: {
                            html: '<div class="a-document-status text-right"><div class="a-status-badge a-status-md status-{record.status}">{record.status}</div></div>',
                        },
                    },
                ],
            },
            {
                xtype: 'container',
                bind: {
                    hidden: '{record.status ? false : true}',
                },
                items: [
                    {
                        bind: {
                            html: '<div class="a-document-status text-right"><div class="a-status-badge a-status-md status-{record.status}">{record.status}</div></div>',
                            hidden: '{hasActiveAprovals || (nonEditable && !selectedSection.selection.is_default) ? false : true}',
                        },
                    },
                ],
            },
            {
                xtype: 'public.updated.by',
                cls: 'no_show',
                bind: {
                    data: {
                        user: '{record.updated_by_user}',
                        updated_at: '{record.updated_at}',
                    },
                },
                minWidth: 156,
                margin: '0 16 0 32',
            },
            {
                width: 38,
                items: [
                    {
                        xtype: 'documents.edit.button',
                        testId: 'documentListEditButton',
                        subObject: 'documents',
                        hidden: true,
                        bind: {
                            cls: '{nonEditable ? "hidden" : ""}',
                            objectPermission: '{objectPermissions}',
                        },
                    },
                ],
            },
            {
                xtype: 'button',
                margin: '0 0 0 8',
                iconCls: 'md-icon-navigate-next',
                ui: 'tool-sm round normal raised',
                testId: 'documentListDetailsButton',
                tooltip: {
                    anchorToTarget: true,
                    align: 'bc-tc?',
                    html: 'View details',
                    showDelay: 0,
                    hideDelay: 0,
                    dismissDelay: 0,
                    closeAction: 'destroy',
                },
                handler: function () {
                    let list = this.up('list'),
                        record = this.upVM().get('record');

                    list.select(record);
                },
            },
        ],
    },
    items: [
        {
            xtype: 'container',
            docked: 'top',
            margin: '8 16 16 24',
            height: 30,
            layout: {
                type: 'hbox',
                align: 'center',
                pack: 'space-between',
            },
            subObject: 'documents',
            items: [
                {
                    xtype: 'splitbutton',
                    text: 'Document',
                    iconCls: 'md-icon-add',
                    ui: 'action small',
                    slug: 'portcallDocuments',
                    testId: 'documentListAddDocumentButton',
                    hidden: true,
                    bind: {
                        hidden: '{nonEditable ? true : false}',
                        permission: '{userPermissions}',
                    },
                    height: 30,
                    menu: {
                        cls: 'a-menu-badges',
                        width: 170,
                        items: [
                            {
                                text: 'Operational',
                                testId: 'documentListAddOperationalMenuButton',
                                cls: 'a-menu-sof',
                                iconCls: 'md-icon-timer md-icon-outlined',
                                handler: function () {
                                    Ext.create('Abraxa.view.adocs.SofDocumentForm', {
                                        viewModel: {
                                            data: {
                                                object_record: this.upVM().get('object_record'),
                                                userPermissions: this.upVM().get('userPermissions'),
                                                documentTypes: this.upVM().get('documentTypes'),
                                                defaultCargoUnits: this.upVM().get('defaultCargoUnits'),
                                            },
                                        },
                                    }).show();
                                },
                            },
                            {
                                text: 'Cargo',
                                testId: 'documentListAddCargoMenuButton',
                                cls: 'a-menu-cargo',
                                iconCls: 'icon-cargo',
                                bind: {
                                    html: '{(currentUserPlan == "starter") ? "<span style=\\"margin-right: 12px; color: #FFB74D;\\"><i class=\\"far fa-gem\\"></i></span>":""}',
                                },
                                handler: function () {
                                    let vm = this.upVM(),
                                        currentUserPlan = vm.get('currentUserPlan');
                                    if (currentUserPlan == 'starter') {
                                        Ext.create('Abraxa.view.main.UpgradeDialog').show();
                                    } else {
                                        Ext.create('Abraxa.view.adocs.CargoDocumentForm', {
                                            viewModel: {
                                                data: {
                                                    object_record: vm.get('object_record'),
                                                    organizations: vm.get('organizations'),
                                                    documentTypes: vm.get('documentTypes'),
                                                    userPermissions: vm.get('userPermissions'),
                                                },
                                                formulas: {
                                                    showCombined: {
                                                        bind: {
                                                            bindTo: '{selectedDocumentTypes.selection}',
                                                            deep: true,
                                                        },
                                                        get: function (selection) {
                                                            let hide = true;
                                                            if (selection) {
                                                                Ext.each(selection, function (record) {
                                                                    if (record.get('can_combine')) {
                                                                        hide = false;
                                                                    }
                                                                });
                                                            }
                                                            return hide;
                                                        },
                                                    },
                                                    selectedCargoes: {
                                                        bind: {
                                                            bindTo: '{documentsSelectedCargoes.selection}',
                                                            deep: true,
                                                        },
                                                        get: function (selection) {
                                                            if (selection) {
                                                                return selection.length;
                                                            }
                                                            return 0;
                                                        },
                                                    },
                                                },
                                            },
                                        }).show();
                                    }
                                },
                            },
                            {
                                text: 'Disbursement',
                                testId: 'documentListAddDisbursementMenuButton',
                                cls: 'a-menu-financial',
                                iconCls: 'md-icon-attach-money',
                                handler: function () {
                                    Ext.create('Abraxa.view.adocs.FinancialDocumentForm', {
                                        viewModel: {
                                            data: {
                                                object_record: this.upVM().get('object_record'),
                                                disbursementGrouping: this.upVM().get('disbursementGrouping'),
                                                organizations: this.upVM().get('organizations'),
                                                organizationTypesFilter: this.upVM().get('organizationTypesFilter'),
                                                documentTypes: this.upVM().get('documentTypes'),
                                                document_data: {},
                                                subObjects: this.upVM().get('subObjects'),
                                                currentUser: this.upVM().get('currentUser'),
                                                userPermissions: this.upVM().get('userPermissions'),
                                                expenses: this.upVM().get('expenses'),
                                                recieptExpenses: this.upVM().get('recieptExpenses'),
                                                accounts: this.upVM().get('accounts'),
                                                bankAccounts: this.upVM().get('bankAccounts'),
                                            },
                                            formulas: {
                                                selectedDisbursementItems: {
                                                    bind: {
                                                        bindTo: '{selectedDisbursement.selection}',
                                                        deep: true,
                                                    },
                                                    get: function (record) {
                                                        if (record) {
                                                            let expenses = this.get('expenses'),
                                                                data = [];

                                                            expenses.each(function (item) {
                                                                if (
                                                                    item.get(record.get('type') + '_id') ==
                                                                        record.get('id') &&
                                                                    item.get('default_expense_item_id')
                                                                ) {
                                                                    data.push(item);
                                                                }
                                                            });
                                                            return data;
                                                        }
                                                    },
                                                },
                                            },
                                        },
                                    }).show();
                                },
                            },
                            {
                                text: 'Invoice',
                                testId: 'documentListAddInvoiceMenuButton',
                                cls: 'a-menu-invoice',
                                iconCls: 'md-icon md-icon-file-copy',
                                handler: function (btn) {
                                    const documentsVM = btn.upVM();
                                    const expensesStore = documentsVM.get('expenses');

                                    if (AbraxaFunctions.checkIfExpensesPresent(expensesStore) === false) return false;

                                    let docForm = Ext.create('Abraxa.view.adocs.InvoiceDocumentForm', {
                                        viewModel: {
                                            data: {
                                                object_record: documentsVM.get('object_record'),
                                                organizations: documentsVM.get('organizations'),
                                                documentTypes: documentsVM.get('documentTypes'),
                                                document_data: {},
                                                subObjects: documentsVM.get('subObjects'),
                                                fromSuply: false,
                                                currentUser: documentsVM.get('currentUser'),
                                                expenses: expensesStore,
                                                recieptExpenses: documentsVM.get('recieptExpenses'),
                                                accounts: documentsVM.get('accounts'),
                                                vouchers: documentsVM.get('vouchers'),
                                                bankAccounts: documentsVM.get('bankAccounts'),
                                            },
                                            formulas: {
                                                expenseItems: {
                                                    bind: {
                                                        bindTo: '{billingParty.selection}',
                                                        deep: true,
                                                    },
                                                    get: function (billingParty) {
                                                        if (!billingParty) return [];

                                                        const docFormVM = this;
                                                        const expenses = docFormVM.get('expenses'),
                                                            expense = docFormVM.get('expense'),
                                                            data = [];

                                                        if (expense) {
                                                            expenses.each(function (item) {
                                                                if (item.get('id') === expense.get('id')) {
                                                                    data.push(item);
                                                                }
                                                            });
                                                        } else {
                                                            expenses.each(function (item) {
                                                                if (
                                                                    item.get('default_expense_item_id') &&
                                                                    item.get('account_id') === billingParty.get('id')
                                                                ) {
                                                                    data.push(item);
                                                                }
                                                            });
                                                        }
                                                        return data;
                                                    },
                                                },
                                            },
                                        },
                                    });

                                    let selectedType = documentsVM.get('documentTypes').queryBy((rec, id) => {
                                        return rec.get('slug') === 'creditNote' || rec.get('slug') === 'invoice';
                                    }).items;

                                    if (selectedType.length) {
                                        Ext.Array.sort(selectedType, function (a, b) {
                                            return a.get('id') > b.get('id') ? 1 : -1;
                                        });
                                        docForm.upVM().set('document_data.document_type_id', selectedType[0].id);
                                    }
                                    docForm.show();
                                },
                            },
                        ],
                    },
                    handler: function () {
                        Ext.create('Abraxa.view.adocs.CreateDocumentPopup', {
                            viewModel: {
                                parent: this.upVM(),
                                data: {
                                    selectedFolder: this.upVM().get('selectedSection.selection'),
                                    object_record: this.upVM().get('object_record'),
                                    currentUser: this.upVM().get('currentUser'),
                                    organizations: this.upVM().get('organizations'),
                                    userPermissions: this.upVM().get('userPermissions'),
                                },
                            },
                        }).show();
                    },
                },
                {
                    xtype: 'div',
                },
                {
                    xtype: 'container',
                    layout: 'hbox',
                    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            slug: 'portcall',
                            hidden: true,
                            showAnimation: 'fade',
                            bind: {
                                cls: '{selectedSection.selection.is_default || nonEditable ? "" : "a-br-100"}',
                                permission: '{userPermissions}',
                                hidden: '{selectedFiles.length ? false : true}',
                                padding: '{selectedSection.selection.is_default ? "" : "0 8 0 0"}',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    margin: '0 0 0 8',
                                    ui: 'tool-text-sm',
                                    iconCls: 'md-icon-outlined md-icon-save-alt',
                                    text: 'Download',
                                    testId: 'documentListDownloadButton',
                                    handler: function () {
                                        let files = this.upVM().get('selectedFiles');

                                        Ext.each(files, function (file) {
                                            var record = file.upVM().get('record'),
                                                doc = record,
                                                name = record.get('name'),
                                                urlToSend =
                                                    Env.ApiEndpoint + 'file/' + doc.get('id') + '/download/' + name;

                                            var temporaryDownloadLink = document.createElement('a');
                                            temporaryDownloadLink.style.display = 'none';

                                            document.body.appendChild(temporaryDownloadLink);

                                            temporaryDownloadLink.setAttribute('href', urlToSend);
                                            temporaryDownloadLink.setAttribute('download', name);

                                            temporaryDownloadLink.click();

                                            document.body.removeChild(temporaryDownloadLink);
                                            file.setChecked(false);
                                        });
                                        this.upVM().set('selectedFiles', null);
                                    },
                                },
                                {
                                    xtype: 'button',
                                    margin: '0 0 0 8',
                                    ui: 'tool-text-sm',
                                    iconCls: 'md-icon-outlined md-icon-folder',
                                    text: 'Move to',
                                    testId: 'documentListMoveToButton',
                                    slug: 'portcall',
                                    subObject: 'documents',
                                    bind: {
                                        cls: '{nonEditable ? "hidden" : ""} ',
                                        // objectPermission: '{objectPermissions}',
                                    },
                                    handler: function (me) {
                                        let vm = me.upVM(),
                                            files = this.upVM().get('selectedFiles'),
                                            folders = this.upVM().get('folders'),
                                            selectedFolderId = this.upVM().get('selectedSection.selection.id'),
                                            approvalsCount;

                                        Ext.each(files, function (file) {
                                            var record = file.upVM().get('record');
                                            if (!approvalsCount) approvalsCount = record.approvals().count();
                                        });
                                        if (approvalsCount) {
                                            Ext.Msg.confirm(
                                                'Confirmation',
                                                'Are you sure you want to move the document/s to another folder?<br><br>The document/s have been submitted for approval.<br>Proceeding will cancel the approval process.',
                                                function (answer) {
                                                    if (answer == 'yes') {
                                                        Ext.create('Ext.Dialog', {
                                                            closable: true,
                                                            title: 'Move to',
                                                            cls: 'move_to_dialog',
                                                            items: [
                                                                {
                                                                    xtype: 'selectfield',
                                                                    ui: '',
                                                                    cls: 'a-field-icon icon-folder non-editable selected_folder',
                                                                    valueField: 'id',
                                                                    displayField: 'name',
                                                                    queryMode: 'local',
                                                                    store: folders,
                                                                    reference: 'newFolder',
                                                                    value: selectedFolderId,
                                                                },
                                                            ],
                                                            buttons: [
                                                                {
                                                                    text: 'Cancel',
                                                                    margin: '0 8 0 0',
                                                                    handler: function () {
                                                                        this.up('dialog').destroy();
                                                                    },
                                                                },
                                                                {
                                                                    text: 'Save',
                                                                    ui: 'action',
                                                                    handler: function (cmp) {
                                                                        let newFolder = cmp
                                                                            .upVM()
                                                                            .get('newFolder.selection');
                                                                        Ext.each(files, function (file) {
                                                                            var record = file.upVM().get('record'),
                                                                                folder_file = file
                                                                                    .upVM()
                                                                                    .get('record')
                                                                                    .getFolderFile(),
                                                                                store = file
                                                                                    .upVM()
                                                                                    .get(
                                                                                        'selectedSection.selection.documents'
                                                                                    );

                                                                            record.set('status', 'draft');
                                                                            folder_file.set(
                                                                                'document_folder_id',
                                                                                newFolder.get('id')
                                                                            );
                                                                            folder_file.save({
                                                                                success: function (rec, opt) {
                                                                                    Ext.toast('Document updated', 1500);
                                                                                    store.remove(folder_file);
                                                                                    let new_folder = folders.getById(
                                                                                        vm
                                                                                            .get('newFolder.selection')
                                                                                            .get('id')
                                                                                    );
                                                                                    new_folder.documents().add(record);
                                                                                    vm.set(
                                                                                        'refreshFolderCount',
                                                                                        new Date()
                                                                                    );
                                                                                },
                                                                                failure: function (batch, operations) {
                                                                                    Ext.Msg.alert(
                                                                                        'Something went wrong',
                                                                                        'Could not update file.'
                                                                                    );
                                                                                },
                                                                            });
                                                                            file.setChecked(false);
                                                                        });
                                                                        cmp.upVM().set('selectedFiles', null);
                                                                        Ext.ComponentQuery.query(
                                                                            '[cls~=move_to_dialog]'
                                                                        )[0].destroy();
                                                                    },
                                                                },
                                                            ],
                                                        }).show();
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
                                                        text: 'Yes',
                                                    },
                                                ]
                                            );
                                        } else {
                                            Ext.create('Ext.Dialog', {
                                                closable: true,
                                                title: 'Move to',
                                                cls: 'move_to_dialog',
                                                items: [
                                                    {
                                                        xtype: 'selectfield',
                                                        ui: '',
                                                        placeholder: 'Choose folder',
                                                        cls: 'a-field-icon icon-folder non-editable',
                                                        valueField: 'id',
                                                        displayField: 'name',
                                                        queryMode: 'local',
                                                        store: folders,
                                                        reference: 'newFolder',
                                                        value: selectedFolderId,
                                                    },
                                                ],
                                                buttons: [
                                                    {
                                                        text: 'Cancel',
                                                        margin: '0 8 0 0',
                                                        handler: function () {
                                                            record.reject();
                                                            this.up('dialog').destroy();
                                                        },
                                                    },
                                                    {
                                                        text: 'Save',
                                                        ui: 'action',
                                                        handler: function (cmp) {
                                                            let me = this;
                                                            let newFolder = me.upVM().get('newFolder.selection');
                                                            Ext.each(files, function (file) {
                                                                var record = file.upVM().get('record'),
                                                                    folder_file = file
                                                                        .upVM()
                                                                        .get('record')
                                                                        .getFolderFile(),
                                                                    store = file
                                                                        .upVM()
                                                                        .get('selectedSection.selection.documents');

                                                                record.set('status', 'draft');
                                                                folder_file.set(
                                                                    'document_folder_id',
                                                                    newFolder.get('id')
                                                                );
                                                                folder_file.save({
                                                                    success: function (rec, opt) {
                                                                        Ext.toast('Document updated', 1500);
                                                                        store.remove(folder_file);
                                                                        let new_folder = folders.getById(
                                                                            vm.get('newFolder.selection').get('id')
                                                                        );
                                                                        new_folder.documents().add(record);
                                                                        vm.set('refreshFolderCount', new Date());
                                                                    },
                                                                    failure: function (batch, operations) {
                                                                        Ext.Msg.alert(
                                                                            'Something went wrong',
                                                                            'Could not update file.'
                                                                        );
                                                                    },
                                                                });
                                                                file.setChecked(false);
                                                            });
                                                            cmp.upVM().set('selectedFiles', null);
                                                            Ext.ComponentQuery.query(
                                                                '[cls~=move_to_dialog]'
                                                            )[0].destroy();
                                                        },
                                                    },
                                                ],
                                            }).show();
                                        }
                                    },
                                },
                                {
                                    xtype: 'button',
                                    margin: '0 0 0 8',
                                    ui: 'tool-text-sm',
                                    iconCls: 'md-icon-outlined md-icon-delete',
                                    text: 'Delete',
                                    testId: 'documentListDeleteButton',
                                    slug: 'portcallDocumentDelete',
                                    subObject: 'documents',
                                    bind: {
                                        cls: '{nonEditable ? "hidden" : ""} ',
                                        objectPermission: '{objectPermissions}',
                                        permission: '{userPermissions}',
                                    },
                                    handler: function (deleteBtn) {
                                        Ext.Msg.confirm(
                                            'Delete',
                                            'Are you sure you want to delete the selected documents?',
                                            function (answer) {
                                                if (answer !== 'yes') return;
                                                const documentsViewModel = deleteBtn.upVM();
                                                const checkboxes = documentsViewModel.get('selectedFiles');
                                                const docRecords = [];

                                                if (!checkboxes || !checkboxes.length) return;
                                                checkboxes.forEach(function (checkbox) {
                                                    checkbox.setChecked(false);
                                                    const docRecord = checkbox.upVM().get('record');
                                                    docRecords.push(docRecord);
                                                });
                                                const documentsController = deleteBtn.lookupController();
                                                documentsController.deleteSelectedDocuments(
                                                    docRecords,
                                                    documentsViewModel
                                                );
                                            },
                                            // The scope (this reference) in which the callback is executed.
                                            deleteBtn,
                                            [
                                                {
                                                    xtype: 'button',
                                                    itemId: 'no',
                                                    margin: '0 8 0 0',
                                                    text: 'Cancel',
                                                },
                                                {
                                                    xtype: 'button',
                                                    itemId: 'yes',
                                                    ui: 'decline alt',
                                                    text: 'Delete',
                                                },
                                            ]
                                        );
                                    },
                                },
                            ],
                        },
                        {
                            xtype: 'button',
                            margin: '0 0 0 8',
                            ui: 'btn-sm small success',
                            iconCls: 'md-icon-outlined md-icon-check-circle',
                            text: 'Request approval',
                            testId: 'documentListRequestApprovalButton',
                            disabled: true,
                            slug: 'portcallDocumentApproval',
                            subObject: 'documents',
                            bind: {
                                hidden: '{selectedSection.selection.is_default || nonEditable ? true: false}',
                                disabled: '{selectedFiles.length ? false : true}',
                                permission: '{userPermissions}',
                            },
                            tooltip: {
                                ui: 'info',
                                html: 'Please select a document in order to send for approval',
                                maxWidth: 220,
                                anchor: true,
                                anchorToTarget: true,
                                align: 'bc-tc?',
                                closeAction: 'destroy',
                            },
                            handler: function () {
                                mixpanel.track('Request approval (docs screen) - button');
                                let selectedFiles = Ext.ComponentQuery.query('[cls~="file-checkbox"][checked="true"]');
                                let selectedRecords = [];
                                Ext.Array.each(selectedFiles, function (file) {
                                    selectedRecords.push(file.getParent().getRecord());
                                });
                                Ext.create('Abraxa.view.approval.SendForApprovalDialog', {
                                    viewModel: {
                                        parent: this.upVM(),
                                        data: {
                                            selectedRecords: selectedRecords,
                                            approvalMembers: this.upVM().get('sectionMembers'),
                                        },
                                    },
                                }).show();
                                mixpanel.track('Request approval button clicked (Disbursement)');
                            },
                        },
                    ],
                },
            ],
        },
    ],
    listeners: {
        childtap: function (cmp, item) {
            if (
                item.sourceElement.classList.value.indexOf('no_show') >= 0 ||
                item.sourceElement.classList.value == 'x-button-el'
            )
                return false;
        },
    },
});
