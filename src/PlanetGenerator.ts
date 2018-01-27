import { materialNames, materialNameToCombatUnit, Planet, PlanetGenStats } from './Planet';

const randomInt = (min: number, max: number) => {
    return Math.round(min + Math.random() * max);
};

export const GeneratePlanet = (): Planet => {
    const materialToGenerate = materialNames[randomInt(0, materialNames.length)];
    const materialsGenerated = {};
    materialsGenerated[materialToGenerate] = 1;

    const unitsGenerated = {};
    unitsGenerated[materialNameToCombatUnit[materialToGenerate]] = 1;

    const settings: PlanetGenStats = {
        maxGateways: randomInt(1, 5),
        materialsGenerated: materialsGenerated,
        materialCost: materialsGenerated,
        unitsProduced: unitsGenerated,
        materialGenFrequencyOffset: 0.00,
        combatUnitGenFrequencyOffset: 0.00,
        gatewayMoveFrequencyOffset: 0.00
    };

    return new Planet(settings);
};