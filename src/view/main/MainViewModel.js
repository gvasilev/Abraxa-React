import Env from '../../env.jsx'; // Import Env from env.jsx
import '../../store/Components.jsx';
import '../../store/common/Organizations.jsx';
import '../../store/common/Users.jsx';
import '../../store/adocs/DocumentTypes.jsx';
import '../../store/common/OrganizationContacts.jsx';
import '../../store/common/PortsServed.jsx';
import '../../store/common/system/RecentlyOpened.jsx';
import '../../store/common/system/Notifications.jsx';
import '../../store/cdb/Types.jsx';
import '../../store/common/Objects.jsx';
import '../../store/announcement/Announcements.jsx';
import '../../store/tasks/Tasks.jsx';
import '../../store/comments/Comments.jsx';
import '../../store/common/CurrencyRates.jsx';
import '../../store/agreement/Agreements.jsx';
import '../../store/company/CompanyCurrencies.jsx';
import '../../store/common/DefaultUnits.jsx';
import '../../store/commodities/Commodities.jsx';
import '../../store/vessels/Vessels.jsx';
import '../../store/directory/agents/Agents.jsx';
Ext.define('Abraxa.view.main.MainViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.main-viewmodel',
    data: {
        object_id: null,
        object_meta_id: null,
        history: 0,
        object_record: null,
        is_logged: false,
        appHasUpdate: false,
        objectPermissions: null,
        newsFeedCount: 0,
        hideSections: {}, // by default, hide no sections
    },
    stores: {
        components: {
            type: 'components',
        },
        organizations: {
            type: 'organizations',
            autoLoad: true,
        },
        organizationsCombo: {
            type: 'organizations',
            autoLoad: true,
        },
        mainMenu: Ext.create('Ext.data.Store', {
            storeId: 'mainMenu',
            data: [
                {
                    iconCls: 'md-icon-dashboard md-icon-outlined',
                    icon: 'dashboard',
                    name: 'Dashboard',
                    hash: '#dashboard',
                    cls: 'chameleon_main_menu_dashboard',
                },
                {
                    iconCls: 'md-icon-business-center md-icon-outlined',
                    icon: 'business_center',
                    cls: 'chameleon_main_menu_portcalls',
                    name: 'Operations',
                    // slug: 'portcall',
                    // skipEditPermission: true,
                    hash: '#operations',
                    bind: {
                        pressed: '{(routeHash == "#operations") ? true : false}',
                        // permission: '{userPermissions}',
                    },
                },
                {
                    iconCls: 'md-icon-business-center md-icon-outlined',
                    icon: 'business_center',
                    cls: 'chameleon_main_menu_portcalls',
                    name: 'Port calls',
                    slug: 'portcall',
                    skipEditPermission: true,
                    hash: '#portcalls',
                    bind: {
                        pressed:
                            '{(routeHash == "#portcalls" || routeHash == "#portcall" || routeHash == "#invitations") ? true : false}',
                        permission: '{userPermissions}',
                    },
                },
                {
                    iconCls: 'md-icon-live-help md-icon-outlined',
                    icon: 'live_help',
                    hidden: false,
                    name: 'Inquiries',
                    hash: '#inquiries',
                    bind: {
                        pressed: '{(routeHash == "#inquiries") ? true : false}',
                    },
                },
                {
                    iconCls: 'md-icon-contacts md-icon-outlined',
                    name: 'Company database',
                    icon: 'contacts',
                    cls: 'chameleon_main_menu_cdb',
                    hash: '#companydatabase',
                    slug: 'cdb',
                    skipEditPermission: true,
                    bind: {
                        pressed: '{routeHash == "#companydatabase" ? true : false}',
                        permission: '{userPermissions}',
                    },
                },
                {
                    iconCls: 'md-icon-outlined md-icon-task-alt',
                    icon: '',
                    customIcon: 'md-icon-outlined md-icon-task-alt',
                    hidden: false,
                    name: 'Task manager',
                    hash: '#taskmanager',
                    slug: 'task',
                    skipEditPermission: true,
                    bind: {
                        pressed: '{(routeHash == "#taskmanager") ? true : false}',
                        permission: '{userPermissions}',
                    },
                },
                {
                    iconCls: 'md-icon-attach-money md-icon-outlined',
                    icon: '',
                    hidden: false,
                    name: 'Inquiries',
                    hash: '#nquiries',
                    bind: {
                        pressed: '{(routeHash == "#wpsboard") ? true : false}',
                    },
                },
            ],
        }),
        users: {
            type: 'users',
            autoLoad: true,
        },
        documentTypes: {
            type: 'document.types',
            autoLoad: true,
        },
        organizationContacts: {
            type: 'organization.contacts',
            autoLoad: true,
        },
        portsServed: {
            type: 'ports.served',
            autoLoad: true,
            sorters: [
                {
                    property: 'port_name',
                    direction: 'ASC',
                },
            ],
        },
        recentlyOpened: {
            type: 'recently-opened',
            autoLoad: true,
        },
        invitations: {
            type: 'invitations',
            filters: '{invitationFilter}',
            autoLoad: true,
            // groupField: 'status_order',
        },
        notifications: {
            type: 'notifications',
            autoLoad: true,
        },
        types: {
            type: 'company-organization-types',
            autoLoad: true,
        },
        objects: {
            type: 'objects',
            autoLoad: true,
        },
        announcements: {
            type: 'announcements',
            autoLoad: true,
        },
        myTasks: {
            type: 'tasks',
            autoLoad: true,
            proxy: {
                type: 'rest',
                url: Env.ApiEndpoint + 'my_tasks',
            },
        },
        myMentions: {
            type: 'comments',
            autoLoad: true,
            proxy: {
                type: 'rest',
                url: Env.ApiEndpoint + 'my_comments',
            },
        },
        currencyRates: {
            autoLoad: true,
            type: 'currency_rates',
            proxy: {
                extraParams: {
                    base_currency: '{currentCompany.default_currency}',
                },
            },
            updateProxy: function (proxy) {
                if (proxy) {
                    proxy.onAfter('extraparamschanged', this.load, this);
                }
            },
        },
        agreements: {
            autoLoad: true,
            type: 'agreements',
        },
        companyCurrencies: {
            autoLoad: true,
            type: 'company.currencies',
            proxy: {
                extraParams: {
                    company_id: '{currentCompany.id}',
                },
            },
            // filters: [{
            //     property: 'id',
            //     operator: '!=',
            //     value: -1,
            //     exactMatch: true
            // }],
            sorters: [
                {
                    property: 'is_default',
                    direction: 'DESC',
                },
            ],
            updateProxy: function (proxy) {
                if (proxy) {
                    proxy.onAfter('extraparamschanged', this.load, this);
                }
            },
        },
        defaultUnits: {
            type: 'default-units',
            autoLoad: true,
        },
        defaultCargoUnits: {
            source: '{defaultUnits}',
            filters: [
                {
                    filterFn: function (record) {
                        const arr = record.get('type').split(',');
                        return arr.includes('cargo');
                    },
                },
            ],
        },
        defaultServiceUnits: {
            source: '{defaultUnits}',
            filters: [
                {
                    filterFn: function (record) {
                        const arr = record.get('type').split(',');
                        return arr.includes('service');
                    },
                },
            ],
        },
        commodities: {
            type: 'commodities',
            autoLoad: true,
        },
        vessels: {
            type: 'vessels',
            autoLoad: true,
        },
        activeUsers: {
            source: '{users}',
            filters: [
                {
                    id: 'activeUsers',
                    filterFn: function (record) {
                        let company_user = record.get('company_user'),
                            company_user_record = null;
                        Ext.Array.each(company_user, function (value) {
                            if (value.company_id == record.get('current_company_id')) {
                                company_user_record = value;
                            }
                        });
                        if (company_user_record) {
                            return company_user_record.is_active;
                        }
                    },
                },
            ],
        },
        companyOffices: {
            autoLoad: true,
            type: 'CompanyOffices',
            proxy: {
                extraParams: {
                    company_id: '{currentCompany.id}',
                },
            },
        },
        agentsStore: {
            type: 'AgentsStore',
            autoLoad: true,
        },
    },
    formulas: {
        userPermissions: {
            bind: {
                bindTo: '{currentUser.role.permissions}',
                deep: true,
            },
            get: function (perms) {
                var me = this,
                    permissions = {};
                Ext.each(perms, function (permission) {
                    permissions[permission.slug] = permission;
                });
                return permissions;
            },
        },
        // todo - kalo Portcall will not work because of that !!!!IMPORTANT
        joinSocket: {
            bind: {
                bindTo: '{currentUser.current_company_id}',
                // deep: true
            },
            get: function (company_id) {
                if (company_id) {
                    Abraxa.Socket.init(company_id);
                }
            },
        },
        initChat: {
            bind: {
                bindTo: '{currentUser}',
                deep: true,
            },
            get: function (user) {
                let userID = user.get('id');
                // if (parseInt(userID) && (userID == 1 || userID == 9 || userID == 4)) {
                //     let uid = 'user' + userID;
                //     CometChatWidget.init({
                //         "appID": "316654f441dc020",
                //         "appRegion": "eu",
                //         "authKey": "8ba541cf0a6670372cd43e0f048a8aeb335db89b"
                //     }).then(response => {

                //         //You can now call login function.
                //         CometChatWidget.login({
                //             "uid": uid
                //         }).then(response => {
                //             CometChatWidget.launch({
                //                 "widgetID": "fb90cb2f-26ec-4a39-ad54-306faa118f5a",
                //                 "docked": "true",
                //                 "alignment": "right", //left or right
                //                 "roundedCorners": "true",
                //                 "height": "620px",
                //                 "width": "780px",
                //                 "defaultID": 'superhero1', //default UID (user) or GUID (group) to show,
                //                 "defaultType": 'user' //user or group
                //             });
                //         }, error => {

                //             //Check the reason for error and take appropriate action.
                //         });
                //     }, error => {

                //         //Check the reason for error and take appropriate action.
                //     });
                // }
            },
        },
        object_meta_id: {
            bind: {
                bindTo: '{routeParams}',
                deep: true,
            },
            get: function (params) {
                if (params) return parseInt(params);
            },
        },
        object_id: {
            bind: {
                bindTo: '{routeHash}',
                deep: true,
            },
            get: function (hash) {
                if (hash && hash == '#portcall') return 3;

                return null;
            },
        },
        headerIcon: {
            bind: {
                bindTo: '{routeHash}',
                deep: true,
            },
            get: function (hash) {
                if (hash) {
                    let cls = '',
                        icon = '';
                    switch (hash) {
                        case '#dashboard':
                            cls = 'a-logo-dashboard';
                            icon = 'md-icon-dashboard md-icon-outlined';
                            break;
                        case '#inquiries':
                        case '#inquiry':
                            cls = 'a-logo-inquiry';
                            icon = 'md-icon-live-help md-icon-outlined';
                            break;
                        case '#directory':
                        case '#profiles':
                        case '#port-info':
                            cls = 'a-logo-directory';
                            icon = 'md-icon-contacts md-icon-outlined';
                            break;
                        case '#pda':
                            cls = 'a-logo-inquiry';
                            icon = 'md-icon-live-help md-icon-outlined';
                            break;
                        case '#agencymanager':
                            cls = 'a-logo-am';
                            icon = 'abraxa-icon-am';
                            break;
                        case '#companydatabase':
                            cls = 'a-logo-cdb';
                            icon = 'md-icon-outlined md-icon-contacts';
                            break;
                        case '#company':
                            cls = 'a-logo-cdb';
                            icon = 'md-icon-outlined md-icon-contacts';
                            break;
                        case '#wpsboard':
                            cls = 'a-logo-billing';
                            icon = 'abraxa-icon-money';
                            break;
                        case '#inbox':
                            cls = 'a-logo-design';
                            icon = 'md-icon-inbox md-icon-outlined';
                            break;
                        // case '#voyage':
                        //     cls = 'a-logo-design';
                        //     icon = 'md-icon-water md-icon-outlined';
                        //     break;
                        // case '#financial':
                        // 	cls = 'a-logo-financials';
                        // 	icon = 'abraxa-icon-finance';
                        // 	break;
                        case '#calendar':
                            cls = 'a-logo-calendar';
                            icon = 'abraxa-icon-calendar';
                            break;
                        case '#map':
                            cls = 'a-logo-map';
                            icon = 'abraxa-icon-map';
                            break;
                        case '#taskmanager':
                            cls = 'a-logo-tasks';
                            icon = 'md-icon-outlined md-icon-task-alt';
                            break;
                        case '#settings':
                            cls = 'a-logo-settings';
                            icon = 'material-icons-outlined';
                            break;
                        case '#portcalls':
                        case '#operations':
                        case '#portcall':
                        case '#invitations':
                            cls = 'a-logo-appointment';
                            icon = 'md-icon-business-center md-icon-outlined';
                            break;
                        case '#design':
                            cls = 'a-logo-design';
                            icon = 'abraxa-icon-bulb';
                            break;
                        case '#billing':
                            cls = 'a-logo-billing';
                            icon = 'md-icon-attach-money md-icon';
                            break;
                        case '#404':
                            cls = 'a-logo-map';
                            icon = 'md-icon-error md-icon-outlined';
                            break;
                        case '#profile':
                            cls = 'a-logo-profile';
                            icon = 'md-icon-outlined md-icon-person';
                            break;
                        case '#calculator':
                            cls = 'a-logo-calculator';
                            icon = 'md-icon-calculate md-icon-outlined';
                            break;
                        case '#portnews':
                            cls = 'a-logo-portnews';
                            icon = 'md-icon-lab-profile md-icon-outlined';
                            break;
                        default:
                            cls = '';
                            icon = '';
                            break;
                    }
                    return {
                        icon: icon,
                        cls: cls,
                    };
                }
            },
        },
        object_header: {
            bind: {
                bindTo: '{routeHash}',
                deep: true,
            },
            get: function (hash) {
                if (hash) {
                    let header = {
                        xtype: 'default.header',
                    };
                    switch (hash) {
                        case '#portcall':
                            header.xtype = 'portcall.header';
                            break;
                        case '#portcalls':
                        case '#invitations':
                            header.xtype = 'portcalls.header';
                            break;
                        case '#companydatabase':
                            header.xtype = 'cdb.header';
                            break;
                        case '#company':
                            header.xtype = 'company.header';
                            break;
                        case '#taskmanager':
                            header.xtype = 'tasks.header';
                            break;
                        case '#inquiries':
                            header.xtype = 'inquiry.header';
                            break;

                        case '#inquiry':
                            header.xtype = 'inquiry.details.header';
                            break;
                        case '#directory':
                            header.xtype = 'DirectoryHeader';
                            break;
                        case '#pda':
                            header.xtype = 'inquiry.details.header';
                            break;
                        case '#wpsboard':
                            header.xtype = 'wps.financial.header';
                            break;
                        case '#calculator':
                            header.xtype = 'calculator.portcostengine.header';
                            break;
                        case '#operations':
                            header.xtype = 'OperationsHeader';
                            break;
                        case '#portnews':
                            header.xtype = 'PortNewsHeader';
                            break;
                    }
                    return header;
                }
            },
        },
        registration_mode: {
            bind: {
                bindTo: '{routeHash}',
                deep: true,
            },
            get: function (route) {
                if (route) {
                    switch (route) {
                        case '#signup':
                            return true;
                        default:
                            return false;
                    }
                }
            },
        },
        viewTitle: {
            bind: {
                bindTo: '{routeHash}',
                deep: true,
            },
            get: function (route) {
                let title = '';
                if (route) {
                    route = route.substr(1);
                    switch (route) {
                        case 'view':
                            title = '';
                            break;
                        case 'settings':
                            title = 'Settings';
                            break;
                        case 'dashboard':
                            title = 'Dashboard';
                            break;
                        case 'companydatabase':
                            title = 'Company Database';
                            break;
                        case 'inquiries':
                            title = 'Enquiries';
                            break;
                        case 'portcalls':
                        case 'portcall':
                        case 'invitations':
                            title = 'Port calls';
                            break;
                        case '404':
                            title = 'Page not found';
                            break;
                        case 'design':
                            title = 'Design';
                            break;
                        case 'billing':
                            title = 'Account & Billing';
                            break;
                        case 'taskmanager':
                            title = 'Task manager';
                            break;
                        case 'register':
                            title = 'Sign up';
                            break;
                        case 'login':
                            title = 'Login';
                            break;
                        case 'company':
                            title = 'Company';
                            break;
                        case 'profile':
                            title = 'My profile';
                            break;
                        case 'financial':
                            title = 'Financial board';
                            break;
                        case 'wpsboard':
                            title = 'Financial board';
                            break;
                        case 'calculator':
                            title = 'Calculator';
                            break;
                        case 'pda':
                            title = 'PDA';
                            break;
                        case 'inbox':
                            title = 'Inbox';
                            break;
                        case 'operations':
                            title = 'Operations';
                            break;
                        case 'directory':
                            title = 'Directory';
                            break;
                        case 'port-info':
                            title = 'Port';
                            break;
                        case 'profiles':
                            title = 'Public profile';
                            break;
                        case 'portnews':
                            title = 'News feed';
                            break;
                        case 'voyage':
                            title = 'Voyage';
                            break;
                        case 'comingsoon':
                            title = 'Coming soon';
                            break;
                        default:
                    }
                }
                window.document.title = title + ' - Abraxa';

                return title;
            },
        },
        userProfileImage: {
            bind: {
                bindTo: '{currentUser}',
                deep: true,
            },
            get: function (user) {
                if (user) {
                    if (user.get('profile_image') == '') {
                        return AbraxaConstants.urls.staticAbraxa + 'images/profile/no-image.svg';
                    } else {
                        return user.get('profile_image');
                    }
                }
            },
        },
        trackHsistory: {
            bind: {
                bindTo: '{routeHash}',
                deep: true,
            },
            get: function () {
                this.set('history', this.get('history') + 1);
            },
        },
        invitationFilter: {
            bind: {
                bindTo: '{currentUser}',
                deep: true,
            },
            get: function (user) {
                if (user) {
                    if (this.get('invitations')) {
                        this.get('invitations').clearFilter();
                    }
                    return function (item) {
                        return item.get('tenant_id') == user.get('current_company_id');
                    };
                }
            },
        },
        currentUserType: {
            bind: {
                bindTo: '{currentUser.company.type}',
                deep: true,
            },
            get: function (type) {
                return type;
            },
        },
        invitaionsPendingCount: {
            bind: {
                bindTo: '{invitations}',
                deep: true,
            },
            get: function (store) {
                let pendingCount = 0,
                    pendingRecords;
                if (store) {
                    pendingRecords = store.queryBy(function (record) {
                        return record.get('status') == 'Pending';
                    });
                    pendingCount = pendingRecords.items.length;
                }
                return pendingCount;
            },
        },
        invitationsCount: {
            bind: {
                bindTo: '{invitations}',
                deep: true,
            },
            get: function (store) {
                if (store && store.isLoaded()) {
                    let user = this.get('currentUser');
                    return {
                        received: store.queryBy(function (rec, id) {
                            return (
                                rec.get('tenant_id') == user.get('current_company_id') && rec.get('status') == 'Pending'
                            );
                        }).items.length,

                        sent: store.queryBy(function (rec, id) {
                            return (
                                rec.get('company_id') == user.get('current_company_id') &&
                                rec.get('status') == 'Pending'
                            );
                        }).items.length,
                    };
                }
            },
        },
        tasksCount: {
            bind: {
                bindTo: '{tasks}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    return store.queryBy(function (rec, id) {
                        return rec.get('status') != 'completed';
                    }).items.length;
                }
            },
        },
        currentUserPlan: {
            bind: {
                bindTo: '{currentUser.company.plan}',
                deep: true,
            },
            get: function (plan) {
                return plan;
            },
        },
        currentCompany: {
            bind: {
                bindTo: '{currentUser}',
                deep: true,
            },
            get: function (user) {
                return user.getCompany();
            },
        },
        offices: {
            bind: {
                bindTo: '{currentCompany}',
                deep: true,
            },
            get: function (record) {
                if (record.offices()) {
                    record.offices().getProxy().setBatchActions(true);
                    record.offices().getProxy().getWriter().setAllowSingle(false);
                    record
                        .offices()
                        .getProxy()
                        .setExtraParams({
                            company_id: record.get('id'),
                        });
                    record.offices().setAutoLoad(true);
                    return record.offices();
                }
            },
        },
        currentCompanyVerified: {
            bind: {
                bindTo: '{currentUser.company.verified}',
                deep: true,
            },
            get: function (is_verified) {
                return is_verified;
            },
        },
        pendingValidation: {
            bind: {
                bindTo: '{currentCompany}',
                deep: true,
            },
            get: function (company) {
                if (company && company.get('verified')) {
                    return 'verified';
                } else if (company && company.get('verification')) {
                    return 'pending';
                } else {
                    return 'not verified';
                }
            },
        },
        verifiedCompany: {
            bind: {
                bindTo: '{currentUser.company}',
                deep: true,
            },
            get: function (company) {
                if (company && company.get('verified')) {
                    return '<i class="material-icons c-green mr-12">verified_user</i><span class="c-black">Verified</span>';
                } else if (company && company.get('verification')) {
                    return '<i class="material-icons c-yellow mr-12">verified_user</i><span class="c-grey">Verification pending</span>';
                } else {
                    return '<i class="material-icons c-red mr-12">verified_user</i><span class="c-grey">Not verified</span>';
                }
            },
        },
        hideInviteButton: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    if (this.get('currentCompany') && this.get('currentCompany').get('verified')) {
                        if (record.get('is_live') || record.get('is_archived')) return true;

                        return false;
                    } else {
                        return true;
                    }
                }
            },
        },
        hideTaskNotesTools: {
            bind: {
                routeHash: '{routeHash}',
            },
            get: function (data) {
                if (data && data.routeHash) {
                    let hiddens = ['#companydatabase', '#inquiry', '#pda', '#port-info', '#profiles', '#voyage'];
                    if (Ext.Array.contains(hiddens, data.routeHash)) {
                        return true;
                    } else {
                        return false;
                    }
                }
                return true;
            },
        },
        windowLocation: {
            bind: {
                bindTo: '{object_record}',
                deep: true,
            },
            get: function (record) {
                if (
                    record &&
                    this.get('routeHash') != '#company' &&
                    record &&
                    this.get('routeHash') != '#port-info' &&
                    record &&
                    this.get('routeHash') != '#profiles' &&
                    this.get('routeHash') != '#portnews'
                ) {
                    window.document.title =
                        record.getVoyage().get('vessel_name') + ' [' + record.get('file_id') + '] - Abraxa';
                }
            },
        },
        mixPanelIdentify: {
            bind: {
                bindTo: '{currentUser}',
                // deep: true
            },
            get: function (user) {
                if (user && user.get('current_company_id')) {
                    var USER_ID = user.get('id');
                    mixpanel.identify(USER_ID);

                    mixpanel.people.set({
                        $email: user.get('email'), // only reserved properties need the $
                        'Sign up date': new Date().toISOString(), // Send dates in ISO timestamp format (e.g. "2020-01-02T21:07:03Z")
                        USER_ID: USER_ID, // use human-readable names
                        credits: 150, // ...or numbers
                    });
                }
            },
        },
        sentryIdentify: {
            bind: {
                bindTo: '{currentUser}',
            },
            get: function (user) {
                if (user && user.get('current_company_id')) {
                    if (typeof Sentry !== 'undefined') {
                        Sentry.setUser({
                            email: user.get('email'),
                            id: user.get('id'),
                            username: user.get('full_name'),
                        });
                    }
                }
            },
        },
        unreadNotifications: {
            bind: {
                bindTo: '{notifications}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    return (store = store.queryBy(function (record) {
                        return record.get('is_seen') == 0;
                    }).items.length);
                }
            },
        },
        companiesWithContacts: {
            bind: {
                bindTo: '{organizations}',
                deep: true,
            },
            get: function (store) {
                if (store) {
                    let combined = [],
                        emails = [];
                    store.each(function (value) {
                        if (!emails.includes(value.get('org_email'))) {
                            emails.push(value.get('org_email'));
                            combined.push(
                                Ext.create('Abraxa.model.company.Company', {
                                    org_id: value.get('org_id'),
                                    org_email: value.get('org_email'),
                                    org_name: value.get('org_name'),
                                    is_contact: false,
                                })
                            );
                        }
                        value.contacts().each(function (contact) {
                            if (!emails.includes(contact.get('contact_email'))) {
                                emails.push(contact.get('contact_email'));
                                combined.push(
                                    Ext.create('Abraxa.model.company.Company', {
                                        contact_id: contact.get('contact_id'),
                                        is_contact: true,
                                        org_email: contact.get('contact_email'),
                                        org_name: contact.get('contact_full_name'),
                                    })
                                );
                            }
                        });
                        value.departments().each(function (department) {
                            if (!emails.includes(department.get('contact_email'))) {
                                emails.push(department.get('dept_email'));
                                combined.push(
                                    Ext.create('Abraxa.model.company.Company', {
                                        dept_id: department.get('dept_id'),
                                        org_email: department.get('dept_email'),
                                        org_name: department.get('dept_name'),
                                    })
                                );
                            }
                        });
                    });
                    return combined;
                }
                return [];
            },
        },
        editablePermissions: {
            bind: {
                bindTo: '{objectPermissions}',
                deep: true,
            },
            get: function (permissions) {
                if (permissions) {
                    let generalPermission = Object.keys(permissions).includes('general');
                    if (generalPermission) {
                        if (!permissions['general'].can_edit) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }
                return true;
            },
        },
        cdbActiveTab: {
            bind: {
                bindTo: '{routeParams}',
                deep: true,
            },
            get: function get(route) {
                let tab = 0;
                switch (route) {
                    case 'companies':
                        tab = 0;
                        break;

                    case 'contacts':
                        tab = 1;
                        break;
                }
                return tab;
            },
        },
        showInvitation: {
            bind: {
                bindTo: '{invitation_id}',
                deep: true,
            },
            get: function (id) {
                if (id) {
                    let store = this.get('invitations');
                    if (store.isLoaded()) {
                        let invitation = store.getById(id);
                        Abraxa.getApplication().getController('AbraxaController').showInviteDialog(invitation);
                    } else {
                        store.invitation_id = id;
                    }
                }
            },
        },
        bankAccounts: {
            bind: {
                bindTo: '{currentUser}',
                deep: true,
            },
            get: function (user) {
                let banks = [];
                let company = this.get('currentCompany');
                if (user) {
                    if (user.get('current_office_id')) {
                        let office = user.getOffice();
                        if (office && office.get('banks') && office.get('banks').length) {
                            Ext.Array.each(office.get('banks'), function (bank) {
                                let bankModel = bank.bank;
                                bankModel.is_default = Boolean(bank.is_default);
                                banks.push(bankModel);
                            });
                        } else {
                            if (company.banks()) {
                                company.banks().each(function (bank) {
                                    banks.push(bank);
                                });
                            }
                        }
                    } else {
                        if (company.banks()) {
                            company.banks().each(function (bank) {
                                banks.push(bank);
                            });
                        }
                    }
                }
                return banks;
            },
        },
        usersForMention: {
            bind: {
                bindTo: '{users}',
                deep: true,
            },
            get: function (users) {
                let data = [];
                if (users) {
                    users.each(function (record) {
                        let user = record.getData();

                        user.name = user.first_name + user.last_name;
                        user.type = 'user';

                        data.push({
                            name: user.first_name + user.last_name,
                            type: 'user',
                            profile_image: user.profile_image,
                            abbr: user.abbr,
                            full_name: user.full_name,
                            id: user.id,
                        });
                    });
                }
                return data;
            },
        },
        customSequence: {
            bind: {
                bindTo: '{currentUser}',
                deep: true,
            },
            get: function (currentUser) {
                let data = {
                    disbursement: false,
                    portcall: false,
                };
                let company = this.get('currentCompany');
                if (company.get('custom_file_number')) {
                    data.portcall = true;
                    data.portcall_placeholder = 'Automated ID';
                }

                if (currentUser.get('office') && currentUser.get('office').custom_file_number) {
                    Ext.each(currentUser.get('office').custom_file_numbers, function (sequence) {
                        data[sequence.numerable_type] = true;
                        switch (sequence.numerable_type) {
                            case 'disbursement':
                                data.disbursement_placeholder =
                                    'Automated ID ' +
                                    (sequence.prefix ? sequence.prefix : '') +
                                    sequence.sequence +
                                    (sequence.suffix ? sequence.suffix : '');
                                break;
                            case 'portcall':
                                data.portcall_placeholder =
                                    'Automated ID ' +
                                    (sequence.prefix ? sequence.prefix : '') +
                                    sequence.sequence +
                                    (sequence.suffix ? sequence.suffix : '');
                                break;
                        }
                    });
                }
                return data;
            },
        },
        organizationTypesFilter: {
            bind: {
                bindTo: '{types}',
                deep: true,
            },
            get: function (store) {
                let filterItems = [];
                store.each(function (rec) {
                    filterItems.push({
                        text: rec.get('org_t_name'),
                        value: rec.get('org_t_id'),
                        group: 'type',
                    });
                });
                return filterItems;
            },
        },
    },
});
