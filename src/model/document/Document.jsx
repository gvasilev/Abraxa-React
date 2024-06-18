import '../adocs/DocumentFolderFile';
import '../approval/Approval';

Ext.define('Abraxa.model.document.Document', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
            type: 'integer',
        },
        {
            name: 'size',
            convert: function(size) {
                var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
                if (size == 0) return '0 Byte';
                var i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
                return Math.round(size / Math.pow(1024, i), 2) + ' ' + sizes[i];
            },
        },
        {
            name: 'status',
            type: 'auto',
        },
        {
            name: 'approvals',
            type: 'auto',
        },
        {
            name: 'folder_file',
            type: 'auto',
        },
        {
            name: 'pdf',
            type: 'auto',
            persist: false,
        },
        {
            name: 'shared_document',
            type: 'boolean',
            persist: false,
        },
        {
            name: 'is_locked',
            type: 'boolean',
            depends: ['status', 'approvals', 'shared_document'],
            persist: false,
            convert: function(val, record) {
                let approvalMatters = false;
                if (record.get('approvals') && record.get('approvals').length) {
                    record.get('approvals').forEach((approval) => {
                        if (approval.status == 'pending' || approval.status == 'approved') approvalMatters = true;
                    });
                }
                if (approvalMatters) return true;

                if (record.get('status') != 'draft') {
                    return true;
                }

                if (record.get('shared_document')) {
                    return true;
                }
                return false;
            },
        },
        {
            name: 'hide_status',
            type: 'boolean',
            depends: ['approvals', 'shared_document'],
            persist: false,
            convert: function(val, record) {
                if (val) {
                    return val;
                } else {
                    let hasActiveApproval = false;
                    if (record.get('approvals') && record.get('approvals').length) {
                        record.get('approvals').forEach((approval) => {
                            if (approval.status == 'pending') hasActiveApproval = true;
                        });
                    }
                    if (record.get('shared_document')) {
                        hasActiveApproval = true;
                    }
                    return hasActiveApproval;
                }
            },
        },
        {
            name: 'is_changed',
            type: 'boolean',
            persist: false,
        },
        {
            name: 'not_in_portcall',
            type: 'boolean',
            persist: false,
        },
        {
            name: 'folder_id',
            depends: ['folder_file'],
            persist: false,
            convert: function(val, record) {
                if (record.get('folder_file')) return record.get('folder_file').document_folder_id;

                return null;
            },
        },
    ],
    hasOne: [
        {
            name: 'folderFile',
            model: 'Abraxa.model.adocs.DocumentFolderFile',
            associationKey: 'folder_file',
        },
    ],
    hasMany: [
        {
            name: 'approvals',
            model: 'Abraxa.model.approval.Approval',
            associationKey: 'approvals',
        },
    ],
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'document',
    },
});
