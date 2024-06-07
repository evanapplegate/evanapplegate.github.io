import os
import numpy as np
from osgeo import gdal

def process_tiffs(sst_dir, lst_dir, output_dir):
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    print(f"Output directory created at {output_dir}")

    sst_tiffs = [os.path.join(sst_dir, f) for f in os.listdir(sst_dir) if f.endswith('.tif')]
    lst_tiffs = [os.path.join(lst_dir, f) for f in os.listdir(lst_dir) if f.endswith('.tif')]

    for idx, (sst_tif, lst_tif) in enumerate(zip(sorted(sst_tiffs), sorted(lst_tiffs)), start=1):
        print(f"Processing SST: {sst_tif} and LST: {lst_tif}")
        sst_ds = gdal.Open(sst_tif)
        lst_ds = gdal.Open(lst_tif)

        sst_band = sst_ds.GetRasterBand(1).ReadAsArray().astype(np.int16)
        lst_band = lst_ds.GetRasterBand(1).ReadAsArray().astype(np.int16)

        nodata_value = -32767  # LST NoData value

        # Ensure SST data is preserved correctly
        # Overlay LST on SST, treating LST NoData as transparent
        combined_array = np.where((lst_band != nodata_value) & (lst_band != -32768), lst_band, sst_band)

        out_tif = os.path.join(output_dir, f"combined{idx}.tif")
        driver = gdal.GetDriverByName('GTiff')
        out_ds = driver.Create(out_tif, sst_ds.RasterXSize, sst_ds.RasterYSize, 1, gdal.GDT_Int16, options=['COMPRESS=LZW'])
        out_ds.SetGeoTransform(sst_ds.GetGeoTransform())
        out_ds.SetProjection(sst_ds.GetProjection())
        out_band = out_ds.GetRasterBand(1)
        out_band.WriteArray(combined_array)
        out_band.SetNoDataValue(nodata_value)
        out_band.FlushCache()

        print(f"Combined TIFF written to {out_tif}")

        sst_ds = None
        lst_ds = None
        out_ds = None

if __name__ == "__main__":
    sst_dir = 'SST_tifs_16bit'
    lst_dir = 'LST_tifs'
    output_dir = 'Combined_tifs'
    process_tiffs(sst_dir, lst_dir, output_dir)