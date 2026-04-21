import api from "./axios";

const normalizeSettings = (settings) => ({
    theme: settings.theme || "light",
    language: settings.language || "en",
    notifications:
        settings.notifications !== undefined ? settings.notifications : true,
    emailUpdates:
        settings.email_updates !== undefined ? settings.email_updates : false,
    timezone: settings.timezone || "Asia/Colombo",
});

export const getSettings = async () => {
    const response = await api.get("/settings");
    return normalizeSettings(response.data.settings || {});
};

export const updateSettings = async (settingsData) => {
    const response = await api.patch("/settings", {
        theme: settingsData.theme,
        language: settingsData.language,
        notifications: settingsData.notifications,
        email_updates: settingsData.emailUpdates,
        timezone: settingsData.timezone,
    });

    return normalizeSettings(response.data.settings || {});
};

export const initSettings = async () => {
    const response = await api.post("/settings/init");
    return normalizeSettings(response.data.settings || {});
};