import '../tasks/TaskController.jsx';
import '../../core/components/AbraxaFormlist.jsx';
Ext.define('Abraxa.view.portcall.InternalToolsPanel', {
    extend: 'Ext.Sheet',
    xtype: 'internal.tools.panel',
    cls: 'a-notification-center a-bgr-white',
    bodyCls: 'a-bgr-white',
    testId: 'internalToolsPanel',
    width: 540,
    // side: 'right',throw error comment for now
    displayed: false,
    hideOnMaskTap: true,
    flex: 1,
    scrollable: 'y',
    header: false,
    collapsible: false,
    weighted: true,
    modal: false,
    controller: 'task-controller',
    hideMode: 'offsets',
    margin: '73 0 0 0',
    toggle: function () {
        if (this.isVisible()) {
            // Ext.query('[class=x-mask]')[0].classList.remove('no-opacity');
            this.hide();
        } else {
            this.show();
            // Ext.query('[class=x-mask]')[0].classList.add('no-opacity');
        }
    },
    layout: {
        type: 'vbox',
        align: 'stretch',
    },
    slug: 'portcallNotes',
    bind: {
        permission: '{userPermissions}',
    },
    items: [
        {
            xtype: 'container',
            cls: 'a-titlebar',
            minHeight: 64,
            items: [
                {
                    xtype: 'title',
                    title: "<div class='hbox'><div class='a-badge a-badge-notes'><i class='md-icon-outlined md-icon-mode-comment'></i></div><div><span class='a-panel-title'>Internal notes</span><span class='a-panel-subtitle'><i class='md-icon-outlined md-icon-lock'></i>Visible only to my organization</span></div></div>",
                },
                {
                    xtype: 'container',
                    cls: 'a-actions',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                    },
                    items: [
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-add',
                            testId: 'internalToolsPanelAddBtn',
                            slug: 'portcallNotes',
                            // hidden: true,
                            bind: {
                                permission: '{userPermissions}',
                                disabled: '{object_record.is_archived ? true : false}',
                            },
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Add note',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function () {
                                let button = this;

                                // Check if a note is already opened
                                if (button.noteOpened) {
                                    return;
                                }

                                button.noteOpened = true;

                                let note = Ext.create('Abraxa.view.notes.AddNotePopup', {
                                    viewModel: {
                                        data: {
                                            object_record: this.upVM().get('object_record'),
                                            object_type: this.upVM().get('object_type'),
                                            users: this.upVM().get('users'),
                                            sortedFilesNoLimit: this.upVM().get('sortedFilesNoLimit'),
                                            currentUser: this.upVM().get('currentUser'),
                                            subObjects: this.upVM().get('subObjects'),
                                            editMode: false,
                                            record: this.upVM().get('notes').add({})[0],
                                        },
                                    },
                                    // Add listeners to reset the flag when the note is closed
                                    listeners: {
                                        destroy: () => {
                                            button.noteOpened = false; // Reset the flag
                                        },
                                    },
                                });

                                // Show the note
                                note.show();
                            },
                        },
                        {
                            weight: 0,
                            xtype: 'button',
                            ui: 'round tool-round-md toggle',
                            enableToggle: true,
                            iconCls: 'md-icon-search',
                            testId: 'internalToolsPanelSearchBtn',
                            tooltip: {
                                anchorToTarget: true,
                                align: 'bc-tc?',
                                html: 'Search',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                closeAction: 'destroy',
                            },
                            handler: function () {
                                Ext.select('.a-notes-search').toggleCls('is-hidden');
                            },
                        },
                        {
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            iconCls: 'md-icon-more-horiz',
                            hidden: true,
                            testId: 'internalToolsPanelMoreBtn',
                            tooltip: {
                                anchorToTarget: true,
                                html: 'More',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            arrow: false,
                            handler: function () {
                                let vm = this.upVM();
                                Ext.create('Ext.menu.Menu', {
                                    viewModel: {
                                        parent: vm,
                                    },
                                    items: [
                                        {
                                            iconCls: 'md-icon-outlined md-icon-picture-as-pdf',
                                            text: 'Export',
                                            handler: function (me) {
                                                let record = me.upVM().get('object_record'),
                                                    sections = ['notes'];
                                                Abraxa.export.portcall(record.get('id'), sections);
                                            },
                                        },
                                    ],
                                }).showBy(this, 'tr-br?');
                            },
                        },
                        {
                            iconCls: 'md-icon-keyboard-tab md-icon-outlined',
                            margin: 0,
                            xtype: 'button',
                            ui: 'round tool-round-md',
                            testId: 'internalToolsPanelCloseBtn',
                            tooltip: {
                                anchorToTarget: true,
                                html: 'Close',
                                align: 'bc-tc?',
                                showDelay: 0,
                                hideDelay: 0,
                                dismissDelay: 0,
                                allowOver: false,
                                closeAction: 'destroy',
                            },
                            handler: function () {
                                Ext.ComponentQuery.query('internal\\.tools\\.panel')[0].hide();
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            cls: 'a-notes-search is-hidden',
            padding: '0 16 16',
            items: [
                {
                    xtype: 'searchfield',
                    placeholder: 'Search notes',
                    ui: 'no-border classic',
                    testId: 'internalToolsPanelSearchField',
                    listeners: {
                        change: function (field, newValue, oldValue, eOpts) {
                            var notes = this.upVM().get('notes');
                            if (newValue == '') notes.removeFilter('search');
                        },
                        action: function (me, newValue, oldValue, eOpts) {
                            var query = this.getValue().toLowerCase();
                            var notes = this.upVM().get('notes');
                            notes.removeFilter('search');
                            if (query.length > 2) {
                                notes.addFilter(
                                    new Ext.data.Query({
                                        id: 'search',
                                        source: 'note like "' + query + '"',
                                    })
                                );
                            }
                        },
                        painted: function (me) {
                            me.focus();
                        },
                    },
                },
            ],
        },
        {
            xtype: 'abraxa.formlist',
            testId: 'internalToolsPanelAbxFormlist',
            variableHeights: true,
            cls: 'chatter a-bt-100',
            flex: 1,
            scrollable: true,
            emptyText:
                '<div class="a-inner"><div class="a-no-content-txt"><span class="fs-13">No notes available</span></div></div>',
            bind: {
                store: '{notes}',
            },
            itemConfig: {
                xtype: 'container',
                // flex: 1,
                width: '100%',
                cls: 'x-listitem a-message-item white-space',
                viewModel: {
                    data: {
                        hovered: false,
                    },
                    formulas: {
                        isOwn: {
                            bind: {
                                bindTo: '{record}',
                                deep: true,
                            },
                            get: function (record) {
                                let currentUser = this.get('currentUser'),
                                    object_record = this.get('object_record');

                                if (record.get('user_id') == currentUser.get('id')) {
                                    return 'own';
                                }
                                return false;
                            },
                        },
                        user: {
                            bind: {
                                bindTo: '{record}',
                                deep: true,
                            },
                            get: function (record) {
                                let commentator = record.get('commentator');

                                if (commentator) return commentator.first_name[0] + '.' + commentator.last_name;
                            },
                        },
                        likes: {
                            bind: {
                                bindTo: '{record}',
                                deep: true,
                            },
                            get: function (record) {
                                if (record) return record.likes();
                            },
                        },
                        edited: {
                            bind: {
                                bindTo: '{record}',
                                deep: true,
                            },
                            get: function (record) {
                                if (record.get('created_at'))
                                    return (
                                        record.get('created_at').setSeconds('00') ==
                                        record.get('updated_at').setSeconds('00')
                                    );
                            },
                        },
                        tooltipText: {
                            bind: {
                                bindTo: '{record.likes}',
                                deep: true,
                            },
                            get: function (likes) {
                                let html = 'Like';
                                if (likes.getCount()) {
                                    html = '<strong>Liked by</strong>';
                                    let currentUser = this.get('currentUser'),
                                        users = this.get('users'),
                                        user = likes.queryBy(function (rec, id) {
                                            return rec.get('created_by') == currentUser.get('id');
                                        }).items[0],
                                        others = likes.queryBy(function (rec, id) {
                                            return rec.get('created_by') != currentUser.get('id');
                                        }).items;

                                    if (user) {
                                        html += '<br>You';
                                    }
                                    if (others) {
                                        Ext.each(others, function (u) {
                                            let usr = users.queryBy(function (rec, id) {
                                                return rec.get('id') == u.get('created_by');
                                            }).items[0];
                                            if (usr) {
                                                html += '<br>' + usr.get('first_name')[0] + '.' + usr.get('last_name');
                                            }
                                        });
                                    }
                                }
                                return html;
                            },
                        },
                        noteSubObject: {
                            bind: {
                                bindTo: '{record}',
                                deep: true,
                            },
                            get: function (record) {
                                if (record) {
                                    let subObjects = this.get('subObjects');

                                    if (subObjects) {
                                        var subObject = Ext.Array.filter(subObjects, function (rec) {
                                            return (
                                                rec.id == record.get('noteable_id') &&
                                                rec.model == record.get('noteable_type')
                                            );
                                        })[0];
                                    }

                                    if (subObject) {
                                        let icon = '';
                                        switch (subObject.type) {
                                            case 'supply':
                                                icon = 'abraxa-icon-layers';
                                                break;
                                            case 'disposal':
                                                icon = 'abraxa-icon-recycle';
                                                break;
                                            case 'bunker':
                                                icon = 'abraxa-icon-oil';
                                                break;
                                            case 'service':
                                                icon = 'md-icon-outlined md-icon-assistant';
                                                break;
                                            case 'file':
                                                icon = 'md-icon-outlined md-icon-description';
                                                break;
                                            case 'cargo':
                                                icon = 'abraxa-icon-cargo';
                                                break;
                                            case 'berth':
                                                icon = 'md-icon-outlined md-icon-place';
                                                break;
                                            case 'user':
                                                icon = 'md-icon-outlined md-icon-person';
                                                break;
                                            case 'disbursement':
                                                icon = 'md-icon-outlined md-icon-attach-money';
                                                break;
                                            case 'incoming':
                                                icon = 'md-icon-outlined md-icon-add';
                                                subObject.name = Ext.String.capitalize(subObject.kind);
                                                break;
                                            case 'outgoing':
                                                icon = 'md-icon-outlined md-icon-remove';
                                                subObject.name = Ext.String.capitalize(subObject.kind);
                                                break;
                                            case 'requested':
                                                icon = 'md-icon-outlined md-icon-inventory';
                                                subObject.name = Ext.String.capitalize(subObject.kind);
                                                break;
                                            default:
                                                break;
                                        }
                                        subObject.iconCls = icon;
                                        return subObject;
                                    }
                                }
                            },
                        },
                        updatedAtDateFormated: {
                            bind: {
                                bindTo: '{record.updated_at}',
                                deep: true,
                            },
                            get: function (updatedAt) {
                                if (updatedAt) {
                                    return Abraxa.getApplication()
                                        .getController('AbraxaController')
                                        .parseMomentDate(
                                            updatedAt,
                                            AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                                        );
                                } else {
                                    return '';
                                }
                            },
                        },
                        createdAtDateFormated: {
                            bind: {
                                bindTo: '{record.created_at}',
                                deep: true,
                            },
                            get: function (createdAt) {
                                if (createdAt) {
                                    return Abraxa.getApplication()
                                        .getController('AbraxaController')
                                        .parseMomentDate(
                                            createdAt,
                                            AbraxaConstants.formatters.date.dayMonYearHyphenTime24
                                        );
                                } else {
                                    return '';
                                }
                            },
                        },
                    },
                },
                // bind: {
                //     hidden: '{record.created_by ? false : true}'
                // },
                layout: {
                    type: 'hbox',
                    pack: 'space-between',
                },
                items: [
                    {
                        xtype: 'abraxa.container',
                        hidden: true,
                        top: 6,
                        cls: 'chat-message-tools',
                        items: [
                            {
                                xtype: 'button',
                                ui: 'round tool-sm',
                                iconCls: 'md-icon-edit',
                                slug: 'portcallNotes',
                                bind: {
                                    permission: '{userPermissions}',
                                },
                                tooltip: 'Edit',
                                handler: function () {
                                    let button = this;

                                    // Check if a note is already opened
                                    if (button.noteOpened) {
                                        return;
                                    }

                                    button.noteOpened = true;

                                    let record = this.upVM().get('record'),
                                        subObjects = this.upVM().get('subObjects'),
                                        subObject = Ext.Array.filter(subObjects, function (rec) {
                                            return (
                                                rec.id == record.get('noteable_id') &&
                                                rec.model == record.get('noteable_type')
                                            );
                                        })[0];

                                    let note = Ext.create('Abraxa.view.notes.AddNotePopup', {
                                        viewModel: {
                                            data: {
                                                object_record: this.upVM().get('object_record'),
                                                users: this.upVM().get('users'),
                                                sortedFilesNoLimit: this.upVM().get('sortedFilesNoLimit'),
                                                currentUser: this.upVM().get('currentUser'),
                                                editMode: true,
                                                record: record,
                                                subObjects: subObjects,
                                                selectedSubObject: subObject ? subObject.id : null,
                                            },
                                        },
                                        // Add listeners to reset the flag when the note is closed
                                        listeners: {
                                            destroy: () => {
                                                button.noteOpened = false; // Reset the flag
                                            },
                                        },
                                    });

                                    // Show the note
                                    note.show();
                                },
                            },
                            {
                                xtype: 'button',
                                ui: 'round tool-sm',
                                iconCls: 'md-icon-close md-icon-outlined',
                                tooltip: 'Delete note',
                                slug: 'portcallNotes',
                                bind: {
                                    permission: '{userPermissions}',
                                },
                                handler: function () {
                                    let vm = this.upVM(),
                                        store = vm.get('notes'),
                                        record = this.upVM().get('record');
                                    Ext.Msg.confirm(
                                        'Delete',
                                        'Are you sure you want to delete this record?',
                                        function (answer) {
                                            if (answer == 'yes') {
                                                store.remove(record);
                                                store.sync({
                                                    success: function () {
                                                        Ext.toast('Record updated', 1000);
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
                                                text: 'Cancel',
                                            },
                                            {
                                                xtype: 'button',
                                                itemId: 'yes',
                                                ui: 'decline alt',
                                                text: 'Delete',
                                                separator: true,
                                            },
                                        ]
                                    );
                                },
                            },
                        ],
                    },
                    {
                        xtype: 'public.updated.by',
                        cls: 'chatter-avatar',
                        bind: {
                            data: {
                                user: '{record.commentator}',
                                hide_tooltip: true,
                            },
                        },
                    },
                    {
                        xtype: 'container',
                        flex: 1,
                        cls: 'chatter-message-cont',
                        items: [
                            {
                                xtype: 'div',
                                cls: 'chatter-title',
                                bind: {
                                    html: '<a href="javascript:void(0);" class="a-user">{user}</a><span class="a-date">{createdAtDateFormated}</span>',
                                },
                                listeners: {
                                    click: {
                                        element: 'element',
                                        delegate: 'a.a-user',
                                        fn: function (el) {
                                            if (this.component.upVM().get('record.commentator')) {
                                                var user = this.component.upVM().get('record.commentator');
                                                let tipExist = Ext.getCmp('createdByTool');
                                                if (tipExist) {
                                                    tipExist.destroy();
                                                }
                                                if (user) {
                                                    Ext.create('Abraxa.view.common.tooltips.PublicPersonToolTip', {
                                                        target: el.target,
                                                        id: 'createdByTool',
                                                        viewModel: {
                                                            data: {
                                                                user: user,
                                                                clickedElement: el.target,
                                                            },
                                                        },
                                                    }).show();
                                                }
                                            }
                                        },
                                    },
                                },
                            },
                            {
                                xtype: 'div',
                                bind: {
                                    cls: 'chatter-message',
                                    html: '{record.note}',
                                },
                            },
                            {
                                xtype: 'container',
                                cls: 'chatter-footer',
                                layout: {
                                    type: 'hbox',
                                    pack: 'space-between',
                                    align: 'middle',
                                },
                                items: [
                                    {
                                        xtype: 'div',
                                        bind: {
                                            html: '<i class="{noteSubObject.iconCls}"></i>{noteSubObject.name}',
                                            cls: 'a-status-badge a-status-xs a-status-{noteSubObject.type} rounded no-border',
                                        },
                                    },
                                    {
                                        xtype: 'container',
                                        layout: {
                                            type: 'hbox',
                                            pack: 'end',
                                            align: 'middle',
                                        },
                                        items: [
                                            {
                                                xtype: 'div',
                                                hidden: true,
                                                cls: 'text-right',
                                                margin: '0 16',
                                                bind: {
                                                    hidden: '{edited}',
                                                    html: '<small class="a-edited" title="Edited on {updatedAtDateFormated}">Edited</small>',
                                                },
                                            },
                                            {
                                                xtype: 'button',
                                                iconCls: 'md-icon-thumb-up md-icon-outlined',
                                                ui: 'default mini',
                                                iconAlign: 'right',
                                                cls: 'like_button',
                                                hidden: true,
                                                hideMode: 'opacity',
                                                // text: 23,
                                                bind: {
                                                    text: '{likes.count ? likes.count : null}',
                                                    ui: '{likes.count ? "normal mini" : "default mini"}',
                                                    hidden: '{likes.count || hovered ? false : true}',
                                                    iconCls: 'md-icon-thumb-up {likes.count ? "" : "md-icon-outlined"}',
                                                    tooltip: {
                                                        html: '{tooltipText}',
                                                        anchor: true,
                                                        anchorToTarget: true,
                                                        align: 'tc-bc?',
                                                        showDelay: 0,
                                                        hideDelay: 0,
                                                        dismissDelay: 0,
                                                        allowOver: false,
                                                        closeAction: 'destroy',
                                                    },
                                                },
                                                handler: function (btn) {
                                                    let likes = btn.upVM().get('likes'),
                                                        vm = btn.upVM(),
                                                        record = btn.upVM().get('record'),
                                                        currentUser = btn.upVM().get('currentUser'),
                                                        like = likes.queryBy(function (rec, id) {
                                                            return rec.get('created_by') == currentUser.get('id');
                                                        }).items[0];

                                                    if (like) {
                                                        likes.remove(like);
                                                        likes.sync();
                                                    } else {
                                                        likes.add({
                                                            object_id: vm.get('object_id'),
                                                            object_meta_id: vm.get('object_meta_id'),
                                                            likable_type: record.get('model_name'),
                                                            likable_id: record.get('id'),
                                                        });
                                                        likes.sync();
                                                    }
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                ],
                listeners: {
                    mouseenter: {
                        element: 'element',
                        fn: function fn() {
                            let cmp = this.component;

                            if (cmp.upVM().get('isOwn') && !cmp.upVM().get('object_record.is_archived'))
                                cmp.down('[cls~=chat-message-tools]').show();

                            cmp.upVM().set('hovered', true);
                        },
                    },
                    mouseleave: {
                        element: 'element',
                        fn: function fn() {
                            let cmp = this.component;

                            cmp.down('[cls~=chat-message-tools]').hide();
                            if (!cmp.upVM().get('record').likes().count()) {
                                cmp.down('[cls~=like_button]').hide();
                            }
                            cmp.upVM().set('hovered', false);
                        },
                    },
                    click: {
                        element: 'element',
                        delegate: 'a',
                        fn: function (el) {
                            let type = el.currentTarget.getAttribute('data-object-type');
                            let vm = this.component.upVM();

                            switch (type) {
                                case 'user':
                                    let tipExist = Ext.getCmp('notesPersonTooltip');
                                    if (tipExist) {
                                        tipExist.destroy();
                                    }
                                    Ext.create('Abraxa.view.common.tooltips.PersonToolTip', {
                                        id: 'notesPersonTooltip',
                                        viewModel: {
                                            parent: vm,
                                            data: {
                                                user_id: el.currentTarget.getAttribute('data-object-id'),
                                                clickedElement: el.target,
                                            },
                                        },
                                    }).showBy(el, 'bc-tc?');
                                    break;
                                case 'cargo':
                                    var commodity_id = parseInt(el.currentTarget.getAttribute('data-object-id'));
                                    if (commodity_id) Abraxa.Global.showCommodityDialog(commodity_id);

                                    break;

                                case 'file':
                                    var file_id = parseInt(el.currentTarget.getAttribute('data-object-id'));
                                    var selectedFile;
                                    var files = vm.get('sortedFilesNoLimit');

                                    Ext.each(files, function (file) {
                                        if (file.id == parseInt(el.currentTarget.getAttribute('data-file-id')))
                                            selectedFile = file;
                                    });

                                    selectedFile = new Abraxa.model.adocs.DocumentFolderFile(selectedFile);

                                    var data = {
                                        file_id: file_id,
                                        object_id: 3,
                                        object_meta_id: vm.get('object_record.id'),
                                    };
                                    Abraxa.getApplication()
                                        .getController('AbraxaController')
                                        .previewFile(selectedFile, data);

                                    break;
                            }
                        },
                    },
                },
            },
        },
        // {
        //     xtype: 'notes.input',
        //     docked: 'bottom'
        // }
    ],
});
