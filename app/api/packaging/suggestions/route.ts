import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js";

console.log('DEBUG: THIS IS THE ABSOLUTE FINAL TEST - IF YOU SEE THIS, THE FILE IS UPDATED');

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const jwt = authHeader?.replace("Bearer ", "");
    console.log("JWT received:", jwt);

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: { headers: { Authorization: `Bearer ${jwt}` } }
      }
    );

    const body = await request.json();
    const {
      productId,
      optimalSize,
      material,
      ecoScore,
      costSavings,
      co2Reduction,
      alternatives,
      confidence,
    } = body;

    // Insert packaging suggestion into database
    const { data, error } = await supabase
      .from("packaging_suggestions")
      .insert([
        {
          product_id: productId,
          optimal_length: optimalSize.length,
          optimal_width: optimalSize.width,
          optimal_height: optimalSize.height,
          material: material,
          eco_score: ecoScore,
          cost_estimate: costSavings,
          co2_reduction: co2Reduction,
          packaging_efficiency: confidence,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating packaging suggestion:", error);
      return NextResponse.json(
        { success: false, error: "Failed to create packaging suggestion" },
        { status: 500 }
      );
    }

    // --- Analytics update logic ---
    // Get user_id from JWT if possible
    let userId = null;
    if (jwt) {
      try {
        const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64').toString());
        userId = payload.sub;
      } catch (e) {
        console.error('Failed to parse JWT for analytics:', e);
      }
    }
    if (userId) {
      // WARNING: Do NOT use now.getDate() here! Always use 1 for the first day and 0 for the last day of the month.
      const now = new Date();
      const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
      const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
      console.log('DEBUG: now', now.toISOString(), 'periodStart', periodStart, 'periodEnd', periodEnd);
      // Upsert analytics for packaging_efficiency, co2_saved, cost_savings (increment values)
      const upsertAnalytics = async (metric_type: string, metric_value: number) => {
        // Fetch current value
        const { data: existing, error: fetchErr } = await supabase
          .from('analytics')
          .select('metric_value')
          .eq('user_id', userId)
          .eq('metric_type', metric_type)
          .eq('period_start', periodStart)
          .single();
        let newValue = metric_value;
        if (existing && existing.metric_value != null) {
          newValue += existing.metric_value;
        }
        await supabase.from('analytics').upsert([
          {
            user_id: userId,
            metric_type,
            metric_value: newValue,
            period_start: periodStart,
            period_end: periodEnd,
          },
        ], { onConflict: 'user_id,metric_type,period_start,period_end' });
      };
      await upsertAnalytics('packaging_efficiency', confidence);
      await upsertAnalytics('co2_saved', co2Reduction);
      await upsertAnalytics('cost_savings', costSavings);
    }
    // --- End analytics update logic ---

    return NextResponse.json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Packaging suggestion error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create packaging suggestion" },
      { status: 500 }
    );
  }
} 