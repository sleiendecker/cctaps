//How to sort list items to the top of the list based on a class attribute name.

var ul = $('ul'), 
     li = $('li'),
     sort = $('#sort'),
     choiceMenu = $('#property'),
     length = li.size(); //count the number of list items

sort.click(function() {
    console.log('clicked sort!');
    var items = [], //create an empty array to store the list item objects
        choice = choiceMenu.val(), //get their choice from the menu
        orderNum = 0; //set the order number to start at zero.
    
    /**** loop over each list item and fill its values into liObj properties for later use. ***/
    
    for(i=0; i < length; i++) {
        
        var liObj = {}; //create an object to store the properties of the list item
        
        liObj.txt = li.eq(i).text(); //get the text for the li and store as liObj property.
        
        liObj.type = li.eq(i).attr('class'); //get the class attribute and store as liObj property.
        
        if(liObj.type === choice) { //check if the type for each object matches users choice
            orderNum++; //increment order number by one
            liObj.order = orderNum; //update the order number
        } else {
            liObj.order = 9999; //set order number to a very high number.
        }
     
        items.push(liObj); //push each object in the items array   
    }
    
    /*** sort the array based on order number ***/
    items.sort(function(a, b) {
        return a.order - b.order;
    });
      
    /*** now display the array again as list items ***/
    
    ul.empty(); //first clear out all previous list items
    
    //then rebuild all the list items again with the new order
    $.each(items, function(i, value) {    
        ul.append('<li class="'+items[i].type+'">'+items[i].txt+'</li>'); //append list item with correct type class and text.      
    });
  
});