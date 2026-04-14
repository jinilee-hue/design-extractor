const puppeteer = require('puppeteer');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 추출 셀렉터 정의
const BUTTON_SELECTOR = 'button, a[href], a[role="button"], [class*="btn"], [class*="button"]';
const ENTRY_SELECTOR = 'input, textarea, select, [role="checkbox"], [role="radio"], .toggle, .switch, .checkbox, .radio';

async function analyzePage(page, url) {
    try {
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        await delay(2000);

        // 메인 프레임 및 모든 iframe 포함 분석
        const allEntries = [];
        const frames = page.frames();

        for (const frame of frames) {
            try {
                const data = await frame.evaluate((btnSel, entrySel) => {
                    const getStyle = (el) => window.getComputedStyle(el);
                    
                    // 실제 CSS 선언 여부 확인 (가상 클래스)
                    const getActualFunctions = (el) => {
                        const funcs = { hasHover: false, hasFocus: false, hasChecked: false, hasDisabled: false };
                        try {
                            for (const sheet of document.styleSheets) {
                                try {
                                    const rules = sheet.cssRules || sheet.rules;
                                    for (const rule of rules) {
                                        if (rule.selectorText && (rule.selectorText.includes(el.className.split(' ')[0]) || rule.selectorText.includes(el.tagName.toLowerCase()))) {
                                            if (rule.selectorText.includes(':hover')) funcs.hasHover = true;
                                            if (rule.selectorText.includes(':focus')) funcs.hasFocus = true;
                                            if (rule.selectorText.includes(':checked')) funcs.hasChecked = true;
                                            if (rule.selectorText.includes(':disabled')) funcs.hasDisabled = true;
                                        }
                                    }
                                } catch(e) {}
                            }
                        } catch(e) {}
                        return funcs;
                    };

                    const collect = (selector) => {
                        return Array.from(document.querySelectorAll(selector))
                            .filter(el => el.offsetWidth > 5 && el.offsetHeight > 5)
                            .map(el => {
                                const s = getStyle(el);
                                const rect = el.getBoundingClientRect();
                                
                                // 배경색 상속 처리
                                let actualBg = s.backgroundColor;
                                let parent = el.parentElement;
                                while ((actualBg === 'rgba(0, 0, 0, 0)' || actualBg === 'transparent') && parent) {
                                    actualBg = window.getComputedStyle(parent).backgroundColor;
                                    parent = parent.parentElement;
                                }

                                return {
                                    type: el.type || el.tagName.toLowerCase(),
                                    tag: el.tagName.toLowerCase(),
                                    text: el.innerText.trim() || el.placeholder || el.value || 'Label',
                                    css: {
                                        backgroundColor: actualBg,
                                        color: s.color,
                                        borderTopColor: s.borderTopColor,
                                        borderTopWidth: s.borderTopWidth,
                                        borderTopStyle: s.borderTopStyle,
                                        borderRadius: s.borderRadius,
                                        fontSize: s.fontSize,
                                        fontWeight: s.fontWeight,
                                        fontFamily: s.fontFamily,
                                        paddingTop: s.paddingTop,
                                        paddingRight: s.paddingRight,
                                        paddingBottom: s.paddingBottom,
                                        paddingLeft: s.paddingLeft,
                                        letterSpacing: s.letterSpacing
                                    },
                                    metrics: {
                                        width: Math.round(rect.width) + 'px',
                                        height: Math.round(rect.height) + 'px',
                                        padding: `${parseInt(s.paddingTop)}px ${parseInt(s.paddingRight)}px`
                                    },
                                    functions: getActualFunctions(el)
                                };
                            });
                    };

                    return {
                        buttons: collect(btnSel),
                        entries: collect(entrySel)
                    };
                }, BUTTON_SELECTOR, ENTRY_SELECTOR);
                
                allEntries.push(...data.entries);
                // 버튼 데이터는 메인 분석에서 중복 제거 후 통합
                if (frame === page.mainFrame()) allEntries.mainButtons = data.buttons;
            } catch (e) {}
        }

        return allEntries;
    } catch (e) { return []; }
}

async function extractDesignTokens(baseUrl) {
    const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
    const page = await browser.newPage();
    try {
        // 1. 컬러 분석 (메인 페이지)
        await page.goto(baseUrl, { waitUntil: 'networkidle2' });
        const colorData = await page.evaluate(() => {
            const res = {};
            document.querySelectorAll('*').forEach(el => {
                const s = window.getComputedStyle(el);
                if (s.backgroundColor.startsWith('rgb') && s.backgroundColor !== 'rgba(0, 0, 0, 0)') {
                    res[s.backgroundColor] = (res[s.backgroundColor] || 0) + 1;
                }
            });
            return res;
        });

        // 2. 타이포 분석 (해상도별)
        const typo = {};
        const viewports = [{n:'1920*1080', w:1920}, {n:'768*1024', w:768}, {n:'360*760', w:360}];
        for(const vp of viewports) {
            await page.setViewport({width: vp.w, height: 1000});
            await page.goto(baseUrl, {waitUntil: 'networkidle2'});
            await delay(1000);
            typo[vp.n] = await page.evaluate(() => {
                const tags = {'H1':'h1','H2':'h2','H3':'h3','H4':'h4','H5':'h5','Body':'p','Small':'small'};
                const res = {};
                Object.entries(tags).forEach(([label, tag]) => {
                    const el = document.querySelector(tag) || document.createElement(tag);
                    const s = window.getComputedStyle(el);
                    res[label] = { family: s.fontFamily, size: s.fontSize, lh: s.lineHeight, ls: s.letterSpacing, color: s.color, weight: s.fontWeight };
                });
                return res;
            });
        }

        // 3. 라이브러리 분석 (iframe 포함)
        const entryData = await analyzePage(page, baseUrl);

        await browser.close();

        // 데이터 가공 및 중복 제거
        const rgbToHex = (rgb) => {
            const m = rgb.match(/\d+/g);
            return m ? "#" + m.slice(0, 3).map(x => parseInt(x).toString(16).padStart(2, '0')).join('').toUpperCase() : "#FFFFFF";
        };
        const rgbToCmyk = (rgb) => {
            const m = rgb.match(/\d+/g).map(Number);
            let r=m[0]/255, g=m[1]/255, b=m[2]/255, k=1-Math.max(r,g,b);
            if(k===1) return "C0 M0 Y0 K100";
            return `C${Math.round((1-r-k)/(1-k)*100)} M${Math.round((1-g-k)/(1-k)*100)} Y${Math.round((1-b-k)/(1-k)*100)} K${Math.round(k*100)}`;
        };

        const sortedColors = Object.entries(colorData).sort((a,b)=>b[1]-a[1]).map(c => ({
            hex: rgbToHex(c[0]), rgb: c[0], cmyk: rgbToCmyk(c[0])
        }));

        // 중복 제거 필터
        const uniqueFilter = (arr) => {
            const seen = new Set();
            return arr.filter(item => {
                const sig = `${item.css.backgroundColor}-${item.css.color}-${item.css.fontSize}-${item.css.fontFamily}`;
                if (seen.has(sig)) return false;
                seen.add(sig);
                return true;
            });
        };

        return {
            colorSystem: { brand: sortedColors.slice(0,4), functional: sortedColors.slice(4,8), supporting: sortedColors.slice(8,12) },
            typo,
            buttonLibrary: uniqueFilter(entryData.mainButtons || []),
            entryLibrary: uniqueFilter(entryData)
        };
    } catch (e) { if(browser) await browser.close(); throw e; }
}

module.exports = { extractDesignTokens };