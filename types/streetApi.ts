


export interface StreetSummary {
    germanName: string,
    polishNames: string[],
    slug: string,
    imageUrl: string,
}

export interface StreetAPIResponse {
    success: boolean
    message: string
    total_streets: number
    offset: number
    streets: StreetSummary[]
}
