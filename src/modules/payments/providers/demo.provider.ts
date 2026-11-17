/**
 * Provedor de pagamento demonstrativo.
 *
 * Simula o fluxo de pagamento sem integração real.
 * Em produção, substituir por um gateway real (Stripe, Pagar.me, etc.)
 * mantendo a mesma interface.
 */

export interface PaymentRequest {
  orderId: string;
  amount: number;
  method: string;
}

export interface PaymentResult {
  externalReference: string;
  status: "PAID" | "FAILED" | "PROCESSING";
  provider: string;
}

export const demoProvider = {
  name: "demo",

  async processPayment(request: PaymentRequest): Promise<PaymentResult> {
    // Simula latência de processamento
    await new Promise((resolve) => setTimeout(resolve, 100));

    // No modo demo, todos os pagamentos são aprovados
    return {
      externalReference: `DEMO-${request.orderId}-${Date.now()}`,
      status: "PAID",
      provider: "demo",
    };
  },
};
