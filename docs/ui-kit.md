# Fresh UI Kit (숫자 포스터 + 화면 무대 방향)

채용 제출용 포트폴리오에 쓰는 CSS 키트입니다. 처음에는 토스식 모바일 서비스 화면(넓은 여백, 둥근 카드, 메쉬 배경)을 본떴고, 2026년 9월에 **운영 콘솔** 방향을 거쳐, 같은 달 **숫자 포스터 + 화면 무대** 방향으로 바꿨습니다. 성과 숫자가 가장 먼저 읽히고, 실제로 만든 화면이 그다음에 보이도록 합니다.

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

- `fresh-nav`: 종이색 고정 내비게이션, 아래 2px 먹색 선
- `fresh-card`: 흰 바탕, 회색 1px 테두리 카드. 그림자 없음
- `fresh-list-item`: 같은 규칙의 작은 행 · 칩
- `fresh-button`: 먹색 주 CTA(누르면 주홍)
- `fresh-button-soft`: 먹색 2px 테두리 보조 버튼
- `fresh-stage`: 어두운 무대. 안쪽 글자 · 선 변수를 뒤집습니다(프로젝트 섹션)
- `fresh-paper`: 무대 안에 다시 밝은 판을 둘 때 변수를 되돌립니다(데모)
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

- 바탕은 종이색(`--fresh-bg`), 글자는 먹색(`--fresh-ink`), 강조색은 주홍 하나(`--fresh-accent`)입니다. 작은 글자 · 링크에는 대비가 충분한 `--fresh-accent-strong`을 씁니다.
- 의미 색은 초록 하나(운영 중 상태)입니다. `--fresh-blue*` 등 나머지 색은 가져온 서비스 데모 화면(`components/demos`) 전용입니다.
- 한국어 글꼴은 본문 · 제목 모두 Noto Sans KR(가변 400~900, Google Fonts가 글자 조각 단위로 보냄) 하나입니다. 큰 제목(`h1` · 섹션 `h2` · 프로젝트 이름)은 900 굵기, 좁은 자간으로 크게 씁니다. 문장 끝 마침표만 주홍으로 뗄 수 있습니다.
- 성과는 큰 모노 숫자(`--font-mono`)로 먼저 보여 줍니다. 전후 비교는 이전 값에 주홍 취소선을 긋습니다. 숫자가 없는 성과는 제목을 크게 쓰고 숫자를 지어내지 않습니다. `--font-mono`에는 한국어 글꼴이 뒤에 있어서, 기간처럼 숫자와 한글이 섞이면 한글은 본문 글꼴로 나옵니다.
- 구획은 2px 먹색 선(`--fresh-rule`)으로 시작하고, 안쪽은 1px 연한 선으로 나눕니다. 카드 안에 카드를 넣지 않습니다.
- 실제 화면 캡처만 기울여(±1.5~4deg) 그림자와 함께 올립니다. 기울임은 호버 때 풀리고, 모션은 CSS만 쓰며 `prefers-reduced-motion`을 따릅니다.
- 반지름은 8px(판 · 캡처)과 6px(작은 요소) 두 단계, 버튼 · 칩 · 아바타만 원형입니다.
- 누르는 요소는 44px 이상입니다. 호버 모양은 마우스 기기(`hover: hover`)에서만 주고, 스크롤 이동도 `prefers-reduced-motion`을 따릅니다. 필터 같은 선택 상태는 채운 버튼 대신 주홍 밑줄로 보여 주고, 채운 먹색은 주 CTA에만 씁니다.
- 아이콘은 최소로 씁니다. 글자만으로 뜻이 통하는 곳(버튼 · 목록 · 라벨)에는 아이콘을 붙이지 않고, 방향 화살표(→)처럼 동작을 알리는 기호만 남깁니다.
- 섹션 번호 · 영어 대문자 라벨을 쓰지 않고, 한국어 제목(`h2`)이 섹션을 이끕니다.
- 포트폴리오에서는 기술 과시보다 내용 신뢰도가 먼저 보이게 합니다.
