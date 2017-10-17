import Loader from './components/loader';
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

export default class Ed3d {
    constructor() {
        this.container = container;
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

        // Materials
        this.material = {
            Trd: new THREE.MeshBasicMaterial({ color: 0xffffff }),
            line: new THREE.LineBasicMaterial({ color: 0xcccccc }),
            white: new THREE.MeshBasicMaterial({ color: 0xffffff }),
            orange: new THREE.MeshBasicMaterial({ color: 0xFF9D00 }),
            black: new THREE.MeshBasicMaterial({ color: 0x010101 }),
            lightblue : new THREE.MeshBasicMaterial({ color: 0x0E7F88 }),
            darkblue : new THREE.MeshBasicMaterial({ color: 0x16292B }),
            selected : new THREE.MeshPhongMaterial({ color: 0x0DFFFF }),
            grey : new THREE.MeshPhongMaterial({ color: 0x7EA0A0 }),
            transparent : new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0
            }),
            glow_1: null,
            custom: []
        };

        this.starSprite = 'textures/lensflare/star_grey2.png';

        this.colors = [];
        this.textures = {};

        // Default colour for system sprite
        this.systemColor = '#eeeeee';

        // HUD
        this.withHudPanel = false;
        this.withOptionsPanel = true;
        this.hudMultipleSelect = true;

        this.systems = [];

        this.starfield = null;

        this.startAnim = true;

        this.effectScaleSystem = [10, 800];

        // Graphical Options
        this.optDistObj = 1500;

        this.playerPos = [0, 0, 0];

        this.cameraPos = null;

        this.isTopView = false;

        this.showGalaxyInfos = false;

        this.showNameNear = false;

        this.popupDetail = false;

        // Objects
        this.action = null;
        this.galaxy = null;

        this.withFullscreenToggle = false;

        //-- Collapse subcategories (false: don't collapse)
        this.categoryAutoCollapseSize = false;
    }

    init(options) {
        // Merge options with defaults
        options = Object.extend(this, options);

        // Initialise 3D map container
        let mapContainerEl = document.createElement('div');
        mapContainerEl.id = 'ed3dmap';
        this.container.appendChild(mapContainerEl);

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
}
