Ext.define('Abraxa.view.portnews.PortNewsType', {
    extend: 'Ext.Component',
    xtype: 'PortNewsType',
    viewModel: {
        data: {
            pressed: false,
        },
    },

    config: {
        record: null,
    },

    listeners: {
        click: {
            element: 'element',
            fn: function fn() {
                const vm = this.component.upVM();
                vm.set('pressed', !vm.get('pressed'));

                if (vm.get('editable')) {
                    this.component.removeCls(!vm.get('pressed') ? 'a-tag-badge a-pressed' : 'a-tag-badge');
                    this.component.setCls(vm.get('pressed') ? 'a-tag-badge a-pressed' : 'a-tag-badge');
                    Ext.fireEvent('selectedNewsType', {
                        pressed: vm.get('pressed'),
                        record: this.component.config.record,
                    });
                }
            },
        },
    },

    setRecord(record) {
        if (record) {
            this.config.record = record;
        } else {
            return;
        }
        this.setHtml(record.get('name'));
        this.removeCls('a-tag-badge a-tag-restrictions a-tag-warning a-tag-sustainability a-tag-lineup a-tag-default');

        switch (record.get('name')) {
            case 'Restrictions':
                this.addCls('a-tag-badge a-tag-restrictions');
                break;
            case 'Warning':
                this.addCls('a-tag-badge a-tag-warning');
                break;
            case 'Sustainability':
                this.addCls('a-tag-badge a-tag-sustainability');
                break;
            case 'Lineup':
                this.addCls('a-tag-badge a-tag-lineup');
                break;
            case 'General information':
                this.addCls('a-tag-badge a-tag-default');
                break;

            default:
                // this.setHtml(record.get('name'));
                break;
        }
    },
});
