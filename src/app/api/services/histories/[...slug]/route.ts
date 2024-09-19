import { getHistories } from "@/utils/firebase/history";
import { NextResponse } from "next/server";

interface Params {
  slug: string[];
}

export async function GET(req: Request, { params }: { params: Params }) {
  if (params.slug.length !== 2) {
    return NextResponse.json({ status: 402, message: "Invalid URL" });
  }

  const service = params.slug[0];
  const email = params.slug[1];

  try {
    const histories = await getHistories(email, service);
    return NextResponse.json({ status: 200, histories });
  } catch (error) {
    return NextResponse.json({ status: 400, message: "Something went wrong" });
  }
}
