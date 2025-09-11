import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { formData } = body;

    // const user = await prisma.silentBlock.create({
    //   data: {
    //     title: formData.title,
    //     description: formData.description,
    //     startsAt: Date.parse(formData.startDateAndTime),
    //     endsAt: Date.parse(formData.endDateAndTime),
    //   },
    // });

    return new Response("successful", {
      status: 200,
      statusText: "User Created",
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected exception";
    return new Response(message, { status: 500 });
  }
}
