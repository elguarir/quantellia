import { parseWebPage } from "@/lib/helpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
   const { url } = await request.json();
   try {
      let result = await parseWebPage(new URL(url));

      return NextResponse.json({ result });
   } catch (error) {
      if (error instanceof Error)
         return NextResponse.json({ error: error.message }, { status: 500 });
   }
}
