import GalaxyMap from './galaxy-map'

let mapEl = document.getElementById('galaxyMap');

let map = new GalaxyMap(mapEl);
map.init();
map.launchMap();
// map.animate();
