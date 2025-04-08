import prisma from "../utils/prisma.js";

export const createClerkUser = async (req, res) => {
  try {
    const { id, email_addresses, first_name, last_name, image_url } =
      req.body.data;
    const email = email_addresses[0]?.email_address;

    // Check if a user already exists with this email
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      console.log("User already exists:", existingUser);
      return res
        .status(200)
        .json({ message: "User already exists", data: existingUser });
    }

    // If not found, create a new user
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
      .json({ message: "User created successfully", data: newUser });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateClerkUser = async (req, res) => {
  try {
    const {
      id, // Clerk's unique user ID
      email_addresses,
      first_name,
      last_name,
      image_url,
    } = req.body.data;

    const email = email_addresses[0]?.email_address;

    // Find user in database by Clerk ID
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: id },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found in database" });
    }

    // Update the user's details
    const updatedUser = await prisma.user.update({
      where: { clerkUserId: id },
      data: {
        email,
        name: first_name ? `${first_name} ${last_name || ""}`.trim() : null,
        imageUrl: image_url,
      },
    });

    console.log("User updated:", updatedUser);
    res
      .status(200)
      .json({ message: "User updated successfully", data: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteClerkUser = async (req, res) => {
  try {
    const { id } = req.body.data; // Clerk user ID

    // Find user in database by Clerk ID
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: id },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found in database" });
    }

    // Delete user from database
    await prisma.user.delete({
      where: { clerkUserId: id },
    });

    console.log("User deleted from database:", id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getClerkUser = async (req, res) => {
  const { clerkUserId } = req.params;
  if (!clerkUserId)
    return res.status(400).json({ message: "Transaction ID is required" });

  const userData = await prisma.user.findUnique({
    where: { clerkUserId },
  });

  if (!userData) return res.status(404).json({ message: "No user found" });

  return res.status(200).json({ message: "User found", data: userData.id });
};
