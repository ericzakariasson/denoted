import { NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  try {
    const { email } = JSON.parse(req.body);

    const apiKey = process.env.MAILERLITE_API_KEY as string;

    if (!apiKey) {
      return res
        .status(500)
        .json({ success: false, message: "Invalid configuration" });
    }

    const response = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        body: JSON.stringify({ email, groups: ["82806046959076689"] }),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const json = await response.json();

    console.info("mailerlite response:", json);

    return res.status(201).json({ success: true, message: "signed up" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
};

export default handler;
