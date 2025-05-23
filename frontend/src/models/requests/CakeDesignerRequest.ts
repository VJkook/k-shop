interface CakeDesignerRequest {
    name: string;
    description: string;
    weight: number;
    id_coverage: number;
    id_cake_form: number;
    filling_ids: number[];
    decors: {
        id: number;
        count: number;
    }[];
}
