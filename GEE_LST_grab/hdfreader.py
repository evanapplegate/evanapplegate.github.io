import os
import glob
import tempfile
import subprocess
from osgeo import gdal

# Directory containing HDF files
dir_path = './LST'
print("Directory set to:", dir_path)

# Get all HDF files in the directory
hdf_files = glob.glob(os.path.join(dir_path, '*.hdf'))
print(f"Found {len(hdf_files)} HDF files.")

# Loop through all HDF files
for hdf_file in hdf_files:
    print(f"Processing file: {hdf_file}")
    # For LST Daytime data
    lst_day_dataset_path = 'HDF4_EOS:EOS_GRID:"{}":MODIS_MONTHLY_0.05DEG_CMG_LST:LST_Day_CMG'.format(hdf_file)
    # Output .tif file path for LST Day (temporary, final, and resized)
    temp_tif_file_day = tempfile.mktemp(suffix='.tif')
    tif_file_day_celsius = os.path.splitext(hdf_file)[0] + '_LST_Day_CMG_Celsius_temp.tif'
    tif_file_day_celsius_resized = os.path.splitext(hdf_file)[0] + '_LST_Day_CMG_Celsius.tif'
    print(f"Output .tif file for LST Day in Celsius will be: {tif_file_day_celsius_resized}")

    # Open the LST Day dataset
    ds_day = gdal.Open(lst_day_dataset_path)
    if ds_day is None:
        print(f"Failed to open LST Day dataset in {hdf_file}.")
        continue
    print("Opened HDF file and accessed LST Day dataset.")

    # Convert LST Day to temporary .tif with LZW compression and keep as Int16 (still in scaled values)
    gdal.Translate(temp_tif_file_day, ds_day, format='GTiff', outputType=gdal.GDT_Int16, creationOptions=['COMPRESS=LZW'])
    print(f"Converted LST Day dataset to temporary .tif with LZW compression: {temp_tif_file_day}")

    # Convert from scaled values to Celsius using gdal_calc.py, assuming a scale factor of 0.02
    cmd_calc = [
        'gdal_calc.py',
        '-A', temp_tif_file_day,
        '--outfile', tif_file_day_celsius,
        '--calc', "int16((A*0.02)-273.15)",
        '--type', 'Int16',
        '--co', 'COMPRESS=LZW'
    ]
    subprocess.run(cmd_calc)
    print(f"Converted scaled LST values to Celsius and saved as Int16: {tif_file_day_celsius}")

    # Resize the TIFF to 7200x3600 using nearest-neighbor interpolation
    cmd_resize = [
        'gdal_translate',
        '-of', 'GTiff',
        '-outsize', '7200', '3600',
        '-r', 'near',
        tif_file_day_celsius,
        tif_file_day_celsius_resized,
        '-co', 'COMPRESS=LZW'
    ]
    subprocess.run(cmd_resize)
    print(f"Resized TIFF to 7200x3600 using nearest-neighbor interpolation: {tif_file_day_celsius_resized}")

    # Fill NoData using gdal_fillnodata, assuming an 8-way search
    cmd_fillnodata = [
        'gdal_fillnodata.py',
        '-md', '5',  # Max distance to search out for values to interpolate
        tif_file_day_celsius_resized,
        '-co', 'COMPRESS=LZW'
    ]
    subprocess.run(cmd_fillnodata)
    print(f"Filled NoData values in: {tif_file_day_celsius_resized}")

    # Cleanup: Close datasets and remove temporary files
    ds_day = None
    os.remove(temp_tif_file_day)
    os.remove(tif_file_day_celsius)
    print("Closed LST Day dataset and cleaned up temporary files.")

print("Processing complete.")