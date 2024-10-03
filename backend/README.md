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
Create env file `.env.development.local`. Copy `.env.example` and fill in correct env values.


## Run
Run the server:
```
npm run dev
```
