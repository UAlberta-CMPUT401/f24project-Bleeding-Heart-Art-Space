# Run for Development:
## Node
Ensure node is installed. Install project dependencies:
```
npm install
```

## PostgreSQL
Install and ensure that PostgreSQL is running. Create a database on PostgreSQL called `bhas`. To do this on linux/macos:
### Install
Install `postgresql` via apt / homebrew etc
### Start PostgreSQL Service
#### linux: 
```
sudo service postgresql start`
```
or
```
sudo systemctl start postgresql
```
#### macos: 
```
brew services start postgresql
````
### Create the database in PostgreSQL
```
psql -U <username> -d postgres
```
use the default username (usually `postgres` or your system username, find your system username with `whoami`). `postgres` is the default database.

Then: 
```
CREATE DATABASE bhas;
```

If you don't know your username's password (needed for the env file later) you can change that here:
```
ALTER USER <username> WITH PASSWORD '<new password>';
```

Finally:
```
exit
```

## Env File
Create env file `.env.development.local`. Copy `.env.example` (into the same directory and rename) and fill in correct env values.

Instruction for setting up `GOOGLE_APPLICATION_CREDENTIALS` var can be found here: https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments
- TLDR:
    - Click `Generate new private key` here: https://console.firebase.google.com/project/bleeding-heart-art-space/settings/serviceaccounts/adminsdk
    - Set `GOOGLE_APPLICATION_CREDENTIALS` to the absolute path to the generated key
    - DON'T COMMIT YOUR PRIVATE KEY TO THE REPO


## Run
Run the server:
```
npm run dev
```
