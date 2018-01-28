import {
  materialNames,
  materialNameToCombatUnit,
  Planet,
  PlanetGenStats
} from './Planet';
import NameGen from './NameGenerator';

const randomInt = (min: number, max: number) => {
  return Math.round(min + Math.random() * max);
};

export const GeneratePlanet = (owner: string = ''): Planet => {
  const materialToGenerate =
    materialNames[randomInt(0, materialNames.length - 1)];
  const materialsGenerated = {};
  materialsGenerated[materialToGenerate] = 1;

  const unitsGenerated = {};
  unitsGenerated[materialNameToCombatUnit[materialToGenerate]] = 1;

  const settings: PlanetGenStats = {
    name: NameGen(),
    maxGateways: randomInt(1, 5),
    materialsGenerated: materialsGenerated,
    materialCost: materialsGenerated,
    unitsProduced: unitsGenerated,
    materialGenFrequencyOffset: 0.0,
    combatUnitGenFrequencyOffset: 0.0,
    gatewayMoveFrequencyOffset: 0.0
  };

  return new Planet(settings, owner);
};

export const GeneratePlanetGraph = (numberOfNodes: number): Array<Planet> => {
  // TODO: add planet collection generation
  return new Array<Planet>();
};
