
export async function useMedals() {
    try {
        // 🤫
        const response = await fetch('https://medals-api-bobochdbrews-projects.vercel.app/api/medals')
        const data = deepMerge(defaultData, await response.json());
        Object.values(data).forEach((c: any) => c.total = c.gold + c.silver + c.bronze);
        return data;
    } catch(e) {
        console.error(e);
        return defaultData;
    }
}

function deepMerge(a: any, b: any) {
    const res: any = {};
    for(let key in b) res[key] ||= b[key];
    for(let key in a) typeof res[key] == "object" ? deepMerge(a[key], res[key]) : res[key] || a[key];
    return res;
}

const defaultData: any = {
    "Europe": { gold: 62, silver: 57, bronze: 71, total: 190 },
    "Asia": { gold: 40, silver: 35, bronze: 37, total: 112 },
    "America": { gold: 24, silver: 35, bronze: 38, total: 97 },
    "Oceania": { gold: 14, silver: 13, bronze: 8, total: 35 },
    "Africa": { gold: 2, silver: 3, bronze: 3, total: 8 }
}