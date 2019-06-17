const puppeteer = require('puppeteer');
const path = require('path');

function log(msg) {
    console.log(`=== ${msg} ===`);
}

puppeteer.launch({
    // headless: false,
}).then(async browser => {
    const page = await browser.newPage();

    log('正在打开页面');

    await page.goto('https://juejin.im');

    log('正在进行操作');

    await page.$eval('.search-input', el => {
        el.focus();
    });

    await page.keyboard.type('yangfan');
    await page.keyboard.press('Enter');

    log('等待 api 响应');

    let res = await page.waitForResponse('https://web-api.juejin.im/query');

    let isOk = res.ok;

    if (!isOk) throw new Error('api 响应失败');

    log('正在进行操作');

    await page.$eval('[href*=user]', el => {
        el.click();
    });

    log('等待 api 响应');

    res = await page.waitForResponse('https://web-api.juejin.im/query');

    isOk = res.ok;

    if (!isOk) throw new Error('api 响应失败');

    log('正在进行操作');

    await page.$eval('.user-list', el => {
        let item = el.childNodes[0];
        let achor = item.querySelector('a');
        achor.target = "_self";
        achor.click();
    });

    const title = await page.$eval('title', el => el.textContent);

    log('正在进行截图');

    let now = new Date();
    let date = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`;

    await page.screenshot({
        path: path.resolve(__dirname, `../dist/photos/${title}-${date}.jpeg`),
        fullPage: true,
        type: "jpeg",
    });

    log('操作完成，正在关闭页面');

    await page.close();

    log('结束');

    process.exit();
});