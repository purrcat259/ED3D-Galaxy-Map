import Loader from './components/loader';
import Material from './models/material';
import * as THREE from 'three';

// ThreeJS
let camera;
let controls;
let scene;
let light;
let renderer;
let raycaster;
let composer;

// Map
let container;
let routes = [];
let lensFlareSel;

// UI
let loader = new Loader();

export default class GalaxyMap {
    constructor(containerEl) {
        this.containerEl = containerEl;
        this.basePath = './';

        this.jsonPath = null;
        this.jsonContainer = null;
        this.json = null;

        this.grid1H = null;
        this.grid1K = null;
        this.grid1XL = null;

        this.tween = null;

        this.globalView = true;

        this.fogDensity = null;

        // Defined texts
        this.textSel = [];

        // Object list by categories
        this.catObjs = [];
        this.catObjsRoutes = [];

        this.starSprite = 'textures/lensflare/star_grey2.png';

        this.colors = [];
        this.textures = {};

        // Default colour for system sprite
        this.systemColor = '#eeeeee';

        this.systems = [];

        this.starfield = null;

        this.startAnim = true;

        this.effectScaleSystem = [10, 800];

        // Graphical Options
        this.optDistObj = 1500;

        this.playerPos = {
            x: 0,
            y: 0,
            z: 0
        };

        this.cameraPos = null;

        this.showNameNear = false;

        this.popupDetail = false;
    }

    init(options) {
        // Merge options with defaults
        options = Object.assign(this, options);

        // Initialise 3D map container
        let mapContainerEl = document.createElement('div');
        mapContainerEl.id = 'ed3dmap';
        this.containerEl.appendChild(mapContainerEl);

        // Load map
        this.launchMap();
    }

    initObjects(options) {
        // TODO: variables were not passed?
        this.action = action;
        this.galaxy = galaxy;
    }

    rebuild(options) {
        loader.start();

        // Remove System & HUD filters
        this.destroy();

        // Reload from JSON
        if (this.jsonPath !== null) {
            this.loadDatasFromFile();
        } else if (this.jsonContainer !== null) {
            this.loadDatasFromContainer();
        }

        this.action.moveInitalPosition();

        loader.stop();
    }

    dstroy() {
        loader.start();

    }
}
