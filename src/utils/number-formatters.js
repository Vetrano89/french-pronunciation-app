export function toPercent(num) {
    if (!num || isNaN(num)) {
        return '';
    }
    return `${num.toFixed(2) * 100}%`
}

export function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}