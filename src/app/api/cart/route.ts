import { auth } from "@/lib/auth";
import { cartService } from "@/modules/cart/cart.service";
import { successResponse, handleRouteError, errorResponse } from "@/lib/utils/http";

// GET /api/cart
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse("Não autorizado.", 401);

    const cart = await cartService.getCart(session.user.id);
    return successResponse(cart);
  } catch (error) {
    return handleRouteError(error);
  }
}
