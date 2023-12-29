let table;
let billDetails = [];
let allbills = [];

function createTable(data) {
    console.log(data);
    if (table) {
        table.clear().rows.add(data).draw();
    } else {
        table = new $("#billsTable").DataTable(
            {
                "rowCallback": function (row, data) {
                    const div = document.createElement("div")
                    div.innerHTML = `<button onclick="viewBill('${data.id}')" class="actionBtn">View Bill</button>
                                <button onclick="convertHTMLtoPDF('${data.id}')" class="actionBtn">Download</button>`
                    $('td:eq(5)', row).html(div);
                    row.id = "row-" + data.id
                },
                data: data,
                columns: [
                    { data: 'inv_no' },
                    { data: 'rec_name' },
                    { data: 'inv_date' },
                    { data: 'amount' },
                    { data: 'items' },
                    { data: null }
                ]
            }
        );
    }
}

function convertHTMLtoPDF(id ) {
    openPreview()
    document.getElementById("invoicePdf").style.display = "block"
    fillBillDetails(billDetails[id].billDetails[0], billDetails[id].grandTotal)
    fillItems(billDetails[id].billItems)
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF('p', 'mm', "a4");
    let pdfjs = document.getElementById('invoicePdf');
    doc.html(pdfjs,{
        margin:[2,2,4,2],
        html2canvas:{scale:0.25},
        callback: function(doc) {
            doc.save(`${billDetails[id].billDetails[0].invoiceNumber}.pdf`);
        },
        x: 0,
        y: 0
    });   
    swal.fire({
        title:"Downloaded",
        text:`Invoice pdf file named ${billDetails[id].billDetails[0].invoiceNumber}.pdf is downloded successfully.`,
        icon: 'success',
        confirmButtonText: 'Ok'
    })             
} 

function viewBill(id) {
    openPreview()
    document.getElementById("invoicePdf").style.display = "block"
    fillBillDetails(billDetails[id].billDetails[0], billDetails[id].grandTotal)
    fillItems(billDetails[id].billItems)
}

function openPreview() {
    $("#headerLogo").css("display", "none")
    $("#headerNav").css("display", "none")
    $("#container").css("display", "none")
    $("#invoicePdf").addClass("preview")
    $("#invoicePdf").append(`
        <div class="floatingActionDiv">
            <button class="floatingActionBtn" id="closeViewBtn" onclick="closePreview()"></button>
        </div>
    `)
}

function closePreview() {
    $("#headerLogo").css("display", "flex")
    $("#headerNav").css("display", "flex")
    $("#container").css("display", "block")
    $("#invoicePdf").css("display", "none")
    $("#invoicePdf").removeClass("preview")
    $("#itemTable tbody").html("")
    $("closeViewBtn").remove()
}

function fillBillDetails(bd, grand) {
    console.log(bd);
    $("#invNo").html(bd.invoiceNumber)
    $("#invDate").html(bd.invoiceDate)
    $("#recepientName").html(bd.recepientName)
    $("#recepientState").html(bd.recepientState)
    $("#recepientStateCode").html(bd.recepientStateCode)
    $("#recepientGst").html(bd.recepientGst)
    $("#totalBill").html(grand)
}

function fillItems(items) {
    items.forEach(item => {
        const row = `<tr>
                        <td>${item.serial}</td>
                        <td>${item.name}</td>
                        <td>${item.hsn}</td>
                        <td>${item.unit}</td>
                        <td>${item.quantity}</td>
                        <td>${item.price}</td>
                        <td>${item.gst}</td>
                        <td>${item.amount}</td>
                    </tr>`
        $("#itemTable tbody").append(row)
    })
}

fetch("/getbillhistory")
    .then((result) => {
        if (result.ok) {
            return result.json()
        } else {
            console.log(result);
        }
    })
    .then(res => {
        billDetails = res
        res.forEach((element, index) => {
            let obj = {
                inv_no: element.billDetails[0].invoiceNumber,
                rec_name: element.billDetails[0].recepientName,
                inv_date: element.billDetails[0].invoiceDate,
                amount: element.grandTotal,
                items: element.billItems.length,
                id: index,
                _id: element._id
            }
            allbills.push(obj)
        });
        createTable(allbills)
    })
    .catch((err) => {
        console.log(err);
    });