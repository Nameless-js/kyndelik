import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

// Uses service role key to bypass RLS — server-side only
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { userId, role } = await req.json();

    if (!userId || !role) {
      return NextResponse.json({ error: "userId and role are required" }, { status: 400 });
    }

    const VALID_ROLES = ["student", "mentor", "admin"];
    if (!VALID_ROLES.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Upsert profile with new role using admin client (bypasses RLS)
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ role })
      .eq("id", userId);

    if (error) {
      // If update failed (no existing row), try upsert
      const { error: upsertError } = await supabaseAdmin
        .from("profiles")
        .upsert({ id: userId, role, name: "", grade: "", interests: [], goals: "" });

      if (upsertError) {
        return NextResponse.json({ error: upsertError.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, role });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Unknown error" }, { status: 500 });
  }
}
