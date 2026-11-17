import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { productService } from "@/modules/products/product.service";
import { successResponse, handleRouteError, errorResponse } from "@/lib/utils/http";

function requireAdmin(session: Awaited<ReturnType<typeof auth>>) {
  if (!session?.user) return errorResponse("Não autorizado.", 401);
  if (session.user.role !== "ADMIN") return errorResponse("Acesso negado.", 403);
  return null;
}

// GET /api/admin/products
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const denied = requireAdmin(session);
    if (denied) return denied;

    const { searchParams } = new URL(req.url);
    const filters = {
      search: searchParams.get("search") ?? undefined,
      categoryId: searchParams.get("categoryId") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    };
    const result = await productService.listProductsAdmin(filters);
    return successResponse(result);
  } catch (error) {
    return handleRouteError(error);
  }
}

// POST /api/admin/products
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const denied = requireAdmin(session);
    if (denied) return denied;

    const body = await req.json();
    const product = await productService.createProduct(body);
    return successResponse(product, 201);
  } catch (error) {
    return handleRouteError(error);
  }
}
