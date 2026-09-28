# Fresh UI Kit (운영 콘솔 방향)

채용 제출용 포트폴리오에 쓰는 CSS 키트입니다. 처음에는 토스식 모바일 서비스 화면(넓은 여백, 둥근 카드, 메쉬 배경)을 본떴고, 2026년 9월에 **운영 콘솔** 방향으로 바꿨습니다. 운영 시스템을 만드는 개발자라는 점이 화면 문법에서도 보이도록, 관리 화면에서 쓰는 요소만 남겼습니다.

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

- `fresh-nav`: 반투명 고정 내비게이션(떠 있는 요소라 그림자를 씁니다)
- `fresh-card`: 흰 바탕, 회색 1px 테두리 카드. 그림자 없음
- `fresh-list-item`: 같은 규칙의 작은 행 · 칩
- `fresh-button`: 단색 파랑 주 CTA
- `fresh-button-soft`: 옅은 파랑 보조 버튼
- `fresh-cta-panel`: 연락 섹션용 패널(테두리만)

## 사용 예시

```html
<section>
  <h2 class="section-title">기술 스택</h2>
  <dl class="fresh-card rounded-lg divide-y">
    <div class="grid md:grid-cols-[10rem_1fr]">
      <dt>백엔드</dt>
      <dd>Java, Spring Boot, MyBatis</dd>
    </div>
  </dl>
  <a class="fresh-button" href="/resume.pdf">이력서</a>
</section>
```

## 적용 기준

- 정보가 먼저 읽히고 효과는 쓰지 않습니다. 메쉬 · 오로라 · 글로우 · 그라데이션 버튼은 없앴습니다.
- 반지름은 8px(카드 · 패널)과 6px(작은 요소) 두 단계입니다. 버튼 · 칩 · 아바타만 원형입니다.
- 그림자는 떠 있는 요소(내비게이션 · 모달)에만 씁니다. 카드는 테두리로 구분합니다.
- 여러 항목은 카드 격자보다 행 목록 · 정의 목록(1px 구분선)으로 보여 줍니다. 카드 안에 카드를 넣지 않습니다.
- 파란색은 링크 · 주 CTA · 활성 상태에만 씁니다. 의미 색은 초록 하나(운영 중 상태)입니다.
- 섹션 번호 · 영어 대문자 라벨을 쓰지 않고, 한국어 제목(`h2`)이 섹션을 이끕니다.
- 숫자 · 기간은 `--font-mono`로, 제목은 본문과 같은 한국어 산세리프로 씁니다.
- 포트폴리오에서는 기술 과시보다 내용 신뢰도가 먼저 보이게 합니다.
