import os
import json
from pathlib import Path
from datetime import datetime

# Directory containing data files
data_dir = Path(__file__).parent / 'data'

# Get all CSV files in the data directory
def get_csv_files(directory):
    csv_files = []
    for file in directory.iterdir():
        if file.is_file():
            ext = file.suffix.lower()
            if ext == '.csv' or (ext == '' and file.name.upper().endswith('.CSV')):
                csv_files.append(file)
    return csv_files

# Get the most recent modification date from all CSV files
def get_most_recent_date():
    try:
        csv_files = get_csv_files(data_dir)
        most_recent_date = None

        for file in csv_files:
            try:
                modified_time = file.stat().st_mtime
                modified_date = datetime.fromtimestamp(modified_time)
                
                if most_recent_date is None or modified_date > most_recent_date:
                    most_recent_date = modified_date
            except Exception as e:
                print(f'Error reading {file.name}: {e}')

        return most_recent_date
    except Exception as e:
        print(f'Error reading data directory: {e}')
        return None

# Generate JSON file with the refresh date
def generate_refresh_date_file():
    most_recent_date = get_most_recent_date()
    
    if most_recent_date:
        date_info = {
            'refreshDate': most_recent_date.isoformat(),
            'formattedDate': most_recent_date.strftime('%m/%d/%Y'),
            'timestamp': int(most_recent_date.timestamp() * 1000)
        }

        output_path = data_dir / 'refresh-date.json'
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(date_info, f, indent=2)
        print(f'Data refresh date updated: {date_info["formattedDate"]}')
        print(f'File saved to: {output_path}')
    else:
        print('Could not determine data refresh date')

# Run the script
if __name__ == '__main__':
    generate_refresh_date_file()

