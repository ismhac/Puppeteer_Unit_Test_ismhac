const puppeteer = require('puppeteer');
jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;

var users = [
    { username: "admin@gmail.com", password: "123456" },
    { username: "admin@gmail.com", password: "12345" },
    { username: "dien123456789@gmail.com", password: "123456789" },
    { username: "tuyendung1@gmail.com", password: "123456789" },
    { username: "admin@gmail.com", password: "12345" },
    { username: "dien123456789@gmail.com", password: "123456789" },
    { username: "admin@gmail.com", password: "12345" },
    { username: "dien123456789@gmail.com", password: "123456789" },
    { username: "admin@gmail.com", password: "12345" },
    { username: "dien123456789@gmail.com", password: "123456789" },
    { username: "dien123456789@gmail.com", password: "123456789" },
    { username: "dien123456789@gmail.com", password: "123456789" },
];

let login = async (browser, username, password) => {
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
    await page.close();
    return status;
}

let results = [];

describe('Login tests', () => {
    let browser;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            // headless: "new",
            // headless: false,
        });
    });

    afterAll(async () => {
        await browser.close();
        console.log("\n");
        console.table(results);
    });

    users.forEach((user, index) => {
        it(`Test login with username ${user.username} and password ${user.password}`, async () => {
            let status;
            try {
                status = await login(browser, user.username, user.password);
            } catch (error) {
                console.error(`Error logging in with user ${index + 1}:`, error);
                status = 500;
            }
            expect(status).toBe(201);
            results.push({ 'User': index + 1, 'Expected Status': 201, 'Actual Status': status });
        });
    });
});






