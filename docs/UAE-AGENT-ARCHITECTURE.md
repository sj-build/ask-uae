# UAE Agent Architecture & Data Structure

> 대화 요약 (2026-02-07)

---

## 1. 두 개의 에이전트 아키텍처

```
┌─────────────────────────────────────────────────────────────────┐
│                        UAE AGENT SYSTEM                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────┐         ┌──────────────────────┐
│  UAE-PUBLIC-AGENT    │         │  UAE-HASHED-AGENT    │
│  (공개 시장 정보)      │         │  (내부 전용)          │
├──────────────────────┤         ├──────────────────────┤
│ • askuae.vercel.app  │         │ • hashed-uae (VPN)   │
│ • 공개 뉴스/산업정보   │   ───▶  │ • Slack 미팅 요약     │
│ • 일반 Q&A           │  읽기만  │ • Notion 내부 문서    │
│                      │         │ • Google Docs        │
│                      │   ⛔    │ • Telegram 미팅      │
│                      │  ◀───   │                      │
│                      │  쓰기금지 │                      │
└──────────────────────┘         └──────────────────────┘
         │                                │
         ▼                                ▼
┌──────────────────────┐         ┌──────────────────────┐
│ uae-public-memory    │         │ uae-hashed-memory    │
│ (Supabase)           │         │ (별도 Supabase)       │
│                      │         │                      │
│ • 공개 뉴스          │         │ • 내부 미팅 기록      │
│ • Ask Me Q&A 로그    │         │ • 딜 메모            │
│ • 대시보드 콘텐츠     │         │ • 파트너 정보        │
└──────────────────────┘         └──────────────────────┘
```

### 핵심 원칙: ONE-WAY SYNC

| 방향 | 허용 |
|------|------|
| Public → Hashed (읽기) | ✅ OK |
| Hashed → Public (쓰기) | ⛔ NEVER |

---

## 2. 현재 구현 상태 (UAE-PUBLIC-AGENT)

### 웹사이트 ↔ 데이터 연결

```
┌─────────────────────────────────────────────────────────────────┐
│                    askuae.vercel.app                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐           │
│  │ Ask Me Hero │   │ 뉴스 섹션    │   │ 산업지도     │           │
│  │ (AI 질문)   │   │ (실시간)    │   │ (정적 데이터) │           │
│  └──────┬──────┘   └──────┬──────┘   └──────┬──────┘           │
│         │                 │                 │                   │
└─────────┼─────────────────┼─────────────────┼───────────────────┘
          │                 │                 │
          ▼                 ▼                 ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ /api/search     │  │ /api/news       │  │ src/data/       │
│                 │  │                 │  │ industry/       │
│ • Claude API    │  │ • Google RSS    │  │ sectors.ts      │
│ • 질문 → 답변    │  │ • Naver API     │  │                 │
│ • Supabase 저장 │  │                 │  │ (정적 TS 파일)   │
└────────┬────────┘  └────────┬────────┘  └─────────────────┘
         │                    │
         ▼                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    uae-public-memory (Supabase)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  askme_sessions          news_articles         documents        │
│  ┌─────────────┐         ┌─────────────┐      ┌─────────────┐  │
│  │ question    │         │ title       │      │ content     │  │
│  │ answer      │         │ url         │      │ source      │  │
│  │ model       │         │ publisher   │      │ category    │  │
│  │ locale      │         │ category    │      │ tags        │  │
│  │ created_at  │         │ published_at│      │ metadata    │  │
│  └─────────────┘         └─────────────┘      └─────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 데이터 흐름

1. **Ask Me 질문**
   ```
   사용자 질문 → /api/search → Claude API → 답변 생성
                                          ↓
                                  askme_sessions 테이블에 저장
   ```

2. **뉴스 크롤링**
   ```
   Vercel Cron (매일 9AM) → /api/memory/sync-news
                                    ↓
                           Google/Naver RSS 크롤링
                                    ↓
                           news_articles 테이블에 저장
   ```

3. **산업/정치/경제 데이터**
   ```
   src/data/industry/sectors.ts (정적 TypeScript)
         ↓
   SectorCard 컴포넌트에서 직접 import
   ```

---

## 3. Supabase 테이블 구조

### askme_sessions (Q&A 로그)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| question | text | 사용자 질문 |
| answer | text | Claude 답변 |
| sources_used | jsonb | 참조한 문서 |
| model | text | 사용 모델 |
| rating | int | 1-5 평점 |
| locale | text | ko/en |
| created_at | timestamptz | 생성 시간 |

### news_articles (뉴스)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| title | text | 제목 |
| url | text | 원문 링크 |
| publisher | text | 언론사 |
| source | text | google/naver |
| category | text | politics/economy 등 |
| published_at | timestamptz | 발행일 |

### documents (통합 콘텐츠)
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | uuid | PK |
| content | text | 본문 |
| source | text | news/dashboard/askme/manual |
| category | text | 분류 |
| tags | text[] | 태그 배열 |
| metadata | jsonb | 추가 정보 |

---

## 4. UAE-HASHED-AGENT (미래 구축)

### 연동 서비스 & 권한

| 서비스 | 허용 권한 | 금지 권한 |
|--------|----------|----------|
| **Slack** | xoxb- (Bot), #uae-meeting | xoxp- (User), #investment, DM |
| **Notion** | 명시적 공유 페이지 | Full workspace, Delete |
| **Google** | drive.file (AI 생성만) | gmail, full drive |
| **Telegram** | Bot API 전용 채널 | User session |

### 출력 제한
- Public DB 쓰기 완전 차단
- Slack #ai-output 채널만 응답
- 실명 자동 마스킹

### 환경 분리
```
UAE-PUBLIC                    UAE-HASHED
────────────────────────────────────────────
github.com/sj-build/...       github.com/hashed/... (private)
askuae.vercel.app             hashed-uae.vercel.app (VPN)
uae-public-memory             uae-hashed-memory
Supabase anon key only        Supabase service key
```

---

## 5. 관련 파일

| 파일 | 설명 |
|------|------|
| `supabase/schema.sql` | DB 스키마 |
| `src/lib/supabase.ts` | Supabase 클라이언트 |
| `src/app/api/search/route.ts` | Ask Me API |
| `src/app/api/memory/sync-news/route.ts` | 뉴스 동기화 |
| `docs/UAE-HASHED-AGENT-CHECKLIST.md` | Hashed 에이전트 체크리스트 |

---

*Last updated: 2026-02-07*
