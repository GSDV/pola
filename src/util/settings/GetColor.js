let colors = {
    'light': {
        'red': { 'primary': '#FF858E', 'secondary': '#C02F2F' },
        'green': { 'primary': '#8BBD87', 'secondary': '#03A079' },
        'blue': { 'primary': '#43A8CA', 'secondary': '#1951AF' },
    },
    'dark': {
        'red': { 'primary': '#C54646', 'secondary': '#881818' },
        'green': { 'primary': '#465E45', 'secondary': '#017F3C' },
        'blue': { 'primary': '#43A8CA', 'secondary': '#192988' },
    },
}


export default function getColor(darkMode, colorPref, mode) {
    if (darkMode) return colors['dark'][colorPref][mode];
    return colors['light'][colorPref][mode];
}