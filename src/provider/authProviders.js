import * as CryptoJS from "crypto-js";


class AuthProviders {
    constructor() {
        this.siteKey = import.meta.env.VITE_SITE_KEY;
        this.secretKey = import.meta.env.VITE_SITE_SECRET;
        this.storage = localStorage;
    }

    encrypt(data) {
        const encryptedData = CryptoJS.AES.encrypt(data, this.secretKey);
        return encryptedData.toString();
    }

    decrypt(data) {
        const decryptedData = CryptoJS.AES.decrypt(data, this.secretKey);
        return decryptedData.toString(CryptoJS.enc.Utf8);
    }

    decryptresponse(data, iv) {
        // Convert key ke format yang dibutuhkan CryptoJS
        const keyWords = CryptoJS.enc.Utf8.parse(this.secretKey);
        const ivWords = CryptoJS.enc.Base64.parse(iv);

        // Decrypt
        const ciphertextBytes = CryptoJS.enc.Base64.parse(data);

        const decrypted = CryptoJS.AES.decrypt(
            { ciphertext: ciphertextBytes },
            keyWords,
            {
                iv: ivWords,
                mode: CryptoJS.mode.CFB,
                padding: CryptoJS.pad.NoPadding
            }
        );

        const datafinal = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

        return datafinal
    }

    encryptRequest(data) {

        // Convert secretKey ke format yang dibutuhkan CryptoJS
        const keyWords = CryptoJS.enc.Utf8.parse(this.secretKey);

        // Buat IV acak
        const ivWords = CryptoJS.lib.WordArray.random(16);

        // Konversi data ke string JSON
        const jsonData = JSON.stringify(data);

        // Enkripsi
        const encrypted = CryptoJS.AES.encrypt(
            CryptoJS.enc.Utf8.parse(jsonData),
            keyWords,
            {
                iv: ivWords,
                mode: CryptoJS.mode.CFB,
                padding: CryptoJS.pad.NoPadding
            }
        );

        // Encode hasil enkripsi dan IV ke base64
        const ciphertextBase64 = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
        const ivBase64 = CryptoJS.enc.Base64.stringify(ivWords);

        // Return data terenkripsi dan IV
        return { datax: ciphertextBase64, datay: ivBase64 };
    }


    hash(key) {
        const hashedKey = CryptoJS.SHA256(key, this.secretKey);
        return hashedKey.toString();
    }

    getKey(key) {
        return this.hash(`${this.siteKey}_${key}`);
    }

    get authData() {
        const encryptedData = this.storage.getItem("authData");

        if (!encryptedData) {
            return {
                info: {},
                user: {},
                modules: null,
                domain_url: null,
                module_url: null,
                menus: {},
                registed: null,
                theme: null,
                token: null,
                token_create_at: null,
            };
        }

        const decryptedData = this.decrypt(encryptedData);
        return JSON.parse(decryptedData);
    }

    set authData(data) {
        const encryptedData = this.encrypt(JSON.stringify(data));
        this.storage.setItem("authData", encryptedData);
    }

    clearAuthData() {
        this.storage.removeItem("authData");
    }

    get token() {
        return this.authData.token;
    }

    set token(response) {
        if (!response) return;

        this.authData = {
            ...this.authData,
            token: response,
            token_create_at: Date.now(),
        };
    }

    get user() {
        const storeUser = this.authData.user;

        if (!storeUser || storeUser.name === null) {
            return {};
        }

        return storeUser;
    }

    get expired() {
        const minute =
            parseInt(
                (Date.now() -
                    parseInt(this.authData.token_create_at?.toString() || "0")) /
                1000
            ) || 0;
        const expire = parseInt(this.authData.token?.expires_in?.toString() || "0");

        return minute >= expire;
    }

    get check() {
        try {
            if (!this.authData.token) {
                return false;
            }

            return !!this.authData.token.token && !this.expired;
        } catch (error) {
            this.clearAuthData();
            return false;
        }
    }

    get logged() {
        return this.authData.token !== null;
    }
}

export default AuthProviders;
