import prisma from "../../../../../lib/prisma";
import client from "../../../../../lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    // Supabase signup
    const supRes = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: name,
        },
      },
    });
    console.log(supRes);
    console.log(supRes.data.user?.user_metadata);
    // Mirror entry in Prisma User table
    const user = await prisma.user.create({
      data: {
        id: supRes.data.user?.id ?? "",
        email: email,
        name: name,
      },
    });

    return new Response("successful", {
      status: 200,
      statusText: "User Created",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected exception";
    return new Response(message, { status: 500 });
  }
}
