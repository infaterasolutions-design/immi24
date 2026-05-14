import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ subscribed: false });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "", 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  try {
    const { data, error } = await supabase
      .from('subscribers')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (error) {
      console.error('Subscription check error:', error);
      return NextResponse.json({ subscribed: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ subscribed: !!data });
  } catch (error) {
    console.error('Subscription API error:', error);
    return NextResponse.json({ subscribed: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
