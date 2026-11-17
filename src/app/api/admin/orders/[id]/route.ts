import type { Session } from "next-auth";
import { auth } from "@/lib/auth";
import { orderService } from "@/modules/orders/order.service";
import { successResponse, handleRouteError, errorResponse } from "@/lib/utils/http";

function requireAdmin(session: Session | null) {
  if (!session?.user) return errorResponse("Não autorizado.", 401);
  if (session.user.role !== "ADMIN") return errorResponse("Acesso negado.", 403);
  return null;
}

// GET /api/admin/orders/:id
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const denied = requireAdmin(session);
    if (denied) return denied;

    const order = await orderService.getOrderById(params.id);
    return successResponse(order);
  } catch (error) {
    return handleRouteError(error);
  }
}
