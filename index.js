const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    let output = '';
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.tutorialsteacher.com/online-test/nodejs-test', {waitUntil: 'networkidle2'});
    
    const START_BTN = ".btn-primary";

    await page.click(START_BTN);

    let counter = 1;
    while(counter <= 3) {
        await page.waitForNavigation();
        let question = await page.$eval('pre', element => element.innerHTML);

        output += `\nQUESTION #${counter}: ${question}\n`;

        let answers = await page.evaluate(() => Array.from(document.getElementsByTagName('label'), e => e.innerText));

        answers.forEach(answer => {
            output += `${answer}\n`;
        });

        counter++;
        let NEXT_BTN = "#next";
        await page.click(NEXT_BTN);
    }

    fs.writeFileSync("output.txt", output); 

    await browser.close();
})();