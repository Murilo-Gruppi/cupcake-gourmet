import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { cartService } from "@/modules/cart/cart.service";
import { successResponse, handleRouteError, errorResponse } from "@/lib/utils/http";

// POST /api/cart/items
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse("Não autorizado.", 401);

    const body = await req.json();
    const cart = await cartService.addItem(session.user.id, body);
    return successResponse(cart, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
