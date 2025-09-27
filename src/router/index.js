
import { createRouter, createWebHistory } from "vue-router";
import authProvider from "@/provider/authProviders"
import base from "@/layouts/base.vue"
import login from "@/pages/auth/login-page.vue"
import dashboard from '@/pages/dashboard/index.vue'

//import Page Master Data
import masterdataDistrict from "@/pages/admin/masterdata/district-page.vue"
import masterdataVillage from "@/pages/admin/masterdata/village-page.vue"

// Import Page Utility Group
// import utilityRoles from "@/pages/admin/utilities/roles-page.vue"
import utilityUser from "@/pages/admin/utilities/users-page.vue"
import utilityfilemanagement from "@/pages/admin/utilities/filemanagement.vue"
import utilityRoles from "@/pages/admin/utilities/roles-page.vue"
import utilityChangePassword from "@/pages/admin/utilities/changepassword-page.vue"

// Import Page Survey
import surveyTopic from "@/pages/admin/survey/topic-page.vue"
import surveyTopicDocument from "@/pages/admin/survey/topic-document-page.vue"
import surveyTopicCategory from "@/pages/admin/survey/topic-category-page.vue"
import surveyData from "@/pages/admin/survey/data-pages.vue"
import surveyTopicQuestion from "@/pages/admin/survey/topic-question-page.vue"

import survey from "@/pages/landing/survey-page.vue"
import sendingSuccess from "@/pages/landing/sending-success.vue"


// Import Theme Demo
// import themeDemo from "@/components/ThemeDemo/index.vue"
// import themeTest from "@/components/ThemeTest/index.vue"

const routes = [
    {
        path: '',
        redirect: 'survey'
    },
    {
        path: '/survey',
        name: 'survey',
        component: survey,
    },
    {
        path: '/sending-success',
        name: 'sending-success',
        component: sendingSuccess,
    },
    {
        path: '/auth/login',
        name: 'login',
        component: login
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

            // /**
            //  * Route Master Data
            //  */
            {
                path: "/auth/logged/master-data/district-management",
                name: "master-data-district-management",
                component: masterdataDistrict,
            },
            {
                path: "/auth/logged/master-data/village-management",
                name: "master-data-village-management",
                component: masterdataVillage,
            },

            // /**
            //  * Route Utility
            //  */
            {
                path: "/auth/logged/utilities/roles-management",
                name: "utilities-roles-management",
                component: utilityRoles,
            },
            {
                path: "/auth/logged/utilities/users-management",
                name: "utilities-users-management",
                component: utilityUser,
            },
            {
                path: "/auth/logged/utilities/filemanagement",
                name: "utilities-filemanagement",
                component: utilityfilemanagement,
            },

            {
                path: "/auth/logged/utilities/change-password",
                name: "change-password",
                component: utilityChangePassword,
            },

            // /**
            //  * Route Survey
            //  */
            {
                path: "/auth/logged/survey/topic-management",
                name: "survey-topic-management",
                component: surveyTopic,
            },
            {
                path: "/auth/logged/survey/topic-document-management/:survey_topic_id",
                name: "survey-topic-document-management",
                component: surveyTopicDocument,
            },
            {
                path: "/auth/logged/survey/topic-question-management/:survey_topic_id",
                name: "survey-topic-question-management",
                component: surveyTopicQuestion,
            },
            {
                path: "/auth/logged/survey/topic-category-management/:survey_topic_id",
                name: "survey-topic-category-management",
                component: surveyTopicCategory,
            },
            {
                path: "/auth/logged/survey/data-management",
                name: "survey-data-management",
                component: surveyData,
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
