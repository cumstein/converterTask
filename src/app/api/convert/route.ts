import { NextResponse } from "next/server";
import { convertCurrency } from "@/lib/convertCurrency";

export async function POST(req: Request) {
  try {
    const { amount, from, to } = await req.json();

    if (!amount || !from || !to) {
      return NextResponse.json({ error: "اطلاعات ناقص است" }, { status: 400 });
    }

    const result = await convertCurrency(Number(amount), from, to);

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: "خطا در پردازش درخواست" }, { status: 500 });
  }
}