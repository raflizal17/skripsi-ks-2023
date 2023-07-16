// Import region data
var jateng = ee.FeatureCollection("projects/ee-221910812/assets/
JawaTengah_KEC");
// Import and filtering data CO
var co = ee.ImageCollection('COPERNICUS/S5P/NRTI/L3_CO')
  .select('CO_column_number_density')
  .filterDate('2021-01-01', '2021-12-31')
  .filterBounds(jateng);
// Create a reducer that will compute the median of the inputs
var co_median = co.reduce(ee.Reducer.median()).clip(jateng);
// Visualization parameter
Map.centerObject(jateng);
var band_viz = {
  min: 0, max: 0.05,
  palette: ['black', 'blue', 'purple', 'cyan', 'green', 'yellow', 'red']
};
// Visualizing
Map.addLayer(co_median, band_viz, 'S5P CO');
// Export GeoTIFF Image
Export.image.toDrive({
   image: co_median,
   description: 'JATENG_CO',
   folder: 'SKRIPSI_RAFLI',
   fileNamePrefix: 'JATENG_CO',
   region: jateng,
   scale: 1113.2,
   maxPixels: 1e9,
   crs: 'EPSG:4326'
});
