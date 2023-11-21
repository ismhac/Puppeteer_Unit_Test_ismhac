const puppeteer = require('puppeteer');

// test case: 
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
];

//
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

let results = [];

users.forEach((user, index) => {
    describe(`Test login with username ${user.username} and password ${user.password}`, () => {
        test('User can login successfully', async () => {
            let result = await login(user.username, user.password);
            result.browser.close();
            results.push({ 'User': index + 1, 'Expected Status': 201, 'Actual Status': result.status });
            expect(result.status).toBe(201);
        });
    });
});

afterAll(() => {
    console.log("\n");
    console.table(results);
});
