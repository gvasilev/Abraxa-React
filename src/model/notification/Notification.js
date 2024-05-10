Ext.define('Abraxa.model.notification.Notification', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            name: 'parsed_date',
            persist: false,
            convert: function (v, record) {
                if (record.get('created_at')) {
                    date = new Date(record.get('created_at'));
                    today = new Date();
                    today.setHours(0);
                    today.setMinutes(0);
                    today.setSeconds(0);
                    today.setMilliseconds(0);
                    diff = today.getTime() - date.getTime();
                    if (date.getDate() == today.getDate()) {
                        return (
                            Abraxa.getApplication().getController('AbraxaController').parseMomentDate(date, 'HH:mm') +
                            ' Today'
                        );
                    } else if (diff <= 24 * 60 * 60 * 1000) {
                        return (
                            Abraxa.getApplication().getController('AbraxaController').parseMomentDate(date, 'HH:mm') +
                            ' Yesterday'
                        );
                    } else {
                        return Abraxa.getApplication()
                            .getController('AbraxaController')
                            .parseMomentDate(date, 'HH:mm - DD MMM');
                    }
                }
            },
        },
        {
            name: 'grouper',
            persist: false,
            convert: function (v, record) {
                if (record.get('created_at')) {
                    date = new Date(record.get('created_at'));
                    today = new Date();
                    if (date.getDate() == today.getDate()) {
                        return 'Today';
                    } else {
                        return 'Older';
                    }
                }
            },
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'notification',
    },
});
