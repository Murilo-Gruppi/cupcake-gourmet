import { NextRequest } from "next/server";
import { productService } from "@/modules/products/product.service";
import { successResponse, handleRouteError } from "@/lib/utils/http";

// GET /api/products/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const product = await productService.getActiveProductById(params.id);
    return successResponse(product);
  } catch (error) {
    return handleRouteError(error);
  }
}
