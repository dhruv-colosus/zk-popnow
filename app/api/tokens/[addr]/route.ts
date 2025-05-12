import { NextResponse } from "next/server";
import prisma from "../../../../prisma/db";

export async function GET(
  request: Request,
  { params }: { params: { addr: string } }
) {
  try {
    const event = await prisma.event.findFirst({
      where: {
        mintAddress: params.addr,
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Token not found" }, { status: 404 });
    }

    return NextResponse.json({
      name: event.name,
      symbol: event.name.slice(0, 4).toUpperCase(),
      uri: event.imageUrl,
      decimals: 0,
      supply: event.totalSupply,
      mint: event.mintAddress,
    });
  } catch (error) {
    console.error("Error fetching token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
