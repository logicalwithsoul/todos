import "react-native-url-polyfill/auto";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Supabase 설정 - 실제 프로젝트에서는 환경변수로 관리해야 합니다
const supabaseUrl = "https://abzmeoeossurcgaqssla.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiem1lb2Vvc3N1cmNnYXFzc2xhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzMDU5OTMsImV4cCI6MjA2Nzg4MTk5M30.r--UMEiilRQM7ooBSKOZ30E6lKue7JMi68VRsaYmN04";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// 데이터베이스 테이블 생성 SQL (Supabase에서 실행해야 함)
/*
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
*/
