import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Truck, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="gradient-cream py-20 md:py-32">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-6 animate-fade-in">
            <Badge variant="secondary" className="text-xs font-medium px-3 py-1">
              🧁 Artesanal com amor
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Cupcakes{" "}
              <span className="text-primary">Gourmet</span>{" "}
              para cada momento
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed max-w-lg mx-auto">
              Sabores irresistíveis, ingredientes premium e uma experiência
              única para adoçar seu dia. Encomende agora com entrega rápida.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" asChild className="rounded-full px-8">
                <Link href="/products">
                  Ver Cardápio <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="rounded-full px-8">
                <Link href="/register">Criar Conta</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Destaques */}
      <section className="py-16 container">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-3xl font-bold">Por que escolher a gente?</h2>
          <p className="text-muted-foreground">
            Qualidade e cuidado em cada detalhe
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Star className="h-8 w-8 text-primary" />,
              title: "Ingredientes Premium",
              description:
                "Usamos apenas os melhores ingredientes, selecionados com cuidado para garantir o sabor perfeito em cada mordida.",
            },
            {
              icon: <Truck className="h-8 w-8 text-primary" />,
              title: "Entrega Rápida",
              description:
                "Receba seus cupcakes fresquinhos com rapidez e segurança, embalados com carinho para chegar perfeitos.",
            },
            {
              icon: <ShieldCheck className="h-8 w-8 text-primary" />,
              title: "Compra Segura",
              description:
                "Sua compra é 100% segura. Dados protegidos e processo de pagamento simples e confiável.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center text-center p-6 rounded-xl border bg-card hover:shadow-md transition-shadow"
            >
              <div className="mb-4 p-3 rounded-full bg-primary/10">{item.icon}</div>
              <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            Pronto para se deliciar?
          </h2>
          <p className="text-primary-foreground/80 max-w-md mx-auto">
            Explore nosso cardápio com sabores clássicos, especiais, veganos
            e sem glúten. Tem algo para todo mundo!
          </p>
          <Button
            size="lg"
            variant="secondary"
            asChild
            className="rounded-full px-8"
          >
            <Link href="/products">
              Explorar Cardápio <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
