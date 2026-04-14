
# 🎨 벤치마킹 디자인 시스템 리포트
> **대상 사이트:** https://carrotjunior.kr/home
> **추출 일시:** 2026. 4. 13. PM 7:06:54

## 🌈 메인 컬러 팔레트 (추출된 빈도순)
| 순위 | 시각화 | RGB 값 | HEX 값 |
| :--- | :---: | :--- | :--- |
| Color 1 | ![#000000](https://placehold.jp/000000/ffffff/50x20.png?text=%20) | rgba(0, 0, 0, 0) | `#000000` |
| Color 2 | ![#111111](https://placehold.jp/111111/ffffff/50x20.png?text=%20) | rgb(17, 17, 17) | `#111111` |
| Color 3 | ![#6D7076](https://placehold.jp/6D7076/ffffff/50x20.png?text=%20) | rgb(109, 112, 118) | `#6D7076` |
| Color 4 | ![#1D1D1F](https://placehold.jp/1D1D1F/ffffff/50x20.png?text=%20) | rgb(29, 29, 31) | `#1D1D1F` |
| Color 5 | ![#F4F5F6](https://placehold.jp/F4F5F6/ffffff/50x20.png?text=%20) | rgb(244, 245, 246) | `#F4F5F6` |
| Color 6 | ![#FFFAE2](https://placehold.jp/FFFAE2/ffffff/50x20.png?text=%20) | rgb(255, 250, 226) | `#FFFAE2` |
| Color 7 | ![#FFFFFF](https://placehold.jp/FFFFFF/ffffff/50x20.png?text=%20) | rgb(255, 255, 255) | `#FFFFFF` |
| Color 8 | ![#FF6714](https://placehold.jp/FF6714/ffffff/50x20.png?text=%20) | rgb(255, 103, 20) | `#FF6714` |

## 📝 타이포그래피 정보
- **기본 폰트:** `Pretendard, "Malgun Gothic", 맑은고딕, sans-serif`
- **제목(H1) 크기:** ``
- **제목 글자색:** `#FFFFFF`

## 💻 개발자용 CSS 변수 (추천)
```css
:root {
  --primary-bg: rgba(0, 0, 0, 0);
  --main-accent: #000000;
  --sub-accent: #111111;
  --base-font: Pretendard, "Malgun Gothic", 맑은고딕, sans-serif;
}
```

## 🚀 Tailwind CSS 설정 예시
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        'bench-primary': '#000000',
        'bench-secondary': '#111111',
      }
    }
  }
}
```
