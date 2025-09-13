import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { blockData, userId } = body;

    if (
      !blockData?.title ||
      !blockData?.startsAt ||
      !blockData?.endsAt ||
      !userId
    ) {
      return new Response(
        JSON.stringify({ error: "Missing required block fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const newSilentBlock = await prisma.silentBlock.create({
      data: {
        title: blockData.title,
        description: blockData.description ?? "",
        startsAt: new Date(blockData.startsAt),
        endsAt: new Date(blockData.endsAt),
        user: {
          connect: { id: userId },
        },
      },
    });

    return new Response(JSON.stringify(newSilentBlock), {
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
