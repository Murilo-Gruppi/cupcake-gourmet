import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AppError } from "@/lib/errors";

export function successResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 500, details?: unknown) {
  return NextResponse.json(
    { success: false, error: message, ...(details ? { details } : {}) },
    { status }
  );
}

/**
 * Handler genérico de erros para Route Handlers.
 * Converte AppError e ZodError em respostas JSON padronizadas.
 */
export function handleRouteError(error: unknown): NextResponse {
  if (error instanceof AppError) {
    return errorResponse(error.message, error.statusCode);
  }

  if (error instanceof ZodError) {
    const fields = error.flatten().fieldErrors as Record<string, string[]>;
    return errorResponse("Dados de entrada inválidos.", 422, fields);
  }

  console.error("[RouteError]", error);
  return errorResponse("Erro interno do servidor.", 500);
}
