//--
let camera;
let controls;
let scene;
let light;
let renderer;

let raycaster;

let composer;

//-- Map Vars
let container;
let routes = [];
let lensFlareSel;


export class Ed3dMap {
    constructor() {
        this.container = null;
        this.basePath = './';

        this.jsonPath = null;
        this.jsonContainer = null;
        this.json = null;

        this.grid1H = null;
        this.grid1K = null;
        this.grid1XL = null;

        this.tween = null;

        this.globalView = null;

        //-- Fog density save
        this.fogDensity = null;

        //-- Defined texts
        this.textSel = [];

        //-- Object list by categories
        this.catObjs = null;
        this.catObjsRoutes = [];

        this.material = {
            trd: new THREE.MeshBasicMaterial({
                color: 0xffffff
            }),
            line: new THREE.LineBasicMaterial({
                color: 0xcccccc
            }),
            white: new THREE.MeshBasicMaterial({
                color: 0xffffff
            }),
            orange: new THREE.MeshBasicMaterial({
                color: 0xFF9D00
            }),
            black: new THREE.MeshBasicMaterial({
                color: 0x010101
            }),
            lightblue: new THREE.MeshBasicMaterial({
                color: 0x0E7F88
            }),
            darkblue: new THREE.MeshBasicMaterial({
                color: 0x16292B
            }),
            selected: new THREE.MeshPhongMaterial({
                color: 0x0DFFFF
            }),
            grey: new THREE.MeshPhongMaterial({
                color: 0x7EA0A0
            }),
            transparent: new THREE.MeshBasicMaterial({
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

        //-- Default color for system sprite
        this.systemColor = '#eeeeee';

        //-- HUD
        this.withHudPanel = false;
        this.withOptionsPanel = true;
        this.hudMultipleSelect = true;

        //-- Systems
        this.systems = [];

        //-- Starfield
        this.starfield = null;

        //-- Start animation
        this.startAnim = true;

        //-- Scale system effect
        this.effectScaleSystem = [10, 800];

        //-- Graphical Options
        this.optDistObj = 1500;

        //-- Player position
        this.playerPos = [0, 0, 0];

        //-- Initial camera position
        this.cameraPos = null;

        //-- Active 2D top view
        this.isTopView = false;

        //-- Show galaxy infos
        this.showGalaxyInfos = false;

        //-- Show names near camera
        this.showNameNear = false;

        //-- Popup mode for click on detail
        this.popupDetail = false;

        //-- Objects
        this.action = null;
        this.galaxy = null;

        //-- With button to toggle fullscreen
        this.withFullscreenToggle = false;

        //-- Collapse subcategories (false: don't collapse)
        this.categoryAutoCollapseSize = false;
    }


  /**
   * Init Ed3d map
   *
   */

    init(options) {
        this.options = options;

        // OPTIONS
        this.container = options.container;
        this.jsonPath = options.jsonPath;
        this.withHudPanel = options.withHudPanel;
        this.hudMultipleSelect = options.hudMultipleSelect;
        this.effectScaleSystem = options.effectScaleSystem;
        this.startAnim = options.startAnim;
        this.showGalaxyInfos = options.showGalaxyInfos;
        this.cameraPos = options.cameraPos;
        this.systemColor = options.systemColor;

        //-- Init 3D map container
        let mapDiv = document.createElement('div');
        mapDiv.id = 'ed3dmap';
        let containerEl = documet.getElementById(this.container);
        containerEl.appendChild(mapDiv);

        //-- Load dependencies
        Loader.update('Load core files');

        if(typeof isMinified !== 'undefined') return Ed3d.launchMap();

        // Dependencies will be bundled
        // $.when(
        //
        //     $.getScript(Ed3d.basePath + "vendor/three-js/OrbitControls.js"),
        //     $.getScript(Ed3d.basePath + "vendor/three-js/CSS3DRenderer.js"),
        //     $.getScript(Ed3d.basePath + "vendor/three-js/Projector.js"),
        //     $.getScript(Ed3d.basePath + "vendor/three-js/FontUtils.js"),
        //     $.getScript(Ed3d.basePath + "vendor/three-js/helvetiker_regular.typeface.js"),
        //
        //     $.getScript(Ed3d.basePath + "js/components/grid.class.js"),
        //     $.getScript(Ed3d.basePath + "js/components/icon.class.js"),
        //     $.getScript(Ed3d.basePath + "js/components/hud.class.js"),
        //     $.getScript(Ed3d.basePath + "js/components/action.class.js"),
        //     $.getScript(Ed3d.basePath + "js/components/route.class.js"),
        //     $.getScript(Ed3d.basePath + "js/components/system.class.js"),
        //     $.getScript(Ed3d.basePath + "js/components/galaxy.class.js"),
        //     $.getScript(Ed3d.basePath + "js/components/heat.class.js"),
        //
        //     $.getScript(Ed3d.basePath + "vendor/tween-js/Tween.js"),
        //
        //     $.Deferred(function( deferred ){
        //         $( deferred.resolve );
        //     })
        //
        // ).done(function() {
        //
        //   Loader.update('Done !');
        //   Ed3d.launchMap();
        //
        // });

    }

      /**
       * Init objects
       */

    initObject(options) {
        //-- Init Object
        // TODO: Initialise Action and Galaxy at the top
        this.Action = Action;
        this.Galaxy = Galaxy;
    }

    /**
     * Rebuild completely system list and filter (for new JSon content)
     */

    rebuild(options) {

        // TODO: initialise Loader
        Loader.start();

        // Remove System & HUD filters
        this.destroy();

        // Reload from JSON
        if (this.jsonPath) {
            Ed3d.loadDatasFromFile();
        } else if(this.jsonContainer) {
            Ed3d.loadDatasFromContainer();
        }

        this.Action.moveInitalPosition();

        // TODO: initialise Loader
        Loader.stop();
    }

    /**
      * Destroy the 3dmap
      */

    destroy() {

        Loader.start();

        // Remove System & HUD filters
        // TODO: Initialise
        System.remove();
        HUD.removeFilters();
        Route.remove();
        Galaxy.remove();

        Loader.stop();

    }

    /**
     * Launch
     */

    launchMap() {

        this.initObjects();

        Loader.update('Textures');
        this.loadTextures();

        Loader.update('Launch scene');
        this.initScene();

        // Create grid

        this.grid1H  = Object.assign({}, Grid.init(100, 0x111E23, 0));
        this.grid1K  =  Object.assign({}, Grid.init(1000, 0x22323A, 1000));
        this.grid1XL =  Object.assign({}, Grid.infos(10000, 0x22323A, 10000));

        // Add some scene enhancement
        this.skyboxStars();

        // Create HUD
        HUD.create("ed3dmap");

        // Add galaxy center
        Loader.update('Add Sagittarius A*');
        this.Galaxy.addGalaxyCenter();

        // Load systems
        Loader.update('Loading JSON file');
        if (this.jsonPath) {
            this.loadDatasFromFile();
        } else if(this.jsonContainer) {
            this.loadDatasFromContainer();
        } else if (document.getElementsByClassName('ed3d-item').length > 0) {
            this.loadDatasFromAttributes();
        } else if(this.json) {
            this.loadDatas(this.json);
            this.loadDatasComplete();
            this.showScene();
        } else {
            Loader.update('No JSON found.');
        }

        if (!this.startAnim) {
            this.grid1XL.hide();
            this.Galaxy.milkyway2D.visible = false;
        }

        // Animate
        animate();
    }

    /**
     * Load Textures
     */

    loadTextures() {
        //-- Load textures for lensflare
        let texloader = new THREE.TextureLoader();

        //-- Load textures
        this.textures.flare_white = texloader.load(`${this.basePath}textures/lensflare/flare2.png`);
        this.textures.flare_yellow = texloader.load(`${this.basePath}${this.starSprite}`);
        this.textures.flare_center = texloader.load(`${this.basePath}textures/lensflare/flare3.png`);

        //-- Load sprites
        this.material.glow_1 = new THREE.SpriteMaterial({
            map: this.textures.flare_yellow,
            color: 0xffffff,
            transparent: false,
            fog: true
        });

        this.material.glow_2 = new THREE.SpriteMaterial({
            map: Ed3d.textures.flare_white,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.5
        });
    }

    addCustomMaterial(id, color) {
        color = new THREE.Color(`#${color}`);
        this.colors[id] = color;
    }

    /**
     * Init Three.js scene
     */

    initScene() {
        container = document.getElementById('ed3dmap');

        // Scene
        scene = new THREE.Scene();
        scene.visible = false;
        /*scene.scale.set(10,10,10);*/

        //  Camera
        let aspectRatio = container.offsetWidth / container.offsetHeight;
        camera = new THREE.PerspectiveCamera(45, aspectRatio, 1, 200000);
        //camera = new THREE.OrthographicCamera( container.offsetWidth / - 2, container.offsetWidth / 2, container.offsetHeight / 2, container.offsetHeight / - 2, - 500, 1000 );

        camera.position.set(0, 500, 500);

        //HemisphereLight
        light = new THREE.HemisphereLight(0xffffff, 0xcccccc);
        light.position.set(-0.2, 0.5, 0.8).normalize();
        scene.add(light);

        //WebGL Renderer
        renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true
        });
        renderer.setClearColor(0x000000, 1);
        renderer.setSize(container.offsetWidth, container.offsetHeight);
        renderer.domElement.style.zIndex = 5;
        container.appendChild(renderer.domElement);

        //controls
        controls = new THREE.OrbitControls(camera, container);
        controls.rotateSpeed = 0.6;
        controls.zoomSpeed = 2.0;
        controls.panSpeed = 0.8;
        controls.maxDistance = 60000;
        controls.enableZoom = 1;
        controls.enablePan = 1;
        controls.enableDamping = !0;
        controls.dampingFactor = .3;


        // Add Fog
        scene.fog = new THREE.FogExp2(0x0D0D10, 0.000128);
        renderer.setClearColor(scene.fog.color, 1);
        this.fogDensity = scene.fog.density;
    }

    /**
     * Show the scene when fully loaded
     */

    showScene() {
        Loader.stop();
        scene.visible = true;
    }

    /**
     * Load Json file to fill map
     */

    loadDatasFromFile() {
        let request = new XMLHttpRequest();
        request.open('GET', this.jsonPath, true);

        request.onload = () => {
            if (request.status >= 200 && request.status < 400) {
                let data = JSON.parse(request.responseText);
                this.loadDatas(data);
                this.loadDatasComplete();
                this.showScene();
            }
        };

        request.send();
    }

    loadDatasFromContainer() {
        let jsonContainer = document.getElementById(this.jsonContainer);
        let content = jsonContainer.innerHTML;
        let json = null;

        try {
            json = JSON.parse(content);
        } catch (e) {
            console.error('Cannot load JSON for systems');
        }
        if (json) {
            this.loadDatas(json);
        }
        this.loadDatasComplete();
        this.showScene();
    }


    loadDatasFromAttributes() {
        let jsonContainer = document.getElementById(this.jsonContainer);
        let content = jsonContainer.innerHTML;
        let json = [];
        let containers = document.getElementsByClassName('ed3d-item');
        for (let i = 0; i < containers.length; i++) {
            let cont = containers[i];
            let objName = cont.innerHTML;
            let coords = cont.coords.split(',');
            if (coords.length === 3) {
                json.push(
                    {
                        name:objName,
                        coords: {
                            x:coords[0],
                            y:coords[1],
                            z:coords[2]
                        }
                    }
                );
            }
        }

        if (json) {
            this.loadDatas(json);
        }
        this.loadDatasComplete();
        this.showScene();
    }


    loadDatas(data) {

        //-- Init Particle system
        System.initParticleSystem();

        //-- Load cat filters
        if(data.categories) {
            HUD.initFilters(data.categories)
        };

        //-- Check if simple or complex json
        list = (data.systems !== undefined) ? data.systems : data;

        //-- Init Routes

        Loader.update('Routes...');
        if (data.routes) {
            for (let key in data.routes) {
                Route.initRoute(key, data.routes[key]);
            }
        }

        //-- Loop into systems

        Loader.update('Systems...');
        for (let key in list) {
            let val = list[key];
            system = System.create(val);
            if (system) {
              if (val.cat) {
                  this.addObjToCategories(system,val.cat);
              }
              if (val.cat) {
                  this.systems.push(system);
              }
            }
        }

        //-- Routes

        if (data.routes) {
            for (let key in data.routes) {
                let route = data.routes[key];
                Route.createRoute(key, route);
            }
        }

          //-- Heatmap
        if (data.heatmap) {
            Heatmap.create(data.heatmap);
        }

        //-- Check start position in JSON
        if (this.startAnim && data.position) {
            this.playerPos = [
                data.position.x,
                data.position.y,
                data.position.z
            ];

            let camX = (parseInt(data.position.x) - 500);
            let camY = (parseInt(data.position.y) + 8500);
            let camZ = (parseInt(data.position.z) - 8500);
            this.cameraPos = [camX, camY, camZ];

            Action.moveInitalPosition(4000);
        }

    }

    loadDatasComplete() {
        System.endParticleSystem();
        HUD.init();
        this.Action.init();
    }

    /**
      * Add an object to a category
      */

    addObjToCategories(index, catList) {
        for (let key in catList) {
            let idCat = catList[key];
            if (this.catObjs[idCat]) {
                this.catObjs[idCat].push(index);
            }
        }
    }

    /**
      * Create a skybox of particle stars
      */

    skyboxStars() {
        let sizeStars = 10000;
        let particles = new THREE.Geometry;
        for (let p = 0; p < 5; p++) {
            let particle = new THREE.Vector3(
                Math.random() * sizeStars - (sizeStars / 2),
                Math.random() * sizeStars - (sizeStars / 2),
                Math.random() * sizeStars - (sizeStars / 2)
            );
            particles.vertices.push(particle);
        }

        let particleMaterial = new THREE.PointsMaterial({
            color: 0xeeeeee,
            size: 2
        });
        this.starfield = new THREE.Points(particles, particleMaterial);

        scene.add(this.starfield);
    }


    /**
      * Calc distance from Sol
      */

    calcDistSol(target) {
        let dx = target.x;
        let dy = target.y;
        let dz = target.z;

        return Math.round(Math.sqrt(dx * dx + dy * dy + dz * dz));
    }


}

// let Ed3d = new Ed3dMap();

//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------
//------------------------------------------------------------------------------

let animate = (time) => {

  //rendererStats.update(renderer);

    if (!scene.visible) {
        requestAnimationFrame(animate);
        return;
    }

    refreshWithCamPos();
    //controls.noRotate().set(false);
    //controls.noPan().set(false);
    //controls.minPolarAngle = 0;
    //controls.maxPolarAngle = 0;

    controls.update();

    TWEEN.update(time);

    //-- If 2D top view, lock camera pos
    if(Ed3d.isTopView) {
        camera.rotation.set(-Math.PI/2,0,0);
        camera.position.x = controls.target.x;
        camera.position.z = controls.target.z;
    }


    renderer.render(scene, camera);


    document.getElementById('cx').innerHTML = Math.round(controls.target.x);
    document.getElementById('cy').innerHTML = Math.round(controls.target.y);
    document.getElementById('cz').innerHTML = Math.round(-controls.target.z);   // Reverse z coord

    document.getElementById('distsol').innerHTML = Ed3d.calcDistSol(controls.target);

    //-- Move starfield with cam
    Ed3d.starfield.position.set(
        controls.target.x - (controls.target.x / 10) % 4000,
        controls.target.y - (controls.target.y / 10) % 4000,
        controls.target.z - (controls.target.z / 10) % 4000
    );

    //-- Change selection cursor size depending on camera distance

    let scale = distanceFromTarget(camera) / 200;

    this.Action.updateCursorSize(scale);

    HUD.rotateText('system');
    HUD.rotateText('coords');
    HUD.rotateText('system_hover');

    //-- Zoom on on galaxy effect
    this.Action.sizeOnScroll(scale);

    this.Galaxy.infosUpdateCallback(scale);

    if (scale > 25) {
        enableFarView(scale);
    } else {
        disableFarView(scale);
    }

    this.Action.updatePointClickRadius(scale);

    requestAnimationFrame(animate);
}

let isFarView = false;

let enableFarView = (scale, withAnim) => {
    if (isFarView || !this.Galaxy) {
        return;
    }
    withAnim = withAnim || true;

    isFarView = true;

    //-- Scale change animation
    let scaleFrom = {
        zoom:25
    };
    let scaleTo = {
        zoom:500
    };
    if (withAnim) {

        let obj = this;

        //controls.enabled = false;
        Ed3d.tween = new TWEEN.Tween(scaleFrom, {override: true}).to(scaleTo, 500)
            .start()
            .onUpdate(() => {
                obj.Galaxy.milkyway[0].material.size = scaleFrom.zoom;
                obj.Galaxy.milkyway[1].material.size = scaleFrom.zoom * 4;
            });
    } else {
        this.Galaxy.milkyway[0].material.size = scaleTo;
        this.Galaxy.milkyway[1].material.size = scaleTo * 4;
    }

    //-- Enable 2D galaxy
    this.Galaxy.milkyway2D.visible = true;
    this.Galaxy.infosShow();

    //this.Galaxy.obj.scale.set(20,20,20);

    this.Action.updateCursorSize(60);

    Ed3d.grid1H.hide();
    Ed3d.grid1K.hide();
    Ed3d.grid1XL.show();
    Ed3d.starfield.visible = false;
    scene.fog.density = 0.000009;
}

let disableFarView = (scale, withAnim) => {

    if(!isFarView) {
        return;
    }
    withAnim = withAnim || true;

    isFarView = false;
    let oldScale = parseFloat(1 / (25 / 3));

    //-- Scale change animation

    let scaleFrom = {
        zoom:250
    };
    let scaleTo = {
        zoom:64
    };
    if (withAnim) {
        let obj = this;
        //controls.enabled = false;
        Ed3d.tween = new TWEEN.Tween(scaleFrom, {override: true}).to(scaleTo, 500)
            .start()
            .onUpdate(() => {
                obj.Galaxy.milkyway[0].material.size = scaleFrom.zoom;
                obj.Galaxy.milkyway[1].material.size = scaleFrom.zoom;
            });
    } else {
        this.Galaxy.milkyway[0].material.size = scaleTo;
        this.Galaxy.milkyway[1].material.size = scaleTo;
    }

    //-- Disable 2D galaxy
    this.Galaxy.milkyway2D.visible = false;
    this.Galaxy.infosHide();

    //-- Show element
    this.Galaxy.milkyway[0].material.size = 16;

    //--
    camera.scale.set(1,1,1);

    this.Action.updateCursorSize(1);

    Ed3d.grid1H.show();
    Ed3d.grid1K.show();
    Ed3d.grid1XL.hide();
    Ed3d.starfield.visible = true;
    scene.fog.density = Ed3d.fogDensity;
}


let render = () => {
    renderer.render(scene, camera);
}

let refresh3dMapSize = () => {
    if(renderer) {
        let width = container.offsetWidth;
        let height = container.offsetHeight;
        if (width < 100) {
            width = 100;
        }
        if (height < 100) {
            height = 100;
        }
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}

window.addEventListener('resize', () => {
    refresh3dMapSize();
});


//--------------------------------------------------------------------------
// Test perf


let distance = (v1, v2) => {
    let dx = v1.position.x - v2.position.x;
    let dy = v1.position.y - v2.position.y;
    let dz = v1.position.z - v2.position.z;

    return Math.round(Math.sqrt(dx * dx + dy * dy + dz * dz));
}

let distanceFromTarget = (v1) => {
    let dx = v1.position.x - controls.target.x;
    let dy = v1.position.y - controls.target.y;
    let dz = v1.position.z - controls.target.z;

    return Math.round(Math.sqrt(dx * dx + dy * dy + dz * dz));
}

let camSave = {x: 0, y: 0, z: 0};

let refreshWithCamPos = () => {

    let d = new Date();
    let n = d.getTime();

    //-- Refresh only every 5 sec
    if (n % 1 != 0) {
        return;
    }

    Ed3d.grid1H.addCoords();
    Ed3d.grid1K.addCoords();

    //-- Refresh only if the camera moved
    let p = Ed3d.optDistObj / 2;
    if (
        camSave.x == Math.round(camera.position.x/p) * p &&
        camSave.y == Math.round(camera.position.y/p) * p &&
        camSave.z == Math.round(camera.position.z/p) * p
    ) {
        return;

    }

    //-- Save new pos
    camSave.x = Math.round(camera.position.x / p) * p;
    camSave.y = Math.round(camera.position.y / p) * p;
    camSave.z = Math.round(camera.position.z / p) * p;

}

// TODO: Move to own file
var Loader = {

  /**
   * Start loader
   */

  'start' : function() {

    $('#loader').remove();
    $('<div></div>')
      .attr('id','loader')
      .html(Loader.svgAnim)
      .css('color','rgb(200, 110, 37)')
      .css('font-size','1.5rem')
      .css('font-family','Helvetica')
      .css('font-variant','small-caps')
      .appendTo('#ed3dmap');


    clearInterval(this.animCount);
    this.animCount = setInterval(function () {
      var animProgress = $('#loader #loadTimer');
      animProgress.append('.');
      if(animProgress.html() != undefined && animProgress.html().length > 10) animProgress.html('.');
    }, 1000);

  },

  /**
   * Refresh infos for current loading step
   */

  'update' : function(info) {

    $('#loader #loadInfos').html(info);

  },

  /**
   * Stop loader
   */

  'stop' : function() {

    $('#loader').remove();
    clearInterval(this.animCount);

  },

  'animCount' : null,
  'svgAnim' : '<div id="loadInfos"></div><div id="loadTimer">.</div><svg width="100" height="100" viewbox="0 0 40 40"><path d="m5,8l5,8l5,-8z"   class="l1 d1" /><path d="m5,8l5,-8l5,8z"   class="l1 d2" /><path d="m10,0l5,8l5,-8z"  class="l1 d3" /><path d="m15,8l5,-8l5,8z"  class="l1 d4" /><path d="m20,0l5,8l5,-8z"  class="l1 d5" /><path d="m25,8l5,-8l5,8z"  class="l1 d6" /><path d="m25,8l5,8l5,-8z"  class="l1 d7" /><path d="m30,16l5,-8l5,8z" class="l1 d8" /><path d="m30,16l5,8l5,-8z" class="l1 d9" /><path d="m25,24l5,-8l5,8z" class="l1 d10" /><path d="m25,24l5,8l5,-8z" class="l1 d11" /><path d="m20,32l5,-8l5,8z" class="l1 d13" /><path d="m15,24l5,8l5,-8z" class="l1 d14" /><path d="m10,32l5,-8l5,8z" class="l1 d15" /><path d="m5,24l5,8l5,-8z"  class="l1 d16" /><path d="m5,24l5,-8l5,8z"  class="l1 d17" /><path d="m0,16l5,8l5,-8z"  class="l1 d18" /><path d="m0,16l5,-8l5,8z"  class="l1 d19" /><path d="m10,16l5,-8l5,8z" class="l2 d0" /><path d="m15,8l5,8l5,-8z"  class="l2 d3" /><path d="m20,16l5,-8l5,8z" class="l2 d6"  /><path d="m20,16l5,8l5,-8z" class="l2 d9" /><path d="m15,24l5,-8l5,8z" class="l2 d12" /><path d="m10,16l5,8l5,-8z" class="l2 d15" /></svg>'

}
