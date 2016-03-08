# Charm City Taps
This is the API and website for Charm City Taps.

# Purpose
The idea of this app is to neatly display all beers at local Charm City bars in a sortable manner.
Sortable fields include ratings, style, and ABV.


# Pre-Installation
Make sure brew is up to date by running brew update and make sure node, npm, and mongodb are installed globally.
```unix
brew update
brew install node
brew install mongodb
brew upgrade node
brew upgrade mongodb
```

Try to access the /data/db dir. If it does not exist, create one.
 ```unix
 ls /data/db
 mkdir /data
 mkdir /data/db
 ```

# Global NPM Packages
Install required global packages using the following.
```unix
npm install -g gulp webpack webpack-devserver nodemon flow
```

# Installation

## Clone repo and run the app
Clone the repository and install dependencies.
```unix
git clone https://github.com/sleiendecker/cctaps.git
cd cctaps
npm install
```
Open a new terminal window/tab and run mongoDB in the background.
```unix
sudo mongod
```

If you see output similar to the following, it was successful and you should leave this terminal open.
```unix
2015-10-01T11:09:54.839-0400 I NETWORK  [initandlisten] connection accepted ...
2015-10-01T11:09:54.839-0400 I NETWORK  [initandlisten] connection accepted ...
2015-10-01T11:09:54.839-0400 I NETWORK  [initandlisten] connection accepted ...
2015-10-01T11:09:54.839-0400 I NETWORK  [initandlisten] connection accepted ...
2015-10-01T11:09:54.841-0400 I NETWORK  [initandlisten] connection accepted ...
```

Go to the root of the repo and load the sample data into the db.
```unix
cd (project_dir)
mongorestore --host=127.0.0.1 —db cctaps dump/cctaps/
```
Start cctaps and go to localhost:3000 to see all the beers in your database.
```unix
gulp
```


## Many Thanks
* Untappd
* node-untapped
