import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabase } from "@/lib/supabase";

const ADMIN_USER_ID = process.env.ADMIN_USER_ID;

function isAdmin(userId: string | null) {
    return userId && userId === ADMIN_USER_ID;
}

// GET /api/testimonials/admin — fetch all testimonials (admin only)
export async function GET(req: NextRequest) {
    const { userId } = await auth();
    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const url = new URL(req.url);
    const status = url.searchParams.get("status");

    let query = supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });

    if (status) {
        query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// PATCH /api/testimonials/admin — update testimonial status (admin only)
export async function PATCH(req: NextRequest) {
    const { userId } = await auth();
    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !["approved", "rejected", "pending"].includes(status)) {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { data, error } = await supabase
        .from("testimonials")
        .update({ status })
        .eq("id", id)
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// DELETE /api/testimonials/admin — delete testimonial (admin only)
export async function DELETE(req: NextRequest) {
    const { userId } = await auth();
    if (!isAdmin(userId)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { error } = await supabase.from("testimonials").delete().eq("id", id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
