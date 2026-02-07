# UAE-HASHED-AGENT 구축 체크리스트

> ⚠️ 이 문서는 Hashed 내부 전용 에이전트 구축 시 반드시 따라야 할 보안 가이드라인입니다.
> 기반: AI Agent Security Guide v1.0 + Hashed 내부 정책

---

## 아키텍처 원칙

```
UAE-public-agent (공개 시장 정보)
        │
        │ ONE-WAY SYNC (읽기만)
        ▼
UAE-hashed-agent (내부 전용)
        │
        │ OUTPUT
        ▼
Slack #ai-output 또는 내부 대시보드 (VPN only)

⛔ NEVER: Hashed → Public 방향 쓰기
```

---

## Pre-Build Checklist

### 1. 인프라 격리

- [ ] 별도 GitHub repo: `hashed/uae-hashed-agent` (private)
- [ ] 별도 Vercel 프로젝트: `uae-hashed-agent`
- [ ] 별도 Supabase 프로젝트: `uae-hashed-memory`
- [ ] uae-public-memory에는 READ-ONLY 토큰만 사용
- [ ] 접근 제한: Slack 워크스페이스 내 또는 VPN only

### 2. Slack 연동

| 권한 | 허용 | 비고 |
|------|------|------|
| Bot token (xoxb-) | ✅ | 필수 사용 |
| User token (xoxp-) | ⛔ | 절대 금지 |
| channels:history (#uae-meeting) | ✅ | 명시적 채널만 |
| channels:history (#investment, #hr) | ⛔ | 민감 채널 금지 |
| im:history (DM) | ⛔ | PII 위험 |
| chat:write | ⚠️ | #ai-output 채널만 |

**구현:**
```typescript
const ALLOWED_CHANNELS = [
  'C0123UAE', // #uae-meeting
  'C0123DEALS', // #uae-deals
]

// 다른 채널 접근 시 차단
if (!ALLOWED_CHANNELS.includes(channelId)) {
  throw new Error('Channel not allowed')
}
```

### 3. Notion 연동

| 권한 | 허용 | 비고 |
|------|------|------|
| Specific page read | ✅ | 명시적 공유 페이지만 |
| Full workspace read | ⛔ | 절대 금지 |
| Write | ⚠️ | AI 생성 페이지만 |
| Delete | ⛔ | 절대 금지 |

**구현:**
```typescript
const ALLOWED_NOTION_PAGES = [
  'page-id-uae-meetings',
  'page-id-uae-contacts',
]

// Integration 생성 시 이 페이지들만 공유
```

### 4. Google Docs 연동

| Scope | 허용 | 비고 |
|-------|------|------|
| drive.file | ✅ | AI 생성 파일만 (권장) |
| drive.readonly | ⚠️ | 특정 폴더 ID로 제한 시 OK |
| drive (full) | ⛔ | 너무 광범위 |
| gmail.readonly | ⛔ | 이메일 접근 금지 |
| gmail.send | ⛔ | Prompt injection 위험 |

**구현:**
```typescript
const UAE_FOLDER_ID = 'folder-id-uae-docs'

// 이 폴더 외 접근 차단
const files = await drive.files.list({
  q: `'${UAE_FOLDER_ID}' in parents`,
})
```

### 5. Telegram 연동

| 방식 | 허용 | 비고 |
|------|------|------|
| Bot API | ✅ | 전용 봇 채널만 |
| User session (Telethon) | ⛔ | 개인 대화 접근 위험 |
| 수동 업로드 | ✅ | 가장 안전 |

**권장 방식:**
1. 미팅 후 담당자가 요약을 #uae-telegram-sync 채널에 수동 포스팅
2. 또는 Telegram Bot으로 전용 그룹에서만 수집

### 6. Output 제한

- [ ] Public API/DB 쓰기 완전 차단 (코드 레벨)
- [ ] Slack #ai-output 채널만 응답
- [ ] 또는 내부 대시보드 (hashed-uae.vercel.app, VPN only)
- [ ] 응답에 실명 자동 마스킹

**구현:**
```typescript
// Public DB 쓰기 차단
const publicSupabase = createClient(PUBLIC_URL, PUBLIC_ANON_KEY) // READ ONLY
const hashedSupabase = createClient(HASHED_URL, HASHED_SERVICE_KEY) // READ/WRITE

// 실수 방지: publicSupabase에 service key 절대 넣지 않음
```

### 7. 실명 마스킹

```typescript
const MASK_PATTERNS = [
  // Hashed 팀원
  { pattern: /홍길동/g, mask: '[팀원A]' },
  // LP/파트너
  { pattern: /김철수/g, mask: '[LP-001]' },
]

function maskSensitiveNames(text: string): string {
  let masked = text
  for (const { pattern, mask } of MASK_PATTERNS) {
    masked = masked.replace(pattern, mask)
  }
  return masked
}
```

---

## 환경변수 템플릿

```bash
# .env.local for UAE-hashed-agent

# Anthropic
ANTHROPIC_API_KEY=sk-ant-xxxxx

# Public Memory (READ ONLY - anon key만!)
UAE_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
UAE_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxx
# ⛔ NEVER add service key for public

# Hashed Memory (READ/WRITE)
SUPABASE_URL=https://yyyyy.supabase.co
SUPABASE_ANON_KEY=eyJyyyyy
SUPABASE_SERVICE_ROLE_KEY=eyJyyyyy

# Slack
SLACK_BOT_TOKEN=xoxb-xxxxx
SLACK_SIGNING_SECRET=xxxxx
SLACK_ALLOWED_CHANNELS=C0123UAE,C0123DEALS

# Notion
NOTION_TOKEN=secret_xxxxx
NOTION_ALLOWED_PAGES=page-id-1,page-id-2

# Google (OAuth)
GOOGLE_CLIENT_ID=xxxxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=xxxxx
GOOGLE_UAE_FOLDER_ID=folder-id
```

---

## 배포 전 최종 점검

```bash
# 1. 토큰 스캔
grep -r "sk-ant-\|xoxb-\|secret_" src/ --include="*.ts"
# 결과가 있으면 ⛔ STOP

# 2. Public DB 쓰기 코드 검색
grep -r "publicSupabase.*insert\|publicSupabase.*update\|publicSupabase.*upsert" src/
# 결과가 있으면 ⛔ STOP

# 3. 민감 채널 접근 코드 검색
grep -r "investment\|hr\|salary\|termsheet" src/
# 결과가 있으면 검토 필요
```

---

## 참고 문서

- AI Agent Security Guide v1.0
- `/Users/sjbaek/.claude/rules/security.md`
- Hashed 내부 보안 정책

---

*Last updated: 2026-02-07*
