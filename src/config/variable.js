// Tema default (Cyan)
const DEFAULT_THEME = {
    name: "cyan",
    primary: "cyan",
    primaryLight: "cyan-lighten-5",
    primaryDark: "cyan-darken-5",
    success: "green-darken-2",
    error: "red",
    warning: "orange-darken-4",
    refresh: "blue",
    add: "cyan",
    edit: "orange",
    download: "blue",
    delete: "red",
    help: "grey",
    back: "cyan",
    dot: "white",
    title: "white",
    subtitle: "grey",
};

// Tema alternatif
const THEMES = {
    cyan: {
        name: "cyan",
        primary: "cyan",
        primaryLight: "cyan-lighten-5",
        primaryDark: "cyan-darken-5",
        success: "green-darken-2",
        error: "red",
        warning: "orange-darken-4",
        refresh: "blue",
        add: "cyan",
        edit: "orange",
        download: "blue",
        delete: "red",
        help: "grey",
        back: "cyan",
        dot: "white",
        title: "white",
        subtitle: "grey",
    },
    blue: {
        name: "blue",
        primary: "blue",
        primaryLight: "blue-lighten-5",
        primaryDark: "blue-darken-5",
        success: "green-darken-2",
        error: "red",
        warning: "orange-darken-4",
        refresh: "blue",
        add: "green",
        edit: "orange",
        download: "blue",
        delete: "red",
        help: "grey",
        back: "blue",
        dot: "white",
        title: "white",
        subtitle: "grey",
    },
    indigo: {
        name: "indigo",
        primary: "indigo",
        primaryLight: "indigo-lighten-5",
        primaryDark: "indigo-darken-5",
        success: "green-darken-2",
        error: "red",
        warning: "orange-darken-4",
        refresh: "blue",
        add: "green",
        edit: "orange",
        download: "blue",
        delete: "red",
        help: "grey",
        back: "indigo",
        dot: "white",
        title: "white",
        subtitle: "grey",
    },
    purple: {
        name: "purple",
        primary: "purple",
        primaryLight: "purple-lighten-5",
        primaryDark: "purple-darken-5",
        success: "green-darken-2",
        error: "red",
        warning: "orange-darken-4",
        refresh: "blue",
        add: "green",
        edit: "orange",
        download: "blue",
        delete: "red",
        help: "grey",
        back: "purple",
        dot: "white",
        title: "white",
        subtitle: "grey",
    },
    teal: {
        name: "teal",
        primary: "teal",
        primaryLight: "teal-lighten-5",
        primaryDark: "teal-darken-5",
        success: "green-darken-2",
        error: "red",
        warning: "orange-darken-4",
        refresh: "blue",
        add: "teal",
        edit: "orange",
        download: "blue",
        delete: "red",
        help: "grey",
        back: "teal",
        dot: "white",
        title: "white",
        subtitle: "grey",
    },
    orange: {
        name: "orange",
        primary: "orange",
        primaryLight: "orange-lighten-5",
        primaryDark: "orange-darken-5",
        success: "green-darken-2",
        error: "red",
        warning: "orange-darken-4",
        refresh: "blue",
        add: "green",
        edit: "orange",
        download: "blue",
        delete: "red",
        help: "grey",
        back: "orange",
        dot: "white",
        title: "white",
        subtitle: "grey",
    },
    red: {
        name: "red",
        primary: "red",
        primaryLight: "red-lighten-5",
        primaryDark: "red-darken-5",
        success: "green-darken-2",
        error: "red",
        warning: "orange-darken-4",
        refresh: "blue",
        add: "green",
        edit: "orange",
        download: "blue",
        delete: "red",
        help: "grey",
        back: "red",
        dot: "white",
        title: "white",
        subtitle: "grey",
    },
    green: {
        name: "green",
        primary: "green",
        primaryLight: "green-lighten-5",
        primaryDark: "green-darken-5",
        success: "green-darken-2",
        error: "red",
        warning: "orange-darken-4",
        refresh: "blue",
        add: "green",
        edit: "orange",
        download: "blue",
        delete: "red",
        help: "grey",
        back: "green",
        dot: "white",
        title: "white",
        subtitle: "grey",
    },
};

// Legacy colors untuk backward compatibility
const COLOR_PRIMARY = DEFAULT_THEME.primary;
const COLOR_PRIMARY_LIGHT = DEFAULT_THEME.primaryLight;
const COLOR_PRIMARY_DARK = DEFAULT_THEME.primaryDark;
const COLOR_SUCCESS = DEFAULT_THEME.success;
const COLOR_ERROR = DEFAULT_THEME.error;
const COLOR_WARNING = DEFAULT_THEME.warning;
const COLOR_REFRESH = DEFAULT_THEME.refresh;
const COLOR_ADD = DEFAULT_THEME.add;
const COLOR_EDIT = DEFAULT_THEME.edit;
const COLOR_DOWNLOAD = DEFAULT_THEME.download;
const COLOR_DELETE = DEFAULT_THEME.delete;
const COLOR_HELP = DEFAULT_THEME.help;
const COLOR_BACK = DEFAULT_THEME.back;
const COLOR_DOT = DEFAULT_THEME.dot;
const COLOR_TITLE = DEFAULT_THEME.title;
const COLOR_SUBTITLE = DEFAULT_THEME.subtitle;

const TYPE_SUCCESS = "success";
const TYPE_WARNING = "warning";
const TYPE_ERROR = "error";

const colors = {
    COLOR_PRIMARY,
    COLOR_PRIMARY_LIGHT,
    COLOR_PRIMARY_DARK,
    COLOR_SUCCESS,
    COLOR_WARNING,
    COLOR_ERROR,
    COLOR_REFRESH,
    COLOR_ADD,
    COLOR_EDIT,
    COLOR_DOWNLOAD,
    COLOR_DELETE,
    COLOR_BACK,
    COLOR_HELP,
    COLOR_DOT,
    COLOR_TITLE,
    COLOR_SUBTITLE,
}

const types = {
    TYPE_SUCCESS,
    TYPE_WARNING,
    TYPE_ERROR,
}

export {
    colors,
    types,
    THEMES,
    DEFAULT_THEME
}




