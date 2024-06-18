Ext.define('Abraxa.view.settings.lirbrary.SharedCostCentersButton', {
    extend: 'Ext.Button',
    xtype: 'SharedCostCentersButton',
    iconCls: 'md-icon-outlined md-icon-share',
    ui: 'action',
    cls: 'a-has-counter',
    margin: '0 16',
    hidden: true,
    sharedCostCenters: function () {
        return new Ext.Promise(function (resolve, reject) {
            Ext.Ajax.request({
                url: Env.ApiEndpoint + 'cost-centers/shares/',
                method: 'GET',
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('id_token'),
                    'Content-Type': 'application/json',
                },
                jsonData: {},
                success: function (response) {
                    resolve(response);
                },
                failure: function (response) {
                    reject(response);
                },
            });
        });
    },
    afterRender: function () {
        const button = this;
        if (this.upVM().get('currentUser').data.company.type !== 'principal') return;
        button.sharedCostCenters().then((response) => {
            const data = JSON.parse(response.responseText).data;
            const vm = this.up('settings\\.library\\.main').getViewModel();
            vm.set('agentsCounts', data.length);
        });
    },

    listeners: {
        tap: function (button) {
            const vm = button.up('settings\\.library\\.main').getViewModel();
            const dialog = Ext.create('Abraxa.view.settings.lirbrary.CostCenterShareDialog', {});
            const dialogVm = dialog.getViewModel();
            dialog.show();
            dialog.setMasked({
                xtype: 'loadmask',
                message: 'Loading...',
            });

            button.sharedCostCenters().then((response) => {
                const sharedAgents = [];
                const data = JSON.parse(response.responseText).data;
                const sharedAgentsIds = data.map((record) => record.to_company_id);
                sharedAgentsIds.forEach((id) => {
                    const record = vm.get('agentsStore').findRecord('id', id, 0, false, true, true);
                    if (record) {
                        sharedAgents.push(record);
                    }
                });

                dialogVm.get('selectedAgents').loadData(sharedAgents);
                dialogVm.set('confirmButtonText', sharedAgents.length ? 'Save' : 'Share');
                dialog.setMasked(false);

                dialog.on('destroy', function (dialog) {
                    vm.set('agentsCounts', dialog.count);
                });
            });
        },
    },
});
