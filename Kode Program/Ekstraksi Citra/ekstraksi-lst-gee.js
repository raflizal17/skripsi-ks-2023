// Import region data
var jateng = ee.FeatureCollection("projects/ee-221910812/assets/
JawaTengah_KEC");
// Quality Assessment (cloud mask)
function masking(image) {   
  var qa = image.select('QC_Day');   
  var Mandatory = 1 << 1;   
  var DataQuality = 1 << 3;   
  var LSTerror = 1 << 7;   
  var mask = qa.bitwiseAnd(Mandatory).eq(0)       
  .and(qa.bitwiseAnd(DataQuality).eq(0))
  .and(qa.bitwiseAnd(LSTerror).eq(0)); 
  return image.updateMask(mask); 
}                                  
// Import and filtering LST data
var MODIS = ee.ImageCollection("MODIS/061/MOD11A1");
var LST = MODIS.filter(ee.Filter.date('2021-01-01', '2021-12-31'))
               .map(masking)
               .select('LST_Day_1km');
// Median reducing and clip region
var LST_median_jateng = LST.median().clip(jateng);
// Visualization parameter
var LST_Vis = {
  palette: ['green', 'orange', 'red']
};
// Visualization
Map.centerObject(jateng, 10);
Map.addLayer(LST_median_jateng, LST_Vis, 'Daytime LST');
// Export GeoTIFF Image
Export.image.toDrive({   
  image : LST_median_jateng,
  description: '2021_Jateng_MODIS',   
  folder : 'SKRIPSI_RAFLI',   
  region: jateng,   
  scale : 1000,   
  maxPixels: 1e10 });
