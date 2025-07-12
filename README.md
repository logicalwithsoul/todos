# Todo App

할 일을 관리하는 크로스 플랫폼 앱입니다. 웹, 안드로이드, iOS에서 동작합니다.

## 기능

- **오늘의 할 일**: 오늘 마감인 할 일들을 관리
- **백로그**: 향후 할 일들을 관리
- **상태 관리**: 예정 → 진행중 → 완료 상태 변경
- **완료된 일 숨기기**: 오늘의 할 일 섹션에서 완료된 일을 숨길 수 있음
- **마감일 설정**: 일/주/달/연/미지정 단위로 마감일 설정
- **Supabase 연동**: 모든 데이터는 Supabase에 저장

## 설치 및 설정

### 1. 의존성 설치

```bash
npm install
```

### 2. Supabase 설정

1. [Supabase](https://supabase.com)에서 새 프로젝트를 생성합니다.
2. `src/services/supabase.ts` 파일에서 다음 정보를 업데이트합니다:
   - `YOUR_SUPABASE_URL`: Supabase 프로젝트 URL
   - `YOUR_SUPABASE_ANON_KEY`: Supabase 익명 키

### 3. 데이터베이스 테이블 생성

Supabase SQL 편집기에서 다음 SQL을 실행합니다:

```sql
CREATE TABLE todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
  due_date DATE,
  due_period VARCHAR(20) CHECK (due_period IN ('day', 'week', 'month', 'year', 'unspecified')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 활성화
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽고 쓸 수 있도록 정책 설정 (실제 프로덕션에서는 더 엄격한 정책 필요)
CREATE POLICY "Allow all operations" ON todos FOR ALL USING (true) WITH CHECK (true);
```

## 실행

### 웹에서 실행

```bash
npm run web
```

### iOS에서 실행

```bash
npm run ios
```

### 안드로이드에서 실행

```bash
npm run android
```

## 사용 방법

### 할 일 추가

1. 화면 우하단의 '+' 버튼을 터치
2. 할 일 내용 입력 (최대 20글자)
3. 일정 단위 선택 (일/주/달/연/미지정)
4. 마감일 설정 (선택사항)
5. 저장 버튼 터치

### 할 일 상태 변경

- 할 일을 터치하면 '예정' ↔ '진행중' 상태가 변경됩니다
- 체크박스를 터치하면 '완료' 상태로 변경됩니다

### 완료된 일 숨기기

- '오늘의 할 일' 섹션의 스위치를 끄면 완료된 일이 숨겨집니다

## 프로젝트 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── TodoItem.tsx    # 개별 할 일 아이템
│   └── TodoSection.tsx # 할 일 섹션
├── screens/            # 화면 컴포넌트
│   ├── HomeScreen.tsx  # 메인 홈 화면
│   └── AddTodoScreen.tsx # 새 할 일 추가 화면
├── services/           # API 서비스
│   ├── supabase.ts     # Supabase 설정
│   └── todoService.ts  # 할 일 CRUD 서비스
├── types/              # TypeScript 타입 정의
│   └── index.ts
└── utils/              # 유틸리티 함수
    └── dateUtils.ts    # 날짜 관련 함수
```

## 기술 스택

- **React Native**: 크로스 플랫폼 앱 개발
- **Expo**: 개발 도구 및 배포 플랫폼
- **TypeScript**: 타입 안전성
- **Supabase**: 백엔드 데이터베이스
- **React Navigation**: 화면 네비게이션
- **@react-native-community/datetimepicker**: 날짜 선택기

## 주의사항

- 실제 프로덕션 환경에서는 Supabase RLS 정책을 더 엄격하게 설정해야 합니다
- 환경변수를 사용하여 Supabase 키를 관리하는 것을 권장합니다
- 앱 스토어 배포 시 필요한 설정들을 추가로 진행해야 합니다
