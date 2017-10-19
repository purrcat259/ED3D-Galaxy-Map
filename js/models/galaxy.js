import { Sprite } from 'three';

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
            coords = {
                x: this.y, // Why is x assigned y?
                y: this.y,
                z: this.z
            },
            cat = []
        };

        this.obj = this.galaxyMap.system.create(settings, true);

        let sprite = Sprite(this.galaxyMap.material.glow_2);
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
}
