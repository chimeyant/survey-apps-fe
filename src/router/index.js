
import { createRouter, createWebHistory } from "vue-router";
import login from "../pages/auth/login.vue"
import loginPage1 from "../pages/auth/login_page1.vue"
import base from "../layouts/base.vue"
import dashboard from '../pages/dashboard.vue'
import authProvider from "@/provider/authProviders"

//import Page Master Data
import masterdataAgencyMaster from '@/pages/admin/masterdata/agency-master.vue'
import masterdataDivisionMaster from '@/pages/admin/masterdata/division-master.vue'
import masterdataServiceCategoryMaster from '@/pages/admin/masterdata/service-category-master.vue'
import masterdataServiceSubCategoryMaster from '@/pages/admin/masterdata/service-sub-category-master.vue'
import masterdataPositionMaster from '@/pages/admin/masterdata/position-master.vue'
import masterdataOfficialMaster from '@/pages/admin/masterdata/official-master.vue'
import masterdataServiceCategoryDocumentMaster from '@/pages/admin/masterdata/service-category-document-master.vue'


//import Page User 
import userDashboard from "@/pages/user/dashboard/index.vue";
import userApplication from '@/pages/user/application/index.vue'



// Import Page Utility Group
import utilityUser from "@/pages/admin/utilities/users-management.vue"
import utilityfilemanagement from "@/pages/admin/utilities/filemanagement.vue"
import utilityChangePassword from "@/pages/admin/utilities/changepassword.vue"

// Import Theme Demo
import themeDemo from "@/components/ThemeDemo/index.vue"
import themeTest from "@/components/ThemeTest/index.vue"

const routes = [
    {
        path: '',
        name: 'login',
        component: login
    },
    {
        path: '/auth/login-page1',
        name: 'login_page1',
        component: loginPage1
    },
    {
        path: '/auth/logged',
        component: base,
        meta: {
            auth: true,
        },
        children: [
            {
                path: "/auth/logged/dashboard",
                name: "dashboard",
                component: dashboard,
            },

            /**
             * Route Master Data
             */
            {
                path: "/auth/logged/master-data/agency-master",
                name: "master-data-agency-master",
                component: masterdataAgencyMaster,
            },
            {
                path: "/auth/logged/master-data/division-master",
                name: "master-data-division-master",
                component: masterdataDivisionMaster,
            },
            {
                path: "/auth/logged/master-data/service-category-master",
                name: "master-data-service-category-master",
                component: masterdataServiceCategoryMaster,
            },
            {
                path: "/auth/logged/master-data/service-sub-category-master",
                name: "master-data-service-sub-category-master",
                component: masterdataServiceSubCategoryMaster,
            },
            {
                path: "/auth/logged/master-data/position-master",
                name: "master-data-position-master",
                component: masterdataPositionMaster,
            },
            {
                path: "/auth/logged/master-data/official-master",
                name: "master-data-official-master",
                component: masterdataOfficialMaster,
            },
            {
                path: "/auth/logged/master-data/service-category-document-master/:service_category_master_uuid",
                name: "master-data-service-category-document-master",
                component: masterdataServiceCategoryDocumentMaster,
            },


            /**
             * Route Utility
             */
            {
                path: "/auth/logged/utilities/users-management",
                name: "utilities-users-management",
                component: utilityUser,
            }, {
                path: "/auth/logged/utilities/filemanagement",
                name: "utilities-filemanagement",
                component: utilityfilemanagement,
            },

            {
                path: "/auth/logged/utilities/change-password",
                name: "change-password",
                component: utilityChangePassword,
            },

            /**
             * Route Theme Demo
             */
            {
                path: "/auth/logged/theme-demo",
                name: "theme-demo",
                component: themeDemo,
            },
            {
                path: "/auth/logged/theme-test",
                name: "theme-test",
                component: themeTest,
            },

            /**
             * Router User
             */
            {
                path: "/auth/logged/user/dashboard",
                name: "user-dashboard",
                component: userDashboard,
            },
            {
                path: "/auth/logged/user/application",
                name: "user-application",
                component: userApplication,
            }

        ]
    },

];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// Navigation Guard for authentication
router.beforeEach((to, from, next) => {
    const auth = new authProvider();


    if (window.top !== window.self) {
        alert('Akses ditolak: Aplikasi tidak dapat disematkan dalam iframe.');
        window.top.location = window.location.href; // Redirect keluar dari iframe
    } else {
        next();
    }

    const requiresAuth = to.matched.some((record) => record.meta.auth);

    if (requiresAuth) {
        if (!auth.logged) {
            next({ name: "login" });
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
