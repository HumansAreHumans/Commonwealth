import * as React from 'react';
import './GameUI.css';
import { Game, Planet, GeneratePlanet } from './GameLogic';

interface GameUIProps {

}

interface GameUIState {
    planetOwner: string;
    sourcePlanet: string;
    destPlanet: string;
    materialToSend: string;
    combatUnitToSend: string;
}

export default class GameUI extends React.Component<GameUIProps, GameUIState> {

    constructor(props: GameUIProps) {
        super(props);

        this.state = {
            planetOwner: '',
            sourcePlanet: '',
            destPlanet: '',
            materialToSend: '',
            combatUnitToSend: ''
        };

        this.generatePlanet = this.generatePlanet.bind(this);
        this.buildGateway = this.buildGateway.bind(this);
        this.sendCombatUnit = this.sendCombatUnit.bind(this);
        this.sendMaterial = this.sendMaterial.bind(this);
    }

    generatePlanet() {
        const planet = GeneratePlanet(this.state.planetOwner);
        Game.Add(planet);

        console.log(JSON.stringify(planet));
    }

    buildGateway() {
        const srcId = parseInt(this.state.sourcePlanet, 10);
        const dstId = parseInt(this.state.destPlanet, 10);

        const sourcePlanet = Game.GetGameObjectById(srcId) as Planet;
        const destPlanet = Game.GetGameObjectById(dstId) as Planet;

        if (sourcePlanet !== undefined
        && destPlanet !== undefined
        && sourcePlanet.AddGatewayToPlanet(destPlanet)) {
            console.log('Gateway created successfully');
        } else {
            console.log('Gateway failed to be created');
        }
    }

    planetStatus(field: 'sourcePlanet' | 'destPlanet') {
        const strId = this.state[field];
        const id = parseInt(strId, 10);
        const planet = Game.GetGameObjectById(id) as Planet;

        if (planet !== undefined) {
            console.log('PlanetStats: ' + JSON.stringify(planet.planetGenStats));
            console.log(JSON.stringify(planet.stationedCombatUnits));
            console.log(JSON.stringify(planet.stationedMaterials));
            console.log('Gateways: ' + planet.gateways.length);
        } else {
            console.log('planet not found');
        }
    }

    sendMaterial() {
        // TODO: add variable material generation, so we can have materials to transfer between planets
        return;
    }

    sendCombatUnit() {
        const srcId = parseInt(this.state.sourcePlanet, 10);
        const dstId = parseInt(this.state.destPlanet, 10);

        const sourcePlanet = Game.GetGameObjectById(srcId) as Planet;
        const destPlanet = Game.GetGameObjectById(dstId) as Planet;

        const unitName = this.state.combatUnitToSend;

        // TODO: validate that unit type exists, or just let josh handle it in real UI later

        if (sourcePlanet !== undefined 
        &&  destPlanet !== undefined) {
            const success = sourcePlanet.MoveCombatUnitsToPlanet(destPlanet, unitName);
            if ( success === false) {
                console.error('no gateway exists from source planet to destination planet');
            }
        } else {
            console.error('invalid source or destination planet');
        }
    }

    onChange(field: keyof(GameUIState), event: any) {
        const partial = {};
        partial[field] = event.target.value;
        this.setState(partial);
    }

    render() {
        return (
            <div className="DebugMenu"> 
                <div>
                    <label>Planet Owner:</label>
                    <input  
                        type="text"
                        value={this.state.planetOwner}
                        onChange={(event: any) => this.onChange('planetOwner', event)} 
                    />
                    <button className="button" onClick={this.generatePlanet}>Generate Planet</button>
                </div>
                <div>
                    <label>Source ID:</label>
                    <input  
                        type="text"
                        value={this.state.sourcePlanet}
                        onChange={(event: any) => this.onChange('sourcePlanet', event)} 
                    />
                    <button className="button" onClick={() => this.planetStatus('sourcePlanet')}>?</button>
                    <label>Destination ID:</label>
                    <input 
                        type="text"
                        value={this.state.destPlanet}
                        onChange={(event: any) => this.onChange('destPlanet', event)} 
                    />
                    <button className="button" onClick={() => this.planetStatus('destPlanet')}>?</button>
                </div>
                <div>
                    <button className="button" onClick={this.buildGateway}>Build Gateway</button>
                </div>
                <div>
                    <label>Material:</label>
                    <input  
                        type="text"
                        value={this.state.materialToSend}
                        onChange={(event: any) => this.onChange('materialToSend', event)} 
                    />
                    <button className="button" onClick={this.sendMaterial}>Send Material</button>
                </div>
                <div>
                    <label>Combat Unit:</label>
                    <input  
                        type="text"
                        value={this.state.combatUnitToSend}
                        onChange={(event: any) => this.onChange('combatUnitToSend', event)} 
                    />
                    <button className="button" onClick={this.sendCombatUnit}>Send Combat Unit</button>
                </div>
                
            </div>
        );
    }
}
