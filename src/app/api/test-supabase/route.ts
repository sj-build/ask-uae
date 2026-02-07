import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    return NextResponse.json({
      success: false,
      error: 'Missing env vars',
      hasUrl: !!url,
      hasKey: !!key,
    })
  }

  try {
    const supabase = createClient(url, key, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data, error } = await supabase
      .from('askme_sessions')
      .insert({
        question: 'API 테스트 ' + new Date().toISOString(),
        answer: '연결 테스트 성공',
        model: 'test',
        locale: 'ko',
      })
      .select()

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
      })
    }

    return NextResponse.json({
      success: true,
      data,
    })
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
    })
  }
}
