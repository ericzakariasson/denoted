import axios from "axios";

const handler = async (req, res) => {
  if (!req.query?.currency) {
    return res
      .status(500)
      .json({ text: "INVALID_PARAMS", message: "missing currency" });
  }

  try {
    const result = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${req.query.currency}&vs_currencies=usd`
    );

    return res.status(200).send(result.data.ethereum.usd);
  } catch (e) {
    res.status(500).json({ text: "ERROR", message: e.message });
  }
};

export default handler;
