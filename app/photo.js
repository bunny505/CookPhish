import formidable from "formidable";
import fs from "fs";

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const form = formidable();

  form.parse(req, async (err, fields, files) => {
    try {
      const BOT_TOKEN = process.env.BOT_TOKEN;
      const CHAT_ID = process.env.CHAT_ID;

      const photo = files.photo[0];

      const formData = new FormData();
      formData.append("chat_id", CHAT_ID);
      formData.append("caption", "📸 Camera Test Photo");
      formData.append("photo", fs.createReadStream(photo.filepath));

      const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;

      await fetch(url, {
        method: "POST",
        body: formData
      });

      res.json({ ok: true });
    } catch (e) {
      res.status(500).json({ error: "Upload failed" });
    }
  });
}