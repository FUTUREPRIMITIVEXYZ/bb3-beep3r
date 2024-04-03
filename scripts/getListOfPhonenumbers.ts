import { PrismaClient } from "@prisma/client";
import { createObjectCsvWriter } from "csv-writer";
import { createWriteStream } from "fs";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();

  const csvWriter = createObjectCsvWriter({
    path: "beepersUsers.csv",
    header: [
      { id: "id", title: "ID" },
      { id: "phone", title: "PHONE" },
      { id: "wallet", title: "WALLET" },
      { id: "code", title: "CODE" },
      { id: "verified", title: "VERIFIED" },
      { id: "hasClaimedAirdrop", title: "HASCLAIMEDAIRDROP" },
    ],
  });

  await csvWriter.writeRecords(users);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
