// Utilities
import { defineStore } from "pinia";
import apiService from "@/provider/apiService";
import authProvider from "@/provider/authProviders";
import { colors, types, THEMES, DEFAULT_THEME } from "@/config/variable";
import { MSG_ERROR } from "@/config/lang";
import { useRouter } from "vue-router";
import configMenus from "../config/menus";
import { nextTick } from "vue";

export const useAppStore = defineStore("app", {
    state: () => ({
        router: useRouter(),
        device: {
            mobile: null,
            tablet: null,
            laptop: null,
            desktop: null,
            tv: null,
        },
        appinfo: {},
        menus: [],
        theme: {
            mode: "light",
            current: "cyan",
            available: Object.keys(THEMES),
        },
        http: apiService,
        colors: {
            PRIMARY: colors.COLOR_PRIMARY,
            SUCCESS: colors.COLOR_SUCCESS,
            ERROR: colors.COLOR_ERROR,
            WARNING: colors.COLOR_WARNING,
            REFRESH: colors.COLOR_REFRESH,
            ADD: colors.COLOR_ADD,
            EDIT: colors.COLOR_EDIT,
            DOWNLOAD: colors.COLOR_DOWNLOAD, // Fixed typo here
            DELETE: colors.COLOR_DELETE,
            BACK: colors.COLOR_BACK,
            HELP: colors.COLOR_HELP,
            DOT: colors.COLOR_DOT,
            TITLE: colors.COLOR_TITLE,
            SUBTITLE: colors.COLOR_SUBTITLE,
        },
        types: {
            SUCCESS: types.TYPE_SUCCESS,
            WARNING: types.TYPE_WARNING,
            ERROR: types.TYPE_ERROR,
        },
        page: {
            dataUrl: null,
            crud: null,
            title: null,
            subtitle: null,
            icon: null,
            pagination: false,
            key: "id",
            breadcrumbs: [],
            toolbar: true,
            add: false,
            edit: false,
            actions: {
                refresh: true,
                add: true,
                edit: true,
                delete: true,
                bulkdelete: true,
                export: false,
                print: false,
                help: false,
                close: false,
                back: false,
                find: true,
                search: false
            },
            showtable: false,
        },
        user: {
            name: null,
            email: null,
            avatar: null,
            role: {},
        },
        records: [],
        record: {},
        table: {
            itemsPerPage: 10,
            totalItems: 0,
            loading: false,
            keyWord: null,
            selects: [],

            footer: {
                page: 1,
                currentPage: 1,
                firstPage: 1,
                lastPage: 1,
                itemsPerPage: 10,
                total: 0,
            },

        },
        lists: {
            itemsPerPage: 10,
            totalItems: 0,
            page: 1,
            lastPage: 1,
            loading: false,
            search: null,
            selects: [],
        },
        form: {
            add: false,
            edit: false,
            delete: false,
            help: false,
            loading: false,
            info: false,
            page: false,
        },
        uploader: {
            state: false,
            progress: 0,
        },
        rules: {
            email: [
                (v) => !!v || "E-mail is required",
                (v) => /.+@.+\..+/.test(v) || "E-mail must be valid",
            ],
            required: [(v) => !!v || "This field is required"],
            phone: [
                (v) => !!v || "Phone Number is required",
                (v) =>
                    /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(v) ||
                    "Nomor telpon tidak benar",
            ],
            ktp: [
                (v) => !!v || "NIK tidak boleh kosong",
                (v) => (v && v.length == 16) || "NIK tidak benar",
            ],
        },
        snackbar: {
            text: "",
            color: "green",
            type: "success",
            state: false,
        },
    }),
    getters: {
        getAppInfo: (state) => state.appinfo,
        getTheme: (state) => state.theme,
        getCurrentTheme: (state) => THEMES[state.theme.current] || DEFAULT_THEME,
        getAvailableThemes: (state) => state.theme.available,
        getThemeColors: (state) => {
            // Agar perubahan theme langsung terupdate, ambil current dari state setiap kali getter dipanggil
            const themeName = state.theme.current;
            const currentTheme = THEMES[themeName] || DEFAULT_THEME;
            // Spread agar tidak ada referensi ke object yang bisa menyebabkan stale
            return {
                primary: currentTheme.primary,
                primaryLight: currentTheme.primaryLight,
                primaryDark: currentTheme.primaryDark,
                success: currentTheme.success,
                error: currentTheme.error,
                warning: currentTheme.warning,
                refresh: currentTheme.refresh,
                add: currentTheme.add,
                edit: currentTheme.edit,
                download: currentTheme.download,
                delete: currentTheme.delete,
                help: currentTheme.help,
                back: currentTheme.back,
                dot: currentTheme.dot,
                title: currentTheme.title,
                subtitle: currentTheme.subtitle,
            };
        },
    },
    actions: {
        deviceResize() {
            let width = window.innerWidth;

            const payload = {
                mobile: width < 480,
                tablet: width >= 481 && width <= 768,
                laptop: width >= 769 && width <= 1024,
                desktop: width >= 1025 && width <= 1200,
                tv: width >= 1200,
            };

            this.setDevice(payload);
        },

        setDevice(payload) {
            Object.keys(payload).forEach((key) => {
                this.device[key] = payload[key];
            });
        },

        setList(payload) {
            Object.keys(payload).forEach((key) => {
                this.lists[key] = payload[key];
            });
        },

        async fetchAppInfo() {
            const endpoint = "/api/v1/app-info";
            const result = await apiService.get(endpoint);
            this.setAppInfo(result.data);
        },

        setAppInfo(data) {
            this.appinfo = data;
        },

        async getUserInfo() {
            try {
                const endpoint = "api/v1/auth/user-info";
                const result = await apiService.get(endpoint);
                const auth = new authProvider()
                const decryptedData = auth.decryptresponse(result.data.datax, result.data.datay)
                this.setUserInfo(decryptedData);
            } catch (error) {
                this.catchError(error);
            }
        },

        setUserInfo(data) {
            this.user = data;
        },

        setRecords(payload) {
            this.records = payload;
        },

        setRecord(payload) {
            this.record = payload;
        },

        changeRecord(payload) {
            const index = this.records.findIndex((item) => item.uuid === payload.uuid);
            Object.keys(payload).forEach((key) => {
                this.records[index][key] = payload[key];
            });
        },

        removeRecord(payload) {
            this.records.splice(this.records.findIndex((item) => item.uuid == payload), 1);
        },

        async fetchMenus() {
            try {
                const auth = new authProvider()

                if (auth.user.role.name == "Administrator") {
                    const menus = configMenus.administrator;
                    this.setMenus(menus);
                }
                if (auth.user.role.name == "User") {
                    const menus = configMenus.user;
                    this.setMenus(menus);
                }

                return true;
            } catch (error) {
                this.catchError(error.response);
            }
        },

        setMenus(data) {
            this.menus = data;
        },

        setPage(payload) {
            Object.keys(payload).forEach((key) => {
                this.page[key] = payload[key];
            });
        },

        setForm(payload) {
            Object.keys(payload).forEach((key) => {
                this.form[key] = payload[key];
            });
        },

        setSnackbar(text, color = "green", type = "success") {
            this.snackbar.text = text;
            this.snackbar.color = color;
            this.snackbar.type = type;
            this.snackbar.state = true;
            setTimeout(() => {
                this.snackbar.text = "";
                this.snackbar.color = color;
                this.snackbar.type = type;
                this.snackbar.state = false;
            }, 3000)
        },

        setUploaderState(status) {
            this.uploader.state = status;
        },

        setUploaderProgress(progress) {
            this.uploader.progress = progress;
        },

        starUpload() {
            this.uploader.state = true;
        },

        finishUpload() {
            this.uploader.state = false;
            this.uploader.progress = 0;
        },

        async postRegister(payload) {
            try {
                const endpoint = "/api/v1/auth/register";
                const result = await apiService.post(endpoint, payload);

                if (result.status == 200) {
                    this.setSnackbar(result.data.message, colors.COLOR_SUCCESS);
                    return true;
                } else {
                    this.setSnackbar(result.data.message, colors.COLOR_WARNING);
                    return false;
                }
            } catch (error) {
                this.catchError(error);
                return false;
            }
        },

        async postSignin(payload, encrypt = false) {
            try {
                if (!payload.email || !payload.password) {
                    return false;
                }

                const endpoint = "api/v1/auth/login";

                let result;

                if (encrypt) {
                    const auth = new authProvider();
                    const encryptdata = auth.encryptRequest(payload)
                    result = await apiService.post(endpoint, encryptdata);
                } else {
                    result = await apiService.post(endpoint, payload);
                }

                this.setMenus([]);

                if (result.data.code == 200) {
                    const authent = result.data.data.auth;

                    const auth = new authProvider();

                    const payload = {
                        info: {},
                        user: result.data.data.user,
                        modules: null,
                        domain_url: null,
                        module_url: null,
                        menus: {},
                        registed: null,
                        theme: null,
                        token: authent.token,
                        token_create_at: authent.expire_at,
                    };

                    auth.authData = payload;
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                return false;
            }
        },

        async postSignOut() {
            const auth = new authProvider();
            auth.clearAuthData();
            this.setMenus([]);
        },

        async fetchRecords(endpoint, payload, decrypt) {

            try {
                if (decrypt) {
                    const auth = new authProvider();

                    this.table.loading = true;
                    const result = await apiService.get(endpoint, payload);

                    const data = auth.decryptresponse(result.data.datax, result.data.datay)
                    this.table.footer.total = data.meta.total
                    this.table.footer.currentPage = data.meta.current_page
                    this.table.footer.firstPage = data.meta.first_page
                    this.table.footer.lastPage = data.meta.last_page

                    if (process.env.NODE_ENV === "development") {
                        console.log("payload:", payload);
                        console.log("fetch records decrypted data:", data);
                    }

                    return {
                        data: data,
                        status: true,
                    };

                } else {
                    this.table.loading = true;
                    const result = await apiService.get(endpoint, payload);

                    this.table.footer.total = result.data.meta.total
                    this.table.footer.currentPage = result.data.meta.current_page
                    this.table.footer.firstPage = result.data.meta.first_page
                    this.table.footer.lastPage = result.data.meta.last_page

                    return {
                        data: result.data,
                        status: true,
                    };
                }

            } catch (error) {
                this.catchError(error);
            } finally {
                this.table.loading = false;
            }
        },

        async fetchExport(url) {
            try {
                this.table.loading = true;
                const response = await apiService.downloadFile(url);
                return response;
            } catch (error) {
                this.catchError(error);
                throw error;
            } finally {
                this.table.loading = false;
            }
        },

        async postRecord(endpoint, payload, method = "store", encrypt) {
            try {
                this.form.loading = true;

                if (process.env.NODE_ENV === "development") {
                    console.log("post record payload:", payload);
                }

                if (encrypt) {
                    if (method === "store") {
                        const auth = new authProvider();

                        const encryptdata = auth.encryptRequest(payload)

                        const result = await apiService.post(endpoint, encryptdata);
                        return result;
                    }
                    if (method === "update") {
                        const auth = new authProvider();

                        const encryptdata = auth.encryptRequest(payload)

                        const result = await apiService.put(endpoint, encryptdata);
                        return result;
                    }
                    if (method === "delete") {
                        const result = await apiService.delete(endpoint);
                        return result;
                    }
                } else {

                    if (method === "store") {
                        const result = await apiService.post(endpoint, payload);
                        return result;
                    }
                    if (method === "update") {
                        const result = await apiService.put(endpoint, payload);
                        return result;
                    }
                    if (method === "delete") {
                        const result = await apiService.delete(endpoint);
                        return result;
                    }
                }
            } catch (error) {

                this.catchError(error);
            } finally {
                this.form.loading = false;
            }
        },

        async showRecord(endpoint, decrypt) {
            try {
                if (decrypt) {
                    const auth = new authProvider()
                    this.form.loading = true;
                    const result = await apiService.get(endpoint);

                    const decryptedData = auth.decryptresponse(result.data.datax, result.data.datay)

                    if (process.env.NODE_ENV === "development") {
                        console.log("show record decrypted data:", decryptedData);
                    }

                    return decryptedData

                } else {
                    this.form.loading = true;
                    const result = await apiService.get(endpoint);
                    return result.data;
                }
            } catch (error) {
                this.catchError(error);
            } finally {
                this.form.loading = false;
            }
        },

        async getCombo(endpoint, encrypt) {
            try {
                if (encrypt) {
                    const auth = new authProvider();
                    const result = await apiService.get(endpoint);
                    const data = auth.decryptresponse(result.data.datax, result.data.datay)
                    if (process.env.NODE_ENV === "development") {
                        console.log("getCombo decrypted data:", data);
                    }
                    return data;
                } else {
                    const result = await apiService.get(endpoint);
                    return result.data;
                }
            } catch (error) {
                this.catchError(error);
            }
        },



        async uploadFile(file, doctype) {
            try {
                this.uploader.state = true
                const handleProgress = (progress) => {
                    this.uploader.progress = progress
                }
                const result = await apiService.uploadFile(file, doctype, handleProgress);
                return result;
            } catch (error) {
                this.catchError(error);
            } finally {
                this.uploader.state = false
            }
        },

        async deleteFile(fileName) {
            const endpoint = "api/v1/media-file/delete-by-file-name/" + fileName;
            try {
                const result = await apiService.delete(endpoint);
                return result;
            } catch (error) {
                this.catchError(error);
            }
        },

        catchError(payload) {
            let message;

            console.log(payload)

            if (payload.status === 422) {
                message = `${MSG_ERROR}, ${payload.response.statusText}`;
            }

            else if (payload.status === 401) {
                message = `${MSG_ERROR}, ${payload.statusText}`;
                this.postSignOut();
                this.router.push({ name: "login" });
            } else if (payload.status === 405) {
                message = "Method Not Allow"
            }
            else if (payload.status === 500) {
                message = "Internal Server Error"
            }
            else if (payload.status === 404) {
                message = "API Service Not Found (404)"

            }
            else {
                message = payload.data ? payload.data.message : MSG_ERROR;
            }

            this.setSnackbar(message, colors.COLOR_ERROR, "error");
        },

        // Theme management
        setTheme(themeName) {
            if (THEMES[themeName]) {
                this.theme.current = themeName;
                // Save to localStorage for persistence
                localStorage.setItem('app-theme', themeName);
                return true;
            }
            return false;
        },

        loadThemeFromStorage() {
            const savedTheme = localStorage.getItem('app-theme');
            if (savedTheme && THEMES[savedTheme]) {
                this.theme.current = savedTheme;
            }
        },

        getCurrentThemeColors() {
            const currentTheme = THEMES[this.theme.current] || DEFAULT_THEME;
            return {
                primary: currentTheme.primary,
                primaryLight: currentTheme.primaryLight,
                primaryDark: currentTheme.primaryDark,
                success: currentTheme.success,
                error: currentTheme.error,
                warning: currentTheme.warning,
                refresh: currentTheme.refresh,
                add: currentTheme.add,
                edit: currentTheme.edit,
                download: currentTheme.download,
                delete: currentTheme.delete,
                help: currentTheme.help,
                back: currentTheme.back,
                dot: currentTheme.dot,
                title: currentTheme.title,
                subtitle: currentTheme.subtitle,
            };
        },
    },
});
