import { cFetch } from "@/lib/utils";
import { Country } from "@/types";

export async function getCountries() {
    return await cFetch<Country[]>(
        "https://raw.githubusercontent.com/dr5hn/countries-states-cities-database/master/countries%2Bstates%2Bcities.json"
    );
}

export function getStatesByCountry(iso2?: string, countries?: Country[]) {
    return countries?.find((x) => x.iso2 === iso2)?.states;
}

export function getCitiesByState(
    stateCode?: string,
    states?: Country["states"]
) {
    return states?.find((x) => x.state_code === stateCode)?.cities;
}
