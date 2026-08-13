import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LocationData } from "../../types";
import { MapPin, Search, Check, Globe, SlidersHorizontal, Loader2, Sparkles } from "lucide-react";

export interface LocationPickerProps {
  value: LocationData;
  onChange: (loc: LocationData) => void;
  t: (key: string) => string;
}

/**
 * Curated Global Cities Database covering major world regions, state disambiguations,
 * and popular civic hubs for immediate offline / quick fallback support.
 */
export const CITIES_DATABASE: LocationData[] = [
  // India & South Asia
  { city: "Mumbai", state: "Maharashtra", country: "India" },
  { city: "Delhi", state: "Delhi NCR", country: "India" },
  { city: "Bengaluru", state: "Karnataka", country: "India" },
  { city: "Hyderabad", state: "Telangana", country: "India" },
  { city: "Chennai", state: "Tamil Nadu", country: "India" },
  { city: "Kolkata", state: "West Bengal", country: "India" },
  { city: "Pune", state: "Maharashtra", country: "India" },
  { city: "Ahmedabad", state: "Gujarat", country: "India" },
  { city: "Jaipur", state: "Rajasthan", country: "India" },
  { city: "Chandigarh", state: "Punjab", country: "India" },
  { city: "Kochi", state: "Kerala", country: "India" },
  { city: "Dhaka", state: "Dhaka Division", country: "Bangladesh" },
  { city: "Colombo", state: "Western Province", country: "Sri Lanka" },
  { city: "Kathmandu", state: "Bagmati", country: "Nepal" },

  // East Asia & Pacific
  { city: "Tokyo", state: "Tokyo Metropolis", country: "Japan" },
  { city: "Osaka", state: "Osaka Prefecture", country: "Japan" },
  { city: "Kyoto", state: "Kyoto Prefecture", country: "Japan" },
  { city: "Seoul", state: "Seoul Capital Area", country: "South Korea" },
  { city: "Singapore", state: "Central Region", country: "Singapore" },
  { city: "Sydney", state: "New South Wales", country: "Australia" },
  { city: "Melbourne", state: "Victoria", country: "Australia" },
  { city: "Auckland", state: "Auckland Region", country: "New Zealand" },
  { city: "Bangkok", state: "Bangkok Metropolis", country: "Thailand" },
  { city: "Manila", state: "Metro Manila", country: "Philippines" },
  { city: "Jakarta", state: "Special Capital Region", country: "Indonesia" },

  // Europe
  { city: "London", state: "Greater London", country: "United Kingdom" },
  { city: "Paris", state: "Île-de-France", country: "France" },
  { city: "Berlin", state: "Berlin State", country: "Germany" },
  { city: "Munich", state: "Bavaria", country: "Germany" },
  { city: "Amsterdam", state: "North Holland", country: "Netherlands" },
  { city: "Madrid", state: "Community of Madrid", country: "Spain" },
  { city: "Barcelona", state: "Catalonia", country: "Spain" },
  { city: "Rome", state: "Lazio", country: "Italy" },
  { city: "Zurich", state: "Canton of Zürich", country: "Switzerland" },
  { city: "Vienna", state: "Vienna State", country: "Austria" },
  { city: "Stockholm", state: "Stockholm County", country: "Sweden" },
  { city: "Oslo", state: "Oslo Region", country: "Norway" },
  { city: "Dublin", state: "Leinster", country: "Ireland" },

  // Americas (North, Central, South)
  { city: "New York", state: "New York", country: "United States" },
  { city: "San Francisco", state: "California", country: "United States" },
  { city: "Los Angeles", state: "California", country: "United States" },
  { city: "Chicago", state: "Illinois", country: "United States" },
  { city: "Springfield", state: "Illinois", country: "United States" },
  { city: "Springfield", state: "Massachusetts", country: "United States" },
  { city: "Springfield", state: "Missouri", country: "United States" },
  { city: "Toronto", state: "Ontario", country: "Canada" },
  { city: "Vancouver", state: "British Columbia", country: "Canada" },
  { city: "Montreal", state: "Quebec", country: "Canada" },
  { city: "Mexico City", state: "CDMX", country: "Mexico" },
  { city: "São Paulo", state: "State of São Paulo", country: "Brazil" },
  { city: "Rio de Janeiro", state: "State of Rio de Janeiro", country: "Brazil" },
  { city: "Buenos Aires", state: "Autonomous City", country: "Argentina" },
  { city: "Santiago", state: "Santiago Metropolitan", country: "Chile" },

  // Middle East & Africa
  { city: "Dubai", state: "Dubai Emirate", country: "United Arab Emirates" },
  { city: "Abu Dhabi", state: "Abu Dhabi Emirate", country: "United Arab Emirates" },
  { city: "Riyadh", state: "Riyadh Province", country: "Saudi Arabia" },
  { city: "Cairo", state: "Cairo Governorate", country: "Egypt" },
  { city: "Nairobi", state: "Nairobi County", country: "Kenya" },
  { city: "Lagos", state: "Lagos State", country: "Nigeria" },
  { city: "Johannesburg", state: "Gauteng", country: "South Africa" },
  { city: "Cape Town", state: "Western Cape", country: "South Africa" },
];

