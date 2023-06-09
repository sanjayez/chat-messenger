const express = require("express");
const router = express.Router();

const StreamChat = require("stream-chat").StreamChat;
const streamChat = StreamChat.getInstance(
  process.env.STREAM_API_KEY,
  process.env.STREAM_PRIVATE_API_KEY
);

const TOKEN_USER_ID_MAP = new Map();

router.post("/signup", async (req, res) => {
  const { id, name, image } = req.body;
  if (id == null || id === "" || name == null || name === "") {
    return res.status(400).send("Check user fields.");
  }

  const exisitingUsers = await streamChat.queryUsers({ id });
  if (exisitingUsers.users.length > 0) {
    return res.status(400).send("User ID already taken.");
  }

  const user = await streamChat.upsertUser({ id, name, image });
  res.status(201).json(user);
});

router.post("/login", async (req, res) => {
  const { id } = req.body;
  if (id == null || id === "") {
    return res.status(400).send();
  }

  const {
    users: [user],
  } = await streamChat.queryUsers({ id });
  if (user == null) return res.status(401).send();

  const token = streamChat.createToken(id);
  TOKEN_USER_ID_MAP.set(token, user.id);

  res.status(200).json({
    token,
    user: { name: user.name, id: user.id, image: user.image },
  });
});

router.post("/logout", async (req, res) => {
  const token = req.body.token;
  if (token == null || token === "") {
    return res.status(400).send();
  }

  const id = TOKEN_USER_ID_MAP.get(token);
  if (id == null) {
    return res.status(400).send();
  }

  const user = await streamChat.revokeUserToken(id, new Date());
  TOKEN_USER_ID_MAP.delete(token);

  res.status(200).json(user);
});

module.exports = router;
