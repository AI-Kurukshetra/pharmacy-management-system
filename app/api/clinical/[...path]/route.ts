import { NextRequest } from "next/server";
import { handleDomainRequest } from "@/app/api/_shared";

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const p = await params;
  return handleDomainRequest("clinical", request, p.path);
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const p = await params;
  return handleDomainRequest("clinical", request, p.path);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const p = await params;
  return handleDomainRequest("clinical", request, p.path);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const p = await params;
  return handleDomainRequest("clinical", request, p.path);
}
