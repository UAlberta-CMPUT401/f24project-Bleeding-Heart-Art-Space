# Each migration file should be prefixed with an ISO 8601 date so that 
# they executed in order. This generates the prefix.

import datetime

def generate_migration_prefix():
    # Get the current UTC time
    utc_now = datetime.datetime.now(datetime.timezone.utc)
    
    # Format the date and time according to ISO 8601
    iso_date = utc_now.strftime("%Y%m%d%H%M%S")
    
    return iso_date

if __name__ == "__main__":
    migration_prefix = generate_migration_prefix()
    print(migration_prefix)
