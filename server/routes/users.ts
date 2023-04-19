import { FastifyInstance } from "fastify";
import { StreamChat } from "stream-chat";

const streamChat = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_PRIVATE_API_KEY!
);

export async function userRoutes(app: FastifyInstance) {
  app.post<{ Body: { id: string; name: string; image: String } }>(
    "/signup",
    async (req, res) => {
      const { id, name, image } = req.body;
      if (id == null || id === "" || name == null || name === "") {
        return res.status(400).send();
      }

      const exisitingUsers = await streamChat.queryUsers({ id });
      if (exisitingUsers.users.length > 0) {
        return res.status(400).send("User ID already taken.");
      }

      await streamChat.upsertUser({ id, name, image });
    }
  );

  app.post<{ Body: { id: string } }>("/login", async (req, res) => {
    const { id } = req.body;
    if (id == null || id === "") {
      return res.status(400).send();
    }

    const {
      users: [user],
    } = await streamChat.queryUsers({ id });
    if (user == null) return res.status(401).send();

    const token = streamChat.createToken(id);

    return {
      token,
      user: { name: user.name, id: user.id, image: user.image },
    };
  });
}
