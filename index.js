const express = require("express");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(bodyParser.json());

const send_notification = async (title, content, res) => {
  try {
    const message = {
      notification: {
        title: title,
        body: content,
      },
      topic: "topic",
    };

    const response = await admin.messaging().send(message);
    res.status(200).send(`Successfully sent message: ${response}`);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).send("Error sending notification");
  }
};

app.get("/", (req, res) => {
  send_notification("NodeJS Notification", "Hello from NodeJS", res);
});

app.post("/send-notification", (req, res) => {
  const { title, content } = req.body;
  send_notification(title || "Default Title", content || "Default Content", res);
});

app.listen(3000, () => {
  console.log("Listening on http://localhost:3000");
});