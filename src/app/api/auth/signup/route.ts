import prisma from "../../../../../lib/prisma";
import client from "../../../../../lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { formData, uid } = body;
    const user = await prisma.user.create({
      data: {
        id: uid,
        email: formData.email,
        name: formData.username,
      },
    });

    console.log(user);

    return new Response("successful", {
      status: 200,
      statusText: "User Created",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected exception";
    return new Response(message, { status: 500 });
  }
}
