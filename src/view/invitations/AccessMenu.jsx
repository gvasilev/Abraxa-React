Ext.define('Abraxa.view.invitations.AccessMenu', {
    extend: 'Ext.menu.Menu',
    xtype: 'invitations.access.menu',
    cls: 'a-invitations-access-menu',
    width: 452,
    autoHide: false,
    viewModel: {
        data: {
            activateDisbursementFormula: new Date(),
        },
        formulas: {
            pemissionAccessMenu: {
                bind: {
                    bindTo: '{currentMember}',
                    deep: true,
                },
                get: function (member) {
                    let data = [
                        {
                            title: 'Overview',
                            checked: true,
                            disabled: true,
                        },
                        {
                            sub_object_slug: 'supply',
                            sub_object_id: 14,
                            title: 'Services',
                        },
                        {
                            sub_object_slug: 'general',
                            sub_object_id: 10,
                            title: 'General',
                        },
                        {
                            sub_object_slug: 'appointment',
                            sub_object_id: 22,
                            title: 'Appointment',
                        },
                        {
                            sub_object_slug: 'crewing',
                            sub_object_id: 15,
                            title: 'Crewing',
                        },
                        {
                            sub_object_slug: 'berth',
                            sub_object_id: 10,
                            title: 'Berths',
                        },
                        {
                            sub_object_slug: 'documents',
                            sub_object_id: 17,
                            title: 'Documents',
                            hidecheck: true,
                        },
                        {
                            sub_object_slug: 'sof',
                            sub_object_id: 12,
                            title: 'SOF',
                        },
                        {
                            sub_object_slug: 'billing',
                            sub_object_id: 23,
                            title: 'Billing',
                            hidecheck: true,
                        },
                        {
                            sub_object_slug: 'progress',
                            sub_object_id: 13,
                            title: 'Cargo progress',
                        },
                        {
                            sub_object_slug: 'kpis',
                            sub_object_id: 20,
                            title: 'KPIs',
                        },
                    ];
                    if (member && member.permissions()) {
                        const permissions = member.permissions();
                        Ext.Array.each(data, function (value) {
                            if (value.sub_object_slug) {
                                const permissionRecord = permissions.findRecord(
                                    'sub_object_slug',
                                    value.sub_object_slug
                                );
                                if (permissionRecord) {
                                    value.checked = true;
                                }
                            }
                        });
                    }
                    return data;
                },
            },
            disbursementMemberStore: {
                bind: {
                    disbursement: '{disbursements}',
                    member: '{currentMember}',
                },
                get: function (data) {
                    let items = [];
                    if (data.member && data.disbursement && data.disbursement.getCount()) {
                        let store = data.disbursement,
                            currentMember = data.member;
                        store.each(function (value) {
                            let item = {
                                id: value.get('id'),
                                currency: value.get('currency'),
                                balance: value.get('balance'),
                                group_id: value.get('group_id'),
                                account_id: value.get('account_id'),
                                name: value.get('name'),
                                type: value.get('type'),
                            };
                            let member = value.members().query('member_id', currentMember.get('id'));
                            if (member.items.length) {
                                item.checked = true;
                                item.member_id = currentMember.get('id');
                            } else {
                                item.checked = false;
                                item.member_id = null;
                            }
                            items.push(item);
                        });
                    }
                    return new Ext.data.Store({
                        data: items,
                        id: 'DisbursementMemberStoreData',
                        proxy: {
                            type: 'memory',
                        },
                    });
                },
            },
        },
    },
    items: [
        {
            xtype: 'container',
            showAnimation: 'fadeIn',
            hideAnimation: 'fadeOut',
            itemId: 'mainMenuContainer',
            items: [
                {
                    xtype: 'list',
                    layout: {
                        type: 'hbox',
                        pack: 'start',
                        align: 'stretch',
                        wrap: true,
                    },
                    bind: {
                        store: '{pemissionAccessMenu}',
                    },
                    flex: 1,
                    itemConfig: {
                        viewModel: true,
                        xtype: 'container',
                        cls: 'a-list-item',
                        minHeight: 40,
                        padding: '8 16',
                        layout: {
                            type: 'hbox',
                            pack: 'space-between',
                            align: 'middle',
                        },
                        width: 226,
                        items: [
                            {
                                xtype: 'div',
                                flex: 1,
                                bind: {
                                    html: '{record.title}',
                                },
                            },
                            {
                                xtype: 'checkboxfield',
                                ui: 'switch icon',
                                checkByHuman: false,
                                bind: {
                                    label: false,
                                    disabled: '{record.disabled}',
                                    checked: '{record.checked}',
                                    hidden: '{record.hidecheck}',
                                },
                                listeners: {
                                    mousedown: {
                                        element: 'inputElement',
                                        fn: function (e, el) {
                                            this.component.checkByHuman = true;
                                        },
                                    },
                                    change: function (me, checked, oldValue, e) {
                                        if (!me.checkByHuman) return;
                                        me.checkByHuman = false;

                                        const accessMenu = me.up('menu');
                                        const currentMember = me.upVM().get('currentMember');
                                        const permissions = currentMember.permissions();

                                        const cargoRecord = permissions.findRecord('sub_object_slug', 'cargo');
                                        const slug = me.upVM().get('record').get('sub_object_slug');
                                        const sub_object_id = me.upVM().get('record').get('sub_object_id');
                                        let addPermission = false;

                                        if (checked) {
                                            addPermission = true;
                                            if (slug === 'appointment') {
                                                if (!cargoRecord) {
                                                    permissions.add(
                                                        accessMenu.getPermissionsObject(currentMember, 'cargo', 11)
                                                    );
                                                }
                                            }
                                        } else {
                                            if (slug === 'appointment') {
                                                permissions.remove(cargoRecord);
                                            }
                                        }

                                        accessMenu.updatePermissions(currentMember, slug, sub_object_id, addPermission);
                                    },
                                },
                            },
                            {
                                xtype: 'div',
                                hidden: true,
                                cls: 'sm-title',
                                bind: {
                                    hidden: '{record.sub_object_slug == "billing" ? false:true}',
                                    html: '{memberInAccount}/{accountMemberStore.count}',
                                },
                            },
                            {
                                xtype: 'div',
                                hidden: true,
                                cls: 'sm-title',
                                bind: {
                                    hidden: '{record.sub_object_slug == "documents" ? false:true}',
                                    html: '{memberInFolders}/{folderStore.count}',
                                },
                            },
                            {
                                xtype: 'tool',
                                iconCls: 'md-icon-navigate-next',
                                ui: 'tool-sm',
                                margin: '0 -4 0 8',
                                hideOnClick: false,
                                tooltip: {
                                    anchorToTarget: true,
                                    align: 'bc-tc?',
                                    html: 'View details',
                                    showDelay: 0,
                                    hideDelay: 0,
                                    dismissDelay: 0,
                                    closeAction: 'destroy',
                                },
                                bind: {
                                    hidden: '{record.sub_object_slug == "billing" ? false:true}',
                                },
                                handler: function (me) {
                                    me.up('menu').down('[itemId=mainMenuContainer]').setHidden(true);
                                    me.up('menu').down('[itemId=accountsContainer]').setHidden(false);
                                },
                            },
                            {
                                xtype: 'tool',
                                iconCls: 'md-icon-navigate-next',
                                ui: 'tool-sm',
                                hideOnClick: false,
                                margin: '0 -4 0 8',
                                tooltip: {
                                    anchorToTarget: true,
                                    align: 'bc-tc?',
                                    html: 'View details',
                                    showDelay: 0,
                                    hideDelay: 0,
                                    dismissDelay: 0,
                                    closeAction: 'destroy',
                                },
                                bind: {
                                    hidden: '{record.sub_object_slug == "documents" ? false:true}',
                                },
                                handler: function (me) {
                                    me.up('menu').down('[itemId=mainMenuContainer]').setHidden(true);
                                    me.up('menu').down('[itemId=documentsContainer]').setHidden(false);
                                },
                            },
                        ],
                    },
                    listeners: {
                        childtap: function (me, location) {
                            let record = location.record,
                                isAdvanced = record.get('hidecheck');
                            if (isAdvanced) {
                                //get check is disbursement or documents
                                let container = null,
                                    mainMenuContainer = me.up('menu').down('[itemId=mainMenuContainer]');
                                if (record.get('sub_object_id') == 23) {
                                    container = me.up('menu').down('[itemId=accountsContainer]');
                                }
                                if (record.get('sub_object_id') == 17) {
                                    container = me.up('menu').down('[itemId=documentsContainer]');
                                }
                                if (container) {
                                    mainMenuContainer.setHidden(true);
                                    container.setHidden(false);
                                }
                            }
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            itemId: 'accountsContainer',
            hidden: true,
            flex: 1,
            showAnimation: {
                type: 'slide',
                direction: 'right',
            },
            items: [
                {
                    xtype: 'abraxa.titlebar',
                    padding: 0,
                    margin: '0',
                    title: 'Billing parties',
                    items: [
                        {
                            xtype: 'button',
                            margin: '0 8 0 16',
                            align: 'left',
                            iconCls: 'md-icon-keyboard-backspace',
                            ui: 'round default',
                            handler: function (me) {
                                me.up('menu').down('[itemId=accountsContainer]').setHidden(true);
                                me.up('menu').down('[itemId=mainMenuContainer]').setHidden(false);
                            },
                        },
                    ],
                },
                {
                    xtype: 'list',
                    flex: 1,
                    itemId: 'accountsList',
                    maxHeight: 270,
                    scrollable: true,
                    selectable: false,
                    bind: {
                        store: '{accountMemberStore}',
                    },
                    itemConfig: {
                        viewModel: {
                            formulas: {
                                memberInDisbursement: {
                                    bind: {
                                        record: '{record}',
                                        member: '{currentMember}',
                                        activateDisbursementFormula: '{activateDisbursementFormula}',
                                    },
                                    get: function (data) {
                                        let members = 0;
                                        if (data.record) {
                                            let disbursementMemberStore = this.get('disbursementMemberStore'),
                                                countMembers = disbursementMemberStore.queryBy(function (rec, id) {
                                                    return (
                                                        rec.get('checked') &&
                                                        rec.get('account_id') == data.record.get('id')
                                                    );
                                                });
                                            members = countMembers.count();
                                        }
                                        return members;
                                    },
                                },
                                disbursementCounts: {
                                    bind: {
                                        record: '{record}',
                                        disbursementCount: '{disbursements.count}',
                                        disbursements: '{disbursements}',
                                    },
                                    get: function (data) {
                                        let count = 0;
                                        if (data.record && data.disbursements) {
                                            let countDisb = data.disbursements.queryBy(function (rec, id) {
                                                return rec.get('account_id') == data.record.get('id');
                                            });
                                            count += countDisb.count();
                                        }
                                        return count;
                                    },
                                },
                            },
                        },
                        xtype: 'container',
                        padding: '8 16',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                        },
                        items: [
                            {
                                xtype: 'div',
                                flex: 1,
                                bind: {
                                    html: '<div class="hbox"><div class="a-badge a-badge-account"><i class="md-icon-outlined">corporate_fare</i></div><div class="ml-12"><div class="fw-b text-truncate" style="width: 200px">{record.bill_to_name}</div><div class="sm-title">#CR-{record.id}</div></div>',
                                },
                            },
                            {
                                xtype: 'div',
                                cls: 'sm-title mr-16',
                                bind: {
                                    html: '{memberInDisbursement}/{disbursementCounts}',
                                },
                            },
                            {
                                xtype: 'checkboxfield',
                                ui: 'switch icon',
                                checkByHuman: false,
                                bind: {
                                    label: false,
                                    checked: '{record.checked}',
                                },
                                listeners: {
                                    mousedown: {
                                        element: 'inputElement',
                                        fn: function (e, el) {
                                            this.component.checkByHuman = true;
                                        },
                                    },
                                    change: function (me, checked) {
                                        if (!me.checkByHuman) return;
                                        me.checkByHuman = false;

                                        const accessMenu = me.up('menu');
                                        const checkVM = me.upVM();
                                        const checkRecord = checkVM.get('record');
                                        const currentMember = me.upVM().get('currentMember');
                                        if (checked) {
                                            checkRecord.set('member_id', currentMember.get('id'));
                                        } else {
                                            checkRecord.set('member_id', null);
                                        }
                                        const store = me.up('list').getStore();
                                        const accountsPermission = [];

                                        store.each(function (value) {
                                            let permission = {
                                                member_id: value.get('member_id'),
                                                account_id: value.get('id'),
                                            };
                                            accountsPermission.push(permission);
                                        });
                                        currentMember.set('accountsPermission', accountsPermission);

                                        const slug = 'accounts';
                                        const sub_object_id = 23;
                                        const sharedIndex = accountsPermission.findIndex((val) => val.member_id);
                                        let addPermission = false;
                                        if (sharedIndex >= 0) {
                                            addPermission = true;
                                        }

                                        accessMenu.updatePermissions(currentMember, slug, sub_object_id, addPermission);
                                        me.upVM().set('activateAccountFormula', new Date());
                                    },
                                },
                            },
                            {
                                xtype: 'tool',
                                iconCls: 'md-icon-navigate-next',
                                ui: 'tool-sm',
                                margin: '0 0 0 16',
                                hideOnClick: false,
                                tooltip: {
                                    anchorToTarget: true,
                                    align: 'bc-tc?',
                                    html: 'View details',
                                    showDelay: 0,
                                    hideDelay: 0,
                                    dismissDelay: 0,
                                    closeAction: 'destroy',
                                },
                                handler: function (me) {
                                    me.up('menu').down('[itemId=accountsContainer]').setHidden(true);
                                    me.up('menu')
                                        .down('[itemId=disbursementContainer]')
                                        .getVM()
                                        .set('selectedAccount', me.upVM().get('record'));
                                    me.up('menu').down('[itemId=disbursementContainer]').setHidden(false);
                                },
                            },
                        ],
                    },
                    listeners: {
                        childtap: function (me, location, eOpts) {
                            if (location.source.target.localName == 'input') {
                                return false;
                            }
                            me.up('menu').down('[itemId=accountsContainer]').setHidden(true);
                            me.up('menu')
                                .down('[itemId=disbursementContainer]')
                                .getVM()
                                .set('selectedAccount', location.record);
                            me.up('menu').down('[itemId=disbursementContainer]').setHidden(false);
                        },
                    },
                },
            ],
        },
        {
            xtype: 'container',
            itemId: 'disbursementContainer',
            hidden: true,
            viewModel: {
                data: {
                    selectedAccount: null,
                },
                stores: {
                    disbMemberStore: {
                        source: '{disbursementMemberStore}',
                        filters: '{disbMebmerFilter}',
                    },
                },
                formulas: {
                    disbMebmerFilter: {
                        bind: {
                            bindTo: '{selectedAccount}',
                            deep: true,
                        },
                        get: function (record) {
                            if (record) {
                                let store = this.get('disbMemberStore');
                                if (store) store.clearFilter();

                                return function (rec) {
                                    if (rec.get('account_id') == record.get('id')) {
                                        return true;
                                    }
                                };
                            } else {
                                return function (item) {
                                    return true;
                                };
                            }
                        },
                    },
                },
            },
            flex: 1,
            showAnimation: {
                type: 'slide',
                direction: 'right',
            },
            items: [
                {
                    xtype: 'abraxa.titlebar',
                    padding: 0,
                    margin: '0',
                    title: 'Disbursements',
                    items: [
                        {
                            xtype: 'button',
                            margin: '0 8 0 16',
                            align: 'left',
                            iconCls: 'md-icon-keyboard-backspace',
                            ui: 'round default',
                            handler: function (me) {
                                me.up('menu').down('[itemId=disbursementContainer]').setHidden(true);
                                me.up('menu').down('[itemId=accountsContainer]').setHidden(false);
                                let checkboxs = me
                                    .up('menu')
                                    .down('[itemId=disbursementContainer]')
                                    .query('[xtype=checkboxfield]');
                                if (checkboxs) {
                                    Ext.Array.each(checkboxs, function (val) {
                                        val.checkByHuman = false;
                                    });
                                }
                            },
                        },
                        {
                            xtype: 'tool',
                            ui: 'tool-md',
                            iconCls: 'md-icon-close',
                            align: 'right',
                            margin: '0 16 0 8',
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
                            handler: function (me) {
                                me.up('menu').down('[itemId=disbursementContainer]').setHidden(true);
                                me.up('menu').down('[itemId=accountsContainer]').setHidden(true);
                                me.up('menu').down('[itemId=mainMenuContainer]').setHidden(false);
                                // me.up('menu').hide();
                            },
                        },
                    ],
                },
                {
                    xtype: 'abraxa.formlist',
                    flex: 1,
                    maxHeight: 270,
                    scrollable: true,
                    bind: {
                        store: '{disbMemberStore}',
                    },
                    itemConfig: {
                        viewModel: true,
                        xtype: 'container',
                        padding: '8 16',
                        layout: 'hbox',
                        items: [
                            {
                                xtype: 'div',
                                flex: 1,
                                bind: {
                                    html: '<div class="hbox"><span class="file-icon-badge file-icon-x32" data-type="{record.type}" data-icon="money"></span><div class="ml-12"><div class="fw-b">{record.name}</div><div class="sm-title">{record.group_id}</div></div>',
                                },
                            },
                            {
                                xtype: 'checkboxfield',
                                ui: 'switch icon',
                                checkByHuman: false,
                                disabled: true,
                                bind: {
                                    label: false,
                                    checked: '{record.checked}',
                                    disabled: '{selectedAccount.checked ? false:true}',
                                },
                                listeners: {
                                    mousedown: {
                                        element: 'inputElement',
                                        fn: function (e, el) {
                                            this.component.checkByHuman = true;
                                        },
                                    },
                                    change: function (me, checked) {
                                        const accessMenu = me.up('menu');

                                        if (!accessMenu || !me.up('list')) return;
                                        if (!me.checkByHuman) return;
                                        me.checkByHuman = false;

                                        const currentMember = me.upVM().get('currentMember');
                                        const currentDisbursementId = me.upVM().get('record').get('id');

                                        let currentDisbursements = currentMember.get('disbursementsPermission') || [];

                                        const existingDisbObj = currentDisbursements.find((val) => {
                                            return val.disbursement_id === currentDisbursementId;
                                        });
                                        // If unchecked, mark as not shared (will delete from permissions on BE):
                                        let updatedMemberId = null;
                                        if (checked === true) {
                                            // If checked, mark as shared:
                                            updatedMemberId = currentMember.get('id');
                                        }

                                        if (existingDisbObj) {
                                            existingDisbObj.member_id = updatedMemberId;
                                        } else {
                                            const disbPermission = {
                                                member_id: updatedMemberId,
                                                disbursement_id: currentDisbursementId,
                                            };
                                            currentDisbursements.push(disbPermission);
                                        }

                                        const slug = 'disbursements';
                                        const sub_object_id = 18;
                                        const sharedIndex = currentDisbursements.findIndex((val) => val.member_id);
                                        let addPermission = false;
                                        if (sharedIndex >= 0) {
                                            addPermission = true;
                                        }

                                        // Need to set currentDisbursements and permissions as new arrays to properly refresh bindings
                                        const updatedDisbursements = currentDisbursements.map((disb) => disb);
                                        currentMember.set('disbursementsPermission', updatedDisbursements);
                                        accessMenu.updatePermissions(currentMember, slug, sub_object_id, addPermission);
                                        accessMenu.getVM().set('activateDisbursementFormula', new Date());
                                    },
                                },
                            },
                        ],
                    },
                },
            ],
            listeners: {
                hide: function (me) {
                    let checkboxs = me.up('menu').down('[itemId=disbursementContainer]').query('[xtype=checkboxfield]');
                    if (checkboxs) {
                        Ext.Array.each(checkboxs, function (val) {
                            val.checkByHuman = false;
                        });
                    }
                },
            },
        },
        {
            xtype: 'container',
            itemId: 'documentsContainer',
            hidden: true,
            flex: 1,
            showAnimation: {
                type: 'slide',
                direction: 'right',
            },
            items: [
                {
                    xtype: 'abraxa.titlebar',
                    padding: 0,
                    margin: '0',
                    title: 'Shared folders',
                    items: [
                        {
                            xtype: 'button',
                            margin: '0 8 0 16',
                            align: 'left',
                            iconCls: 'md-icon-keyboard-backspace',
                            ui: 'round default',
                            handler: function (me) {
                                me.up('menu').down('[itemId=documentsContainer]').setHidden(true);
                                me.up('menu').down('[itemId=mainMenuContainer]').setHidden(false);
                            },
                        },
                    ],
                },
                {
                    xtype: 'abraxa.formlist',
                    flex: 1,
                    bind: {
                        store: '{folderStore}',
                    },
                    itemConfig: {
                        viewModel: true,
                        xtype: 'container',
                        cls: 'a-folder-item-access',
                        paddng: '0 8',
                        layout: {
                            type: 'hbox',
                            align: 'middle',
                            pack: 'space-between',
                        },
                        items: [
                            {
                                xtype: 'div',
                                cls: 'a-folder-name',
                                flex: 1,
                                bind: {
                                    html: '<i class="icon-folder-{!record.is_shared ? "Default" : "Shared"}"></i><div class="a-title">{record.name}<span class="sm-title">{record.file_count} documents</span></div>',
                                },
                            },
                            {
                                xtype: 'checkboxfield',
                                ui: 'switch icon',
                                checkByHuman: false,
                                bind: {
                                    label: false,
                                    checked: '{record.checked}',
                                    disabled: '{record.is_disabled}',
                                },
                                listeners: {
                                    mousedown: {
                                        element: 'inputElement',
                                        fn: function (e, el) {
                                            this.component.checkByHuman = true;
                                        },
                                    },
                                    change: function (me, checked) {
                                        if (!me.checkByHuman) return;
                                        me.checkByHuman = false;

                                        const accessMenu = me.up('menu');
                                        let currentMember = me.upVM().get('currentMember');
                                        if (checked === true) {
                                            me.upVM().get('record').set('member_id', currentMember.get('id'));
                                        } else {
                                            me.upVM().get('record').set('member_id', null);
                                        }
                                        let store = me.up('list').getStore(),
                                            documentsPermission = [];
                                        store.each(function (value) {
                                            if (value.get('is_shared')) {
                                                let permission = {
                                                    member_id: value.get('member_id'),
                                                    folder_id: value.get('folder_id'),
                                                };
                                                documentsPermission.push(permission);
                                            }
                                        });
                                        currentMember.set('documentsPermission', documentsPermission);

                                        const slug = 'documents';
                                        const sub_object_id = 17;
                                        const sharedIndex = documentsPermission.findIndex((val) => val.member_id);
                                        let addPermission = false;
                                        if (sharedIndex >= 0) {
                                            addPermission = true;
                                        }

                                        accessMenu.updatePermissions(currentMember, slug, sub_object_id, addPermission);
                                        me.upVM().set('activateDocumentFormula', new Date());
                                    },
                                },
                            },
                        ],
                    },
                },
            ],
        },
    ],
    listeners: {
        painted: function (me) {
            me.upVM().set('activateAccountFormula', new Date());
            me.upVM().set('activateDocumentFormula', new Date());
        },
        hide: function (me) {
            me.down('[itemId=accountsContainer]').setHidden(true);
            me.down('[itemId=disbursementContainer]').setHidden(true);
            me.down('[itemId=documentsContainer]').setHidden(true);
            me.down('[itemId=mainMenuContainer]').setHidden(false);
        },
    },
    getPermissionsObject: function (currentMember, slug, subObjectID) {
        return {
            object_id: currentMember.get('object_id'),
            object_meta_id: currentMember.get('object_meta_id'),
            can_edit: currentMember.get('role') === 'can edit' ? true : false,
            sub_object_id: subObjectID,
            sub_object_slug: slug,
        };
    },
    updatePermissions: function (currentMember, slug, sub_object_id, addPermission) {
        const accessMenu = this;
        const permissions = currentMember.permissions();

        const permissionRecord = permissions.findRecord('sub_object_slug', slug);
        if (addPermission === true) {
            if (!permissionRecord) {
                permissions.add(accessMenu.getPermissionsObject(currentMember, slug, sub_object_id));
            }
        } else {
            permissions.remove(permissionRecord);
        }

        // Need to explicitly set permissions as a new array to properly refresh stores and VM bindings
        const updatedPermissions = [];
        permissions.each(function (permission) {
            updatedPermissions.push(permission.getData());
        });

        currentMember.set('permissions', updatedPermissions);
    },
});
