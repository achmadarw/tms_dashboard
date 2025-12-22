export interface CoverageArea {
    id: string;
    name: string;
    code: string;
    type: 'COUNTRY' | 'REGION' | 'PROVINCE' | 'CITY' | 'DISTRICT';
    parentId: string | null;
    latitude: number | null;
    longitude: number | null;
    isActive: boolean;
    parent?: CoverageArea;
    children?: CoverageArea[];
}

export interface CoverageHierarchy {
    COUNTRY: CoverageArea[];
    REGION: CoverageArea[];
    PROVINCE: CoverageArea[];
    CITY: CoverageArea[];
    DISTRICT: CoverageArea[];
}
