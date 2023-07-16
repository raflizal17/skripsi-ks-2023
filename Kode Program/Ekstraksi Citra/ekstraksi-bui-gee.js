// Import region data
var jateng = ee.FeatureCollection("projects/ee-221910812/assets/
JawaTengah_KEC");
// Create cloud masking function
var masking = function CloudMask(image) {
  var QA60 = image.select(['QA60']);
  var clouds = QA60.bitwiseAnd(1<<10).or(QA60.bitwiseAnd(1<<11)); // this gives us cloudy pixels
  return image.updateMask(clouds.not()); // remove the clouds from image
};
// Import and filtering data S2, cloud selection, and cloud masking
var S2_masked = ee.ImageCollection('COPERNICUS/S2_SR')
                        .filterDate("2021-01-01", "2021-12-31")
                        .filterBounds(jateng)
                        .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
                        .map(masking);                     
// Reducing an ImageCollection
var S2_masked_median = S2_masked.median();
// Band Selection
Map.addLayer(S2_masked_median.clip(jateng), {bands:['B4','B3','B2'], min:0, max:3000}, 'True-colour-p1');
Map.addLayer(S2_masked_median.clip(jateng), {bands:['B8','B3','B2'], min:0, max:3000}, 'False-colour');
Map.centerObject(jateng, 10);
// Compute BUI (Band Compositing)
var BUI = S2_masked_median.expression(
          "((SWIR - NIR) / (SWIR + NIR)) - ((NIR-RED)/(NIR+RED)) ",
          {
            RED : S2_masked_median.select("B4"),
            NIR : S2_masked_median.select("B8"),
            SWIR : S2_masked_median.select("B11")
          });
// Visualizing
Map.addLayer(BUI.clip(jateng), {min:-2, max:1}, "BUI");
// Export GeoTIFF Image
Export.image.toDrive({
  image: BUI.clip(jateng),
  folder: 'SKRIPSI_RAFLI',
  description: 'BUI_JATENG_CLOUDMASK',
  fileNamePrefix: 'BUI_JATENG_CLOUDMASK',
  scale: 10,
  region: jateng,
  maxPixels: 1e13,
  fileFormat: 'GeoTIFF'
});
