/*
**********************
    CONSTRUCTORS
**********************
Constructor for Item Object
Attributes: 
String: Name, Id
Float: Price
Int: Quantity
Location: Location
*/


//Function that populates the table with data from database, as well as add event listeners to all forms.
function init(){
    console.log("File loaded");
    const createItemForm = document.getElementById("NewItemForm");
    const editItemForm = document.getElementById("EditItemForm");
    const deleteItemForm = document.getElementById("DeleteItemForm");

    // Send a GET request to the server to retrieve all item information, and then put into the item table.
    getData();

    // Upon submission of create new item form, send POST request to the server
    createItemForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handlePostRequest();
    });

    // Upon submission of Edit Item form, send a PUT request to the server
    editItemForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleEditRequest();
    });

    // Upon submission of Delete Item form, send a DELETE request to the server
    deleteItemForm.addEventListener("submit", (e) => {
        e.preventDefault();
        handleDeleteRequest();
    });

}

/*
**********************
   TABLE FUNCTIONS
**********************
functions that change the appearance of the Item table on the HTML page
*/

// Function that gets the data from a form and returns it in an array format.
function retrieveFormData(formid){
    return Array.from(document.getElementById(formid)).reduce((acc, input) => ({ ...acc,[input.name]: input.value }), {});
}

// Function that takes a list of Item objects from the database and adds them to the Item Table
function PopulateTable(tableData){
    const table = document.getElementById("ItemTable");
    for (item of tableData){
        table.appendChild(CreateRow(item));
    }
}

// Function to create a new row to be added to the Item table
function CreateRow(element){
    let newRow = document.createElement("tr");
    newRow.setAttribute("id", element._id);
    for(x in element){
        newRow.appendChild(CreateNode("td",element[x]));
    }
    return newRow;
}

// Function that creates a new collumn, takes in the element type and data to be presented
function CreateNode(elementType, Data){
        let newNode = document.createElement(elementType);
        newNode.textContent = Data;
        return newNode;
}

// Function that deletes a row by it's ID
function DeleteRow(idToDelete){
    const row = document.getElementById(idToDelete);
    row.parentNode.removeChild(row);
}

// Function that edits an item in the Item Table
function EditRow(newElementInfo){
    const children = document.getElementById(newElementInfo._id).children;
    let counter = 0;
    for(x in newElementInfo){
        children[counter].textContent = newElementInfo[x];
        counter++;
    }
}

/*
************************
  CATEGORIES FUNCTIONS
************************
Functions that relate to categories and the select menus they appear 
*/

// Function that takes a list of Items, retrieves all unique categories, and adds them to the category drop down menus
function getCategories(tableData){
    let categoryList = [];
    for(item of tableData){
        let itemCategory = item.Category;
        if(!categoryList.includes(itemCategory)){
            categoryList.push(itemCategory);
        }
    }
    populateSelect(categoryList);
    return categoryList;
}

function populateSelect(categories){
    dataList1 = document.getElementById("Categories1");
    dataList2 = document.getElementById("Categories2");
    for(category of categories){
        newNode1 = document.createElement("option");
        newNode1.setAttribute("value", category);
        newNode2 = document.createElement("option");
        newNode2.setAttribute("value", category);
        dataList1.appendChild(newNode1);
        dataList2.appendChild(newNode2);
        
    }
}




/*
**********************
  DATABASE REQUESTS
**********************
*/

// Send a GET request to the server for all Items in the database.
async function getData(){
    const response = await fetch("/api")
    const data = await response.json();
    PopulateTable(data);
    categories = getCategories(data);
}

// Send a POST request to the server with the data for the new item.
async function handlePostRequest(){
    const formData = retrieveFormData("NewItemForm");
    const options = {
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({Name: formData.name,Price: formData.price,Quantity: formData.quantity,Category: formData.category})
    };
    // Await response from server, when response is recieved, add new item to table
    const response = await fetch('/api', options);
    const json = await response.json();
    populateSelect([json.Category]);
    PopulateTable([json]);
}

// Send a PUT request to the server with the new data for the existing item
async function handleEditRequest(){
    const formData = retrieveFormData("EditItemForm");
    const options = {
        method: "PUT",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({Id: formData.id ,Name: formData.name,Price: formData.price,Quantity: formData.quantity,Category: formData.category})
    };

    // When response from server is recieved, update the information in the Item Table.
    const response = await fetch('/api', options);
    const json = await response.json();
    EditRow(json);
}

// send a DELETE request to the server with the id of the item to be deleted
async function handleDeleteRequest(){
    const formData = retrieveFormData("DeleteItemForm");
    const options = {
        method: "DELETE",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({Id: formData.id})
    };

    // When response from server is recieved, delete the item from the Item Table
    const response = await fetch('/api', options);
    const json = await response.json();
    DeleteRow(json.id);
}
