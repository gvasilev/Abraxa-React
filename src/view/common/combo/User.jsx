Ext.define('Abraxa.view.common.combo.User', {
    extend: 'Ext.field.ComboBox',
    xtype: 'user.combo',
    label: 'User',
    selectable: true,
    forceSelection: true,
    placeholder: 'Search users',
    valueField: 'id',
    displayField: 'full_name',
    minHeight: 42,
    triggers: {
        search: null,
        expand: {
            cls: 'no_show',
        },
    },
    bind: {
        store: '{activeUsers}',
    },
    itemTpl: Ext.create(
        'Ext.XTemplate',
        '<tpl if=\'!profile_image\'><div class="a-person a-icon-round">{[this.userInitials(values)]} {full_name}</div> <tpl else><div class="a-person a-icon-round"><img style="height: 24px;" src="{profile_image}"> {full_name}</div> </tpl>',
        {
            userInitials: function (values) {
                if (values) {
                    return '<span class="a-int">' + values.abbr + '</span>';
                }
            },
        }
    ),
    // store: {
    //     type: 'users',
    //     autoLoad: true
    // },
    queryMode: 'local',
    listeners: {
        initialize: function () {
            this.on('change', function (me) {
                let record = this.getSelection();
                this.removeCls('has-image');
                this.removeCls('no-image');
                this.removeCls('a-user-combo');
                this.beforeInputElement.set({
                    style: 'backgroundImage: none',
                });
                // this.beforeInputElement.dom.style.setProperty("--user-icon", "'" + record.get('abbr') + "'");
                // this.beforeInputElement.set({
                //     "style": 'backgroundImage: none',
                //     "data-abbr": record.get('abbr')
                // });
                if (record) {
                    let img = record.get('profile_image');
                    this.addCls('a-user-combo');
                    if (img) {
                        this.addCls('has-image');
                        this.removeCls('no-image');
                        this.beforeInputElement.set({
                            style: 'backgroundImage: url(' + img + ')',
                        });
                    } else {
                        this.removeCls('has-image');
                        this.addCls('no-image');
                        this.beforeInputElement.dom.style.setProperty('--user-icon', "'" + record.get('abbr') + "'");
                        this.beforeInputElement.set({
                            style: 'backgroundImage: none',
                            'data-abbr': record.get('abbr'),
                        });
                    }
                }
            });
        },
        clearicontap: function () {
            this.removeCls('has-image');
            this.removeCls('no-image');
            this.removeCls('a-user-combo');
            this.beforeInputElement.set({
                style: 'backgroundImage: none',
            });
        },
    },
});
