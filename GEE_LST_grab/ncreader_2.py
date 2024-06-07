import os
import glob
from multiprocessing import Pool
from osgeo import gdal

def process_nc_file(nc_file):
    try:
        print(f"Processing file: {nc_file}")
        tif_file = os.path.splitext(nc_file)[0] + '_sst.tif'
        print(f"Output .tif file will be: {tif_file}")

        sst_dataset_path = f'NETCDF:"{nc_file}":sst'
        ds = gdal.Open(sst_dataset_path)
        if ds is None:
            print(f"Failed to open sst band in {nc_file}.")
            return
        print("Opened .nc file and accessed 'sst' band.")

        temp_tif_file = os.path.splitext(tif_file)[0] + '_temp.tif'
        gdal.Translate(temp_tif_file, ds, format='GTiff', outputType=gdal.GDT_Int16, creationOptions=['COMPRESS=LZW'])
        print(f"Converted 'sst' band to temporary .tif with LZW compression: {temp_tif_file}")

        gdal.Warp(tif_file, temp_tif_file, width=7200, height=3600, resampleAlg=gdal.GRA_NearestNeighbour)
        print(f"Resized TIFF to 7200x3600: {tif_file}")

        # Open the resized TIFF for updating
        ds = gdal.Open(tif_file, gdal.GA_Update)
        if ds is None:
            print(f"Failed to open {tif_file} for NoData filling.")
        else:
            targetBand = ds.GetRasterBand(1)
            gdal.FillNodata(targetBand=targetBand, maskBand=targetBand, maxSearchDist=900, smoothingIterations=0)
            print(f"Filled NoData values in: {tif_file}")
            ds = None

        os.remove(temp_tif_file)
        print("Closed .nc file and cleaned up temporary files.")
    except Exception as e:
        print(f"Error processing {nc_file}: {e}")

def main():
    dir_path = './SST'
    print("Directory set to:", dir_path)

    nc_files = glob.glob(os.path.join(dir_path, '*.nc'))
    print(f"Found {len(nc_files)} .nc files.")

    # Number of processes to create in the pool. Adjust based on your system's capabilities.
    num_processes = os.cpu_count()  # Or set to a fixed number

    with Pool(processes=num_processes) as pool:
        pool.map(process_nc_file, nc_files)

if __name__ == "__main__":
    main()