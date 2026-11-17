import { NextRequest } from "next/server";
import type { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { orderService } from "@/modules/orders/order.service";
import { successResponse, handleRouteError, errorResponse } from "@/lib/utils/http";

function requireAdmin(session: Session | null) {
  if (!session?.user) return errorResponse("Não autorizado.", 401);
  if (session.user.role !== "ADMIN") return errorResponse("Acesso negado.", 403);
  return null;
}

// GET /api/admin/orders
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const denied = requireAdmin(session);
    if (denied) return denied;

    const { searchParams } = new URL(req.url);
    const filters = {
      status: searchParams.get("status") ?? undefined,
      page: searchParams.get("page") ? Number(searchParams.get("page")) : undefined,
      limit: searchParams.get("limit") ? Number(searchParams.get("limit")) : undefined,
    };
    const result = await orderService.listAllOrders(filters);
    return successResponse(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
