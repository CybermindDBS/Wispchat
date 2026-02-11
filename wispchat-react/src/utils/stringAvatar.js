export default function stringAvatar(name = "") {
    const initials = name
        .trim()
        .split(/\s+/)
        .filter(word => /^[A-Za-z]/.test(word))
        .map(word => word[0].toUpperCase())
        .slice(0, 2)
        .join('');

    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: initials || "U",
    };
}


function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = Math.abs(hash) % 360;   // full color wheel
    const saturation = 85;
    const lightness = 75;
    return hslToHex(hue, saturation, lightness);
}

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    const r = Math.round(255 * f(0));
    const g = Math.round(255 * f(8));
    const b = Math.round(255 * f(4));

    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}
