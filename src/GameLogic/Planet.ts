import GameObject from './GameObject';
import { Game } from './GameState';
import { GeneratePlanet } from './PlanetGenerator';

////////////////////////
// CONST GAME DATA
////////////////////////

const resourceLimit = 100;
const materialGenFrequency = 0.25;
const combatUnitGenFrequency = 0.25;
const gatewayMoveFrequency = 0.25;
const gatewayMoveDuration = 1.0;

export const combatUnitNames = ['unitOne', 'unitTwo', 'unitThree'];
export const materialNames = ['materialOne', 'materialTwo', 'materialThree'];
export const materialNameToCombatUnit = {};
materialNames.forEach((res, i) => {
  materialNameToCombatUnit[res] = combatUnitNames[i];
});
const mod = (v: number, m: number) => {
  return (v + m) % m;
};

export interface CombatOrder {
  matched: string;
  strongAgainst: string;
  weakAgainst: string;
}
export const unitCombatOrder: { [key: string]: CombatOrder } = {};
combatUnitNames.forEach((unit, i) => {
  unitCombatOrder[unit] = {
    matched: unit,
    strongAgainst: combatUnitNames[mod(i - 1, combatUnitNames.length)],
    weakAgainst: combatUnitNames[mod(i + 1, combatUnitNames.length)]
  };
});

//////////////////////////
// END OF CONST GAME DATA
//////////////////////////

export class Probe {
  sourcePlanet: Planet;
  destinationPlanet: Planet;

  constructor(sourcePlanet: Planet, destinationPlanet: Planet) {
    this.sourcePlanet = sourcePlanet;
    this.destinationPlanet = destinationPlanet;
  }
}

export class Gateway {
  sourcePlanet: Planet;
  destinationPlanet: Planet;

  isActive: boolean;
  isMovingCombatUnits: boolean;
  movingResourceName: string;
  amountToMove: number;

  constructor(
    sourcePlanet: Planet,
    destinationPlanet: Planet,
    amountToMove: number = 1
  ) {
    this.sourcePlanet = sourcePlanet;
    this.destinationPlanet = destinationPlanet;
    this.amountToMove = amountToMove;
  }

  Configure(movingCombatUnits: boolean, resourceName: string) {
    this.isActive = true;
    this.isMovingCombatUnits = movingCombatUnits;
    this.movingResourceName = resourceName;
  }

  Deactivate() {
    this.isActive = false;
  }

  Move() {
    if (this.isActive === false) {
      return;
    }

    // Request resources from planet
    if (this.isMovingCombatUnits) {
      // Moving combat units
      if (
        this.sourcePlanet.stationedCombatUnits[this.movingResourceName] >
        this.amountToMove
      ) {
        this.sourcePlanet.stationedCombatUnits[
          this.movingResourceName
        ] -= this.amountToMove;
      } else {
        return;
      }
    } else {
      // Must be moving materials
      if (
        this.sourcePlanet.stationedMaterials[this.movingResourceName] >
        this.amountToMove
      ) {
        this.sourcePlanet.stationedMaterials[
          this.movingResourceName
        ] -= this.amountToMove;
      } else {
        return;
      }
    }

    const deliverResources = (
      sourceOwner: string,
      isMovingCombatUnits: boolean,
      resourceName: string,
      amountToMove: number
    ) => {
      if (isMovingCombatUnits) {
        // If the owners are the same, deliver units
        if (this.destinationPlanet.planetOwner === sourceOwner) {
          this.destinationPlanet.stationedCombatUnits[
            resourceName
          ] += amountToMove;
        } else {
          // Do combat stuff
          this.destinationPlanet.DefendFrom(
            resourceName,
            amountToMove,
            sourceOwner
          );
        }
      } else {
        // Must be moving resources
        this.destinationPlanet.stationedMaterials[resourceName] += amountToMove;
      }
    };

    // Kickoff timer to give resources to other planet
    window.setTimeout(
      deliverResources.bind(
        this,
        this.sourcePlanet.planetOwner,
        this.isMovingCombatUnits,
        this.movingResourceName,
        this.amountToMove
      ),
      gatewayMoveDuration
    );
  }
}

export interface PlanetGenStats {
  maxGateways: number;
  materialsGenerated: {};
  materialCost: {}; // corresponds to the unit produced
  unitsProduced: {};
  materialGenFrequencyOffset: number;
  combatUnitGenFrequencyOffset: number;
  gatewayMoveFrequencyOffset: number;
  name: string;
}

export class Planet extends GameObject {
  planetOwner: string;
  stationedCombatUnits: {};
  stationedMaterials: {};
  x: number;
  y: number;
  gateways: Array<Gateway>;
  probe: Probe;

  readonly stats: PlanetGenStats;

  private materialGenAcc: number;
  private combatUnitGenAcc: number;
  private gatewayMoveFreqAcc: number;

  constructor(planetGen: PlanetGenStats, owner: string = '') {
    super();

    this.planetOwner = owner;

    this.stationedCombatUnits = {};
    this.stationedMaterials = {};

    this.stats = planetGen;
    this.materialGenAcc = 0;
    this.combatUnitGenAcc = 0;
    this.gatewayMoveFreqAcc = 0;

    this.gateways = new Array<Gateway>();
  }

  Start() {
    materialNames.forEach(res => {
      this.stationedMaterials[res] = 0;
    });

    combatUnitNames.forEach(unit => {
      this.stationedCombatUnits[unit] = 0;
    });
  }

