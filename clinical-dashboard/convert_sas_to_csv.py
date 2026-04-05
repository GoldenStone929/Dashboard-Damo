#!/usr/bin/env python3
"""
Convert SAS7BDAT file to CSV format.
This script converts dm.sas7bdat to dm.CSV in the data directory.

Requirements:
    pip install pandas sas7bdat

Usage:
    python convert_sas_to_csv.py
"""

import os
import sys
from pathlib import Path

try:
    import pandas as pd
except ImportError:
    print("Error: pandas is not installed. Please install it with:")
    print("  pip install pandas")
    sys.exit(1)

try:
    from sas7bdat import SAS7BDAT
except ImportError:
    print("Warning: sas7bdat library not found. Trying pandas read_sas method...")
    try:
        # Try using pandas read_sas (requires pyreadstat or sas7bdat)
        pass
    except:
        print("Error: Unable to read SAS7BDAT files.")
        print("Please install one of the following:")
        print("  pip install sas7bdat")
        print("  pip install pyreadstat")
        sys.exit(1)

def convert_sas_to_csv(input_file, output_file):
    """Convert SAS7BDAT file to CSV."""
    try:
        # Get the script directory
        script_dir = Path(__file__).parent
        input_path = script_dir / input_file
        output_path = script_dir / output_file
        
        if not input_path.exists():
            print(f"Error: Input file not found: {input_path}")
            return False
        
        print(f"Reading SAS7BDAT file: {input_path}")
        
        # Try using pandas read_sas (works with pyreadstat)
        try:
            df = pd.read_sas(input_path, format='sas7bdat', encoding='utf-8')
        except:
            # Fallback to sas7bdat library
            print("Trying alternative method with sas7bdat library...")
            with SAS7BDAT(str(input_path), encoding='utf-8') as reader:
                df = reader.to_dataframe()
        
        print(f"Loaded {len(df)} rows and {len(df.columns)} columns")
        print(f"Columns: {', '.join(df.columns[:10])}{'...' if len(df.columns) > 10 else ''}")
        
        # Save to CSV
        print(f"Writing CSV file: {output_path}")
        df.to_csv(output_path, index=False, encoding='utf-8')
        
        print(f"✓ Successfully converted {input_file} to {output_file}")
        print(f"  Output: {output_path}")
        return True
        
    except Exception as e:
        print(f"Error converting file: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    # Default paths
    input_file = "data/dm.sas7bdat"
    output_file = "data/dm.CSV"
    
    # Allow command line arguments
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    if len(sys.argv) > 2:
        output_file = sys.argv[2]
    
    success = convert_sas_to_csv(input_file, output_file)
    sys.exit(0 if success else 1)

