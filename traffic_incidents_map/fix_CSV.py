import csv

# The path to your input CSV file
input_csv_path = 'incidents.csv'
# The path to your output CSV file
output_csv_path = 'output.csv'

# The index of the column with line breaks (e.g., 4 for the fifth column)
column_index = 5

# Open the input CSV file to read and the output CSV file to write
with open(input_csv_path, newline='', encoding='utf-8') as infile, open(output_csv_path, 'w', newline='', encoding='utf-8') as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile)
    
    # Write the header with additional columns
    header = next(reader)
    # Determine the max number of lines in a single cell for this column
    max_lines = max(len(row[column_index].split('\n')) for row in reader)
    # Reset reader to start
    infile.seek(0)
    next(reader)  # skip header row again
    
    # Extend the header with new field names based on the number of max lines found
    extended_header = header + [f'line_{i+1}' for i in range(max_lines)]
    writer.writerow(extended_header)
    
    # Iterate over each row in the CSV file
    for row in reader:
        # Split the cell with line breaks into separate fields
        cell_lines = row[column_index].split('\n')
        # If there are fewer lines than the max, append empty strings to match the number of fields
        cell_lines.extend([''] * (max_lines - len(cell_lines)))
        # Write the extended row to the new CSV file
        writer.writerow(row + cell_lines)
