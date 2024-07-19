import { apiSlice } from "@/api/apiSlice";

type geoLocaitonQueryResult = {
    range: [number, number],
    country: string,
    region: string,
    eu: string,
    timezone: string,
    city: string,
    ll: [number, number],
    metro: number,
    area: number
}

export const nearbyPeopleApiSlice = apiSlice.injectEndpoints({
    endpoints: (build) => ({
        getIpLocation: build.query<geoLocaitonQueryResult | null, {}>({
            query: () => "get-ip-location",
            transformResponse: (rawResult: { status: boolean, data: geoLocaitonQueryResult | null }) => rawResult.data
        })
    })
});

export const { useGetIpLocationQuery, useLazyGetIpLocationQuery } = nearbyPeopleApiSlice;