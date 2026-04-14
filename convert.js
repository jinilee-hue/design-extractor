const fs = require('fs');

function rgbToHex(rgb) {
    if (!rgb || rgb === 'transparent') return "#FFFFFF";
    const result = rgb.match(/\d+/g);
    if (!result || result.length < 3) return "#FFFFFF";
    const hex = result.slice(0, 3).map(x => {
        const h = parseInt(x).toString(16);
        return h.length === 1 ? "0" + h : h;
    }).join("").toUpperCase();
    return `#${hex}`;
}

function generateMarkdown(data, url) {
    // 컬러 팔레트에 실제 색상 이미지 칩 추가
    const paletteRows = data.palette.map((color, index) => {
        const hex = rgbToHex(color);
        const colorChip = `![${hex}](https://placehold.jp/${hex.replace('#','')}/ffffff/50x20.png?text=%20)`;
        return `| Color ${index + 1} | ${colorChip} | ${color} | \`${hex}\` |`;
    }).join('\n');

    return `
# 🎨 벤치마킹 디자인 시스템 리포트
> **대상 사이트:** ${url}
> **추출 일시:** ${new Date().toLocaleString()}

## 🌈 메인 컬러 팔레트 (추출된 빈도순)
| 순위 | 시각화 | RGB 값 | HEX 값 |
| :--- | :---: | :--- | :--- |
${paletteRows}

## 📝 타이포그래피 정보
- **기본 폰트:** \`${data.global.fontFamily}\`
- **제목(H1) 크기:** \`${data.typography.h1.fontSize}\`
- **제목 글자색:** \`${rgbToHex(data.typography.h1.color)}\`

## 💻 개발자용 CSS 변수 (추천)
\`\`\`css
:root {
  --primary-bg: ${data.global.backgroundColor};
  --main-accent: ${rgbToHex(data.palette[0])};
  --sub-accent: ${rgbToHex(data.palette[1] || data.palette[0])};
  --base-font: ${data.global.fontFamily};
}
\`\`\`

## 🚀 Tailwind CSS 설정 예시
\`\`\`javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'bench-primary': '${rgbToHex(data.palette[0])}',
        'bench-secondary': '${rgbToHex(data.palette[1] || data.palette[0])}',
      }
    }
  }
}
\`\`\`
`;
}

function saveFiles(data, url) {
    const domain = new URL(url).hostname.replace('www.', '');
    const mdContent = generateMarkdown(data, url);
    fs.writeFileSync(`${domain}.md`, mdContent);
    return { mdPath: `${domain}.md`, data };
}

module.exports = { saveFiles };