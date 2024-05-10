Ext.define('Abraxa.model.portcall.Instruction', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'id',
        },
        {
            name: 'description',
            type: 'auto',
        },
        {
            name: 'description_plain',
            type: 'auto',
            persist: false,
            depends: 'description',
            convert: function (val, record) {
                const labelDescription = 'description';
                if (record.get(labelDescription)) {
                    //This regular expression will search for both opening and closing tags in the text and remove them.
                    //This is useful for displaying text without HTML code.
                    return record.get(labelDescription).replaceAll(/<\/?[^>]+(>|$)/gi, '');
                }
                return '';
            },
        },
        {
            name: 'description_short',
            type: 'auto',
            depends: 'description_plain',
            persist: false,
            convert: function (value, record) {
                const labalDesctription = 'description_plain';
                let descriptionShort = '';
                if (record.get(labalDesctription)) {
                    descriptionShort =
                        record.get(labalDesctription).length > 320
                            ? record.get(labalDesctription).substr(0, 320) + '...'
                            : record.get(labalDesctription);
                }
                return descriptionShort;
            },
        },
        {
            name: 'owner_id',
            type: 'auto',
        },
        {
            name: 'owner_name',
            type: 'auto',
        },
    ],
    hasMany: [
        {
            name: 'attachments',
            model: 'Abraxa.model.portcall.Attachment',
        },
    ],
    idProperty: 'id',
    proxy: {
        type: 'rest',
        url: Env.ApiEndpoint + 'cdb/${org_id}/instructions',
        writer: {
            type: 'json',
            allDataOptions: {
                persist: true,
                associated: true,
            },
            partialDataOptions: {
                changes: true,
                critical: true,
                associated: false,
            },
        },
    },
});
