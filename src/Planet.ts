import GameObject from './GameObject';

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

    constructor(sourcePlanet: Planet, destinationPlanet: Planet, amountToMove: number = 1) {
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
            if (this.sourcePlanet.stationedCombatUnits[this.movingResourceName] > this.amountToMove) {
                this.sourcePlanet.stationedCombatUnits[this.movingResourceName] -= this.amountToMove;
            } else {
                return;
            }
        } else {
            // Must be moving materials
            if (this.sourcePlanet.stationedMaterials[this.movingResourceName] > this.amountToMove) {
                this.sourcePlanet.stationedMaterials[this.movingResourceName] -= this.amountToMove;
            } else {
                return;
            }
        }

        const deliverResources = (sourceOwner: string) => {
            if (this.isMovingCombatUnits) {
                // If the owners are the same, deliver units
                if (this.destinationPlanet.planetOwner === sourceOwner) {
                    this.destinationPlanet.stationedCombatUnits[this.movingResourceName] += this.amountToMove;
                } else {
                    // Do combat stuff
                    // TODO: COMBAT
                    // TODO: Territory claiming
                }
                
            } else {
                // Must be moving resources
                this.destinationPlanet.stationedMaterials[this.movingResourceName] += this.amountToMove;
            }
        };

        // Kickoff timer to give resources to other planet
        window.setTimeout(deliverResources.bind(this, this.sourcePlanet.planetOwner), gatewayMoveDuration);
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
}

export class Planet extends GameObject {
    planetOwner: string;
    stationedCombatUnits: {};
    stationedMaterials: {};
    
    gateways: Array<Gateway>;
    probe: Probe;

    private planetGenStats: PlanetGenStats;

    private materialGenAcc: number;
    private combatUnitGenAcc: number;
    private gatewayMoveFreqAcc: number;
    
    constructor(planetGen: PlanetGenStats) {
        super();

        this.planetGenStats = planetGen;
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

        if (this.materialGenAcc >= materialGenFrequency + this.planetGenStats.materialGenFrequencyOffset) {
            // Generate resources
            Object.keys(this.planetGenStats.materialsGenerated).forEach(key => {
                this.stationedMaterials[key] += this.planetGenStats.materialsGenerated[key] * dt;
            });

            this.materialGenAcc = 0;
        }

        if (this.combatUnitGenAcc >= combatUnitGenFrequency + this.planetGenStats.combatUnitGenFrequencyOffset) {
            // Consume resources to generate combat units
            Object.keys(this.planetGenStats.materialCost).forEach(key => {
                if (this.stationedMaterials[key] >= this.planetGenStats.materialCost[key]) {
                    this.stationedMaterials[key] -= this.planetGenStats.materialCost[key];

                    const unitName = materialNameToCombatUnit[key];

                    this.stationedCombatUnits[unitName] += this.planetGenStats.unitsProduced[unitName];
                } else {
                    // Not enough resources to build unit
                }
            });
            this.combatUnitGenAcc = 0;
        }

        // Move the combat units (via calling move in the gateway)
        if (this.gatewayMoveFreqAcc >= gatewayMoveFrequency + this.planetGenStats.gatewayMoveFrequencyOffset) {
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

    AddGatewayToPlanet(otherPlanet: Planet) {
        if (this.planetGenStats.maxGateways > this.gateways.length
        && otherPlanet.planetGenStats.maxGateways > otherPlanet.gateways.length) {
            this.gateways.push(new Gateway(this, otherPlanet));
        } else {
            // Not enough open gateway slots
        }
    }

    ProbePlanet(target: Planet) {
        
        // TODO: Destroy the planet I am already probing, if necessary
        this.probe = new Probe(this, target); 
    }

    // Configure the gateway to move combat units
    MoveCombatUnitsToPlanet(otherPlanet: Planet, resource: string) {
        // Search for a gateway to the destination planet   
        const gateway = this.gateways.find(val => val.destinationPlanet === otherPlanet);

        // Configure it to send the desired resource
        if (gateway !== undefined) {
            gateway.Configure(true, resource);
        }
    }

    // Configure the gateway to move resources
    MoveMaterialToPlanet(otherPlanet: Planet, resource: string) {
        // Search for a gateway to the destination planet   
        const gateway = this.gateways.find(val => val.destinationPlanet === otherPlanet);
    
        // Configure it to send the desired resource
        if (gateway !== undefined) {
            gateway.Configure(false, resource);
        }
    }
}
