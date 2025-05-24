export interface TierRequest {
    id_filling: number;
    weight: number;
}

export interface DecorRequest {
    id: number
    count: number
}

export interface CakeDesignerRequest {
    name: string;
    description: string;
    weight: number;
    id_coverage: number;
    id_cake_form: number;
    tiers: TierRequest[];
    decors: DecorRequest[];
}
