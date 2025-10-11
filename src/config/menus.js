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
                        title: "Kecamatan",
                        props: {
                            type: "item",
                            icon: "ri-menu-line",
                            route: "master-data-district-management"
                        }
                    },
                    {
                        title: "Desa|Kelurahan",
                        props: {
                            type: "item",
                            icon: "ri-menu-line",
                            route: "master-data-village-management"
                        }
                    }
                ]

            }
        },
        {
            title: "Survei",
            props: {
                type: "group",
                icon: "ri-megaphone-line",
                submenus: [
                    {
                        title: "Topik",
                        props: {
                            type: "item",
                            icon: "ri-menu-line",
                            route: "survey-topic-management"
                        }
                    },
                    {
                        title: "Data",
                        props: {
                            type: "item",
                            icon: "ri-menu-line",
                            route: "survey-data-management"
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
                route: "utilities-roles-management"
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