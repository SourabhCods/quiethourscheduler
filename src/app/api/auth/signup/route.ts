import prisma from "../../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { formData, uid } = await req.json();

    const user = await prisma.user.create({
      data: {
        id: uid,
        email: formData.email,
        name: formData.username,
      },
    });

    return new Response(JSON.stringify(user), {
      status: 201,
      statusText: "User Created",
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected exception";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
