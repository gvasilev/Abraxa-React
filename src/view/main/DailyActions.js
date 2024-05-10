Ext.define('Abraxa.view.main.DailyActions', {
    extend: 'Ext.Container',
    xtype: 'daily.actions',
    cls: 'a-daily-actions',
    controller: 'announcement-controller',
    flex: 1,
    layouyt: {
        type: 'vbox',
        align: 'stretch',
    },
    scrollable: 'y',
    items: [
        {
            xtype: 'container',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-daily-actions-header',
                    layout: {
                        type: 'hbox',
                        align: 'middle',
                        pack: 'space-between',
                    },
                    items: [
                        {
                            xtype: 'div',
                            cls: 'a-collapsible-title',
                            bind: {
                                html: "<div class='hbox'><div class='a-badge a-badge-announcement'><i class='material-icons-outlined'>campaign</i></div><div class='a-panel-title'>Announcements <em>({announcements.count})</em></div></div>",
                            },
                        },
                        {
                            xtype: 'container',
                            margin: '0 16 0 0',
                            cls: 'a-actions',
                            layout: {
                                type: 'hbox',
                                align: 'middle',
                            },
                            items: [
                                {
                                    xtype: 'button',
                                    ui: 'round tool-round-md warning',
                                    iconCls: 'md-icon-add',
                                    tooltip: {
                                        anchorToTarget: true,
                                        html: 'Create announcement',
                                        align: 'bc-tc?',
                                        showDelay: 0,
                                        hideDelay: 0,
                                        dismissDelay: 0,
                                        allowOver: false,
                                        closeAction: 'destroy',
                                    },
                                    handler: function (me) {
                                        let store = this.upVM().get('announcements'),
                                            createAnnouncement = me.upVM().get('createAnnouncement'),
                                            form = me.up('[xtype=daily\\.actions]').down('[itemId=announcementForm]');
                                        if (store.getCount() > 0 && createAnnouncement) {
                                            if (createAnnouncement && form.validate() && !store.needsSync) {
                                                record = store.add({
                                                    announcement: '',
                                                })[0];
                                                this.upVM().set('announcementRecord', record);
                                                this.upVM().set('createAnnouncement', true);
                                            } else {
                                                Ext.Msg.alert('Attention!', 'You have unsubmited data!');
                                            }
                                        } else {
                                            record = store.add({
                                                announcement: '',
                                            })[0];
                                            this.upVM().set('announcementRecord', record);
                                            this.upVM().set('createAnnouncement', true);
                                        }
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    xtype: 'formpanel',
                    itemId: 'announcementForm',
                    bind: {
                        cls: 'a-daily-actions-container a-announcements',
                        hidden: '{announcements.count ? false : true}',
                    },
                    bodyCls: 'a-bgr-transparent',
                    margin: '0 24',
                    padding: '10 16',
                    flex: 1,
                    scrollable: false,
                    items: [
                        //     {
                        //     xtype: 'tool',
                        //     iconCls: 'md-icon-chevron-left',
                        //     left: 16,
                        //     bind: {
                        //         hidden: '{createAnnouncement || editAnnouncement ? true : false}',
                        //         disabled: '{!indicator.activeItemIndex}'
                        //     },
                        //     ui: 'alt',
                        //     handler: 'onPrev'
                        // }, {
                        //     xtype: 'tool',
                        //     iconCls: 'md-icon-chevron-right',
                        //     right: 12,
                        //     bind: {
                        //         hidden: '{createAnnouncement || editAnnouncement ? true : false}',
                        //         disabled: '{indicator.activeItemIndex == announcements.count - 1}'
                        //     },
                        //     ui: 'alt',
                        //     handler: 'onNext'
                        //     },
                        {
                            xtype: 'container',
                            hidden: true,
                            bind: {
                                hidden: '{createAnnouncement || editAnnouncement ? false : true}',
                            },
                            flex: 1,
                            height: 120,
                            items: [
                                {
                                    xtype: 'textareafield',
                                    placeholder: 'Enter announcement',
                                    flex: 1,
                                    ui: 'classic',
                                    required: true,
                                    validators: /^(?!\s+$)/,
                                    bind: {
                                        value: '{announcementRecord.announcement}',
                                    },
                                    listeners: {
                                        painted: function (me) {
                                            me.setError(null);
                                        },
                                    },
                                },
                                {
                                    xtype: 'container',
                                    margin: '8 0 0 0',
                                    layout: {
                                        type: 'hbox',
                                        pack: 'end',
                                    },
                                    items: [
                                        {
                                            xtype: 'button',
                                            text: 'Cancel',
                                            ui: 'small',
                                            handler: function () {
                                                let store = this.upVM().get('announcements');
                                                this.upVM().set('createAnnouncement', false);
                                                this.upVM().set('editAnnouncement', false);
                                                store.rejectChanges();
                                            },
                                        },
                                        {
                                            xtype: 'button',
                                            bind: {
                                                text: '{createAnnouncement ? "Create" : "Save"}',
                                            },
                                            ui: 'small normal',
                                            handler: function (me) {
                                                let store = this.upVM().get('announcements'),
                                                    vm = this.upVM(),
                                                    form = me.up('formpanel');
                                                if (form.validate()) {
                                                    if (store.needsSync) {
                                                        store.sync({
                                                            success: function () {
                                                                Ext.Toast('Record updated');
                                                                vm.set('createAnnouncement', false);
                                                                vm.set('editAnnouncement', false);
                                                                store.load();
                                                            },
                                                        });
                                                    }
                                                }
                                            },
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            xtype: 'abraxa.componentdataview',
                            cls: 'announcement_carousel',
                            bind: {
                                store: '{announcements}',
                                hidden: '{createAnnouncement || editAnnouncement ? true : false}',
                            },
                            minHeight: 80,
                            reference: 'carousel',
                            publishes: ['activeItemIndex', 'count', 'items'],
                            layout: {
                                type: 'card',
                                animation: 'slide',
                                indicator: {
                                    reference: 'indicator',
                                    tapMode: 'item',
                                    publishes: ['activeIndex', 'count'],
                                },
                            },
                            scrollable: false,
                            itemConfig: {
                                xtype: 'container',
                                viewModel: {},
                                items: [
                                    {
                                        layout: {
                                            type: 'hbox',
                                            pack: 'space-between',
                                            align: 'middle',
                                        },
                                        items: [
                                            {
                                                xtype: 'public.updated.by',
                                                cls: 'chatter-avatar',
                                                bind: {
                                                    data: {
                                                        user: '{record.user}',
                                                        hide_tooltip: true,
                                                    },
                                                },
                                            },
                                            {
                                                xtype: 'div',
                                                // cls: 'chatter-title',
                                                bind: {
                                                    html: '<a href="javascript:void(0);" class="a-user">{record.user.first_name.0}. {record.user.last_name}</a></div>',
                                                },
                                            },
                                            {
                                                xtype: 'div',
                                                margin: '0 8',
                                                cls: 'sm-title',
                                                bind: {
                                                    html: '{record.created_at:date("d M y - H:i")}',
                                                },
                                            },
                                            {
                                                flex: 1,
                                            },
                                            {
                                                xtype: 'abraxa.container',
                                                hidden: true,
                                                top: 0,
                                                right: 0,
                                                cls: 'announcement-message-tools',
                                                items: [
                                                    {
                                                        xtype: 'button',
                                                        ui: 'round tool-sm',
                                                        iconCls: 'md-icon-edit md-icon-outlined',
                                                        tooltip: {
                                                            html: 'Edit',
                                                            align: 'bc-tc?',
                                                        },
                                                        handler: function () {
                                                            this.upVM().set('editAnnouncement', true);
                                                            this.upVM().set(
                                                                'announcementRecord',
                                                                this.upVM().get('record')
                                                            );
                                                        },
                                                    },
                                                    {
                                                        xtype: 'button',
                                                        ui: 'round tool-sm',
                                                        iconCls: 'md-icon-delete md-icon-outlined',
                                                        tooltip: {
                                                            html: 'Delete',
                                                            align: 'bc-tc?',
                                                        },
                                                        handler: function () {
                                                            let store = this.upVM().get('announcements'),
                                                                record = this.upVM().get('record');
                                                            Ext.Msg.confirm(
                                                                'Delete',
                                                                'Are you sure you would like to delete this entry?',
                                                                function (answer) {
                                                                    if (answer == 'yes') {
                                                                        store.remove(record);
                                                                        store.sync({
                                                                            success: function () {
                                                                                Ext.toast('Record deleted', 1000);
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
                                                                        text: 'Delete',
                                                                        ui: 'decline alt',
                                                                        separator: true,
                                                                    },
                                                                ]
                                                            );
                                                        },
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        xtype: 'div',
                                        margin: '6 0 0 0',
                                        cls: 'a-announcement-text',
                                        bind: {
                                            html: '{record.announcement}',
                                        },
                                    },
                                ],
                                listeners: {
                                    mouseenter: {
                                        element: 'element',
                                        fn: function fn() {
                                            let cmp = this.component,
                                                record = cmp.upVM().get('record'),
                                                currentUser = cmp.upVM().get('currentUser');

                                            if (record.get('created_by') == currentUser.get('id'))
                                                cmp.down('[cls~=announcement-message-tools]').show();
                                        },
                                    },
                                    mouseleave: {
                                        element: 'element',
                                        fn: function fn() {
                                            let cmp = this.component;
                                            cmp.down('[cls~=announcement-message-tools]').hide();
                                        },
                                    },
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    cls: 'announcement_indicator',
                    reference: 'bbar',
                    hidden: true,
                    margin: '8 0 0 0',
                    bind: {
                        hidden: '{announcements.count ? false : true}',
                    },
                },
            ],
        },
        {
            xtype: 'container',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-daily-actions-header',
                    items: [
                        {
                            xtype: 'div',
                            bind: {
                                html: "<div class='hbox'><div class='a-badge a-badge-tasks'><i class='md-icon-outlined md-icon-task-alt'></i></div><div class='a-panel-title'>Tasks <em>({myTasks.count})</em></div></div>",
                                cls: 'a-collapsible-title a-collapsible-trigger a-trigger-right',
                            },
                            listeners: {
                                click: {
                                    element: 'element',
                                    fn: function fn() {
                                        let component = this.component;
                                        component.toggleCls('is-collapsed');
                                        component
                                            .up('daily\\.actions')
                                            .down('[cls~=related_tasks]')
                                            .toggleCls('is-collapsed');
                                    },
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    bind: {
                        cls: 'a-daily-actions-container a-collapsible-container related_tasks',
                    },
                    ui: 'bordered',
                    items: [
                        {
                            xtype: 'list',
                            selectable: false,
                            cls: 'a-task-list',
                            bind: {
                                store: '{myTasks}',
                            },
                            itemConfig: {
                                viewModel: {
                                    formulas: {
                                        object_name: {
                                            bind: {
                                                bindTo: '{record.ownerable}',
                                                deep: true,
                                            },
                                            get: function (record) {
                                                let task = this.get('record');
                                                if (record) {
                                                    if (record.voyage) {
                                                        return record.voyage.vessel_name + ' ' + record.file_id;
                                                    } else {
                                                        return (
                                                            record.org_name +
                                                            ' ' +
                                                            (record.org_debtor_number ? record.org_debtor_number : '')
                                                        );
                                                    }
                                                }
                                                return 'TSK-' + task.get('id');
                                            },
                                        },
                                    },
                                },
                                xtype: 'container',
                                cls: 'a-task-row',
                                layout: 'hbox',
                                items: [
                                    {
                                        xtype: 'div',
                                        flex: 1,
                                        bind: {
                                            html: '<a class="fw-b c-blue" href="javascript:void(0);">{record.name}</a><div class="sm-title">{object_name}</div>',
                                        },
                                    },
                                    {
                                        xtype: 'container',
                                        cls: 'a-task-right',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                        },
                                        items: [
                                            {
                                                xtype: 'div',
                                                cls: 'a-task-priority',
                                                hidden: true,
                                                bind: {
                                                    hidden: '{record.priority == "high" ? false: true}',
                                                    html: '<i class="material-icons material-icons-outlined c-red md-18">flag</i>',
                                                },
                                            },
                                            {
                                                xtype: 'div',
                                                cls: 'a-date',
                                                hidden: true,
                                                bind: {
                                                    hidden: '{record.due_date ? false : true}',
                                                    html: '<span class="{record.overdue ? "c-red" : ""}">{record.due_date:date("d M")}</span>',
                                                },
                                            },
                                        ],
                                    },
                                ],
                            },
                            listeners: {
                                childtap: function (list, location, eOpts) {
                                    list.up('main\\.notificationmenu').hide(false);
                                    window.location.hash = '#taskmanager';
                                },
                            },
                        },
                    ],
                },
            ],
        },
        {
            xtype: 'container',
            items: [
                {
                    xtype: 'container',
                    cls: 'a-daily-actions-header',
                    items: [
                        {
                            xtype: 'div',
                            bind: {
                                html: "<div class='hbox'><div class='a-badge a-badge-mentions'><i class='material-icons-outlined'>alternate_email</i></div><div class='a-panel-title'>Mentions <em>({myMentions.count})</em></div></div>",
                                cls: 'a-collapsible-title a-collapsible-trigger a-trigger-right',
                            },
                            listeners: {
                                click: {
                                    element: 'element',
                                    fn: function fn() {
                                        let component = this.component;
                                        component.toggleCls('is-collapsed');
                                        component
                                            .up('daily\\.actions')
                                            .down('[cls~=my_mentions]')
                                            .toggleCls('is-collapsed');
                                    },
                                },
                            },
                        },
                    ],
                },
                {
                    xtype: 'container',
                    bind: {
                        cls: 'a-daily-actions-container a-collapsible-container my_mentions',
                    },
                    ui: 'bordered',
                    items: [
                        {
                            xtype: 'list',
                            cls: 'chatter',
                            bind: {
                                store: '{myMentions}',
                            },
                            itemConfig: {
                                viewModel: {
                                    formulas: {
                                        user: {
                                            bind: {
                                                bindTo: '{record}',
                                                deep: true,
                                            },
                                            get: function (record) {
                                                let commentator = record.get('commentator');

                                                if (commentator)
                                                    return commentator.first_name[0] + '.' + commentator.last_name;
                                            },
                                        },
                                        objectRenderer: {
                                            bind: {
                                                bindTo: '{record}',
                                                deep: true,
                                            },
                                            get: function (record) {
                                                if (record && record.get('ownerable')) {
                                                    let value = record.get('ownerable');
                                                    if (
                                                        record.get('ownerable_type') ==
                                                        'App\\Models\\Portcall\\Portcall'
                                                    ) {
                                                        return (
                                                            '<div class="sm-title">' +
                                                            value.voyage.vessel_name +
                                                            ' / ' +
                                                            value.file_id +
                                                            '</div>'
                                                        );
                                                    } else if (
                                                        record.get('ownerable_type') ==
                                                        'App\\Models\\Organization\\Organization'
                                                    ) {
                                                        return (
                                                            '<div class="sm-title">' +
                                                            value.org_name +
                                                            ' / #CDB-' +
                                                            value.org_id +
                                                            '</div>'
                                                        );
                                                    }
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
                                xtype: 'container',
                                cls: 'a-message-item white-space',
                                items: [
                                    {
                                        xtype: 'container',
                                        layout: {
                                            type: 'hbox',
                                            align: 'middle',
                                        },
                                        items: [
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
                                                xtype: 'div',
                                                // cls: 'chatter-title',
                                                bind: {
                                                    html: '<a href="javascript:void(0);" class="a-user">{user}</a>{objectRenderer}',
                                                },
                                            },
                                            {
                                                flex: 1,
                                            },
                                            {
                                                xtype: 'div',
                                                cls: 'sm-title',
                                                bind: {
                                                    html: '<span class="a-date">{createdAtDateFormated} today</span>',
                                                },
                                            },
                                        ],
                                    },
                                    {
                                        xtype: 'div',
                                        flex: 1,
                                        margin: '8 0 0 46',
                                        bind: {
                                            cls: 'chatter-message',
                                            html: '{record.note}',
                                        },
                                    },
                                ],
                            },
                            listeners: {
                                childtap: function (list, location, eOpts) {
                                    let record = location.record;
                                    // record.set('notification_status', 'read');
                                    if (record.get('object_record')) {
                                        list.up('main\\.notificationmenu').hide(false);
                                        window.location.hash = '#portcall/' + record.get('object_record').id;
                                    }
                                },
                            },
                        },
                    ],
                },
            ],
        },
    ],
});
