import { paymentRepository } from "./payment.repository";
import { demoProvider } from "./providers/demo.provider";
import type { PaymentStatus } from "@prisma/client";

const PROVIDERS: Record<string, typeof demoProvider> = {
  demo: demoProvider,
};

export const paymentService = {
  async processPayment(orderId: string, amount: number, method: string) {
    // RN12 — a confirmação não pode vir apenas do navegador.
    // O processamento é sempre feito pelo servidor.
    const provider = PROVIDERS[method] ?? PROVIDERS["demo"];

    const result = await provider.processPayment({
      orderId,
      amount,
      method,
    });

    const payment = await paymentRepository.create({
      orderId,
      provider: result.provider,
      externalReference: result.externalReference,
      amount,
      status: result.status as PaymentStatus,
    });

    return { payment, result };
  },
};
