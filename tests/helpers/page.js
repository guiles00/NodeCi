const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");

class CustomPage {
  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });

    const page = await browser.newPage();

    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: function(target, property) {
        return customPage[property] || browser[property] || page[property]  ;
      }
    });
  }

  constructor(page) {
    this.page = page;
  }

  async login() {

  const user = await userFactory();
  const { session, sig } = sessionFactory(user);

  //Set this keys to chromium as a cookie
  await this.page.setCookie({ name: "session", value: session });
  await this.page.setCookie({ name: "session.sig", value: sig });
  // with this cookies setted, the app thinks you are logged in.
  await this.page.goto("http://localhost:3000/blogs");
  await this.page.waitFor("a[href='/auth/logout']");

  }

  async getContentsOf(selector){
    return this.page.$eval(selector, el => el.innerHTML);
  }
// IMPOORTATE
// El metodo evaluate convierte en string la funcion que le pasas
// y despues lo ejecuta como si estuviera en el navegador
// no se pueden pasar las variables como en vanilla JS
// tenes que pasar los argumentos por parametros y despues 
// pasarlo otra vez por parametro en la funcion que luego 
// llama a la funcion que queres ejecutar
// 
  get(path) {

    return this.page.evaluate(
      (_path) => {

        //this has to be evaluated from chromiun with puppeteer; 
      return  fetch(_path,{
          method:"GET",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json"
          }
        }).then( res => res.json());
      
      }, path);
  }

  post(path,data) {

    return this. page.evaluate(
      (_path,_data) => {

        //this has to be evaluated from chromiun with puppeteer; 
      return  fetch(_path,{
          method:"POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(_data)
        }).then( res => res.json());
      
      }, path, data);
  }

  execRequests(actions) {

    return Promise.all(
      actions.map(({ method, path, data}) => {
       return this[method](path, data);
      })
    );
    
  }
}

module.exports = CustomPage;