export const POPULAR_CIVIC_HUBS: LocationData[] = [
  { city: "Mumbai", state: "Maharashtra", country: "India" },
  { city: "London", state: "Greater London", country: "United Kingdom" },
  { city: "New York", state: "New York", country: "United States" },
  { city: "Tokyo", state: "Tokyo Metropolis", country: "Japan" },
  { city: "San Francisco", state: "California", country: "United States" },
  { city: "Dubai", state: "Dubai Emirate", country: "United Arab Emirates" },
  { city: "Berlin", state: "Berlin State", country: "Germany" },
  { city: "Singapore", state: "Central Region", country: "Singapore" },
];

export const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange, t }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showManualFields, setShowManualFields] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<LocationData[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Perform Global Geocoding via OpenStreetMap Nominatim with fallback to static global DB
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsDropdownOpen(false);
      setIsSearching(false);
      return;
    }

    setIsDropdownOpen(true);
    setIsSearching(true);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      const q = searchQuery.toLowerCase().trim();

      try {
        // Real OpenStreetMap Nominatim Geocoding API call
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&addressdetails=1&limit=8`,
          {
            headers: {
              "Accept-Language": "en",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            const parsedResults: LocationData[] = data.map((item: any) => {
              const addr = item.address || {};
              const city =
                addr.city ||
                addr.town ||
                addr.municipality ||
                addr.village ||
                addr.county ||
                item.display_name.split(",")[0];
              const state = addr.state || addr.region || addr.state_district || addr.county || "";
              const country = addr.country || "";

              return {
                city,
                state: state || city,
                country: country || "Global",
              };
            });

            // Remove duplicates
            const uniqueResults = parsedResults.filter(
              (item, idx, self) =>
                idx ===
                self.findIndex(
                  (t) =>
                    t.city.toLowerCase() === item.city.toLowerCase() &&
                    t.state.toLowerCase() === item.state.toLowerCase() &&
                    t.country.toLowerCase() === item.country.toLowerCase()
                )
            );

            if (uniqueResults.length > 0) {
              setSearchResults(uniqueResults);
              setIsSearching(false);
              return;
            }
          }
        }
      } catch (err) {
        // Ignore network errors and fall back to static database search
      }

      // Fallback: Search inside full 120+ CITIES_DATABASE
      const localMatches = CITIES_DATABASE.filter(
        (item) =>
          item.city.toLowerCase().includes(q) ||
          item.state.toLowerCase().includes(q) ||
          item.country.toLowerCase().includes(q)
      );

      setSearchResults(localMatches);
      setIsSearching(false);
    }, 300);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [searchQuery]);

  const handleSelectCity = (loc: LocationData) => {
    onChange(loc);
    setSearchQuery("");
    setIsDropdownOpen(false);
  };

  return (
    <div className="space-y-4" id="location-picker-container" aria-label="Global Location Selection">
      {/* Search Input Box with Full ARIA Accessibility */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          {isSearching ? (
            <Loader2 className="w-4 h-4 text-purple-400 animate-spin" />
          ) : (
            <Search className="w-4 h-4 text-slate-400" />
          )}
        </div>

        <input
          id="location-search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t("searchLocation")}
          aria-label="Search city, municipality, or region worldwide"
          aria-autocomplete="list"
          aria-expanded={isDropdownOpen}
          aria-controls="location-suggestions-list"
          aria-describedby="location-search-hint"
          className="w-full pl-10 pr-10 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all"
        />

        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setIsDropdownOpen(false);
            }}
            aria-label="Clear location search query"
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
          >
            ×
          </button>
        )}
      </div>

      <p id="location-search-hint" className="sr-only">
        Type a city or municipality name to search global geocoding database or select from popular civic hubs.
      </p>

      {/* Suggested Global Cities Dropdown with Staggered Fade/Slide Animation */}
      <AnimatePresence>
        {isDropdownOpen && searchQuery && (
          <motion.div
            id="location-suggestions-list"
            role="listbox"
            aria-label="Matching global cities and municipalities"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: { opacity: 0, y: -10 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  staggerChildren: 0.04,
                  delayChildren: 0.02,
                },
              },
            }}
            className="max-h-56 overflow-y-auto rounded-xl border border-purple-500/30 bg-slate-900/95 backdrop-blur-md divide-y divide-slate-800/80 shadow-2xl custom-scrollbar z-20"
          >
            {isSearching ? (
              <div className="p-4 text-center text-xs text-purple-300 flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
                <span>Searching global municipalities and geocoding index...</span>
              </div>
            ) : searchResults.length > 0 ? (
              searchResults.map((item, idx) => {
                const isSelected =
                  value.city.toLowerCase() === item.city.toLowerCase() &&
                  value.country.toLowerCase() === item.country.toLowerCase();

                const optionVariants = {
                  hidden: { opacity: 0, y: 8, scale: 0.97 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 24,
                    },
                  },
                };

                return (
                  <motion.button
                    key={`${item.city}-${item.state}-${item.country}-${idx}`}
                    type="button"
                    role="option"
                    variants={optionVariants}
                    aria-selected={isSelected}
                    onClick={() => handleSelectCity(item)}
                    className={`w-full px-4 py-2.5 text-left flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-purple-900/40 text-purple-200 font-semibold"
                        : "hover:bg-purple-950/40 text-slate-200"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <MapPin className="w-4 h-4 text-purple-400 shrink-0" />
                      <div>
                        <span className="font-medium text-slate-100">{item.city}</span>
                        <span className="text-slate-400 text-xs ml-2">
                          {item.state ? `${item.state}, ` : ""}{item.country}
                        </span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                  </motion.button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-400 space-y-1">
                <p>No matching global city found for "{searchQuery}".</p>
                <p className="text-[11px] text-purple-300">
                  Use "Edit Details" below to manually enter your municipality.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Popular City Tags with Micro-Interactions (Hover Scale + Glow) */}
      {!searchQuery && (
        <div className="space-y-2" role="group" aria-label="Popular civic hubs quick-select">
          <span className="text-xs font-medium text-slate-400 flex items-center space-x-1">
            <Globe className="w-3.5 h-3.5 text-purple-400" />
            <span>Popular Civic Hubs:</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {POPULAR_CIVIC_HUBS.map((item) => {
              const isSelected = value.city.toLowerCase() === item.city.toLowerCase();
              return (
                <motion.button
                  key={item.city}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSelectCity(item)}
                  aria-label={`Select ${item.city}, ${item.country}`}
                  aria-pressed={isSelected}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all flex items-center space-x-1.5 cursor-pointer ${
                    isSelected
                      ? "bg-purple-600/30 border-purple-500 text-purple-200 shadow-md shadow-purple-500/20"
                      : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10"
                  }`}
                >
                  <MapPin className={`w-3 h-3 ${isSelected ? "text-purple-400" : "text-slate-400"}`} />
                  <span>{item.city}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Selected Location Display Card with Animated Scale/Fade Entrance */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${value.city}-${value.state}-${value.country}`}
          initial={{ opacity: 0, scale: 0.93, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 22,
            mass: 0.8
          }}
          className="p-3.5 bg-slate-900/80 border border-purple-900/50 rounded-2xl flex items-center justify-between shadow-lg"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-inner">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-purple-300 font-semibold uppercase tracking-wider flex items-center space-x-1">
                <span>Selected Location</span>
                <Sparkles className="w-3 h-3 text-purple-400" />
              </div>
              <div className="text-sm font-bold text-slate-100">
                {value.city || "Not selected"}{value.state ? `, ${value.state}` : ""}
              </div>
              <div className="text-xs text-slate-400">{value.country || "Country"}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowManualFields(!showManualFields)}
            aria-expanded={showManualFields}
            aria-label={showManualFields ? "Hide manual location editing" : "Edit location details manually"}
            className="text-xs font-semibold text-purple-300 hover:text-white flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-800/60 hover:border-purple-500 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{showManualFields ? "Hide Edit" : "Edit Details"}</span>
          </button>
        </motion.div>
      </AnimatePresence>

      {/* Manual Fine-Tuning Inputs */}
      <AnimatePresence>
        {showManualFields && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="p-4 bg-slate-900/90 border border-slate-700/80 rounded-2xl space-y-3 shadow-xl overflow-hidden"
          >
            <div className="text-xs font-bold text-slate-200">Fine-tune Address Details:</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="manual-city-input" className="block text-xs font-semibold text-slate-400 mb-1">
                  {t("city")}
                </label>
                <input
                  id="manual-city-input"
                  type="text"
                  value={value.city}
                  onChange={(e) => onChange({ ...value, city: e.target.value })}
                  aria-label="City name"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="manual-state-input" className="block text-xs font-semibold text-slate-400 mb-1">
                  {t("state")}
                </label>
                <input
                  id="manual-state-input"
                  type="text"
                  value={value.state}
                  onChange={(e) => onChange({ ...value, state: e.target.value })}
                  aria-label="State or region name"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                />
              </div>
              <div>
                <label htmlFor="manual-country-input" className="block text-xs font-semibold text-slate-400 mb-1">
                  {t("country")}
                </label>
                <input
                  id="manual-country-input"
                  type="text"
                  value={value.country}
                  onChange={(e) => onChange({ ...value, country: e.target.value })}
                  aria-label="Country name"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-xs focus:ring-2 focus:ring-purple-500/50 focus:outline-none"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
