import { CoverageArea } from '@/types/coverage-area';

/**
 * Format coverage areas untuk display yang user-friendly
 * Handles:
 * - Single country → "Indonesia (Nationwide)"
 * - Multiple countries → "Indonesia, Singapore, +2 countries"
 * - Region → "Southeast Asia (Regional)"
 * - Cities/Provinces → "Jakarta, Surabaya, +3 cities"
 */
export function formatCoverageDisplay(
    coverageAreas: CoverageArea[],
    maxDisplay: number = 2
): string {
    if (!coverageAreas || coverageAreas.length === 0) {
        return 'No coverage';
    }

    // Group by type
    const byType = {
        COUNTRY: coverageAreas.filter((a) => a.type === 'COUNTRY'),
        REGION: coverageAreas.filter((a) => a.type === 'REGION'),
        PROVINCE: coverageAreas.filter((a) => a.type === 'PROVINCE'),
        CITY: coverageAreas.filter((a) => a.type === 'CITY'),
        DISTRICT: coverageAreas.filter((a) => a.type === 'DISTRICT'),
    };

    // Priority: COUNTRY > REGION > PROVINCE > CITY > DISTRICT
    // If has country, show country
    if (byType.COUNTRY.length > 0) {
        if (byType.COUNTRY.length === 1) {
            return `${byType.COUNTRY[0].name} (Nationwide)`;
        } else if (byType.COUNTRY.length === 2) {
            return `${byType.COUNTRY[0].name}, ${byType.COUNTRY[1].name}`;
        } else {
            const displayed = byType.COUNTRY.slice(0, maxDisplay)
                .map((a) => a.name)
                .join(', ');
            const remaining = byType.COUNTRY.length - maxDisplay;
            return `${displayed}, +${remaining} ${
                remaining === 1 ? 'country' : 'countries'
            }`;
        }
    }

    // If has region
    if (byType.REGION.length > 0) {
        if (byType.REGION.length === 1) {
            return `${byType.REGION[0].name} (Regional)`;
        } else {
            const displayed = byType.REGION.slice(0, maxDisplay)
                .map((a) => a.name)
                .join(', ');
            const remaining = byType.REGION.length - maxDisplay;
            if (remaining > 0) {
                return `${displayed}, +${remaining} ${
                    remaining === 1 ? 'region' : 'regions'
                }`;
            }
            return displayed;
        }
    }

    // If has provinces
    if (byType.PROVINCE.length > 0) {
        const displayed = byType.PROVINCE.slice(0, maxDisplay)
            .map((a) => a.name)
            .join(', ');
        const remaining = byType.PROVINCE.length - maxDisplay;
        if (remaining > 0) {
            return `${displayed}, +${remaining} ${
                remaining === 1 ? 'province' : 'provinces'
            }`;
        }
        return displayed;
    }

    // If has cities
    if (byType.CITY.length > 0) {
        const displayed = byType.CITY.slice(0, maxDisplay)
            .map((a) => a.name)
            .join(', ');
        const remaining = byType.CITY.length - maxDisplay;
        if (remaining > 0) {
            return `${displayed}, +${remaining} ${
                remaining === 1 ? 'city' : 'cities'
            }`;
        }
        return displayed;
    }

    // If has districts
    if (byType.DISTRICT.length > 0) {
        const displayed = byType.DISTRICT.slice(0, maxDisplay)
            .map((a) => a.name)
            .join(', ');
        const remaining = byType.DISTRICT.length - maxDisplay;
        if (remaining > 0) {
            return `${displayed}, +${remaining} ${
                remaining === 1 ? 'district' : 'districts'
            }`;
        }
        return displayed;
    }

    return 'Unknown coverage';
}

/**
 * Get icon emoji for coverage type
 */
export function getCoverageIcon(type: string): string {
    switch (type) {
        case 'COUNTRY':
            return '🌐';
        case 'REGION':
            return '🌍';
        case 'PROVINCE':
            return '🗺️';
        case 'CITY':
            return '🏙️';
        case 'DISTRICT':
            return '📍';
        default:
            return '📌';
    }
}

/**
 * Get label suffix for coverage display in selector
 */
export function getCoverageLabel(type: string): string {
    switch (type) {
        case 'COUNTRY':
            return '(Nationwide)';
        case 'REGION':
            return '(Regional)';
        default:
            return '';
    }
}

/**
 * Determine if coverage is international (multiple countries or specific regions)
 */
export function isInternationalCoverage(
    coverageAreas: CoverageArea[]
): boolean {
    const countries = coverageAreas.filter((a) => a.type === 'COUNTRY');
    const internationalRegions = coverageAreas.filter(
        (a) =>
            a.type === 'REGION' &&
            (a.name.includes('Asia') ||
                a.name.includes('International') ||
                a.name.includes('Global'))
    );

    return countries.length > 1 || internationalRegions.length > 0;
}

/**
 * Get coverage scope description
 */
export function getCoverageScope(coverageAreas: CoverageArea[]): string {
    if (!coverageAreas || coverageAreas.length === 0) {
        return 'No coverage';
    }

    if (isInternationalCoverage(coverageAreas)) {
        return 'International';
    }

    const hasCountry = coverageAreas.some((a) => a.type === 'COUNTRY');
    if (hasCountry) {
        return 'Nationwide';
    }

    const hasRegion = coverageAreas.some((a) => a.type === 'REGION');
    if (hasRegion) {
        return 'Regional';
    }

    return 'Local';
}
