Ext.define('Abraxa.view.portcalls.principal.PortcallsPrincipalController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.portcalls-principal-controller',
    init: function () {},

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
            filters = cmp.upVM().get('portcallPrincipalStatusFilters'),
            filtersIds = cmp.upVM().get('portcallPrincipalStatusFiltersIds'),
            button = cmp.up('button'),
            selected = Ext.ComponentQuery.query(
                'menucheckitem[cls~=portcallPrincipalStatusFilterItem][checked="true"]'
            );
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
    // applyPortFilters: function (cmp, newValue) {
    //     let inquiry = cmp.upVM().get('inquiry'),
    //         filters = cmp.upVM().get("checkedPortFilters"),
    //         filtersIds = cmp.upVM().get("checkedPortFiltersIds"),
    //         button = cmp.up('button'),
    //         selected = Ext.ComponentQuery.query('menucheckitem[cls~=portFilterItem][checked="true"]');
    //     if (newValue) {
    //         //add filter
    //         let index = filters.indexOf(cmp.getText()),
    //             indexId = filtersIds.indexOf(cmp.getRecord().get('port_id'));
    //         if (index !== -1) {
    //             filters.splice(index, 1);
    //         }
    //         if (indexId !== -1) {
    //             filtersIds.splice(indexId, 1);
    //         }
    //         filters.push(cmp.getText());
    //         filtersIds.push(cmp.getRecord().get('port_id'));

    //     }
    //     if (!newValue) {
    //         let index = filters.indexOf(cmp.getText()),
    //             indexId = filtersIds.indexOf(cmp.getRecord().get('port_id'));
    //         if (index !== -1) {
    //             filters.splice(index, 1);
    //         }
    //         if (indexId !== -1) {
    //             filtersIds.splice(indexId, 1);
    //         }
    //     }
    //     if (selected.length > 1) {
    //         let i = 0;
    //         let name = "";
    //         Ext.each(selected, function (val, index) {
    //             if (i === 0) {
    //                 name = val.getText();
    //                 button.setText(name);
    //                 button.getMenu().arrowCls = "delete";
    //             } else {
    //                 button.setText(name + "  +" + i);
    //             }
    //             button.splitArrowElement.removeCls("x-arrow-el");
    //             button.splitArrowElement.addCls("md-icon-close");
    //             button.addCls("active");
    //             i++;
    //         });
    //     }
    //     if (selected.length === 1) {
    //         let check = selected[0];
    //         let name = check.getText();
    //         button.setText(name);
    //         button.splitArrowElement.removeCls("x-arrow-el");
    //         button.splitArrowElement.addCls("md-icon-close");
    //         button.addCls("active");
    //     }
    //     if (selected.length === 0) {
    //         button.setText("Port");
    //         button.splitArrowElement.removeCls("md-icon-close");
    //         button.splitArrowElement.addCls("x-arrow-el");
    //         button.removeCls("active");
    //     }

    //     if (filtersIds.length > 0) {
    //         inquiry.addFilter({
    //             id: 7777,
    //             filterFn: function (item) {
    //                 if (item.getVoyage() && Ext.Array.contains(filtersIds, item.getVoyage().get('port_id'))) {
    //                     return item;
    //                 } else {
    //                     return false;
    //                 }
    //             }
    //         });
    //     } else {
    //         inquiry.removeFilter(7777);
    //     }
    // },
    applyTypeFilters: function (cmp, newValue) {
        let portcalls = cmp.upVM().get('portcalls'),
            filters = cmp.upVM().get('portcallPrincipalType'),
            filtersIds = cmp.upVM().get('portcallPrincipalTypeIds'),
            button = cmp.up('button'),
            selected = Ext.ComponentQuery.query(
                'menucheckitem[cls=checktype-portcallsprincipal-filters][checked="true"]'
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
        let portcalls = cmp.upVM().get('portcalls');
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
            filters = cmp.upVM().get('portcallPrincipalClosedStatusFilters'),
            filtersIds = cmp.upVM().get('portcallPrincipalClosedStatusFiltersIds'),
            button = cmp.up('button'),
            selected = Ext.ComponentQuery.query(
                'menucheckitem[cls~=portcallsPrincipalClosedFilterItem][checked="true"]'
            );
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
    // applyClosedPortFilters: function (cmp, newValue) {
    //     let inquiry = cmp.upVM().get('inquiryArchived'),
    //         filters = cmp.upVM().get("checkedClosedPortFilters"),
    //         filtersIds = cmp.upVM().get("checkedClosedPortFiltersIds"),
    //         button = cmp.up('button'),
    //         selected = Ext.ComponentQuery.query('menucheckitem[cls~=portClosedFilterItem][checked="true"]');
    //     if (newValue) {
    //         //add filter
    //         let index = filters.indexOf(cmp.getText()),
    //             indexId = filtersIds.indexOf(cmp.getRecord().get('port_id'));
    //         if (index !== -1) {
    //             filters.splice(index, 1);
    //         }
    //         if (indexId !== -1) {
    //             filtersIds.splice(indexId, 1);
    //         }
    //         filters.push(cmp.getText());
    //         filtersIds.push(cmp.getRecord().get('port_id'));

    //     }
    //     if (!newValue) {
    //         let index = filters.indexOf(cmp.getText()),
    //             indexId = filtersIds.indexOf(cmp.getRecord().get('port_id'));
    //         if (index !== -1) {
    //             filters.splice(index, 1);
    //         }
    //         if (indexId !== -1) {
    //             filtersIds.splice(indexId, 1);
    //         }
    //     }
    //     if (selected.length > 1) {
    //         let i = 0;
    //         let name = "";
    //         Ext.each(selected, function (val, index) {
    //             if (i === 0) {
    //                 name = val.getText();
    //                 button.setText(name);
    //                 button.getMenu().arrowCls = "delete";
    //             } else {
    //                 button.setText(name + "  +" + i);
    //             }
    //             button.splitArrowElement.removeCls("x-arrow-el");
    //             button.splitArrowElement.addCls("md-icon-close");
    //             button.addCls("active");
    //             i++;
    //         });
    //     }
    //     if (selected.length === 1) {
    //         let check = selected[0];
    //         let name = check.getText();
    //         button.setText(name);
    //         button.splitArrowElement.removeCls("x-arrow-el");
    //         button.splitArrowElement.addCls("md-icon-close");
    //         button.addCls("active");
    //     }
    //     if (selected.length === 0) {
    //         button.setText("Port");
    //         button.splitArrowElement.removeCls("md-icon-close");
    //         button.splitArrowElement.addCls("x-arrow-el");
    //         button.removeCls("active");
    //     }

    //     if (filtersIds.length > 0) {
    //         inquiry.addFilter({
    //             id: 7777,
    //             filterFn: function (item) {
    //                 if (item.getVoyage() && Ext.Array.contains(filtersIds, item.getVoyage().get('port_id'))) {
    //                     return item;
    //                 } else {
    //                     return false;
    //                 }
    //             }
    //         });
    //     } else {
    //         inquiry.removeFilter(7777);
    //     }
    // },
    applyClosedTypeFilters: function (cmp, newValue) {
        let portcallsArchived = cmp.upVM().get('portcallsArchived'),
            filters = cmp.upVM().get('portcallPrincipalClosedType'),
            filtersIds = cmp.upVM().get('portcallPrincipalClosedTypeIds'),
            button = cmp.up('button'),
            selected = Ext.ComponentQuery.query(
                'menucheckitem[cls=checkclosedtypeportcallsprincipal-filters][checked="true"]'
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
