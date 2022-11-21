const express = require("express");
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const { saveAs } = require("./public/filesaver");

const app = express();

app.use("/", express.static('public'));
app.use(fileUpload());
app.post("/extract-text", (req, res) => {
    if(!req.files && !req.files.pdfFile) {
        res.status(400);
        res.end();
    }

    pdfParse(req.files.pdfFile).then(result => {
        let rArray = result.text.split('/[,.\s]/');
        console.log(rArray);
        let fieldNames = [];
        let fieldValues = [];
        fieldNames.push(rArray[1]);
        for(let i = 0; i< rArray.length; i = i + 2){
            if(i !== 2)
            fieldNames.push(rArray[i]);
        }
        for(let j = 1; j < rArray.length; j = j + 2){
            fieldValues.push(rArray[j]);
        }
        console.log(fieldNames, rArray.length);
        console.log(fieldValues);
        let rows = [[...fieldNames], [...fieldValues]];
        let csvContent = "data:text/csv;charset=utf-8," 
        + rows.map(e => e.join(",")).join("\n");

    //     const results = await ls('./samples/invoice_eg.pdf').then(result => result.flatMap(x => x)).catch(console.error);
    // //console.dir(results, { depth: null });
    //     fs.writeFileSync('./samples/result.tsv', '')
    //     for await (let item of results) {
    //         if(item){
    //             fs.appendFileSync('./samples/result.tsv', Object?.values(item).join('\t') + '\n');
    //         }
    //     }
        res.send({rArray: rArray});
    }).catch((err)=> {
        console.log(err)
    })

})


app.listen(3000, () => {
    console.log('Sonal Slow Server Running')
});

