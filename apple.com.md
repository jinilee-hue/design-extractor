
# 🎨 벤치마킹 디자인 시스템 리포트
> **대상 사이트:** https://www.apple.com
> **추출 일시:** 2026. 4. 13. PM 7:00:08

## 🌈 메인 컬러 팔레트 (추출된 빈도순)
| 순위 | 시각화 | RGB 값 | HEX 값 |
| :--- | :---: | :--- | :--- |
| Color 1 | ![#000000](https://placehold.jp/000000/ffffff/50x20.png?text=%20) | rgba(0, 0, 0, 0) | `#000000` |
| Color 2 | ![#1D1D1F](https://placehold.jp/1D1D1F/ffffff/50x20.png?text=%20) | rgb(29, 29, 31) | `#1D1D1F` |
| Color 3 | ![#333336](https://placehold.jp/333336/ffffff/50x20.png?text=%20) | rgb(51, 51, 54) | `#333336` |
| Color 4 | ![#2997FF](https://placehold.jp/2997FF/ffffff/50x20.png?text=%20) | rgb(41, 151, 255) | `#2997FF` |
| Color 5 | ![#000000](https://placehold.jp/000000/ffffff/50x20.png?text=%20) | rgb(0, 0, 0) | `#000000` |
| Color 6 | ![#000000](https://placehold.jp/000000/ffffff/50x20.png?text=%20) | rgba(0, 0, 0, 0.56) | `#000000` |
| Color 7 | ![#000000](https://placehold.jp/000000/ffffff/50x20.png?text=%20) | rgba(0, 0, 0, 0.88) | `#000000` |
| Color 8 | ![#F5F5F7](https://placehold.jp/F5F5F7/ffffff/50x20.png?text=%20) | rgb(245, 245, 247) | `#F5F5F7` |

## 📝 타이포그래피 정보
- **기본 폰트:** `"SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif`
- **제목(H1) 크기:** `34px`
- **제목 글자색:** `#1D1D1F`

## 💻 개발자용 CSS 변수 (추천)
```css
:root {
  --primary-bg: rgb(255, 255, 255);
  --main-accent: #000000;
  --sub-accent: #1D1D1F;
  --base-font: "SF Pro Text", "SF Pro Icons", "Helvetica Neue", Helvetica, Arial, sans-serif;
}
```

## 🚀 Tailwind CSS 설정 예시
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'bench-primary': '#000000',
        'bench-secondary': '#1D1D1F',
      }
    }
  }
}
```
