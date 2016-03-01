import React from 'react';
import ReactDOM from 'react-dom';
import Griddle from 'griddle-react';

export default class Hello extends React.Component {
  render () {
    const self = this;

    const fakeData =  [
      {
        "bar" : "Wiley Gunters",
        "brewery" : "Oskar Blues Grill & Brew",
        "name" : "Pinner Throwback IPA",
        "abv" : "| 4.90%",
        "rating" : "86",
        "newRating" : 86,
        "style" : "American IPA"
      },
      {
        "bar" : "Wiley Gunters",
        "brewery" : "Union Craft Brewing Company",
        "name" : "Pajama Pants",
        "abv" : "| 8.00%",
        "rating" : "-",
        "newRating" : 10,
        "style" : "Oatmeal Stout"
      },
      {
        "bar" : "Wiley Gunters",
        "brewery" : "Ballast Point Brewing Company",
        "name" : "Sculpin IPA",
        "abv" : "| 7.00%",
        "rating" : "97",
        "newRating" : 97,
        "style" : "American IPA"
      },
      {
        "bar" : "Wiley Gunters",
        "brewery" : "Left Hand Brewing Company",
        "name" : "Milk Stout Nitro",
        "abv" : "| 6.00%",
        "rating" : "91",
        "newRating" : 91,
        "style" : "Milk / Sweet Stout"
      },
      {
        "bar" : "Wiley Gunters",
        "brewery" : "Miller Brewing Co.",
        "name" : "Miller Lite",
        "abv" : "| 4.17%",
        "rating" : "55",
        "newRating" : 55,
        "style" : "Light Lager"
      },
      {
        "bar" : "Wiley Gunters",
        "brewery" : "Bell's Brewery, Inc.",
        "name" : "Hopslam Ale",
        "abv" : "10.00%",
        "rating" : "98",
        "newRating" : 98,
        "style" : "American Double / Imperial IPA"
      },
      {
        "bar" : "Wiley Gunters",
        "brewery" : "Union Craft Brewing Company",
        "name" : "Chessie Barleywine",
        "abv" : "| 9.80%",
        "rating" : "-",
        "newRating" : 87,
        "style" : "American Barleywine"
      },
      {
        "bar" : "Wiley Gunters",
        "brewery" : "4 Hands Brewing Co.",
        "name" : "Passion Fruit Prussia",
        "abv" : "| 4.00%",
        "rating" : "86",
        "newRating" : 87,
        "style" : "Berliner Weissbier"
      },
      {
        "bar" : "Wiley Gunters",
        "brewery" : "Dogfish Head Craft Brewery",
        "name" : "Indian Brown Ale",
        "abv" : "| 7.20%",
        "rating" : "92",
        "newRating" : 92,
        "style" : "American Brown Ale"
      },
      {
        "bar" : "Wiley Gunters",
        "brewery" : "Union Craft Brewing Company",
        "name" : "Rye Baby IPA",
        "abv" : "| 6.50%",
        "rating" : "-",
        "newRating" : 92,
        "style" : "Rye Beer"
      },
      {
        "bar" : "Wiley Gunters",
        "brewery" : "Southern Tier Brewing Company",
        "name" : "Pumking",
        "abv" : "| 8.60%",
        "rating" : "90",
        "newRating" : 90,
        "style" : "Pumpkin Ale"
      },
      {
        "bar" : "Wiley Gunters",
        "brewery" : "Green Flash Brewing Co.",
        "name" : "Pacific Gem Single Hop",
        "abv" : "| 5.50%",
        "rating" : "84",
        "newRating" : 84,
        "style" : "American Pale Ale (APA)"
      },
      {
        "bar" : "Wiley Gunters",
        "brewery" : "Coors Brewing Company",
        "name" : "Blue Moon First Peach Ale",
        "abv" : "| 5.60%",
        "rating" : "79",
        "newRating" : 78,
        "style" : "American Brown Ale"
      }
    ];

    const style = {
      fontsize: 12
    }

    return (
      <div id="indexTest">
        <Griddle results={fakeData} />
      </div>
    );
  }
}


// React.render(<Griddle results={fakeData}
//   sortAscendingComponent={<span className="fa fa-sort-alpha-asc"></span>}
//   sortDescendingComponent={<span className="fa fa-sort-alpha-desc"></span>}/>,
//   document.getElementById("some-id"));

ReactDOM.render(<Hello />, document.getElementById('app-container'));