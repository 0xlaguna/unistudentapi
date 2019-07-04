var PuppService = require('../services/puppeteer');
var cheerio = require('cheerio');

const HomePage = "https://si.uni.edu.ni/notasuni/Principal.aspx";
const LoginPage = "https://si.uni.edu.ni/notasuni/Login.aspx";
const MatriculaPage = "https://si.uni.edu.ni/notasuni/HojaMatricula.aspx";

//Get full name
exports.CheckIfUserExists = async function(email, password){

  var browser = await PuppService.GetBrowser();

  //Navigate to login page
  const page = await browser.newPage();
  await page.goto(LoginPage);

  //Write username and password
  await page.type("#txtUsuarioStd", email);
  await page.type("#txtPasswordStd", password);

  //Select sede
  await page.select("#cboSedeStd", "UNI");

  //Click and wait log in and wait for navigation
  await Promise.all([
    page.click("#lnkAceptarStd"),
    page.waitForNavigation({waitUntil: 'networkidle0'})
  ])
  .catch(reason => {
    return Promise.reject(reason);
  });

  //Get full name
  const FullName = await page.$eval('#lblUsuario', e => e.textContent);
  
  //Navigate to students information
  await Promise.all([
    page.click("#lnkInfoEst"),
    page.waitForNavigation({waitUntil: 'networkidle0'})
  ]).catch(reason => {
    return Promise.reject(reason);
  });

  //Get raw student information data
  const rawStudentData = await page.$eval("#pnlPersonales > div.panel-body > div", e => e.outerHTML);

  //Close page
  await page.close();

  return rawStudentData;
}

//Get some shit
exports.GetNotas = async function(email, password){
  
  var browser = await PuppService.GetBrowser();

  //Navigate to login page
  const page = await browser.newPage();
  await page.goto(LoginPage);

  //Write username and password
  await page.type("#txtUsuarioStd", email);
  await page.type("#txtPasswordStd", password);

  //Select sede
  await page.select("#cboSedeStd", "UNI");

  //Click and wait log in and wait for navigation
  await Promise.all([
    page.click("#lnkAceptarStd"),
    page.waitForNavigation({waitUntil: 'networkidle0' })
  ]);

  //Click matricula page nav button
  await Promise.all([
    page.click("#lnkHojaMatricula"),
    page.waitForNavigation({waitUntil: 'networkidle0' })
  ]);

  //line 1

  const fronText = await page.$eval('#divHeaderMatricula > div.frame-heading', e => e.textContent);
  const nReciboTxt = await page.$eval('#divHeaderMatricula > div.form-condensed > div:nth-child(1) > div.form-group.col-xs-24.col-sm-15.col-md-18 > label', e => e.textContent);
  const noRecibo = await page.$eval('#divHeaderMatricula > div.form-condensed > div:nth-child(1) > div.form-group.col-xs-24.col-sm-15.col-md-18 > div > span', e => e.textContent);
  const NoInscriptxt = await page.$eval('#divHeaderMatricula > div.form-condensed > div:nth-child(1) > div.form-group.col-xs-24.col-sm-9.col-md-6 > label', e => e.textContent);
  const NoInscript = await page.$eval('#divHeaderMatricula > div.form-condensed > div:nth-child(1) > div.form-group.col-xs-24.col-sm-9.col-md-6 > div > span', e => e.textContent);

  //line 2
  const fullNameTxt = await page.$eval('#divHeaderMatricula > div.form-condensed > div:nth-child(2) > div.form-group.col-xs-24.col-sm-15.col-md-18 > label', e => e.textContent);
  const fullName = await page.$eval('#divHeaderMatricula > div.form-condensed > div:nth-child(2) > div.form-group.col-xs-24.col-sm-15.col-md-18 > div > span', e => e.textContent);
  const carnetTxt = await page.$eval('#divHeaderMatricula > div.form-condensed > div:nth-child(2) > div.form-group.col-xs-24.col-sm-9.col-md-6 > label', e => e.textContent);
  const carnetN = await page.$eval('#divHeaderMatricula > div.form-condensed > div:nth-child(2) > div.form-group.col-xs-24.col-sm-9.col-md-6 > div > span', e => e.textContent);

  console.log(fronText);
  console.log(nReciboTxt + " " + noRecibo + " " + NoInscriptxt + " " + NoInscript);

  console.log(fullNameTxt + " " + fullName + " " + carnetTxt + " " + carnetN);

  return Promise.resolve();
}