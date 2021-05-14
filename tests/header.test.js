const Page = require("./helpers/page");

let page;

beforeEach(async ()=>{
  page = await Page.build();
  await page.goto("http://localhost:3000");
});

afterEach( async ()=>{
  await page.close();
});

test("The header has the correct text", async () =>{
  //const text = await page.$eval("a.brand-logo", el => el.innerHTML);
  const text = await page.getContentsOf("a.brand-logo");

  expect(text).toEqual("Blogster");
});

test("Clicking login start auth flow", async () =>{
  await page.click(".right a");
  const url = await page.url();
  
  expect(url).toMatch(/accounts\.google\.com/);
});

test("When sign in, shows logout button",async ()=>{
  await page.login();
  
  //const text = await page.$eval("a[href='/auth/logout']", el => el.innerHTML)
  const text = await page.getContentsOf("a[href='/auth/logout']");

  expect(text).toEqual("Logout");
});
  // Para probar el login en passport
  //const id = "60994fb5edf2c4a10d5aa89d";
  // const Buffer = require("safe-buffer").Buffer;
  // const sessionObject = {
  //   passport: {
  //     user: id
  //   }
  // };

  // const sessionString = Buffer.from(JSON.stringify(sessionObject))
  //   .toString("base64");

  // const Keygrip = require("keygrip");
  // const keys = require("../config/keys");
  // const keygrip = new Keygrip([keys.cookieKey]);
  // const sig = keygrip.sign("session="+ sessionString);
