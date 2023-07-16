// Import region data
var jateng = ee.FeatureCollection("projects/ee-221910812/assets/
JawaTengah_KEC");
// Import and filter digital elevation model of Elevation and Clip Jateng
var dem = ee.Image('NASA/NASADEM_HGT/001')
                  .select('elevation')
                  .clip(jateng);            
// Median reducing
var dem_median = dem.reduce(ee.Reducer.median());
// Display elevation layers on the map
Map.centerObject(jateng);
Map.addLayer(dem_median, {min:0, max:2000}, 'Elevation');
// Export GeoTIFF Image
Export.image.toDrive({
    image: dem_median,
    description: 'jateng_elevation',
    folder: 'SKRIPSI_RAFLI',
    fileNamePrefix: 'DEM_Elevation_JATENG',
    region: jateng,
    scale: 30,
    maxPixels: 1e9,
    crs: 'EPSG:4326'
});
