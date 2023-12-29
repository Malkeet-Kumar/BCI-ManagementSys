let catalogue;
let table;

//for new Item add to stock
const invoiceNumber = document.getElementById("invNumber")
const consignorName = document.getElementById("consignorName")
const stockDate = document.getElementById("stockDate")
const itemname = document.getElementById("name")
const hsn = document.getElementById("hsn")
const stock = document.getElementById("stock")
const unit = document.getElementById("unit")
const price = document.getElementById("price")
const gst = document.getElementById("gst")

//for details update
const newName = document.getElementById("newName")
const newHsn = document.getElementById("newHsn")
const newPrice = document.getElementById("newPrice")
const newUnit = document.getElementById("newUnit")
const newGst = document.getElementById("newGst")

//for add stock to existing item
const invoice_number = document.getElementById("invoice_number")
const consignor_name = document.getElementById("consignor_name")
const inward_stock = document.getElementById("inward_stock")
const stock_date = document.getElementById("updateStock_date")

stockDate.valueAsDate = new Date()
stock_date.valueAsDate = new Date()

document.getElementById("openCloseForm").addEventListener('click',e=>{
    if(e.target.innerText==">"){
        e.target.innerText = "<"
        addItemForm.style.display = "none"
    } else {
        e.target.innerText = ">"
        addItemForm.style.display = "flex"
    }
})

function Alert(field){
    swal.fire(
        {
            title:"Required",
            text: field+" is required",
            icon: 'warning',
            confirmButtonText: 'Ok'
        }
    )
}

document.getElementById("upload").addEventListener('click',e=>{addProduct()})

//add new item POST
function addProduct(){
    if(itemname.value.trim().length<3){
        Alert("Name")   
        return
    }
    if(stock.value<=0){
        swal.fire({title:"Required",text:"Stock can not be 0 or empty",icon:"warning"})
        return
    }
    const productItem = {
        "invoice":invoiceNumber.value || "",
        "consignor":consignorName.value || "",
        "date": stockDate.valueAsDate,
        "name":itemname.value || "",
        "hsn":hsn.value || "",
        "price":price.value || 0,
        "unit":unit.value || "",
        "gst":gst.value || 0,
        "stock":stock.value || 0
    }
    fetch("/addproducts",{
        method:"POST",
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify(productItem)
    })
    .then((result) => {
        if(result.ok){
            clearInputs()
            swal.fire({
                title:"Added",
                text:"New product is added to inventory.",
                icon: 'success',
                confirmButtonText: 'Ok'
            })  
            return result.json()
        }
    })
    .then(res=>{
        console.log(res);
        catalogue.push(res)
        createTable(catalogue)
    })
    .catch((err) => {
        alert(err)
    });
}

//clear new item inputs
function clearInputs(){
    invoiceNumber.value = ""
    consignorName.value = ""
    stockDate.value = ""
    itemname.value=""
    price.value=""
    gst.value=""
    stock.value = ""
    hsn.value=""
    unit.value = "Select Unit"
}


//fetch all items
fetch("/getCatalogue")
.then(res=>res.json())
.then((result) => {
    catalogue = result
    createTable(catalogue)
}).catch((err) => {
    alert(err)
});

//initialise datatable
function createTable(data){
    if(table){
        table.clear().rows.add(data).draw();
    } else {
       table = new $("#itemsTable").DataTable(
        {
            "rowCallback": function( row, data, index ) {
                const div = document.createElement("div")
                div.innerHTML=`
                <button class="updateStockBtn" onclick="openStockUpdatePopup('${data._id}')">Add Stock</button>
                <button onclick="openItemUpdateForm('${data._id}')" id="upbtn-${data._id}" class="actionBtn">Update</button>
                <button onclick="deleteItem('${data._id}')" class="actionBtn">Delete</button>`
                $('td:eq(6)', row).html(div);
                row.id = "row-"+data._id
            },
            responsive:true,
            data:data,
            columns:[
                {data:'name',title:"Name"},
                {data:'hsn',title:"HSN Code"},
                {data:'price',title:"Price"},
                {data:'unit',title:"Unit"},
                {data:'gst',title:"GST"},
                {data:'stock',title:"Stock"},
                {data:null,title:"Actions"}
            ]
        }
       );
    }
}

//update stock PATCH
function updateStock(){
    const id = document.getElementById("addStockItemId").value
    fetch("/addproducts",{
        method:"PATCH",
        headers:{
            'content-type':'application/json',
        },
        body:JSON.stringify({
            id:id,
            invoice:invoice_number.value || "",
            consignor: consignor_name.value || "",
            date: stock_date.valueAsDate,
            stock: inward_stock.value || 0
        })
    })
    .then((result) => {
        if(result.ok){
            return result.json()       
        } else {
            alert("Somthing went wrong !")
        }
    })
    .then(res=>{
        const index = getDataAndIndex(id);
        catalogue[index] = res 
        createTable(catalogue)
        table.draw()
        hidePopUp()
        swal.fire({
            title:"Updated",
            text:"The stock details of product are updated",
            icon: 'success',
            confirmButtonText: 'Ok'
        })
    })
    .catch((err) => {
        swal.fire({
            title:"Error Occured",
            text:err,
            icon: 'error',
            confirmButtonText: 'Ok'
        })
    });
   
}

//update item details PUT
function editProduct(){
    const id = document.getElementById("updateItemId").value
    fetch("/addproducts",{
        method:"PUT",
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify({
            id:id,
            "name":newName.value||"",
            "hsn":newHsn.value || "",
            "gst":newGst.value || "",
            "price": newPrice.value || 0,
            "unit":newUnit.value || ""
        })
    })
    .then((result) => {
        if(result.ok){
            return result.json()       
        } else {
            alert("Somthing went wrong !")
        }
    })
    .then(res=>{
        const index = getDataAndIndex(id);
        catalogue[index] = res 
        createTable(catalogue)
        table.draw()
        clearInputs()
        document.getElementById("upload").setAttribute("onclick","addProduct()")
        document.getElementById("upload").setAttribute("value","Add")
        swal.fire({
            title:"Updated",
            text:"The product details in inventory are updated",
            icon: 'success',
            confirmButtonText: 'Ok'
        })
    })
    .catch((err) => {
        alert(err)
    });
}

function getDataAndIndex(id){
    const index = catalogue.findIndex(object => {
        return object._id === id;
    });
    return index
}

//delete item DELETE
function deleteItem(id){
    fetch("/addproducts",{
        method:"DELETE",
        headers:{
            'content-type':'application/json'
        },
        body:JSON.stringify({
            id:id
        })
    })
    .then((result) => {
        if(result.ok){
            catalogue = catalogue.filter(i=>i._id!=id)
            table.row($(`#row-${id}`)).remove()
            table.draw()
            swal.fire({
                title:"Deleted",
                text:"The product is deleted from inventory.",
                icon: 'success',
                confirmButtonText: 'Ok'
            })
        } else if(result.status==404){
            alert("Somthing went wrong !")
        }
    }).catch((err) => {
        alert(err)
    });
}
