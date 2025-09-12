import prisma from "../../../../../../lib/prisma";

export async function GET(params: any) {
  const data = await prisma.silentBlock.findMany({
    where: {
      userId: params.uid,
    },
  });

  return new Response(JSON.stringify(data), { status: 200 });
}
