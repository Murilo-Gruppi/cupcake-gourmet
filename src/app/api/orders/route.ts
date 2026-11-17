import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { orderService } from "@/modules/orders/order.service";
import { successResponse, handleRouteError, errorResponse } from "@/lib/utils/http";

// POST /api/orders
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse("Não autorizado.", 401);

    const body = await req.json();
    const order = await orderService.createOrder(session.user.id, body);
    return successResponse(order, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}

// GET /api/orders
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse("Não autorizado.", 401);

    const orders = await orderService.listUserOrders(session.user.id);
    return successResponse(orders);
  } catch (error) {
    return handleRouteError(error);
  }
}
