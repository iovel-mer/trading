import { cookies } from "next/headers";

export const getAccessToken = async () => {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) return undefined;

  return accessToken;
};
