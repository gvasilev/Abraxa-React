import './OfficeUser';
import './OfficeBank';
import './OfficeEmail';
import '../settings/CustomFileNumber';

Ext.define('Abraxa.model.office.Office', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'name',
            type: 'auto',
            allowBlank: false,
        },
        {
            name: 'office_name',
            type: 'auto',
        },
        {
            name: 'company_id',
            type: 'auto',
        },
        {
            name: 'timezone_id',
            type: 'auto',
        },
        {
            name: 'phone',
            type: 'auto',
        },
        {
            name: 'email',
            type: 'auto',
            allowBlank: false,
        },
        {
            name: 'website',
            type: 'auto',
        },
        {
            name: 'country',
            type: 'auto',
        },
        {
            name: 'city',
            type: 'auto',
        },
        {
            name: 'address',
            type: 'auto',
        },
        {
            name: 'square_logo',
            type: 'auto',
        },
        {
            name: 'logo',
            type: 'auto',
        },
        {
            name: 'fax',
            type: 'auto',
        },
        {
            name: 'vat',
            type: 'auto',
        },
        {
            name: 'trade_reg',
            type: 'auto',
        },
        {
            name: 'description',
            type: 'auto',
        },
        {
            name: 'custom_file_number',
            type: 'boolean',
        },
        {
            name: 'users_count',
            type: 'integer',
            mapping: function (data) {
                return data.users_count || 0;
            },
        },
    ],
    idProperty: 'id',
    hasMany: [
        {
            name: 'users',
            model: 'Abraxa.model.office.OfficeUser',
            associatedKey: 'users',
        },
        {
            name: 'banks',
            model: 'Abraxa.model.office.OfficeBank',
            associatedKey: 'banks',
        },
        {
            name: 'emails',
            model: 'Abraxa.model.office.OfficeEmail',
            associatedKey: 'emails',
        },
        {
            name: 'custom_file_numbers',
            model: 'Abraxa.model.settings.CustomFileNumber',
            associatedKey: 'custom_file_numbers',
        },
    ],
    proxy: {
        type: 'rest',
        batchActions: true,
        url: Env.ApiEndpoint + 'company/${company_id}/offices',
        pageParam: false,
        startParam: false,
        limitParam: false,
        writer: {
            allowSingle: false,
            rootProperty: 'offices',
            clientIdProperty: 'officeId',
            // writeAllFields: true
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
