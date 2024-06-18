import '../settings/company/CompanyCurrency';
import '../team/Team';
import '../settings/company/EmailSettings';
import '../office/Office';
import '../settings/CompanyBankDetails';
import '../company/CustomComponent';

Ext.define('Abraxa.model.common.Company', {
    extend: 'Ext.data.Model',
    idProperty: 'id',
    fields: [
        {
            type: 'number',
            name: 'id',
        },
        {
            type: 'string',
            name: 'name',
        },
        {
            type: 'string',
            name: 'short_name',
        },
        {
            type: 'string',
            name: 'type',
        },
        {
            type: 'auto',
            name: 'country',
        },
        {
            type: 'auto',
            name: 'country_name',
        },
        {
            type: 'auto',
            name: 'city',
        },
        {
            type: 'auto',
            name: 'city_name',
        },
        {
            type: 'string',
            name: 'address',
        },
        {
            type: 'string',
            name: 'email',
        },
        {
            type: 'string',
            name: 'phone',
        },
        {
            type: 'string',
            name: 'employess',
        },
        {
            type: 'string',
            name: 'vat',
        },
        {
            type: 'string',
            name: 'fax',
        },
        {
            type: 'string',
            name: 'website',
        },
        {
            type: 'string',
            name: 'logo',
        },
        {
            type: 'string',
            name: 'notes',
        },
        {
            type: 'boolean',
            name: 'custom_file_number',
        },
        {
            name: 'updated_at',
            type: 'auto',
            persist: false,
        },
        {
            type: 'boolean',
            name: 'use_mfa',
        },
    ],
    hasMany: [
        {
            name: 'currencies',
            model: 'Abraxa.model.settings.company.CompanyCurrency',
            associatedKey: 'id',
        },
        {
            name: 'teams',
            model: 'Abraxa.model.team.Team',
            associatedKey: 'teams',
        },
        {
            name: 'email_settings',
            model: 'Abraxa.model.settings.company.EmailSettings',
            associatedKey: 'email_settings',
        },
        {
            name: 'offices',
            model: 'Abraxa.model.office.Office',
            associatedKey: 'offices',
        },
        {
            name: 'banks',
            model: 'Abraxa.model.settings.CompanyBankDetails',
            associatedKey: 'banks',
        },
        {
            name: 'custom_components',
            model: 'Abraxa.model.company.CustomComponent',
            associationKey: 'custom_components',
        },
    ],
    proxy: {
        type: 'rest',
        appendId: false,
        url: Env.ApiEndpoint + 'company/profile',
    },
});
