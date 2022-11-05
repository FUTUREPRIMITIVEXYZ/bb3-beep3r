import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { tokenId } = req.query;
  res.status(200).json({
    description:
      "The BB3 BEEP3R (ETHSF Edition) is a retro-refurbished device from the EARTH ARCHIVE. Its purpose is to aid in interdimensional communication on the blockchain. Use this device to send messages to other BEEP3R device owners. Use with great care!",
    image: "https://beeper.bb3.xyz/beeper-image.gif",
    name: `BB3 - BEEP3R #${tokenId} (ETHSF Edition)`,
    attributes: [
      {
        trait_type: "FREQUENCY",
        value: "250GHz",
      },
      {
        trait_type: "INVENTOR",
        value: "KANAPAT T",
      },
      {
        trait_type: "VERSION",
        value: "ETHSF",
      },
      {
        trait_type: "TYPE",
        value: "BROADCAST",
      },
      {
        trait_type: "VARIATION",
        value: "SPATIAL BLUE",
      },
    ],
    background_color: "006EAC",
    animation_url: `https://beeper.bb3.xyz/animation/${tokenId}`,
    external_url: `https://beeper.bb3.xyz/token/${tokenId}`,
  });
}
