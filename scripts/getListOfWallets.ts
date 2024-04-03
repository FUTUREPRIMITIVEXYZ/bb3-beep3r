import { PrismaClient } from "@prisma/client";
import wallets from "./wallets.json";
const fs = require("fs");

const prisma = new PrismaClient();

async function main() {
  const usersWithoutWallets = await prisma.user.findMany({
    where: {
      hasClaimedAirdrop: true,
    },
  });

  const brandNewList = wallets.filter((w) =>
    usersWithoutWallets.some((u) => u.wallet === w)
  );

  fs.writeFile("./wallets1.json", JSON.stringify(brandNewList), (err: any) => {
    if (err) {
      console.error(err);
    }
  });
}

main();
