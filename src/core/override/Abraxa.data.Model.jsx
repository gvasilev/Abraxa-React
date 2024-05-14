Ext.define('Abraxa.data.Model', {
    override: 'Ext.data.field.Field',

    buildSearchIndex: function (data) {
        var str = '';
        var excludeProperties = [
            'company',
            'previous_login',
            'profile_image',
            'custom_company_id',
            'profile_image_url',
            'instructions',
            'invitations',
            'watching',
        ];
        iterate(data);

        function iterate(obj) {
            for (var property in obj) {
                if (!Ext.Array.contains(excludeProperties, property)) {
                    if (obj.hasOwnProperty(property)) {
                        if (typeof obj[property] == 'object') {
                            iterate(obj[property]);
                        } else {
                            if (property != 'model_name') {
                                if (typeof obj[property] == 'string') {
                                    str = str + '-' + obj[property].toLowerCase();
                                } else {
                                    str = str + '-' + obj[property];
                                }
                            }
                        }
                    }
                }
            }
        }
        return str;
    },
});
