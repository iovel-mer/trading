"use server";

import { apiFetcher } from "@/app/api/utils/api-fetcher";
import { Country } from "@/app/api/types/countries";

export const getCountries = async () => {
  return apiFetcher<Country[]>(
    `api/Countries`,
    {
      method: "GET",
      fallbackErrorMessages: {
        404: "Countries not found",
        500: "Countries service temporarily unavailable",
      },
    }
  );
}; 