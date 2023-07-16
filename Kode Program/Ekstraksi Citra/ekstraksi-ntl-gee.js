// Import region data
var jateng = ee.FeatureCollection("projects/ee-221910812/assets/
JawaTengah_KEC");
// Import and filtering nighttime data
var collection = ee.ImageCollection("NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG")
  .filter(ee.Filter.date('2021-01-01', '2021-12-31'))
  .select('avg_rad');
// Visualization parameter
var nighttimeVis = {
  min: 0, max: 20
};
// Median reducing and clip region
var median_ntl_jateng = collection.reduce(ee.Reducer.median()).clip(jateng);
// Visualizing
Map.centerObject(jateng, 10);
Map.addLayer(median_ntl_jateng, nighttimeVis, 'NTL_Jateng');
// Export GeoTIFF image
Export.image.toDrive({
  image: median_ntl_jateng,
  folder: 'SKRIPSI_RAFLI',
  description: 'NTL_JATENG',
  fileNamePrefix: 'NTL_JATENG',
  scale: 463.83,
  region: jateng,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});
