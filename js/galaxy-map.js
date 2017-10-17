import Loader from './components/loader';
import Logger from './util/logger';
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
let logger = new Logger();

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

        this.material = new Material();

        this.tween = null;

        this.globalView = true;

        this.fogDensity = null;

        // Defined texts
        this.textSel = [];

        // Object list by categories
        this.catObjs = [];
        this.catObjsRoutes = [];

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
        logger.log('Initialising Galaxy Map');
        // Merge options with defaults
        options = Object.assign(this, options);

        // Initialise 3D map container
        let mapContainerEl = document.createElement('div');
        mapContainerEl.id = 'ed3dmap';
        this.containerEl.appendChild(mapContainerEl);
        this.loadDependencies();
    }

    loadDependencies() {
        logger.log('Loading Textures');
        this.loadTextures();
        logger.log('Loading Sprites');
        this.loadSprites();
    }

    loadTextures() {
        let textureLoader = new THREE.TextureLoader();

        this.textures.flare_white = textureLoader.load(`${this.basePath}textures/lensflare/flare2.png`);
        this.textures.flare_center = textureLoader.load(`${this.basePath}textures/lensflare/flare3.png`);
        this.textures.flare_yellow = textureLoader.load(`${this.basePath}textures/lensflare/star_grey2.png`);
    }

    loadSprites() {
        this.material.glow_1 = new THREE.SpriteMaterial({
            map: this.textures.flare_yellow,
            color: 0xffffff,
            transparent: false,
            fog: true
        });
        this.material.glow_2 = new THREE.SpriteMaterial({
            map: this.textures.flare_white,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.5
        });
    }
}
