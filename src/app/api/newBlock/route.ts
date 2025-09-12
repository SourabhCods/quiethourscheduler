import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { blockData, userId } = body;

    const newSilentBlock = await prisma.silentBlock.create({
      data: {
        title: blockData.title,
        description: blockData.description,
        startsAt: new Date(blockData.startsAt),
        endsAt: new Date(blockData.endsAt),
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

    console.log(newSilentBlock);
    return new Response("successful", {
      status: 200,
      statusText: "Block Created",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected exception";
    return new Response(message, { status: 500 });
  }
}
