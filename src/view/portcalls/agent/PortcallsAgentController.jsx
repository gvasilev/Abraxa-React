Ext.define('Abraxa.view.portcalls.agent.PortcallsAgentController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portcalls-agent-controller',
    init: function () {},
    listen: {
        component: {
            tabbar: {
                activeTabchange: 'onTabChange',
            },
        },
    },
    onTabChange: function (tab) {
        if (tab && tab.getActiveTab()) {
            let balanceStore = Ext.getStore('balanceExposure');
            if (balanceStore && !balanceStore.isLoaded()) {
                balanceStore.reload();
            }
        }
    },
    createPortcallAgent: function (cmp) {
        mixpanel.track('+ Portcall button clicked');
        let currentUser = cmp.upVM().get('currentUser');
        Ext.create('Abraxa.view.portcalls.CreatePortcall', {
            header: {
                bind: {
                    title: '{headerTitle}',
                },
            },
            viewModel: {
                parent: cmp.upVM(),
                links: {
                    object_record: {
                        type: 'Abraxa.model.portcall.Portcall',
                        create: {
                            assigned_to: currentUser.get('id'),
                        },
                    },
                    voyage_data: {
                        type: 'Abraxa.model.voyage.Voyage',
                        create: true,
                    },
                    nomination: {
                        type: 'Abraxa.model.nomination.Nomination',
                        create: {
                            company_role: 'lead agent',
                        },
                    },
                    instruction: {
                        type: 'Abraxa.model.portcall.Instruction',
                        create: {
                            object_id: 3,
                        },
                    },
                },
                stores: {
                    suggestedOrganizations: Ext.create('Ext.data.Store'),
                    files: Ext.create('Ext.data.Store'),
                    templates: {
                        type: 'templates',
                        autoLoad: false,
                    },
                    taskTemplates: {
                        source: '{templates}',
                        filters: [
                            {
                                property: 'type',
                                operator: '=',
                                value: 'task',
                                exactMatch: true,
                            },
                        ],
                    },
                    sofTemplates: {
                        source: '{templates}',
                        filters: [
                            {
                                property: 'type',
                                operator: '=',
                                value: 'sof',
                                exactMatch: true,
                            },
                        ],
                    },
                    disbursementTemplates: {
                        source: '{templates}',
                        filters: [
                            {
                                property: 'type',
                                operator: '=',
                                value: 'disbursement',
                                exactMatch: true,
                            },
                        ],
                    },
                },
                data: {
                    object_id: 3,
                    editMode: false,
                    visibleInstruction: false,
                    visibleTemplates: false,
                    visibleDistriGroups: false,
                    organizations: cmp.upVM().get('organizations'),
                    portcallStore: cmp.upVM().get('portcalls'),
                    hubStructure: false,
                    fromPortcall: true,
                },
                formulas: {
                    distribution_groups: {
                        bind: {
                            bindTo: '{object_record.distribution_groups}',
                            deep: true,
                        },
                        get: function (store) {
                            return store;
                        },
                    },
                    showInstructions: {
                        bind: {
                            bindTo: '{instruction.text}',
                            deep: true,
                        },
                        get: function (text) {
                            if (text && text.length > 0) {
                                return false;
                            } else {
                                return true;
                            }
                        },
                    },
                    showFiles: {
                        bind: {
                            filesCount: '{files.count}',
                            editMode: '{editMode}',
                        },
                        get: function (data) {
                            if (data) {
                                if (data.editMode) {
                                    return true;
                                } else {
                                    if (data.filesCount === 0) {
                                        return true;
                                    }
                                }
                                return false;
                            }
                        },
                    },
                    assignedToImage: {
                        bind: {
                            bindTo: '{usersCombo.selection}',
                            deep: true,
                        },
                        get: function (selection) {
                            if (selection) {
                                if (selection.get('profile_image')) {
                                    let userImage = selection.get('profile_image');
                                    return (
                                        '<div class="a-person a-icon-round">' +
                                        '<img class="a-profile-image a-user" src="' +
                                        userImage +
                                        '" width="24" alt="" />' +
                                        '</div>'
                                    );
                                } else {
                                    return (
                                        '<div class="a-person a-icon-round"><span class="a-int a-user">' +
                                        selection.get('first_name')[0] +
                                        selection.get('last_name')[0] +
                                        '</span></div>'
                                    );
                                }
                            }
                            return '<div class="a-field-icon icon-person icon-rounded"><div class="x-before-input-el"></div></div>';
                        },
                    },
                    dragListeners: {
                        bind: {
                            bindTo: '{userPermissions}',
                            deeP: true,
                        },
                        get: function (store) {
                            if (store && Object.keys(store).length > 0) {
                                let record = store['portcallDocumentUpload'];
                                if (record && record.edit) {
                                    return {
                                        element: 'element',
                                        drop: 'onDrop',
                                        dragleave: 'onDragLeaveListItem',
                                        dragover: 'onDragOverListItem',
                                    };
                                } else {
                                    return {};
                                }
                            } else {
                                return {};
                            }
                        },
                    },
                    headerTitle: {
                        bind: {
                            instructions: '{visibleInstruction}',
                            templates: '{visibleTemplates}',
                            dist_group: '{visibleDistriGroups}',
                        },
                        get: function (data) {
                            if (data) {
                                if (data.instructions) {
                                    return '<span class="a-dialog-instructions-title">Voyage instructions</span>';
                                }
                                if (data.templates) {
                                    return '<span class="a-dialog-instructions-title">Advanced</span>';
                                }
                                if (data.dist_group) {
                                    return '<span class="a-dialog-instructions-title">Distribution groups</span>';
                                }
                            }
                            return '<div class="a-badge a-badge-portcall"><i class="md-icon-business-center md-icon-outlined"></i></div>Create Port call';
                        },
                    },
                    suggestedOrganizationsRequest: {
                        bind: {
                            bindTo: '{object_record.port_id}',
                        },
                        get: async function (port_id) {
                            let vm = this,
                                filter = [
                                    {
                                        property: 'port_id',
                                        value: port_id,
                                        operator: '=',
                                    },
                                ];
                            if (port_id) {
                                Ext.Ajax.request({
                                    url: Env.ApiEndpoint + 'suggested-organizations',
                                    method: 'GET',
                                    params: {
                                        filter: JSON.stringify(filter),
                                    },
                                    success: function (response) {
                                        if (response) {
                                            vm.get('suggestedOrganizations').add(Ext.decode(response.responseText));
                                        }
                                    },
                                });
                            }
                        },
                    },
                },
            },
        }).show();
    },

    createPrincipalPortcall: function (cmp) {
        mixpanel.track('+ Portcall button clicked');
        let currentUser = cmp.upVM().get('currentUser'),
            companyVerified = cmp.upVM().get('currentCompany').get('verified'),
            wpsOrg;
        if (currentUser.get('wps_org')) {
            wpsOrg = currentUser.get('wps_org');
        }
        if (companyVerified) {
            Ext.create('Abraxa.view.portcalls.CreatePortcall', {
                header: {
                    bind: {
                        title: "{visibleInstruction ? \"<span class='a-dialog-instructions-title'>Voyage instructions</span>\" : \"<div class='a-badge a-badge-portcall'><i class='md-icon-business-center md-icon-outlined'></i></div>Create Port call\"}",
                    },
                },
                viewModel: {
                    parent: cmp.upVM(),
                    links: {
                        object_record: {
                            type: 'Abraxa.model.portcall.Portcall',
                            create: {
                                assigned_to: currentUser.get('id'),
                            },
                        },
                        voyage_data: {
                            type: 'Abraxa.model.voyage.Voyage',
                            create: true,
                        },
                        nomination: {
                            type: 'Abraxa.model.nomination.Nomination',
                            create: {
                                lead_agent_id: wpsOrg ? wpsOrg.org_id : null,
                                lead_agent_name: wpsOrg ? wpsOrg.org_name : null,
                                lead_agent_email: wpsOrg ? wpsOrg.org_email : null,
                            },
                        },
                        instruction: {
                            type: 'Abraxa.model.portcall.Instruction',
                            create: {
                                object_id: 3,
                            },
                        },
                    },
                    stores: {
                        files: Ext.create('Ext.data.Store'),
                    },
                    data: {
                        object_id: 3,
                        editMode: false,
                        visibleInstruction: false,
                        visibleTemplates: false,
                        visibleDistriGroups: false,
                        organizations: cmp.upVM().get('organizations'),
                        portcallStore: cmp.upVM().get('portcalls'),
                        hubStructure: true,
                    },
                    formulas: {
                        showInstructions: {
                            bind: {
                                bindTo: '{instruction.text}',
                                deep: true,
                            },
                            get: function (text) {
                                if (text && text.length > 0) {
                                    return false;
                                } else {
                                    return true;
                                }
                            },
                        },
                        showFiles: {
                            bind: {
                                filesCount: '{files.count}',
                                editMode: '{editMode}',
                            },
                            get: function (data) {
                                if (data) {
                                    if (data.editMode) {
                                        return true;
                                    } else {
                                        if (data.filesCount === 0) {
                                            return true;
                                        }
                                    }
                                    return false;
                                }
                            },
                        },
                        assignedToImage: {
                            bind: {
                                bindTo: '{usersCombo.selection}',
                                deep: true,
                            },
                            get: function (selection) {
                                if (selection) {
                                    if (selection.get('profile_image')) {
                                        let userImage = selection.get('profile_image');
                                        return (
                                            '<div class="a-person a-icon-round">' +
                                            '<img class="a-profile-image a-user" src="' +
                                            userImage +
                                            '" width="24" alt="" />' +
                                            '</div>'
                                        );
                                    } else {
                                        return (
                                            '<div class="a-person a-icon-round"><span class="a-int a-user">' +
                                            selection.get('first_name')[0] +
                                            selection.get('last_name')[0] +
                                            '</span></div>'
                                        );
                                    }
                                }
                                return '<div class="a-field-icon icon-person icon-rounded"><div class="x-before-input-el"></div></div>';
                            },
                        },
                        dragListeners: {
                            bind: {
                                bindTo: '{userPermissions}',
                                deeP: true,
                            },
                            get: function (store) {
                                if (store && Object.keys(store).length > 0) {
                                    let record = store['portcallDocumentUpload'];
                                    if (record && record.edit) {
                                        return {
                                            element: 'element',
                                            drop: 'onDrop',
                                            dragleave: 'onDragLeaveListItem',
                                            dragover: 'onDragOverListItem',
                                        };
                                    } else {
                                        return {};
                                    }
                                } else {
                                    return {};
                                }
                            },
                        },
                    },
                },
            }).show();
        } else {
            Ext.Msg.warning(
                '<div class="hbox"><i class="material-icons c-grey my-8 mr-16">verified_user</i>Company verification</div>',
                '<b>Your company is not verified</b>.<br>Please submit the verification form to us before you can<br> start inviting your counterparties and explore the system.'
            );
        }
    },
    applyStatusFilters: function (cmp, newValue) {
        let portcalls = cmp.upVM().get('portcalls'),
            filters = cmp.upVM().get('portcallAgentStatusFilters'),
            filtersIds = cmp.upVM().get('portcallAgentStatusFiltersIds'),
            button = cmp.up('button'),
            selected = Ext.ComponentQuery.query('menucheckitem[cls~=portcallAgentStatusFilterItem][checked="true"]');
        if (newValue) {
            //add filter
            let index = filters.indexOf(cmp.getText()),
                indexId = filtersIds.indexOf(cmp.getRecord().get('id'));
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
            filters.push(cmp.getText());
            filtersIds.push(cmp.getRecord().get('id'));
        }
        if (!newValue) {
            let index = filters.indexOf(cmp.getText()),
                indexId = filtersIds.indexOf(cmp.getRecord().get('id'));
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
        }
        if (selected.length > 1) {
            let i = 0;
            let name = '';
            Ext.each(selected, function (val, index) {
                if (i === 0) {
                    name = val.getText();
                    button.setText(name);
                    button.getMenu().arrowCls = 'delete';
                } else {
                    button.setText(name + '  +' + i);
                }
                button.splitArrowElement.removeCls('x-arrow-el');
                button.splitArrowElement.addCls('md-icon-close');
                button.addCls('active');
                i++;
            });
        }
        if (selected.length === 1) {
            let check = selected[0];
            let name = check.getText();
            button.setText(name);
            button.splitArrowElement.removeCls('x-arrow-el');
            button.splitArrowElement.addCls('md-icon-close');
            button.addCls('active');
        }
        if (selected.length === 0) {
            button.setText('Status');
            button.splitArrowElement.removeCls('md-icon-close');
            button.splitArrowElement.addCls('x-arrow-el');
            button.removeCls('active');
        }

        if (filtersIds.length > 0) {
            portcalls.addFilter({
                id: 5555,
                filterFn: function (item) {
                    if (Ext.Array.contains(filtersIds, item.get('status_data').id)) {
                        return item;
                    } else {
                        return false;
                    }
                },
            });
        } else {
            portcalls.removeFilter(5555);
        }
    },
    applyPortFilters: function (cmp, newValue) {
        let portcalls = cmp.upVM().get('portcalls'),
            filters = cmp.upVM().get('portcallAgentPortFilters'),
            filtersIds = cmp.upVM().get('portcallAgentPortFiltersIds'),
            button = cmp.up('button'),
            selected = Ext.ComponentQuery.query('menucheckitem[cls~=portcallsAgentportFilterItem][checked="true"]');
        if (newValue) {
            //add filter
            let index = filters.indexOf(cmp.getText()),
                indexId = filtersIds.indexOf(cmp.getRecord().get('port_id'));
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
            filters.push(cmp.getText());
            filtersIds.push(cmp.getRecord().get('port_id'));
        }
        if (!newValue) {
            let index = filters.indexOf(cmp.getText()),
                indexId = filtersIds.indexOf(cmp.getRecord().get('port_id'));
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
        }
        if (selected.length > 1) {
            let i = 0;
            let name = '';
            Ext.each(selected, function (val, index) {
                if (i === 0) {
                    name = val.getText();
                    button.setText(name);
                    button.getMenu().arrowCls = 'delete';
                } else {
                    button.setText(name + '  +' + i);
                }
                button.splitArrowElement.removeCls('x-arrow-el');
                button.splitArrowElement.addCls('md-icon-close');
                button.addCls('active');
                i++;
            });
        }
        if (selected.length === 1) {
            let check = selected[0];
            let name = check.getText();
            button.setText(name);
            button.splitArrowElement.removeCls('x-arrow-el');
            button.splitArrowElement.addCls('md-icon-close');
            button.addCls('active');
        }
        if (selected.length === 0) {
            button.setText('Port');
            button.splitArrowElement.removeCls('md-icon-close');
            button.splitArrowElement.addCls('x-arrow-el');
            button.removeCls('active');
        }

        if (filtersIds.length > 0) {
            portcalls.addFilter({
                id: 7777,
                filterFn: function (item) {
                    if (item && Ext.Array.contains(filtersIds, item.get('port_id'))) {
                        return item;
                    } else {
                        return false;
                    }
                },
            });
        } else {
            portcalls.removeFilter(7777);
        }
    },
    applyTypeFilters: function (cmp, newValue) {
        let portcalls = cmp.upVM().get('portcalls'),
            filters = cmp.upVM().get('portcallAgentType'),
            filtersIds = cmp.upVM().get('portcallAgentTypeIds'),
            button = cmp.up('button'),
            selected = Ext.ComponentQuery.query('menucheckitem[cls=checktype-portcallsagent-filters][checked="true"]');

        if (cmp.getText() === 'Dry' && newValue) {
            //add filter
            let index = filters.indexOf('Dry'),
                indexId = filtersIds.indexOf(1);
            if (index !== -1) {
                filters.splice(index, 1);
            }
            filters.push('Dry');
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
            filtersIds.push(1);
        }
        if (cmp.getText() === 'Dry' && !newValue) {
            let index = filters.indexOf('Dry'),
                indexId = filtersIds.indexOf(1);
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
        }
        if (cmp.getText() === 'Wet' && newValue) {
            //add filter
            let index = filters.indexOf('Wet'),
                indexId = filtersIds.indexOf(0);
            if (index !== -1) {
                filters.splice(index, 1);
            }
            filters.push('Wet');
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
            filtersIds.push(0);
        }
        if (cmp.getText() === 'Wet' && !newValue) {
            let index = filters.indexOf('Wet'),
                indexId = filtersIds.indexOf(0);
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
        }
        if (selected.length > 1) {
            let i = 0;
            let name = '';
            Ext.each(selected, function (val, index) {
                if (i === 0) {
                    name = val.getText();
                    button.setText(name);
                    button.getMenu().arrowCls = 'delete';
                } else {
                    button.setText(name + '  +' + i);
                }
                button.splitArrowElement.removeCls('x-arrow-el');
                button.splitArrowElement.addCls('md-icon-close');
                button.addCls('active');
                i++;
            });
        }
        if (selected.length === 1) {
            let check = selected[0];
            let name = check.getText();
            button.setText(name);
            button.splitArrowElement.removeCls('x-arrow-el');
            button.splitArrowElement.addCls('md-icon-close');
            button.addCls('active');
        }
        if (selected.length === 0) {
            button.setText('Type');
            button.splitArrowElement.removeCls('md-icon-close');
            button.splitArrowElement.addCls('x-arrow-el');
            button.removeCls('active');
        }
        if (filtersIds.length > 0) {
            portcalls.addFilter({
                id: 9999,
                filterFn: function (item) {
                    if (item.getVoyage() && Ext.Array.contains(filtersIds, item.getVoyage().get('is_dry'))) {
                        return item;
                    } else {
                        return false;
                    }
                },
            });
        } else {
            portcalls.removeFilter(9999);
        }
    },
    applyWatchingFilter: function (cmp, newValue) {
        let portcalls = cmp.find('portcalls-grid-active').getStore();
        if (newValue) {
            // Add the filter to the store's filters
            portcalls.filter({
                id: 'watchingFilter',
                property: 'is_watching',
                operator: '=',
                value: true,
            });
        } else {
            // Get the filter you want to remove

            // Remove the filter if it exists
            if (portcalls.getFilters().length) {
                let filter = null;
                portcalls.getFilters().items.forEach(function (item) {
                    if (item.config.id === 'watchingFilter') {
                        filter = item;
                    }
                });
                if (filter) {
                    portcalls.getFilters().remove(filter);
                }
            }
        }
    },
    applyArchivedWatchingFilter: function (cmp, newValue) {
        let portcalls = cmp.upVM().get('portcallsArchived');
        if (newValue) {
            portcalls.addFilter({
                id: 2222,
                filterFn: function (item) {
                    if (item.get('is_watching')) {
                        return true;
                    }
                },
            });
        } else {
            portcalls.removeFilter(2222);
        }
    },
    //Closed filters

    applyClosedStatusFilters: function (cmp, newValue) {
        let portcallsArchived = cmp.upVM().get('portcallsArchived'),
            filters = cmp.upVM().get('portcallAgentClosedStatusFilters'),
            filtersIds = cmp.upVM().get('portcallAgentClosedStatusFiltersIds'),
            button = cmp.up('button'),
            selected = Ext.ComponentQuery.query('menucheckitem[cls~=portcallsAgentClosedFilterItem][checked="true"]');
        if (newValue) {
            //add filter
            let index = filters.indexOf(cmp.getText()),
                indexId = filtersIds.indexOf(cmp.getRecord().get('id'));
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
            filters.push(cmp.getText());
            filtersIds.push(cmp.getRecord().get('id'));
        }
        if (!newValue) {
            let index = filters.indexOf(cmp.getText()),
                indexId = filtersIds.indexOf(cmp.getRecord().get('id'));
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
        }
        if (selected.length > 1) {
            let i = 0;
            let name = '';
            Ext.each(selected, function (val, index) {
                if (i === 0) {
                    name = val.getText();
                    button.setText(name);
                    button.getMenu().arrowCls = 'delete';
                } else {
                    button.setText(name + '  +' + i);
                }
                button.splitArrowElement.removeCls('x-arrow-el');
                button.splitArrowElement.addCls('md-icon-close');
                button.addCls('active');
                i++;
            });
        }
        if (selected.length === 1) {
            let check = selected[0];
            let name = check.getText();
            button.setText(name);
            button.splitArrowElement.removeCls('x-arrow-el');
            button.splitArrowElement.addCls('md-icon-close');
            button.addCls('active');
        }
        if (selected.length === 0) {
            button.setText('Status');
            button.splitArrowElement.removeCls('md-icon-close');
            button.splitArrowElement.addCls('x-arrow-el');
            button.removeCls('active');
        }

        if (filtersIds.length > 0) {
            portcallsArchived.addFilter({
                id: 5555,
                filterFn: function (item) {
                    if (Ext.Array.contains(filtersIds, item.get('archived_reason'))) {
                        return item;
                    } else {
                        return false;
                    }
                },
            });
        } else {
            portcallsArchived.removeFilter(5555);
        }
    },
    applyClosedPortFilters: function (cmp, newValue) {
        let portcallsArchived = cmp.upVM().get('portcallsArchived'),
            filters = cmp.upVM().get('portcallAgentClosedPortFilters'),
            filtersIds = cmp.upVM().get('portcallAgentClosedPortFiltersIds'),
            button = cmp.up('button'),
            selected = Ext.ComponentQuery.query(
                'menucheckitem[cls~=portcallsAgentPortClosedFilterItem][checked="true"]'
            );
        if (newValue) {
            //add filter
            let index = filters.indexOf(cmp.getText()),
                indexId = filtersIds.indexOf(cmp.getRecord().get('port_id'));
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
            filters.push(cmp.getText());
            filtersIds.push(cmp.getRecord().get('port_id'));
        }
        if (!newValue) {
            let index = filters.indexOf(cmp.getText()),
                indexId = filtersIds.indexOf(cmp.getRecord().get('port_id'));
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
        }
        if (selected.length > 1) {
            let i = 0;
            let name = '';
            Ext.each(selected, function (val, index) {
                if (i === 0) {
                    name = val.getText();
                    button.setText(name);
                    button.getMenu().arrowCls = 'delete';
                } else {
                    button.setText(name + '  +' + i);
                }
                button.splitArrowElement.removeCls('x-arrow-el');
                button.splitArrowElement.addCls('md-icon-close');
                button.addCls('active');
                i++;
            });
        }
        if (selected.length === 1) {
            let check = selected[0];
            let name = check.getText();
            button.setText(name);
            button.splitArrowElement.removeCls('x-arrow-el');
            button.splitArrowElement.addCls('md-icon-close');
            button.addCls('active');
        }
        if (selected.length === 0) {
            button.setText('Port');
            button.splitArrowElement.removeCls('md-icon-close');
            button.splitArrowElement.addCls('x-arrow-el');
            button.removeCls('active');
        }

        if (filtersIds.length > 0) {
            portcallsArchived.addFilter({
                id: 7777,
                filterFn: function (item) {
                    if (item && Ext.Array.contains(filtersIds, item.get('port_id'))) {
                        return item;
                    } else {
                        return false;
                    }
                },
            });
        } else {
            portcallsArchived.removeFilter(7777);
        }
    },
    applyClosedTypeFilters: function (cmp, newValue) {
        let portcallsArchived = cmp.upVM().get('portcallsArchived'),
            filters = cmp.upVM().get('portcallAgentClosedType'),
            filtersIds = cmp.upVM().get('portcallAgentClosedTypeIds'),
            button = cmp.up('button'),
            selected = Ext.ComponentQuery.query(
                'menucheckitem[cls=checkclosedtypeportcallsagent-filters][checked="true"]'
            );

        if (cmp.getText() === 'Dry' && newValue) {
            //add filter
            let index = filters.indexOf('Dry'),
                indexId = filtersIds.indexOf(1);
            if (index !== -1) {
                filters.splice(index, 1);
            }
            filters.push('Dry');
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
            filtersIds.push(1);
        }
        if (cmp.getText() === 'Dry' && !newValue) {
            let index = filters.indexOf('Dry'),
                indexId = filtersIds.indexOf(1);
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
        }
        if (cmp.getText() === 'Wet' && newValue) {
            //add filter
            let index = filters.indexOf('Wet'),
                indexId = filtersIds.indexOf(0);
            if (index !== -1) {
                filters.splice(index, 1);
            }
            filters.push('Wet');
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
            filtersIds.push(0);
        }
        if (cmp.getText() === 'Wet' && !newValue) {
            let index = filters.indexOf('Wet'),
                indexId = filtersIds.indexOf(0);
            if (index !== -1) {
                filters.splice(index, 1);
            }
            if (indexId !== -1) {
                filtersIds.splice(indexId, 1);
            }
        }
        if (selected.length > 1) {
            let i = 0;
            let name = '';
            Ext.each(selected, function (val, index) {
                if (i === 0) {
                    name = val.getText();
                    button.setText(name);
                    button.getMenu().arrowCls = 'delete';
                } else {
                    button.setText(name + '  +' + i);
                }
                button.splitArrowElement.removeCls('x-arrow-el');
                button.splitArrowElement.addCls('md-icon-close');
                button.addCls('active');
                i++;
            });
        }
        if (selected.length === 1) {
            let check = selected[0];
            let name = check.getText();
            button.setText(name);
            button.splitArrowElement.removeCls('x-arrow-el');
            button.splitArrowElement.addCls('md-icon-close');
            button.addCls('active');
        }
        if (selected.length === 0) {
            button.setText('Type');
            button.splitArrowElement.removeCls('md-icon-close');
            button.splitArrowElement.addCls('x-arrow-el');
            button.removeCls('active');
        }
        if (filtersIds.length > 0) {
            portcallsArchived.addFilter({
                id: 9999,
                filterFn: function (item) {
                    if (item.getVoyage() && Ext.Array.contains(filtersIds, item.getVoyage().get('is_dry'))) {
                        return item;
                    } else {
                        return false;
                    }
                },
            });
        } else {
            portcallsArchived.removeFilter(9999);
        }
    },
});
