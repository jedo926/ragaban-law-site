const fs = require('fs');
import('pdf-parse').then((pdfModule) => {
    const pdf = pdfModule.default || pdfModule;
    let dataBuffer = fs.readFileSync('شركه رقبان و نصيف للمحاماة.pdf');
    pdf(dataBuffer).then(function(data) {
        console.log(data.text);
    }).catch(err => console.error(err));
});
