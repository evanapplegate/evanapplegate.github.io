import os
import gdal
import numpy as np

def read_and_sort_tifs(directory):
    tifs = [os.path.join(directory, f) for f in os.listdir(directory) if f.endswith('.tif')]
    tifs.sort()
    return tifs

def combine_tifs(lst_tifs, sst_tifs, output_dir):
    for lst_tif, sst_tif in zip(lst_tifs, sst_tifs):
        # Read LST and SST TIFs
        lst_ds = gdal.Open(lst_tif)
        sst_ds = gdal.Open(sst_tif)
        
        lst_array = lst_ds.ReadAsArray()
        sst_array = sst_ds.ReadAsArray()
        
        # Combine arrays, LST gets priority
        combined_array = np.where(lst_array > 0, lst_array, sst_array)
        
        # Create output TIF
        driver = gdal.GetDriverByName('GTiff')
        out_tif = os.path.join(output_dir, os.path.basename(lst_tif))
        out_ds = driver.Create(out_tif, lst_ds.RasterXSize, lst_ds.RasterYSize, 1, gdal.GDT_UInt16)
        
        # Set geo-transform and projection from LST TIF
        out_ds.SetGeoTransform(lst_ds.GetGeoTransform())
        out_ds.SetProjection(lst_ds.GetProjection())
        
        # Write combined array to output TIF
        out_ds.GetRasterBand(1).WriteArray(combined_array)
        
        # Reproject to Lambert Azimuthal Equal Area
        reprojected_tif = out_tif.replace('.tif', '_reprojected.tif')
        gdal.Warp(reprojected_tif, out_ds, dstSRS='EPSG:54009', xRes=0, yRes=0, dstNodata=0)
        
        out_ds = None  # Close output dataset

def main():
    lst_dir = 'LST_tifs'
    sst_dir = 'SST_tifs'
    output_dir = 'Combined_tifs'
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    lst_tifs = read_and_sort_tifs(lst_dir)
    sst_tifs = read_and_sort_tifs(sst_dir)
    
    combine_tifs(lst_tifs, sst_tifs, output_dir)

if __name__ == '__main__':
    main()