from osgeo import gdal, osr
import os

input_dir = 'Combined_tifs'
output_dir = 'colorful_tifs'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)
    print(f"Created output directory: {output_dir}")

def assign_projection(input_file):
    ds = gdal.Open(input_file, gdal.GA_Update)
    sr = osr.SpatialReference()
    sr.ImportFromEPSG(4326)
    ds.SetProjection(sr.ExportToWkt())
    ds = None
    print(f"Assigned EPSG:4326 to {input_file}")

def clip_dataset(input_file, output_file):
    # Clip dataset to specified lat and long bounds
    ds = gdal.Warp(output_file, input_file, 
                   outputBounds=(-180, -90, 0, 90), 
                   dstSRS='EPSG:4326', 
                   cropToCutline=True)
    ds = None
    print(f"Clipped {input_file} to lat -90 to 90 and long -180 to 0 and saved to {output_file}")

def apply_projection_clip_resize_convert(input_file, output_file):
    print(f"Processing {input_file}")
    # Assign EPSG:4326 projection
    assign_projection(input_file)
    # Clip the dataset
    clipped_file = os.path.join(output_dir, "clipped_" + os.path.basename(input_file))
    clip_dataset(input_file, clipped_file)
    # Reproject to Orthographic, ensuring NoData value is carried through
    temp_output_file = os.path.join(output_dir, "temp_" + os.path.basename(output_file))
    ds = gdal.Warp(temp_output_file, clipped_file, dstNodata=-37267, resampleAlg=gdal.GRA_NearestNeighbour, format='GTiff', outputType=gdal.GDT_Byte, options=['-t_srs', '+proj=ortho +lat_0=0 +lon_0=-90 +x_0=0 +y_0=0 +a=6370997 +b=6370997 +units=m +no_defs'])
    print(f"Reprojected to Orthographic and saved to temporary file.")
    ds = None

    # Convert to 8-bit RGB TIFF without changing NoData values
    ds = gdal.Open(temp_output_file, gdal.GA_ReadOnly)
    driver = gdal.GetDriverByName('GTiff')
    rgb_output_file = os.path.join(output_dir, "RGB_" + os.path.basename(output_file))
    out_ds = driver.Create(rgb_output_file, ds.RasterXSize, ds.RasterYSize, 3, gdal.GDT_Byte)
    out_ds.SetProjection(ds.GetProjection())
    out_ds.SetGeoTransform(ds.GetGeoTransform())
    # Copy the band to all three RGB channels
    for i in range(1, 4):
        out_band = out_ds.GetRasterBand(i)
        data = ds.GetRasterBand(1).ReadAsArray()
        # Replace NoData values with a specific value, e.g., 255 for visualization
        data[data == -37267] = 255
        out_band.WriteArray(data)
        # Optionally, set NoData value for the band if needed
        # out_band.SetNoDataValue(255)
    out_ds = None
    ds = None

    # Resize the RGB output to 25% of its original size using bicubic interpolation
    ds = gdal.Open(rgb_output_file, gdal.GA_ReadOnly)
    resized_output_file = os.path.join(output_dir, "resized_" + os.path.basename(output_file))
    ds = gdal.Warp(resized_output_file, ds, width=int(ds.RasterXSize * 0.25), height=int(ds.RasterYSize * 0.25), resampleAlg=gdal.GRA_Cubic)
    print(f"Resized to 25% of original size using bicubic interpolation and saved to {resized_output_file}")
    ds = None

    # Optionally, remove the temporary files
    os.remove(temp_output_file)
    os.remove(rgb_output_file)  # Remove if you don't need the intermediate RGB file

for file in os.listdir(input_dir):
    if file.endswith('.tif'):
        input_file = os.path.join(input_dir, file)
        output_file = os.path.join(output_dir, file.replace('.tif', '_final.tif'))
        apply_projection_clip_resize_convert(input_file, output_file)