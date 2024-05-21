Ext.define('Abraxa.view.portcall.documents.DocumentsViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.documents-viewmodel',
    stores: {
        filteredDocuments: {
            source: '{documents}',
            filters: '{documentFolderFilter}',
        },
    },
    formulas: {
        documentFolderFilter: {
            bind: {
                bindTo: '{selectedSection.selection}',
                deep: true,
            },
            get: function (record) {
                if (record) {
                    let store = this.get('filteredDocuments');
                    if (store) store.clearFilter();

                    return function (rec) {
                        if (rec.getFolderFile() && rec.getFolderFile().get('document_folder_id') == record.get('id')) {
                            return true;
                        }
                    };
                } else {
                    return function (item) {
                        return false;
                    };
                }
            },
        },
        sectionMembers: {
            bind: {
                bindTo: {
                    selection: '{selectedSection.selection}',
                    members: '{selectedSection.selection.members}',
                },
                deep: true,
            },
            get: function (data) {
                if (data['selection'] && data['members']) {
                    let membersStore = this.get('members'),
                        dataMembers = data['members'],
                        folderMembers = [];

                    dataMembers.each(function (dataMember) {
                        membersStore.each(function (rec) {
                            if (rec.get('id') == dataMember.get('member_id')) {
                                folderMembers.push(rec);
                            }
                        });
                    });

                    this.set('sectionMembers', folderMembers);
                    this.set('memberPreviewTitle', data.selection.get('name'));

                    return folderMembers;
                }
            },
        },
        folderMembers: {
            bind: {
                bindTo: '{selectedSection.selection}',
                deep: true,
            },
            get: function (folder) {
                if (folder) {
                    let folderMembersStore = folder.members();
                    folderMembersStore.getProxy().setExtraParams({
                        folder_id: folder.get('id'),
                    });
                    return folderMembersStore;
                }
            },
        },
        folderIcon: {
            bind: {
                bindTo: '{selectedSection.selection}',
                deep: true,
            },
            get: function (selection) {
                if (selection) {
                    if (selection.get('is_default')) return 'move_to_inbox';

                    return 'folder_shared';
                }
            },
        },
        folderMembersApprovers: {
            bind: {
                bindTo: '{selectedSection.selection}',
                deep: true,
            },
            get: function (folder) {
                let approvers = [];
                if (folder) {
                    let folderMembersStore = folder.members(),
                        members = this.get('members');

                    folderMembersStore.each(function (record) {
                        let member = members.getById(record.get('member_id'));
                        if (member && !member.get('has_left')) {
                            approvers.push(member);
                        }
                    });

                    return approvers;
                }
            },
        },

        memberCount: {
            bind: {
                bindTo: '{selectedSection.selection.members}',
                deep: true,
            },
            get: function (store) {
                var count = 0;
                if (store) {
                    count = store.getCount();
                }

                return count;
            },
        },
    },
});
