import {
    Sprite,
    Object3D,
    TextureLoader,
    MeshBasicMaterial,
    AdditiveBlending,
    DoubleSide,
    PlaneGeometry,
    Mesh,
    FontUtils,
    ShapeGeometry,
    Matrix4,
    Vector3,
    Color,
    VertexColors,
    PointsMaterial
} from 'three';

export default class Galaxy {
    constructor(galaxyMap) {
        this.galaxyMap = galaxyMap;
        this.scene = galaxyMap.scene;

        this.obj = null;
        this.infos = null;
        this.milkyway = [];
        this.milkyway2D = [];
        this.backActive = [];
        this.colours = [];

        this.x = 25;
        this.y = -21;
        this.z = 25900;

        this.action = null;
    }

    remove() {
        this.scene.remove(this.milkyway2D);
    }

    addGalaxyCenter() {
        let settings = {
            name: 'Sagittarius A*',
            coords: {
                x: this.y, // Why is x assigned y?
                y: this.y,
                z: this.z
            },
            cat: []
        };

        this.obj = this.galaxyMap.system.create(settings, true);

        let sprite = new Sprite(this.galaxyMap.material.glow_2);
        sprite.scale.set(50, 40, 2.0);
        this.obj.add(sprite);

        this.createParticles();
        this.add2DPlane();
    }

    createParticles() {
        let img = new Image();
        let self = this;

        img.onload = () => {
            // Get height data
            self.getHeightData(img, self);

            // TODO: Needs action class
            if (this.galaxyMap.startAnim) {
                this.galaxyMap.camera.position.set(-10000, 40000, 50000);
                // Action.moveInitalPosition(4000);
            } else {
                // Action.moveInitalPositionNoAnim();
            }
        };
    }

    // Add 2D image plane
    showGalaxyInfos() {
        this.infos = new Object3D();
        let self = this;

        // TODO: Add milkyway-ed.json loading
    }

    // Show additional galaxy info
    infosShow() {
        // TODO
    }

    // Hide additional galaxy infos
    infosHide() {
        // TODO
    }

    // Apply opacity for milky way info based on distance
    infosUpdateCallback(scale) {
        // TODO
    }

    // Add 2D image plane
    add2DPlane() {
        let textureLoader = new TextureLoader();

        let back2D = textureLoader.load(`${this.galaxyMap.basePath}textures/heightmap7.jpg`);

        let floorMaterial = new MeshBasicMaterial({
            map: back2D,
            transparent: true,
            opacity: 0.4,
            blending: AdditiveBlending,
            depthWrite: false,
            side: DoubleSide
        });

        let floorGeometry = new PlaneGeometry(104000, 104000, 1, 1);
        this.milkyway2D = new Mesh(floorGeometry, floorMaterial);
        this.milkyway2D.position.set(this.x, this.y, -this.z);
        this.milkyway2D.rotation.x = -Math.PI / 2;
        this.milkyway2D.showCoord = true;

        this.galaxyMap.scene.add(this.milkyway2D);
    }

    addText(textShow, x, y, z, rot, size, revert) {
        revert = revert || false;
        size = size || 450;
        textShow = textShow.toUpperCase();

        let textShapes = FontUtils.generateShapes(textShow, {
            font: 'helvetiker',
            weight: 'normal',
            style: 'normal',
            size: size,
            curveSegments: 12
        });

        let textGeo = new ShapeGeometry(textShapes);

        let textMesh = new Mesh(textGeo, new MeshBasicMaterial({
            color: 0x999999,
            transparent: true,
            opacity: 0.7,
            blending: AdditiveBlending,
            depthWrite: false
        }));

        textMesh.geometry = textGeo;
        textMesh.geometry.needsUpdate = true;

        let middleText = Math.round(size / 2);
        z -= middleText;

        textMesh.rotation.x = -Math.PI / 2;
        textMesh.geometry.applyMatrix(
            new Matrix4().makeTranslation(-Math.round(textShow.length * size / 2),
            0,
            -middleText
        ));

        if (rot !== 0) {
            textMesh.rotateOnAxis(new Vector3(0, 0, 1), Math.Pi * (rot) / 180);
        }
        textMesh.position.set(x, y, -z);
        textMesh.revert = revert;

        this.infos.add(textMesh);
    }

    getHeightData(img, obj) {
        let particles = new Geometry;
        let particlesBig = new Geometry;

        // Get pixels from milkway image

        let canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        let context = canvas.getContext('2d');

        let size = img.wdith * img.height;

        context.drawImage(img, 0, 0);

        let imgd = context.getImageData(0, 0, img.width, img.height);
        let pix = imgd.data;

        // Build galaxy from image data

        let j = 0;
        let min = 8;
        let nb = 0;
        let maxDensity = 15;

        let scaleImg = 21;

        let colorsBig = [];
        let nbBig = 0;

        for (let i = 0; i < pix.length; i += 20) {
            if (Math.random() > 0.5) {
                i += 8;
            }

            let all = pix[i] + pix[i + 1] + pix [i + 2];

            let avg = Math.round((pix[i] + pix[i+1] + pix[i+2]) / 3);

            if (avg > min) {
                let x = scaleImg * ((i / 4) % img.width);
                let z = scaleImg * (Math.floor(i / 4) / img.height);

                let density = Math.floor((pix[i] - min) / 10);
                density = density > maxDensity ? maxDensity : density;

                let add = Math.ceil(density / maxDensity * 2);
                for (let y = -density; y < density; y += add) {
                    let particle = new Vector3(
                        x + ((Math.random() - 0.5) * 25),
                        (y * 10) + ((Math.random() - 0.5) * 50),
                        z + ((Math.random() - 0.5) * 25)
                    );

                    let r = Math.round(pix[i]);
                    let g = Math.round(pix[i + 1]);
                    let b = Math.round(pix[i + 2]);

                    // Big particle
                    if (density >= 2 && Math.abs(y) - 1 === 0 &&  Math.random() * 1000 < 200) {
                        particlesBig.vertices.push(particle);
                        colorsBig[nbBig] = new Color(`rgb(${r}, ${g}, ${b})`);
                        nbBig++;

                    // Small particle

                    } else if (density < 4 || (Math.random() * 1000 < 400-(density*2))) {
                        particles.vertices.push(particle);
                        obj.colors[nb] = new Color(`rgb(${r}, ${g}, ${b})`);
                        nb++;
                    }
                }
            }
        }

        // Create small particles milky way

        particles.colors = obj.colors;

        let particleMaterial = new PointsMaterial({
            map: this.galaxyMap.textures.flare_yellow,
            transparent: true,
            size: 64,
            vertexColors: VertexColors,
            blending: AdditiveBlending,
            depthTest: true,
            depthWrite: false
        });

        let points = new Points(particles, particleMaterial);
        points.sortParticles = true;
        particles.center();

        obj.milkyway[0] = points;
        obj.milkyway[0].scale.set(20, 20, 20);

        obj.obj.add(points);

        // Create big particles milkyway

        particlesBig.colors = colorsBig;

        let particleMaterialBig = new PointsMaterial({
            map: this.galaxyMap.textures.flare_yellow,
            transparent: true,
            vertexColors: VertexColors,
            size: 16,
            blending: AdditiveBlending,
            depthTest: true,
            depthWrite: false
        });

        let pointsBig = new Points(particlesBig, particleMaterialBig);
        pointsBig.sortParticles = true;
        particlesBig.center();

        obj.milkyway[1] = pointsBig;
        obj.milkyway[1].scale.set(20, 20, 20);

        obj.obj.add(pointsBig);
    }
}
