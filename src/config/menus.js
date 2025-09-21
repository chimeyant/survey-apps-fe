const menus = {
    "administrator": [
        {
            title: "Dashboard",
            props: {
                type: "item",
                icon: "ri-dashboard-fill",
                route: "dashboard"
            }
        },
        {
            title: "Aplikasi",
            props: {
                type: "subheader",
                icon: "ri-mac-fill",
            }
        },
        {
            title: "Data Master",
            props: {
                type: "group",
                icon: "ri-database-2-fill",
                submenus: [
                    {
                        title: "Master Dinas",
                        props: {
                            type: "item",
                            icon: "ri-menu-line",
                            route: "master-data-agency-master"
                        }
                    },
                    {
                        title: "Bidang",
                        props: {
                            type: "item",
                            icon: "ri-menu-line",
                            route: "master-data-division-master"
                        }
                    },
                    {
                        title: "Kategori Layanan",
                        props: {
                            type: "item",
                            icon: "ri-menu-line",
                            route: "master-data-service-category-master"
                        }
                    },
                    {
                        title: "Sub Kategori Layanan",
                        props: {
                            type: "item",
                            icon: "ri-menu-line",
                            route: "master-data-service-sub-category-master"
                        }
                    },
                    {
                        title: "Jabatan",
                        props: {
                            type: "item",
                            icon: "ri-menu-line",
                            route: "master-data-position-master"
                        }
                    },
                    {
                        title: "Pejabat Dinas",
                        props: {
                            type: "item",
                            icon: "ri-menu-line",
                            route: "master-data-official-master"
                        }
                    }

                ]

            }
        },
        {
            title: "Permohonan",
            props: {
                type: "group",
                icon: "ri-stack-fill",
                submenus: [
                    {
                        title: "Menu 1",
                        props: {
                            type: "item",
                            icon: "ri-menu-line",
                            route: "/auth/logged/data-master/menu-1"
                        }
                    }
                ]
            }
        },
        {
            title: "Utilities",
            props: {
                type: "subheader",
                icon: "ri-equalizer-fill",
            }
        },
        {
            title: "Manajemen Pengguna",
            props: {
                type: "item",
                icon: "ri-team-fill",
                route: "utilities-users-management"
            }
        },
        {
            title: "Manajemen Role & Akses",
            props: {
                type: "item",
                icon: "ri-shield-user-fill",
                route: "/auth/logged/utilities/roles-management"
            }
        },
        {
            title: "Ganti Password",
            props: {
                type: "item",
                icon: "ri-key-fill",
                route: "change-password"
            }
        },
        {
            title: "Manjemen File",
            props: {
                type: "item",
                icon: "ri-file-fill",
                route: "utilities-filemanagement"
            }
        }

    ],

    "user": [
        {
            title: "Dashboard",
            props: {
                type: "item",
                icon: "ri-dashboard-fill",
                route: "user-dashboard"
            }
        },
        {
            title: "Perangkat Daerah",
            props: {
                type: "group",
                icon: "ri-home-office-line",
                submenus: [
                    {
                        title: "Permohonan",
                        props: {
                            type: "item",
                            icon: "",
                            route: "user-application"
                        }
                    }
                ]
            }
        },

        {
            title: "Utilities",
            props: {
                type: "subheader",
                icon: "ri-equalizer-fill",
            }
        },

        {
            title: "Ganti Password",
            props: {
                type: "item",
                icon: "ri-key-fill",
                route: "change-password"
            }
        },
    ]

}

export default menus;