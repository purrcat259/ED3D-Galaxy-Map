import Loader from './components/loader';
import Logger from './util/logger';
import Material from './models/material';
import * as THREE from 'three';

// ThreeJS
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
        this.mapElement = null;
        this.basePath = './';

        // Map Variables
        this.scene = null;
        this.camera - null;
        this.light = null;
        this.renderer = null;
        this.controls = null;

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
        this.mapElement = mapContainerEl;
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

    initScene() {
        this.scene = new THREE.Scene();
        this.hideScene();
        this.camera = new THREE.PerspectiveCamera(
            45,
            container.offsetWidth / container.offsetHeight,
            1,
            200000
        );
        this.camera.position.set(0, 500, 500);

        // Hemisphere light
        this.light = new THREE.HemisphereLight(0xffffff, 0xcccccc);
        this.light.position.set(-0.2, 0.5, 0.8).normalize();
        this.scene.add(light);

        // WebGL renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.setSize(container.offsetWidth, container.offsetHeight);
        this.renderer.domElement.style.zIndex = 5;
        this.mapElement.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new THREE.OrbitControls(this.camera, this.mapElement);
        this.controls.rotateSpeed = 0.6;
        this.controls.zoomSpeed = 2.0;
        this.controls.panSpeed = 0.8;
        this.controls.maxDistance = 60000;
        this.controls.enableZoom = 1;
        this.controls.enablePan = 1;
        this.controls.enableDamping = !0;
        this.controls.dampingFactor = 0.3;

        // Add Fog
        this.scene.fog = new THREE.FogExp2(0x0D0D10, 0.000128);
        this.renderer.setClearColor(this.scene.fog.color, 1);
        this.fogDensity = this.scene.fog.density;
    }

    showScene() {
        this.scene.visible = true;
    }

    hideScene() {
        this.scene.visible = false;
    }
}
