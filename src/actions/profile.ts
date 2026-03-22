"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/validations";

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Not authenticated" };
  }

  const raw = {
    name: formData.get("name") as string,
    username: formData.get("username") as string,
    bio: formData.get("bio") as string,
  };

  const result = updateProfileSchema.safeParse(raw);
  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { name, username, bio } = result.data;

  // Check username uniqueness
  if (username) {
    const existing = await db.user.findUnique({
      where: { username },
    });
    if (existing && existing.id !== session.user.id) {
      return { error: "Username is already taken" };
    }
  }

  await db.user.update({
    where: { id: session.user.id },
    data: {
      ...(name !== undefined && { name }),
      ...(username !== undefined && { username }),
      ...(bio !== undefined && { bio }),
    },
  });

  revalidatePath("/settings");
  return { success: true };
}
