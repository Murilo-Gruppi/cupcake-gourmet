import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed do banco de dados...");

  // Categorias
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: "Clássicos" },
      update: {},
      create: {
        name: "Clássicos",
        description: "Sabores tradicionais e atemporais",
      },
    }),
    prisma.category.upsert({
      where: { name: "Especiais" },
      update: {},
      create: {
        name: "Especiais",
        description: "Criações exclusivas com ingredientes premium",
      },
    }),
    prisma.category.upsert({
      where: { name: "Veganos" },
      update: {},
      create: {
        name: "Veganos",
        description: "Sem ingredientes de origem animal",
      },
    }),
    prisma.category.upsert({
      where: { name: "Sem Glúten" },
      update: {},
      create: {
        name: "Sem Glúten",
        description: "Opções para intolerantes ao glúten",
      },
    }),
  ]);

  console.log(`✅ ${categories.length} categorias criadas`);

  const [classicos, especiais, veganos, semGluten] = categories;

  // Produtos
  const products = await Promise.all([
    // Clássicos
    prisma.product.upsert({
      where: { id: "prod_chocolate_classico" },
      update: {},
      create: {
        id: "prod_chocolate_classico",
        name: "Chocolate Belga",
        description:
          "Cupcake de chocolate belga com cobertura de ganache e raspas de chocolate amargo. Um clássico irresistível para os amantes de chocolate.",
        price: 12.9,
        imageUrl:
          "https://images.unsplash.com/photo-1587668178277-295251f900ce?w=400",
        categoryId: classicos.id,
        active: true,
      },
    }),
    prisma.product.upsert({
      where: { id: "prod_baunilha_classico" },
      update: {},
      create: {
        id: "prod_baunilha_classico",
        name: "Baunilha com Morango",
        description:
          "Massa fofinha de baunilha com recheio de morango fresco e cobertura de chantilly artesanal. Leveza e sabor em cada mordida.",
        price: 11.9,
        imageUrl:
          "https://images.unsplash.com/photo-1562440499-64c9a111f713?w=400",
        categoryId: classicos.id,
        active: true,
      },
    }),
    prisma.product.upsert({
      where: { id: "prod_red_velvet" },
      update: {},
      create: {
        id: "prod_red_velvet",
        name: "Red Velvet",
        description:
          "O famoso red velvet em formato cupcake, com cobertura de cream cheese suave e levemente adocicado. Elegante e delicioso.",
        price: 13.9,
        imageUrl:
          "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400",
        categoryId: classicos.id,
        active: true,
      },
    }),

    // Especiais
    prisma.product.upsert({
      where: { id: "prod_salted_caramel" },
      update: {},
      create: {
        id: "prod_salted_caramel",
        name: "Salted Caramel",
        description:
          "Massa de caramelo com recheio de doce de leite artesanal e cobertura de buttercream de caramelo salgado com flor de sal.",
        price: 15.9,
        imageUrl:
          "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400",
        categoryId: especiais.id,
        active: true,
      },
    }),
    prisma.product.upsert({
      where: { id: "prod_pistache" },
      update: {},
      create: {
        id: "prod_pistache",
        name: "Pistache Premium",
        description:
          "Cupcake de pistache iraniano com recheio de creme de pistache e cobertura de ganache branca com pistaches triturados.",
        price: 18.9,
        imageUrl:
          "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400",
        categoryId: especiais.id,
        active: true,
      },
    }),
    prisma.product.upsert({
      where: { id: "prod_maracuja_maracuya" },
      update: {},
      create: {
        id: "prod_maracuja_maracuya",
        name: "Maracujá Tropical",
        description:
          "Massa levinha com calda de maracujá fresco e cobertura de merengue suíço caramelizado. Uma explosão tropical.",
        price: 14.9,
        imageUrl:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",
        categoryId: especiais.id,
        active: true,
      },
    }),

    // Veganos
    prisma.product.upsert({
      where: { id: "prod_vegano_chocolate" },
      update: {},
      create: {
        id: "prod_vegano_chocolate",
        name: "Chocolate Vegano",
        description:
          "Cupcake vegano de chocolate amargo com leite de amêndoas, cobertura de ganache vegana e decoração de flores comestíveis.",
        price: 14.9,
        imageUrl:
          "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400",
        categoryId: veganos.id,
        active: true,
      },
    }),
    prisma.product.upsert({
      where: { id: "prod_vegano_limao" },
      update: {},
      create: {
        id: "prod_vegano_limao",
        name: "Limão Siciliano Vegano",
        description:
          "Massa vegana perfumada com limão siciliano orgânico, cobertura de creme de castanha de caju e raspas de limão.",
        price: 13.9,
        imageUrl:
          "https://images.unsplash.com/photo-1552691562-80eb4f9d6e78?w=400",
        categoryId: veganos.id,
        active: true,
      },
    }),

    // Sem Glúten
    prisma.product.upsert({
      where: { id: "prod_sg_amendoa" },
      update: {},
      create: {
        id: "prod_sg_amendoa",
        name: "Amêndoa Sem Glúten",
        description:
          "Feito com farinha de amêndoas, recheio de creme de avelã e cobertura de ganache ao leite. Sem glúten, cheio de sabor.",
        price: 16.9,
        imageUrl:
          "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=400",
        categoryId: semGluten.id,
        active: true,
      },
    }),
    prisma.product.upsert({
      where: { id: "prod_sg_coco" },
      update: {},
      create: {
        id: "prod_sg_coco",
        name: "Coco com Abacaxi Sem Glúten",
        description:
          "Massa de farinha de coco com recheio de abacaxi caramelizado e cobertura de chantilly de coco fresco.",
        price: 15.9,
        imageUrl:
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400",
        categoryId: semGluten.id,
        active: true,
      },
    }),
  ]);

  console.log(`✅ ${products.length} produtos criados`);

  // Usuário admin
  const adminPasswordHash = await hash("Admin@123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@cupcakegourmet.com" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@cupcakegourmet.com",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });

  console.log(`✅ Usuário admin criado: ${admin.email}`);

  // Usuário cliente de teste
  const customerPasswordHash = await hash("Cliente@123456", 12);
  const customer = await prisma.user.upsert({
    where: { email: "cliente@exemplo.com" },
    update: {},
    create: {
      name: "Cliente Teste",
      email: "cliente@exemplo.com",
      passwordHash: customerPasswordHash,
      role: "CUSTOMER",
    },
  });

  console.log(`✅ Usuário cliente criado: ${customer.email}`);

  console.log("\n🎉 Seed concluído com sucesso!");
  console.log("\n📋 Credenciais de acesso:");
  console.log("   Admin: admin@cupcakegourmet.com / Admin@123456");
  console.log("   Cliente: cliente@exemplo.com / Cliente@123456");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
