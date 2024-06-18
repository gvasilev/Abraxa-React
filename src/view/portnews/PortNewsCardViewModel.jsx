Ext.define('Abraxa.view.portnews.PortNewsCardViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.portNewsCardViewModel',
    data: {
        record: null,
        isNewInProggress: false,
        likeButtonIconCls: 'md-icon md-icon-thumb-up',
    },

    formulas: {
        updatedCreatedBy: {
            bind: {
                bindTo: '{record}',
                deep: true,
            },
            get: function (record) {
                const recordCompanyId = record.get('company').id;
                const currentUserCompanyId = this.get('currentUser').get('company').id;

                if (recordCompanyId == currentUserCompanyId) {
                    const updatetByUser = record.get('updated_by_user');
                    const createdByUser = record.get('created_by_user');

                    if (updatetByUser) {
                        img = updatetByUser.profile_image
                            ? updatetByUser.profile_image
                            : AbraxaConstants.urls.staticAbraxa + 'images/profile/no-image.svg';
                        return ` <div class="a-val a-person a-icon-round"><i class="md-icon">calendar_today</i>
                        <span style="margin: 0 7px 0 0" class="c-light-grey-200">Last updated by</span> 
                          <img src="${img}" height="30" alt=""></img><a href="javascript:void(0);" class="fw-b" id="${
                              updatetByUser.id
                          }">${updatetByUser.first_name[0]}. ${
                              updatetByUser.last_name
                          }</a> <span style="margin: 0 6px 0 6px">on</span> 
                         ${Ext.Date.format(record.get('updated_at'), 'd M y - H:i')} </div> `;
                    } else if (createdByUser) {
                        img = createdByUser.profile_image
                            ? createdByUser.profile_image
                            : AbraxaConstants.urls.staticAbraxa + 'images/profile/no-image.svg';
                        return ` <div class="a-val a-person a-icon-round"><i class="md-icon">calendar_today</i>
                        <span style="margin: 0 7px 0 0" class="c-light-grey-200">Created by</span> 
                          <img src="${img}" height="30" alt=""></img><a href="javascript:void(0);" class="fw-b" id="${
                              createdByUser.id
                          }">${createdByUser.first_name[0]}. ${
                              createdByUser.last_name
                          }</a> <span style="margin: 0 6px 0 6px">on</span> 
                         ${Ext.Date.format(record.get('created_at'), 'd M y - H:i')} </div> `;
                    } else {
                        return AbraxaConstants.placeholders.emptyValue;
                    }
                } else {
                    return `<i class="md-icon">calendar_today</i>
                    <div>
                    <span class="c-light-grey-200">Last updated by</span> <a href="javascript:void(0);" class="fw-b" id="${
                        record.get('company').id
                    }">${record.get('company').name}</a> <span>on</span> ${Ext.Date.format(
                        record.get('updated_at'),
                        'd M y - H:i'
                    )}</span> 
                    </div>`;
                }
            },
        },
        title: {
            bind: {
                bindTo: '{record}',
                deep: true,
            },
            get: function (record) {
                const isNewPost = record.get('user_data').is_new;
                return isNewPost
                    ? `<div lang="en" class="h3">${record.get(
                          'title'
                      )}</div><span class="a-status-badge a-status-new a-status-xs">new</span>`
                    : `<div class="h3">${record.get('title')}</div>`;
            },
        },

        likeButtonHtml: {
            bind: {
                bindTo: '{record.likes}',
                deep: true,
            },
            get: function (likes) {
                let currentUser = this.get('currentUser');
                let isCurrentUser = likes.findBy(function (rec) {
                    return rec.get('liker') && rec.get('liker').id == currentUser.get('id');
                });
                this.set(
                    'likeButtonIconCls',
                    isCurrentUser !== -1
                        ? `md-icon md-filled-pseudo md-icon-thumb-up c-link`
                        : `md-icon md-icon-thumb-up`
                );
                if (isCurrentUser !== -1) {
                    return `Liked <em>${likes.getCount()}</em>`;
                } else {
                    return `Like <em>${likes.getCount()}</em>`;
                }
            },
        },

        attachments: {
            bind: {
                bindTo: '{record.attachments}',
            },
            get: function (attachments) {
                const size = Abraxa.utils.Functions.size;
                attachments.each((rec) => {
                    const ext = rec.getDocument().get('extension');
                    const fileSize = rec.getDocument().get('size');
                    rec.set({
                        firstName: rec.get('name'),
                        ext: ext,
                        size: fileSize,
                    });
                });
                this.getView()
                    .down('PortNewsAttachmentsContainer')
                    .down('list')
                    .getViewModel()
                    .set('files', attachments);
            },
        },

        commodities: {
            bind: {
                bindTo: '{record.commodities}',
            },
            get: function (commodities) {
                if (!commodities || !commodities.length) return AbraxaConstants.placeholders.emptyValue;
                let result = '';
                commodities.forEach((commodity, index) => {
                    result += `<a href="javascript:void(0);" id=${commodity.id} >${commodity.name}<a>`;
                    if (index < commodities.length - 1) {
                        result += '<span class="a-sep-bullet"></span>';
                    }
                });
                return result;
            },
        },

        ports: {
            bind: {
                bindTo: '{record.ports}',
            },
            get: function (ports) {
                const countryStore = this.get('countryStore');
                if (!ports || !ports.length) return AbraxaConstants.placeholders.emptyValue;
                const arr = [];
                ports.forEach((port, index) => {
                    const storeIndex = countryStore.find('id', port.country_id);
                    const country = countryStore.getAt(storeIndex) ? countryStore.getAt(storeIndex) : '';
                    const countryName = country ? country.get('country_name') : '-';
                    arr.push({ port: port, countryName: countryName });
                });

                const grouped = arr.reduce((acc, obj) => {
                    const key = `${obj.countryName}`;
                    if (!acc[key]) {
                        acc[key] = [];
                    }
                    acc[key].push(obj.port);
                    return acc;
                }, {});
                const result = Object.entries(grouped)
                    .map(function (pair) {
                        var country = pair[0];
                        var ports = pair[1];
                        return (
                            ports
                                .map(function (port) {
                                    return '<a href="javascript:void(0);" id=' + port.id + '>' + port.name + '</a>';
                                })
                                .join(', ') +
                            ' (' +
                            country +
                            ')'
                        );
                    })
                    .join('<span class="a-sep-bullet"></span></span>');

                return result;
            },
        },
        removeMask: {
            bind: {
                bindTo: '{record}',
            },
            get: function (record) {
                this.getView().unmask();
            },
        },
    },
});
