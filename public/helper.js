const inpFile = document.getElementById("inpFile");
const btnUpload = document.getElementById("btnUpload");
const resultText = document.getElementById("resultText");

var newArray = [];

let recomendList;

var removeFromString = function(oldStr, fullStr) { 
    return fullStr.split(oldStr).join(''); 
};

btnUpload.addEventListener("click", () => {
    const formData = new FormData();

    formData.append("pdfFile", inpFile.files[0]);

    fetch("/extract-text", {
        method: "post",
        body: formData
    }).then(response => {
        return response.json();
        // return response.text();
    }).then(extractedText => {
        resultText.value = extractedText.rArray[0];
        newArray = extractedText.text;
        console.log(extractedText)
        newArray = extractedText.rArray[0].split(':')
        console.log(newArray)
        const HSN_var = newArray[9].split('\n')[newArray[4].split('\n').findIndex(data => data == "SN.DescriptionHSNUnit PriceQty.DiscountProduct") + 7]
        // const DiscountVar = newArray[9].split('\n').slice(8, -2)
        recomendList = [{
            "P Order Number" : newArray[4].split('\n')[newArray[4].split('\n').findIndex(data => data == "Purchase Order Number") + 1],
            // "Order Number": newArray[4].split('\n')[4],
            "Invoice Number" : newArray[4].split('\n')[newArray[4].split('\n').findIndex(data => data == "Invoice Number") + 1],
            "Buyer Name" : newArray[5].split('\n')[1],
            "Buyer Address" : newArray[5].split('\n').slice(2,-2).join('\n'),
            "Invoice Date" : newArray[5].split('\n')[newArray[5].split('\n').findIndex(data => data == "Invoice Date") + 1],
            "Order Date" : newArray[7].split('\n')[newArray[7].split('\n').findIndex(data => data == "Order Date") + 1],
            "Product Title" : newArray[9].split('\n').slice(4, -5).join('\n'),
            "HSN" : HSN_var.split('R').slice(0,-1).toString(),
            "Taxable Value" : newArray[10].split('\n').slice(0, -1).toString().split('R').slice(1,-1).toString(),
            "Discount" :  newArray[9].split('\n').slice(8, -2).toString().split('R').slice(1,-1).toString(),
            "Tax Rate" : newArray[9].split('\n')[newArray[9].split('\n').length-1]
        }];
        document.getElementById("json").innerHTML = JSON.stringify(recomendList, undefined, 4)
        
        console.log(window)
    }).catch(err => {
        console.log(err)
    }); 
});

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

function downloadAsExcel() {
    const worksheet = XLSX.utils.json_to_sheet(recomendList);
    const workbook = {
        Sheets: {
            'data': worksheet
        },
        SheetNames: ['data']
    };
    const excelBuffer = XLSX.write(workbook, {bookType: 'xlsx', type: 'array'});
    console.log(excelBuffer);
    saveAsExcel(excelBuffer, 'myFile')
}

function saveAsExcel(buffer, filename){
    const data = new Blob( [buffer], { type: EXCEL_TYPE });
    saveAs(data,filename+'_export_'+new Date().getTime()+EXCEL_EXTENSION)
}


