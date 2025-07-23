"use client"
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ChevronLeft, Search, ChevronDown } from "lucide-react"
import { postRegistration } from "../../api/auth/postRegistration"
import { getCountries } from "@/app/api/countries/getCountries"
import { getLanguages } from "@/app/api/languages/getLanguages"
import type { Country } from "@/app/api/types/countries"
import type { Language } from "@/app/api/types/languages"
import { useLocale, useTranslations } from "next-intl"

export default function RegisterPage() {
  const t = useTranslations()
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    phoneNumber: "",
    telephone: "",
    country: "",
    language: "",
    dateOfBirth: "", // This will store DD/MM/YYYY string
    source: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [countries, setCountries] = useState<Country[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [userCountryCode, setUserCountryCode] = useState<string | null>(null)
  const [countrySearch, setCountrySearch] = useState("")
  const [languageSearch, setLanguageSearch] = useState("")
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const locale = useLocale()

  const detectUserCountry = async () => {
    try {
      const response = await fetch("https://ipapi.co/json/")
      if (response.ok) {
        const data = await response.json()
        if (data.country_code) {
          setUserCountryCode(data.country_code.toUpperCase())
          return data.country_code.toUpperCase()
        }
      }
    } catch (error) {}
    try {
      const response = await fetch("https://api.country.is/")
      if (response.ok) {
        const data = await response.json()
        if (data.country) {
          setUserCountryCode(data.country.toUpperCase())
          return data.country.toUpperCase()
        }
      }
    } catch (error) {}
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      const countryFromTimezone = getCountryFromTimezone(timezone)
      if (countryFromTimezone) {
        setUserCountryCode(countryFromTimezone)
        return countryFromTimezone
      }
    } catch (error) {}
    return null
  }

  const getCountryFromTimezone = (timezone: string): string | null => {
    const timezoneToCountry: { [key: string]: string } = {
      "America/New_York": "US",
      "America/Los_Angeles": "US",
      "America/Chicago": "US",
      "America/Denver": "US",
      "Europe/London": "GB",
      "Europe/Paris": "FR",
      "Europe/Berlin": "DE",
      "Europe/Rome": "IT",
      "Europe/Madrid": "ES",
      "Asia/Tokyo": "JP",
      "Asia/Shanghai": "CN",
      "Asia/Kolkata": "IN",
      "Asia/Dubai": "AE",
      "Australia/Sydney": "AU",
      "America/Toronto": "CA",
      "America/Sao_Paulo": "BR",
      "Europe/Moscow": "RU",
      "Africa/Cairo": "EG",
      "Asia/Seoul": "KR",
      "Europe/Amsterdam": "NL",
      "Europe/Zurich": "CH",
      "Asia/Singapore": "SG",
      "Asia/Hong_Kong": "HK",
      "Europe/Stockholm": "SE",
      "Europe/Oslo": "NO",
      "Europe/Copenhagen": "DK",
      "Europe/Helsinki": "FI",
      "Europe/Warsaw": "PL",
      "Europe/Prague": "CZ",
      "Europe/Vienna": "AT",
      "Europe/Brussels": "BE",
      "Europe/Dublin": "IE",
      "Europe/Lisbon": "PT",
      "Europe/Athens": "GR",
      "Europe/Budapest": "HU",
      "Europe/Bucharest": "RO",
      "Europe/Sofia": "BG",
      "Europe/Zagreb": "HR",
      "Asia/Bangkok": "TH",
      "Asia/Jakarta": "ID",
      "Asia/Manila": "PH",
      "Asia/Kuala_Lumpur": "MY",
      "Pacific/Auckland": "NZ",
      "America/Mexico_City": "MX",
      "America/Argentina/Buenos_Aires": "AR",
      "America/Lima": "PE",
      "America/Bogota": "CO",
      "America/Santiago": "CL",
      "Africa/Johannesburg": "ZA",
      "Africa/Lagos": "NG",
      "Africa/Nairobi": "KE",
      "Asia/Riyadh": "SA",
      "Asia/Tehran": "IR",
      "Asia/Karachi": "PK",
      "Asia/Dhaka": "BD",
      "Asia/Tashkent": "UZ",
      "Asia/Almaty": "KZ",
    }
    return timezoneToCountry[timezone] || null
  }

  const getSortedCountries = () => {
    if (!userCountryCode || countries.length === 0) {
      return countries
    }
    const userCountry = countries.find((country) => country.code === userCountryCode)
    const otherCountries = countries.filter((country) => country.code !== userCountryCode)
    if (userCountry) {
      return [userCountry, ...otherCountries]
    }
    return countries
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      setFormData((prev) => ({
        ...prev,
        source: window.location.origin as string,
      }))
    }
    const fetchData = async () => {
      try {
        const [countriesResponse, languagesData] = await Promise.all([getCountries(), getLanguages()])
        if (countriesResponse.success && countriesResponse.data) {
          setCountries(countriesResponse.data)
          const detectedCountry = await detectUserCountry()
          if (detectedCountry) {
            const foundCountry = countriesResponse.data.find((country) => country.code === detectedCountry)
            if (foundCountry) {
              setFormData((prev) => ({
                ...prev,
                country: foundCountry.code,
              }))
            }
          }
        }

        // Reorder languages: English first, then German, then others
        const englishLanguage = languagesData.find(
          (lang) => lang.code === "en" || lang.name.toLowerCase() === "english",
        )
        const germanLanguage = languagesData.find((lang) => lang.code === "de" || lang.name.toLowerCase() === "german")

        let sortedLanguages: Language[] = []
        const otherLanguages = languagesData.filter(
          (lang) =>
            !(
              lang.code === "en" ||
              lang.name.toLowerCase() === "english" ||
              lang.code === "de" ||
              lang.name.toLowerCase() === "german"
            ),
        )

        if (englishLanguage) {
          sortedLanguages.push(englishLanguage)
        }
        if (germanLanguage) {
          sortedLanguages.push(germanLanguage)
        }
        sortedLanguages = [...sortedLanguages, ...otherLanguages]

        setLanguages(sortedLanguages)

        // Set default language to English if available, otherwise the first in the sorted list
        if (englishLanguage) {
          setFormData((prev) => ({
            ...prev,
            language: englishLanguage.code,
          }))
        } else if (sortedLanguages.length > 0) {
          setFormData((prev) => ({
            ...prev,
            language: sortedLanguages[0].code,
          }))
        }
      } catch (error) {
        console.error("Error fetching countries or languages:", error)
      }
    }
    fetchData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? null : value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const dateOfBirthForApi = formData.dateOfBirth

    const payload = {
      ...formData,
      dateOfBirth: dateOfBirthForApi,
    }

    const response = await postRegistration(payload)
    if (response.errors) {
      setError(response.message ?? "An unknown error occurred")
      setIsLoading(false)
      return
    }
    router.push("/login?registered=true")
    setIsLoading(false)
  }

  const filteredCountries = getSortedCountries().filter(
    (country) =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.code.toLowerCase().includes(countrySearch.toLowerCase()),
  )

  const filteredLanguages = languages.filter(
    (language) =>
      language.name.toLowerCase().includes(languageSearch.toLowerCase()) ||
      language.code.toLowerCase().includes(languageSearch.toLowerCase()),
  )

  const handleCountrySelect = (countryCode: string) => {
    setFormData((prev) => ({ ...prev, country: countryCode }))
    setCountrySearch("")
    setShowCountryDropdown(false)
  }

  const handleLanguageSelect = (languageCode: string) => {
    setFormData((prev) => ({ ...prev, language: languageCode }))
    setLanguageSearch("")
    setShowLanguageDropdown(false)
  }

  const selectedCountry = countries.find((c) => c.code === formData.country)
  const selectedLanguage = languages.find((l) => l.code === formData.language)

  return (
    <div className="min-h-screen flex bg-[#1b1f7b]">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link
            href={`/${locale}/`}
            className="inline-flex items-center text-sm text-gray-400 hover:text-white mb-8 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {t("register.backToHome")}
          </Link>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">{t("register.title")}</h1>
            <p className="text-gray-400">{t("register.subtitle")}</p>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                  {t("register.firstName")}
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-800 disabled:cursor-not-allowed bg-[#1b1f7b] placeholder-gray-500"
                  placeholder={t("register.firstNamePlaceholder")}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                  {t("register.lastName")}
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-800 disabled:cursor-not-allowed bg-[#1b1f7b] placeholder-gray-500"
                  placeholder={t("register.lastNamePlaceholder")}
                />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                {t("register.email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-800 disabled:cursor-not-allowed bg-[#1b1f7b] placeholder-gray-500"
                placeholder={t("register.emailPlaceholder")}
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1">
                {t("register.username")}
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-800 disabled:cursor-not-allowed bg-[#1b1f7b] placeholder-gray-500"
                placeholder={t("register.usernamePlaceholder")}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                {t("register.password")}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-800 disabled:cursor-not-allowed bg-[#1b1f7b] placeholder-gray-500"
                placeholder={t("register.passwordPlaceholder")}
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-1">
                {t("register.phoneNumber")}
              </label>
              <input
                type="tel"
                id="telephone"
                name="telephone"
                value={formData.telephone}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-800 disabled:cursor-not-allowed bg-[#1b1f7b] placeholder-gray-500"
                placeholder={t("register.phoneNumberPlaceholder")}
              />
            </div>
            <div className="relative">
              <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-1">
                {t("register.country")}
              </label>
              <div className="relative">
                <div
                  className="w-full px-3 py-2 border border-gray-400 text-white rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent disabled:bg-gray-800 disabled:cursor-not-allowed bg-[#1b1f7b] cursor-pointer flex items-center justify-between"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                >
                  <span className={selectedCountry ? "text-white" : "text-gray-500"}>
                    {selectedCountry ? (
                      <span className="flex items-center">
                        {selectedCountry.name}
                        {selectedCountry.code === userCountryCode && (
                          <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                            {t("register.yourLocation")}
                          </span>
                        )}
                      </span>
                    ) : (
                      t("register.selectCountry")
                    )}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${showCountryDropdown ? "rotate-180" : ""}`}
                  />
                </div>
                {showCountryDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-[#1b1f7b] border border-gray-400 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    <div className="p-2 border-b border-gray-400">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder={t("register.searchCountries")}
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 bg-[#1b1f7b] border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country) => (
                          <div
                            key={country.code}
                            onClick={() => handleCountrySelect(country.code)}
                            className={`px-3 py-2 hover:bg-gray-700 cursor-pointer text-white flex items-center justify-between ${
                              country.code === userCountryCode ? "bg-blue-500/10" : ""
                            }`}
                          >
                            <span>{country.name}</span>
                            {country.code === userCountryCode && (
                              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                                {t("register.yourLocation")}
                              </span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-400">{t("register.noCountriesFound")}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="relative">
              <label htmlFor="language" className="block text-sm font-medium text-gray-300 mb-1">
                {t("register.language")}
              </label>
              <div className="relative">
                <div
                  className="w-full px-3 py-2 border border-gray-400 text-white rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent disabled:bg-gray-800 disabled:cursor-not-allowed bg-[#1b1f7b] cursor-pointer flex items-center justify-between"
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                >
                  <span className={selectedLanguage ? "text-white" : "text-gray-500"}>
                    {selectedLanguage ? selectedLanguage.name : t("register.selectLanguage")}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-gray-400 transition-transform ${showLanguageDropdown ? "rotate-180" : ""}`}
                  />
                </div>
                {showLanguageDropdown && (
                  <div className="absolute z-10 w-full mt-1 bg-[#1b1f7b] border border-gray-400 rounded-lg shadow-lg max-h-60 overflow-hidden">
                    <div className="p-2 border-b border-gray-400">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder={t("register.searchLanguages")}
                          value={languageSearch}
                          onChange={(e) => setLanguageSearch(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 bg-[#1b1f7b] border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                        />
                      </div>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {filteredLanguages.length > 0 ? (
                        filteredLanguages.map((language) => (
                          <div
                            key={language.code}
                            onClick={() => handleLanguageSelect(language.code)}
                            className="px-3 py-2 hover:bg-gray-700 cursor-pointer text-white"
                          >
                            {language.name}
                          </div>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-gray-400">{t("register.noLanguagesFound")}</div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-300 mb-1">
                {t("register.dateOfBirth")}
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                value={formData.dateOfBirth || ""}
                onChange={handleInputChange}
                required
                disabled={isLoading}
                className="w-full px-3 py-2 border border-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-800 disabled:cursor-not-allowed bg-[#1b1f7b] placeholder-gray-500"
                placeholder="YYYY-MM-DD"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r mt-3 cursor-pointer from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t("register.creatingAccount")}
                </div>
              ) : (
                t("register.createAccount")
              )}
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              {t("register.alreadyHaveAccount")}{" "}
              <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                {t("register.signIn")}
              </Link>
            </p>
          </div>
        </div>
      </div>
      {/* Right side - Background */}
      <div className="hidden lg:block relative flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black to-black" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative h-full flex items-center justify-center p-12">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold text-white mb-6">{t("register.rightSide.title")}</h2>
            <div className="space-y-4 text-gray-400">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <p>{t("register.rightSide.feature1")}</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <p>{t("register.rightSide.feature2")}</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <p>{t("register.rightSide.feature3")}</p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                </div>
                <p>{t("register.rightSide.feature4")}</p>
              </div>
            </div>
            <div className="mt-10 pt-10 border-t border-gray-400">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="text-gray-400">{t("register.rightSide.totalVolume")}</p>
                  <p className="text-2xl font-bold text-white">{t("register.rightSide.totalVolumeValue")}</p>
                </div>
                <div>
                  <p className="text-gray-400">{t("register.rightSide.activeTraders")}</p>
                  <p className="text-2xl font-bold text-white">{t("register.rightSide.activeTradersValue")}</p>
                </div>
                <div>
                  <p className="text-gray-400">{t("register.rightSide.countries")}</p>
                  <p className="text-2xl font-bold text-white">{t("register.rightSide.countriesValue")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
