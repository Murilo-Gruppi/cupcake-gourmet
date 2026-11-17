import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { productService } from "@/modules/products/product.service";
import { successResponse, handleRouteError, errorResponse } from "@/lib/utils/http";

function requireAdmin(session: Awaited<ReturnType<typeof auth>>) {
  if (!session?.user) return errorResponse("Não autorizado.", 401);
  if (session.user.role !== "ADMIN") return errorResponse("Acesso negado.", 403);
  return null;
}

// PATCH /api/admin/products/:id
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const denied = requireAdmin(session);
    if (denied) return denied;

    const body = await req.json();
    const product = await productService.updateProduct(params.id, body);
    return successResponse(product);
  } catch (error) {
    return handleRouteError(error);
  }
}

// DELETE /api/admin/products/:id — desativa o produto (RN11)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    const denied = requireAdmin(session);
    if (denied) return denied;

    await productService.deactivateProduct(params.id);
    return successResponse({ message: "Produto desativado com sucesso." });
  } catch (error) {
    return handleRouteError(error);
  }
}
