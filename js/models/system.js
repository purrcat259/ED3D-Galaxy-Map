import {
    Geometry,
    Vector3,
    Sprite,
    SphereGeometry,
    Mesh,
    VertexColors,
    AdditiveBlending,
    Points,
    PointsMaterial
} from 'three';
import Material from './material';

export default class System {
    constructor(galaxyMap) {
        this.galaxyMap = galaxyMap;
        this.particle = null;
        this.particleGeo = new Geometry();;
        this.systemColor = '#eeeeee';
        this.particleColor = [];
        this.particleInfos = [];
        this.count = 0;
        this.scaleSize = 64;
    }

    create(val, withSolid) {
        withSolid = withSolid || false;
        if (!val) {
            return false;
        }

        let x = parseInt(val.coords.x);
        let y = parseInt(val.coords.y);
        let z = -parseInt(val.coords.z);  // Revert Z co-ordinate

        // Particles for near and far view

        let colors = [];
        if (this.particleGeo) {
            // if system withi nfo is already registered, concatenate the data
            let systemId = `${x}_${y}_${z}`;
            let indexParticle = this.particleInfos[systemId];
            if (val.infos && indexParticle) {
                this.particleGeo.vertices[indexParticle].infos += val.infos;
                if (val.cat) {
                    // TODO: Needs access to Ed3d
                    this.galaxyMap.addObjToCategories(indexParticle, val.cat);
                }
                return;
            }

            let particle = new Vector3(x, y, z);

            // attach name and set as clickable

            particle.clickable = true;
            particle.visible = true;
            particle.name = val.name;
            if (val.infos) {
                particle.infos = val.infos;
                this.particleINfos[systemId] = this.count;
            }

            if (val.url) {
                particle.url = val.url;
            }

            this.particleGeo.vertices.push(particle);

            this.count++;

            if (withSolid) {
                let sprite = new Sprite(this.galaxyMap.material.glow_1);
                sprite.position.set(x, y, z);
                sprite.scale.set(50, 50, 1.0);
                this.galaxyMap.scene.add(sprite);

                // Sphere

                let geometry = new SphereGeometry(2, 10, 10);
                let sphere = new Mesh(geometry, Material.white());

                sphere.position.set(x, y, z);
                sphere.name = val.name;
                sphere.clickable = true;
                sphere.idsprite = sprite.id;
                this.galaxyMap.scene.add(sphere);

                return sphere;
            }
        }
    }

    initParticleSystem() {
        this.particleGeo = new Geometry;
    }

    endParticleSystem() {
        let particleMaterial = new PointsMaterial({
            map: this.galaxyMap.textures.flare_yellow,
            vertexColors: VertexColors,
            size: this.scaleSize,
            fog: false,
            blending: AdditiveBlending,
            transparent: true,
            depthTest: true,
            depthWrite: false
        });

        this.particle = new Points(this.particleGeo, particleMaterial);

        this.particle.sortParticles = true;
        this.particle.clickable = true;

        this.galaxyMap.scene.add(this.particle);
    }

    remove() {
        this.particleColor = [];
        this.particleGeo = null;
        this.count = 0;
        this.galaxyMap.scene.remove(this.particle);
    }
}
