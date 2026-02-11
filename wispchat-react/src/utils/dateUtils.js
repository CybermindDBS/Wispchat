function normalizeTimestamp(timestamp) {
    // Trim fractional seconds to 3 digits (milliseconds)
    return timestamp.replace(/(\.\d{3})\d+/, '$1');
}

export function formatLocalTime24(timestamp) {
    const normalized = normalizeTimestamp(timestamp);
    return new Date(normalized).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function formatLocalDate(timestamp) {
    const normalized = normalizeTimestamp(timestamp);
    return new Date(normalized).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export function isAtLeastNextDayLocal(prevTimestamp, currTimestamp = new Date()) {
    const prev = new Date(normalizeTimestamp(prevTimestamp));
    const curr = new Date(currTimestamp);

    prev.setHours(0, 0, 0, 0);
    curr.setHours(0, 0, 0, 0);

    const ONE_DAY = 24 * 60 * 60 * 1000;

    return curr.getTime() - prev.getTime() >= ONE_DAY;
}