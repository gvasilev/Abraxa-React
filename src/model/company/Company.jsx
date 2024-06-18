import '../cdb/Compliance';
import '../cdb/Department';
import '../cdb/Note';
import '../portcall/Attachment';
import '../cdb/VirtualAccount';
import '../account/Account';
import '../cdb/OrganizationPhone';

Ext.define('Abraxa.model.company.Company', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'org_id',
            type: 'integer',
        },
        {
            name: 'org_name',
            type: 'string',
            sortType: 'asUCString',
        },
        {
            name: 'org_type',
            type: 'auto',
        },
        {
            name: 'org_created_by',
            type: 'auto',
        },
        {
            name: 'org_email',
            type: 'string',
            validators: 'email',
        },
        {
            name: 'org_phone',
            type: 'auto',
        },
        {
            name: 'org_country',
            type: 'auto',
        },
        {
            name: 'org_city',
            type: 'auto',
        },
        {
            name: 'org_post_code',
            type: 'auto',
        },
        {
            name: 'org_website',
            type: 'string',
        },
        {
            name: 'org_address',
            type: 'string',
        },
        {
            name: 'org_address_2',
            type: 'string',
        },
        {
            name: 'org_memo',
            type: 'string',
        },
        {
            name: 'org_record_owner',
            type: 'auto',
        },
        {
            name: 'created_by_first_name',
            type: 'string',
            persist: false,
        },
        {
            name: 'created_by_full_name',
            type: 'string',
            persist: false,
        },
        {
            name: 'created_by_last_name',
            type: 'string',
            persist: false,
        },
        {
            name: 'company_id',
            type: 'auto',
        },
        {
            name: 'org_validated',
            type: 'auto',
            defaultValue: 0,
        },
        {
            name: 'org_parent_id',
            type: 'auto',
        },
        {
            name: 'org_registration_number',
            type: 'string',
        },
        {
            name: 'organizations_searchfield_index',
            type: 'string',
            persist: false,
        },
        {
            name: 'owner_by_first_name',
            type: 'string',
            persist: false,
        },
        {
            name: 'owner_by_full_name',
            type: 'string',
            persist: false,
        },
        {
            name: 'owner_by_last_name',
            type: 'string',
            persist: false,
        },
        {
            name: 'org_eori',
            type: 'auto',
        },
        {
            name: 'org_po_box',
            type: 'auto',
        },
        {
            name: 'org_debtor_number',
            type: 'auto',
        },
        {
            name: 'abbr',
            type: 'string',
        },
        {
            name: 'tags',
            type: 'auto',
        },
        {
            name: 'compliance',
            type: 'auto',
        },
        {
            name: 'updated_at',
            type: 'date',
        },
        {
            name: 'is_verified',
            depends: ['updated_at'],
            persist: false,
            mapping: function(data) {
                if (data.compliance) return data.compliance.status;
            },
            convert: function(val, record) {
                if (record && record.getCompliance()) return record.getCompliance().get('status');
            },
        },
        {
            name: 'virtual_banks',
            type: 'auto',
            persist: false,
            mapping: function(data) {
                if (data && data.virtual_accounts) {
                    return Ext.Array.filter(data.virtual_accounts, function(rec) {
                        return rec.type == 'bank';
                    });
                }
            },
        },
        {
            name: 'virtual_acc',
            type: 'auto',
            persist: false,
            mapping: function(data) {
                if (data && data.virtual_accounts) {
                    return Ext.Array.filter(data.virtual_accounts, function(rec) {
                        return rec.type == 'virtual_account';
                    });
                } else {
                    return [];
                }
            },
        },
        {
            name: 'search_index',
            depends: 'updated_at',
            persist: false,
            mapping: function(data) {
                if (data) {
                    return this.buildSearchIndex(data);
                }
            },
        },
        {
            name: 'org_types',
            critical: true,
            mapping: function(data) {
                if (data.types) return Ext.Array.pluck(data.types, 'org_type_id');
            },
        },
    ],
    idProperty: 'org_id',
    hasMany: [
        {
            model: 'Abraxa.model.cdb.Bank',
            name: 'banks',
        },
        {
            model: 'Abraxa.model.cdb.Department',
            name: 'departments',
        },
        {
            model: 'Abraxa.model.cdb.Contact',
            name: 'contacts',
        },
        {
            name: 'attachments',
            model: 'Abraxa.model.portcall.Attachment',
            associatedKey: 'attachments',
        },
        {
            name: 'notes',
            model: 'Abraxa.model.cdb.Note',
            associationKey: 'notes',
        },
        {
            name: 'tasks',
            model: 'Abraxa.model.task.Task',
            associationKey: 'tasks',
        },
        {
            name: 'prefundings',
            model: 'Abraxa.model.agreements.AgreementPrefunding',
            associationKey: 'prefundings',
        },
        {
            name: 'discounts',
            model: 'Abraxa.model.agreements.AgreementDiscount',
            associationKey: 'discounts',
        },
        {
            name: 'billings',
            model: 'Abraxa.model.agreements.AgreementBilling',
            associationKey: 'billings',
        },
        {
            name: 'phones',
            model: 'Abraxa.model.cdb.OrganizationPhone',
            associationKey: 'phones',
        },
        {
            name: 'instructions',
            model: 'Abraxa.model.cdb.StandardInstructions',
        },
    ],
    hasOne: [
        {
            model: 'Abraxa.model.cdb.Compliance',
            name: 'compliance',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'organizations',
        writer: {
            type: 'json',
        },
        reader: {
            type: 'json',
            rootProperty: 'data',
        },
    },
});
