# Charm City Taps
This is the API and website for Charm City Taps.

# Purpose 
The idea of this app is to neatly display all beers at local Charm City bars in a sortable manner. 
Sortable fields include Beer Advocate ratings, style, and ABV.


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
From the root of the repo, load sample data into the db.
```unix
cd /path/to/cctaps
mongorestore dump/cctaps
```
Start cctaps and go to localhost:3000/beerlist to see all the beers in your database.
```unix
npm start
```


## Many Thanks
* Beer Advocate
* Untappd
* RateBeer
* Max's Taphouse