  Update(dt: number) {
    this.materialGenAcc += dt;
    this.combatUnitGenAcc += dt;
    this.gatewayMoveFreqAcc += dt;

    // TODO: Handle multiple accumulations per update tick

    if (
      this.materialGenAcc >=
      materialGenFrequency + this.stats.materialGenFrequencyOffset
    ) {
      // Generate resources
      Object.keys(this.stats.materialsGenerated).forEach(key => {
        if (this.stationedMaterials[key] < resourceLimit - this.stats.materialsGenerated[key])
        this.stationedMaterials[key] += this.stats.materialsGenerated[key];
      });

      this.materialGenAcc = 0;
    }

    if (
      this.combatUnitGenAcc >=
      combatUnitGenFrequency + this.stats.combatUnitGenFrequencyOffset
    ) {
      // Consume resources to generate combat units
      Object.keys(this.stats.materialCost).forEach(key => {
        const unitName = materialNameToCombatUnit[key];

        if (
          this.stationedMaterials[key] >= this.stats.materialCost[key] &&
          this.stationedCombatUnits[unitName] <
            resourceLimit - this.stats.unitsProduced[unitName]
        ) {
          this.stationedMaterials[key] -= this.stats.materialCost[key];
          this.stationedCombatUnits[unitName] += this.stats.unitsProduced[
            unitName
          ];
        } else {
          // Not enough resources to build unit
        }
      });
      this.combatUnitGenAcc = 0;
    }

    // Move the combat units (via calling move in the gateway)
    if (
      this.gatewayMoveFreqAcc >=
      gatewayMoveFrequency + this.stats.gatewayMoveFrequencyOffset
    ) {
      Object.keys(this.gateways).forEach(gatewayId => {
        const gateway = this.gateways[gatewayId];
        if (gateway !== undefined) {
          gateway.Move();
        }
      });
      this.gatewayMoveFreqAcc = 0;
    }
  }

  Stop() {
    return;
  }

  AddGatewayToPlanet(otherPlanet: Planet): boolean {
    if (
      this.stats.maxGateways > this.gateways.length &&
      otherPlanet.stats.maxGateways > otherPlanet.gateways.length
    ) {
      if (
        this.probe !== undefined &&
        this.probe.destinationPlanet.id === otherPlanet.id
      ) {
        // Clear the probe so we can probe for a different new planet
        delete this.probe;
      }

      this.gateways.push(new Gateway(this, otherPlanet));
      otherPlanet.gateways.push(new Gateway(otherPlanet, this));
      this.Send('gatewayCreated', {
        sourcePlanet: this,
        destinationPlanet: otherPlanet
      });
      return true;
    } else {
      // Not enough open gateway slots
      return false;
    }
  }

  ProbePlanet() {
    // only the player can probe
    if (this.planetOwner !== 'player') {
      return;
    }

    if (this.probe !== undefined) {
      // Destroy the probed planet, since we don't want to make a gateway to it
      const destPlanet = this.probe.destinationPlanet;
      this.Send('probeDestroyed', {
        sourcePlanet: this,
        destinationPlanet: destPlanet
      });
      Game.Remove(destPlanet);
    }

    const newTarget = GeneratePlanet();
    Game.Add(newTarget);

    this.Send('probeCreated', {
      sourcePlanet: this,
      destinationPlanet: newTarget
    });

    this.probe = new Probe(this, newTarget);
  }

  // Configure the gateway to move combat units
  // true if gateway was successfully configured
  MoveCombatUnitsToPlanet(otherPlanet: Planet, resource: string): boolean {
    // Search for a gateway to the destination planet
    const gateway = this.gateways.find(
      val => val.destinationPlanet === otherPlanet
    );

    // Configure it to send the desired resource
    if (gateway !== undefined) {
      gateway.Configure(true, resource);
      return true;
    }
    return false;
  }

  // Configure the gateway to move resources
  // true if gateway was successfully configured
  MoveMaterialToPlanet(otherPlanet: Planet, resource: string): boolean {
    // Search for a gateway to the destination planet
    const gateway = this.gateways.find(
      val => val.destinationPlanet === otherPlanet
    );

    // Configure it to send the desired resource
    if (gateway !== undefined) {
      gateway.Configure(false, resource);
      return true;
    }
    return false;
  }

  // returns number of surviving attackers
  fightUnits(
    defendingUnitName: string,
    numAttackers: number,
    attackingAdvantage: boolean
  ): number {
    if (this.stationedCombatUnits[defendingUnitName] > 0) {
      this.stationedCombatUnits[defendingUnitName] -=
        numAttackers * (attackingAdvantage ? 2 : 1);
      if (this.stationedCombatUnits[defendingUnitName] >= 0) {
        return 0;
      }

      // Handle over-damage by returning units to combat poos
      numAttackers = Math.abs(this.stationedCombatUnits[defendingUnitName]);
      this.stationedCombatUnits[defendingUnitName] = 0;
    }
    return numAttackers;
  }

  DefendFrom(unitName: string, unitAmount: number, unitOwner: string) {
    // Units fight other units of the same name first,
    // Then they fight the units they are strong against
    // Then they fight the units they are weak against
    const fightOrder = unitCombatOrder[unitName];

    unitAmount = this.fightUnits(fightOrder.matched, unitAmount, false);
    if (unitAmount === 0) {
      return;
    }

    unitAmount = this.fightUnits(fightOrder.strongAgainst, unitAmount, true);
    if (unitAmount === 0) {
      return;
    }

    unitAmount = this.fightUnits(fightOrder.weakAgainst, unitAmount, false);
    if (unitAmount === 0) {
      return;
    } else {
      // If there are no units left, the planet is claimed
      const oldOwner = this.planetOwner;
      this.planetOwner = unitOwner;
      this.stationedCombatUnits[unitName] += unitAmount;
      console.log(unitOwner + ' claimed a planet from ' + oldOwner);
    }
  }
}
