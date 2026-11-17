import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { orderService } from "@/modules/orders/order.service";
import { successResponse, handleRouteError, errorResponse } from "@/lib/utils/http";

// GET /api/orders/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse("Não autorizado.", 401);

    // RN08 — cliente só acessa seus próprios pedidos
    const order = await orderService.getUserOrderById(params.id, session.user.id);
    return successResponse(order);
  } catch (error) {
    return handleRouteError(error);
  }
}
