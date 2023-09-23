export const writeToLocalStore = (key: string, value: string) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const readFromLocalStore = (key: string) => {
    const value = localStorage.getItem(key);
    if (value != null) {
        return JSON.parse(value);
    }
    return null;
};

// https://stackoverflow.com/a/69058154
export const isTokenExpired = (token: string) => {
    try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split("")
                .map(
                    (c) =>
                        "%" + ("00" + c.charCodeAt(0).toString(16).slice(-2)),
                )
                .join(""),
        );

        const { exp } = JSON.parse(jsonPayload);
        const expired = Date.now() >= exp * 1000;
        return expired;
    } catch {
        return true;
    }
};

export const getDateString = (date: Date) => {
    return date.toISOString().split("T")[0];
};
