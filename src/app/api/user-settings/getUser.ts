import { apiFetcher } from "@/app/api/utils/api-fetcher";

export const getUser = async () => {
  const response = await apiFetcher(
    "identity/api/clients/get-client-by-token",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response;
};
