import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { cartService } from "@/modules/cart/cart.service";
import { successResponse, handleRouteError, errorResponse } from "@/lib/utils/http";

// PATCH /api/cart/items/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse("Não autorizado.", 401);

    const body = await req.json();
    const cart = await cartService.updateItem(session.user.id, params.id, body);
    return successResponse(cart);
  } catch (error) {
    return handleRouteError(error);
  }
}

// DELETE /api/cart/items/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return errorResponse("Não autorizado.", 401);

    const cart = await cartService.removeItem(session.user.id, params.id);
    return successResponse(cart);
  } catch (error) {
    return handleRouteError(error);
  }
}
