import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { orderService } from "@/modules/orders/order.service";
import { successResponse, handleRouteError, errorResponse } from "@/lib/utils/http";

function requireAdmin(session: Awaited<ReturnType<typeof auth>>) {
  if (!session?.user) return errorResponse("Não autorizado.", 401);
  if (session.user.role !== "ADMIN") return errorResponse("Acesso negado.", 403);
  return null;
}

// PATCH /api/admin/orders/:id/status
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const denied = requireAdmin(session);
    if (denied) return denied;

    const body = await req.json();
    const order = await orderService.updateOrderStatus(params.id, body);
    return successResponse(order);
  } catch (error) {
    return handleRouteError(error);
  }
}
