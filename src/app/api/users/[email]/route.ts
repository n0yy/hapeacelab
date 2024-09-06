import { getUser } from "@/lib/services/firebase/users";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  const email = params.email;

  const user = await getUser(email);

  if (!user) {
    return NextResponse.json({ success: false });
  } else {
    return NextResponse.json({ success: true, user });
  }
}
