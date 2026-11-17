import { NextRequest } from "next/server";
import { productService } from "@/modules/products/product.service";
import { successResponse, handleRouteError } from "@/lib/utils/http";

// GET /api/products?search=&categoryId=&page=&limit=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = {
      search: searchParams.get("search") ?? undefined,
      categoryId: searchParams.get("categoryId") ?? undefined,
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    };
    const result = await productService.listProducts(filters);
    return successResponse(result);
  } catch (error) {
    return handleRouteError(error);
  }
}
