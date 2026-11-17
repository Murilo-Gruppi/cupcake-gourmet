import { NextRequest } from "next/server";
import { authService } from "@/modules/auth/auth.service";
import { successResponse, handleRouteError } from "@/lib/utils/http";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await authService.register(body);
    return successResponse(user, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
