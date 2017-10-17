export default class System {
    constructor() {
        this.particle = null;
        this.particleGeo = null;
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
                    // Ed3d.addObjToCategories(indexParticle,val.cat);
                }
                return;
            }
        }

    }
}
