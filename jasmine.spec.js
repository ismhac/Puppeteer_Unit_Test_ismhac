const puppeteer = require('puppeteer');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
let login = async (username, password) => {
    let browser = await puppeteer.launch({
        headless: "new",
        // headless: false,
    });
    let page = await browser.newPage();
    await page.goto('https://job-app-ivory.vercel.app/login');
    await page.waitForSelector("#root > div:nth-child(1) > div");

    const emailInput = await page.$('#root > div:nth-child(1) > div > form > div:nth-child(1) > div > input#email');
    const passwordInput = await page.$('#root > div:nth-child(1) > div > form > div:nth-child(2) > div > input#password');
    const loginButton = await page.$('#root > div:nth-child(1) > div > form > button');




    await emailInput.type(username);
    await passwordInput.type(password);

    const response = await Promise.all([
        page.waitForResponse(response => response.url().includes('login') && response.request().resourceType() === 'xhr'),
        loginButton.click()
    ]);

    let status = response[0].status();
    return { status, browser };
}

// describe('Test login 1', () => {
//     it('User can login successfully', async () => {
//         let result = await login("admin@gmail.com", "123456");
//         result.browser.close();
//         expect(result.status).toBeGreaterThanOrEqual(200);
//         expect(result.status).toBeLessThan(400);
//     });
// });

// describe('TestLogin 2', () => {
//     it('User can not login with wrong password', async () => {
//         let result = await login("admin@gmail.com", "12345");
//         result.browser.close();
//         expect(result.status).toBeGreaterThanOrEqual(200);
//         expect(result.status).toBeLessThan(400);
//     });
// });

let users = [
    { username: "admin@gmail.com", password: "123456" },
    { username: "admin@gmail.com", password: "12345" },
    { username: "zoro@gmail.com", password: "123456" },
];

users.forEach(user => {
    describe(`Test login with username ${user.username} and password ${user.password}`, () => {
        it('User can login successfully', async () => {
            let result = await login(user.username, user.password);
            result.browser.close();
            expect(result.status).toBeGreaterThanOrEqual(200);
            expect(result.status).toBeLessThan(400);
        });
    });
});


