import { Planet, PlanetGenStats } from './Planet';

export const GeneratePlanet = (): Planet => {
    const settings: PlanetGenStats = {
        maxGateways: 3,
        materialsGenerated: {
            resourceOne: 1
        },
        materialCost: {
            resourceOne: 1
        },
        unitsProduced: {
            unitOne: 1
        },
        materialGenFrequencyOffset: 0.00,
        combatUnitGenFrequencyOffset: 0.00,
        gatewayMoveFrequencyOffset: 0.00
    };

    return new Planet(settings);
};