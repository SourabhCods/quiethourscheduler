import prisma from "../../../../../../lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { uid: string } }
) {
  try {
    const data = await prisma.silentBlock.findMany({
      where: { userId: params.uid },
    });

    return new Response(JSON.stringify(data), {
      status: 200,
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
