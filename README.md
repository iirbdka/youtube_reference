# RefTube 🎬

> 크리에이터와 기획자를 위한 유튜브 레퍼런스 검색 서비스

고성과 유튜브 영상을 발굴하고 분석하는 도구입니다. 바이럴 콘텐츠를 찾고, 효율 지표를 추적하고, 나만의 레퍼런스 컬렉션을 만들어보세요.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)

## 주요 기능

### 🔍 고급 검색 및 필터링
- **영상 길이** 필터 (짧음/중간/긴 영상)
- **정렬** 옵션 (관련성, 날짜, 조회수, 평점)
- **업로드 날짜** 필터 (1시간/오늘/이번 주/이번 달/올해)
- **라이선스** 필터 (전체/Creative Commons)

### 📊 성과 분석 지표
- **효율 지표**: 조회수 / 구독자수 × 100%
- **Insight 뱃지**: 효율 300% 이상 영상 자동 하이라이트
- 조회수 & 구독자수 비교 분석

### 🌍 다국어 검색 지원
- 🇰🇷 한국어
- 🇺🇸 영어  
- 🇯🇵 일본어

### 🏷️ 태그 인사이트
- 검색 결과에서 인기 태그 자동 추출
- 태그 클릭으로 바로 검색

### 📚 개인 컬렉션
- 영상을 컬렉션에 저장
- 커스텀 메모 추가 기능
- 로컬 스토리지 기반 (로그인 불필요)

### ⚡ 성능 최적화
- 세션 스토리지 캐싱
- 배치 API 요청
- API 쿼터 사용 최소화

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS + Shadcn/UI |
| 상태관리 | React Context |
| API | YouTube Data API v3 |
| 아이콘 | Lucide React |

## 시작하기

### 요구사항

- Node.js 18+
- YouTube Data API v3 키

### YouTube API 키 발급 방법

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성
3. **YouTube Data API v3** 활성화
4. 사용자 인증 정보 → API 키 생성
5. (권장) 키를 YouTube Data API로만 제한

### 설치

```bash
# 저장소 클론
git clone https://github.com/iirbdka/youtube_reference.git
cd youtube_reference

# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
```

`.env.local` 수정:
```
YOUTUBE_API_KEY=발급받은_API_키_입력
```

### 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 접속

### 프로덕션 빌드

```bash
npm run build
npm start
```

## 프로젝트 구조

```
src/
├── app/
│   ├── layout.tsx              # 루트 레이아웃 (Provider 포함)
│   ├── page.tsx                # 메인 검색 페이지
│   ├── collection/page.tsx     # 저장된 레퍼런스 페이지
│   └── api/youtube/            # API 라우트
│       ├── search/route.ts
│       ├── videos/route.ts
│       └── channels/route.ts
├── components/
│   ├── search/                 # SearchBar, FilterSidebar
│   ├── video/                  # VideoCard, EfficiencyBadge
│   ├── tags/                   # TagCloud
│   └── ui/                     # Shadcn UI 컴포넌트
├── contexts/
│   ├── SearchContext.tsx       # 검색 상태 관리
│   └── CollectionContext.tsx   # 컬렉션 + localStorage
├── lib/
│   ├── youtube.ts              # YouTube API 헬퍼
│   └── utils.ts                # 유틸리티 함수
└── types/
    └── index.ts                # TypeScript 인터페이스
```

## API 쿼터 관리

YouTube API는 일일 할당량이 있습니다 (기본: 10,000 유닛/일):

| API 호출 | 비용 | 최적화 전략 |
|----------|------|------------|
| `search.list` | 100 | 세션 스토리지 캐싱 |
| `videos.list` | 1/영상 | 배치 요청 (최대 50개) |
| `channels.list` | 1/채널 | 배치 요청 + 중복 제거 |

## 환경 변수

| 변수명 | 필수 | 설명 |
|--------|------|------|
| `YOUTUBE_API_KEY` | Yes | YouTube Data API v3 키 |

## 로드맵

- [ ] 번역 API 연동 (글로벌 검색)
- [ ] 컬렉션 내보내기 (CSV/JSON)
- [ ] 공유 가능한 컬렉션 링크
- [ ] 분석 대시보드
- [ ] 다크/라이트 테마 토글

## 라이선스

MIT License

## 만든 사람

Next.js와 YouTube Data API로 ❤️ 를 담아 개발했습니다
