import Loader from './components/loader';
import Logger from './util/logger';
import Material from './models/material';
import Action from './models/action';
import System from './models/system';
import Grid from './models/grid';
import * as THREE from 'three';
import OrbitControlsFactory from 'three-orbit-controls';

let OrbitControls = OrbitControlsFactory(THREE);

// ThreeJS
let raycaster;
let composer;

// Map
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

        // Galaxy variables
        this.action = new Action(this);
        this.system = new System(this);
        this.grid = new Grid(this);

        // Map Variables
        this.scene = null;
        this.camera - null;
        this.light = null;
        this.renderer = null;
        this.controls = null;

        // Parts of Map
        this.starField = null;

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
        this.setupEvents();
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

    setupEvents() {
        window.addEventListener('resize', () => {
            this.refresh3dMapSize();
        });
    }

    initScene() {
        this.scene = new THREE.Scene();
        this.hideScene();
        this.camera = new THREE.PerspectiveCamera(
            45,
            this.containerEl.offsetWidth / this.containerEl.offsetHeight,
            1,
            200000
        );
        this.camera.position.set(0, 500, 500);

        // Hemisphere light
        this.light = new THREE.HemisphereLight(0xffffff, 0xcccccc);
        this.light.position.set(-0.2, 0.5, 0.8).normalize();
        this.scene.add(this.light);

        // WebGL renderer
        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setClearColor(0x000000, 1);
        this.renderer.setSize(this.containerEl.offsetWidth, this.containerEl.offsetHeight);
        this.renderer.domElement.style.zIndex = 5;
        this.mapElement.appendChild(this.renderer.domElement);

        // Controls
        this.controls = new OrbitControls(this.camera, this.mapElement);
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

    addSkybox() {
        // TODO: Make configurable
        let starCount = 10000;
        let particles = new THREE.Geometry();
        for (let i = 0; i < 5; i++) {
            let particle = new THREE.Vector3(
                Math.random() * sizeStars - (sizeStars / 2),
                Math.random() * sizeStars - (sizeStars / 2),
                Math.random() * sizeStars - (sizeStars / 2)
            );
            particles.vertices.push(particle);
        }

        let particleMaterial = this.material.particle();
        this.starField = new THREE.Points(particles, particleMaterial);
        this.scene.add(this.starField);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    refresh3dMapSize() {
        if (this.renderer) {
            let width = this.containerEl.offsetWidth > 100 ? this.containerEl.offsetWidth : 100;
            let height = this.containerEl.offsetHeight > 100 ? this.containerEl.offsetHeight : 100;
            this.renderer.setSize(width, height);
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
        }
    }

    calculateDistanceFromSol(target) {
        let dx = target.x;
        let dy = target.y;
        let dz = target.z;

        return Math.round(Math.sqrt(dx * dx + dy * dy + dz * dz));
    }

    animate() {
        // TODO
    }

    launchMap() {
        // this.initObjects();
        logger.log('Initialising Scene');
        this.initScene();

        // Create Grid
        this.grid1H = new Grid(100, 0x111E23, 0).init();
        this.grid1K = new Grid(1000, 0x22323A, 1000).init();
        this.grid1XL = new Grid(10000, 0x22323A, 10000).init();

        // Add the skybox
        this.addSkybox();

        // Create HUD

        // TODO
    }
}
