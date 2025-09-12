import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

Deno.serve(async (_req) => {
  try {
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

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
      throw new Error(`DB fetch error: ${fetchError.message}`);
    }

    if (!blocks || blocks.length === 0) {
      console.log("No blocks found for this run");
      return new Response("No blocks to notify.", { status: 200 });
    }

    const notifiedBlockIds: string[] = [];

    for (const block of blocks) {
      const userEmail =
        Array.isArray(block.User) && block.User.length > 0
          ? block.User[0].email
          : undefined;
      if (!userEmail) continue;

      await resend.emails.send({
        from: "Quiet Hours <onboarding@resend.dev>",
        to: [userEmail],
        subject: `Reminder: Your block "${block.title}" is starting soon!`,
        html: `<p>Your quiet block, <strong>${block.title}</strong>, is starting in 10 minutes.</p>`,
      });

      notifiedBlockIds.push(block.id);
    }

    if (notifiedBlockIds.length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from("SilentBlock")
        .update({ notification_sent: true, status: "upcoming" })
        .in("id", notifiedBlockIds);

      if (updateError) {
        throw new Error(`DB update error: ${updateError.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        message: `Successfully notified ${notifiedBlockIds.length} blocks.`,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Function Error:", error.message);
    return new Response(error.message, { status: 500 });
  }
});
