import {STATUS_PRIORITY} from "../constants/messageStatus.js";

export function sortMembers(members) {
    return [...members].sort((a, b) => {
        const aPriority = a.status ? STATUS_PRIORITY[a.status] ?? 99 : 100;
        const bPriority = b.status ? STATUS_PRIORITY[b.status] ?? 99 : 100;

        if (aPriority === bPriority) {
            return (b.order ?? 0) - (a.order ?? 0);
        }

        return aPriority - bPriority;
    });
}
