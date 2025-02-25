import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const clerkUser = async (req, res) => {
  try {
    const { id, email_addresses, first_name, last_name, image_url } =
      req.body.data;
    const email = email_addresses[0]?.email_address;

    const newUser = await prisma.user.create({
      data: {
        clerkUserId: id,
        email,
        name: first_name ? `${first_name} ${last_name || ""}`.trim() : null,
        imageUrl: image_url,
      },
    });

    console.log("User created: ", newUser);
    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    console.error("Error saving user :", error),
      res.status(500).json({ error: "Internal server error" });
  }
};
