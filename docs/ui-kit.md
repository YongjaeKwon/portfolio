# Fresh UI Kit

채용 제출용 포트폴리오에 적용한 밝고 청량한 UI 키트입니다. 토스식 모바일 서비스 화면에서 느껴지는 넓은 여백, 강한 정보 위계, 파란 CTA, 둥근 카드, 부드러운 메쉬 배경을 재사용 가능한 CSS 단위로 정리했습니다.

## 가져가는 방법

다른 프로젝트에서 아래 폴더를 복사합니다.

```text
src/ui-kit/
  tokens.css
  effects.css
  README.md
```

전역 CSS에서 import 합니다.

```css
@import "./ui-kit/tokens.css";
@import "./ui-kit/effects.css";
```

경로는 프로젝트 구조에 맞게 바꾸면 됩니다.

## 주요 클래스

- `fresh-shell`: 밝은 페이지 배경과 기본 텍스트 톤
- `fresh-nav`: 반투명 고정 내비게이션
- `fresh-card`: 흰색 글래스 카드
- `fresh-list-item`: 모바일 앱 리스트형 카드
- `fresh-button`: 파란 메인 CTA
- `fresh-button-soft`: 옅은 파란 보조 버튼
- `fresh-mesh`: 히어로용 부드러운 메쉬 배경
- `fresh-orb-card`: 말랑한 그라디언트 카드
- `fresh-phone`: 모바일 화면 같은 큰 패널
- `fresh-cta-panel`: 연락/마무리 섹션용 강조 패널
- `fresh-aurora`: CTA 패널 안에서 쓰는 오로라 글로우

## 사용 예시

```html
<section class="fresh-shell">
  <div class="fresh-mesh">
    <h1>서비스형 포트폴리오</h1>
    <a class="fresh-button" href="/resume.pdf">이력서 보기</a>
  </div>

  <article class="fresh-card">
    <h2>프로젝트</h2>
    <p>업무 흐름과 데이터 기준을 함께 맞춘 경험입니다.</p>
  </article>
</section>
```

## 적용 기준

- 정보가 먼저 읽히고 효과는 뒤에서 받쳐야 합니다.
- 카드 반경은 크게 쓰되, 카드 안에 또 카드가 중첩되지 않게 합니다.
- 파란색은 CTA와 활성 상태 중심으로 사용합니다.
- 메쉬/오로라 효과는 히어로와 마지막 CTA처럼 한두 군데만 사용합니다.
- 포트폴리오에서는 기술 과시보다 내용 신뢰도가 먼저 보이게 합니다.

