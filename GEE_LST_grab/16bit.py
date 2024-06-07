import os
from osgeo import gdal, osr

def convert_tiffs(input_directory):
    output_directory = f"{input_directory}_16bit"
    if not os.path.exists(output_directory):
        os.makedirs(output_directory)
    print(f"Output directory created at {output_directory}")

    tiffs = [os.path.join(input_directory, f) for f in os.listdir(input_directory) if f.endswith('.tif')]
    for tif in tiffs:
        print(f"Processing {tif}")
        ds = gdal.Open(tif)
        out_tif = os.path.join(output_directory, os.path.splitext(os.path.basename(tif))[0] + '_int16.tif')

        print("Applying scale factor and adjusting data type")
        # Create output dataset directly without intermediate reprojection
        out_ds = gdal.GetDriverByName('GTiff').Create(out_tif, ds.RasterXSize, ds.RasterYSize, ds.RasterCount, gdal.GDT_Int16, options=['COMPRESS=LZW'])
        out_ds.SetGeoTransform(ds.GetGeoTransform())
        out_ds.SetProjection(ds.GetProjection())

        for i in range(ds.RasterCount):
            in_band = ds.GetRasterBand(i+1)
            out_band = out_ds.GetRasterBand(i+1)
            data = in_band.ReadAsArray()
            # Apply scale factor
            scaled_data = data * 0.0049999999
            # Convert to Int16
            int16_data = scaled_data.astype('int16')
            out_band.WriteArray(int16_data)
            out_band.SetNoDataValue(-32767)
            out_band.FlushCache()

        print(f"Writing output to {out_tif}")

        # Cleanup
        ds = None
        out_ds = None

if __name__ == "__main__":
    input_directory = 'SST_tifs'
    convert_tiffs(input_directory)