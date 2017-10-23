import Ed3dMap from '../ed3dmap';

let d = new Date()
d.setDate(d.getDate() - 1);
let queryDate = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()+' '+d.getHours()+':00:00';

let map = new Ed3dMap();

map.init({
    container   : 'edmap',
   // jsonPath    : "http://www.edsm.net/api-v1/systems?coords=1&known=1&startdatetime="+queryDate,
    jsonPath    : "./json_samples/galnet.json",
    withHudPanel : false,
    hudMultipleSelect : false,
    effectScaleSystem : [50,10000],
    startAnim: false,
    showGalaxyInfos: true,
    cameraPos: [25,14100,-12900],
    systemColor: '#FF9D00'
});
