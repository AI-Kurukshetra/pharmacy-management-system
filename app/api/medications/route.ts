import { NextRequest } from "next/server";
import { handleDomainRequest } from "@/app/api/_shared";

export async function GET(request: NextRequest) {
  return handleDomainRequest("medications", request, []);
}

export async function POST(request: NextRequest) {
  return handleDomainRequest("medications", request, []);
}

export async function PATCH(request: NextRequest) {
  return handleDomainRequest("medications", request, []);
}

export async function DELETE(request: NextRequest) {
  return handleDomainRequest("medications", request, []);
}
