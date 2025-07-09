"use server";

import { deleteSession } from "@/app/api/utils/session";

export const postLogout = async () => {
  await deleteSession();
  return { success: true, message: "Logged out successfully" };
};
