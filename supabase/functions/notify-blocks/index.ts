import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!RESEND_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("Missing required environment variables.");
}

const resend = new Resend(RESEND_API_KEY);
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

Deno.serve(async () => {
  try {
    const now = new Date();
    const tenMinutesLater = new Date(now.getTime() + 10 * 60 * 1000);

    const { data: blocks, error: fetchError } = await supabaseAdmin
      .from("SilentBlock")
      .select(
        `
        id,
        title,
        startsAt,
        notification_sent,
        User (
          email
        )
      `
      )
      .eq("notification_sent", false)
      .gte("startsAt", now.toISOString())
      .lte("startsAt", tenMinutesLater.toISOString());

    if (fetchError) {
      return new Response("Database fetch error", { status: 500 });
    }

    if (!blocks || blocks.length === 0) {
      return new Response("No blocks to notify.", { status: 200 });
    }

    const notifiedBlockIds: string[] = [];
    const failedBlocks: { id: string; error: string }[] = [];

    for (const block of blocks) {
      try {
        const userEmail =
          Array.isArray(block.User) && block.User.length > 0
            ? block.User[0].email
            : undefined;
        if (!userEmail) continue;

        await resend.emails.send({
          from: "Quiet Hours <onboarding@resend.dev>",
          to: [userEmail],
          subject: `Reminder: Your block "${block.title}" starts soon!`,
          html: `<p>Your quiet block, <strong>${block.title}</strong>, starts in 10 minutes.</p>`,
        });

        notifiedBlockIds.push(block.id);
      } catch (emailError: any) {
        failedBlocks.push({ id: block.id, error: emailError.message });
      }
    }

    if (notifiedBlockIds.length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from("SilentBlock")
        .update({ notification_sent: true, status: "upcoming" })
        .in("id", notifiedBlockIds);

      if (updateError) {
        return new Response("Failed to update block status", { status: 500 });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        notified: notifiedBlockIds.length,
        failed: failedBlocks,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch {
    return new Response("Internal server error", { status: 500 });
  }
});
