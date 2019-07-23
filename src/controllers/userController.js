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

  var initialData = {};

  //Get full name
  const FullName = await page.$eval('#lblUsuario', e => e.textContent);
  initialData['fullname'] = FullName;

  //Navigate to students information
  await Promise.all([
    page.click("#lnkInfoEst"),
    page.waitForNavigation({waitUntil: 'networkidle0'})
  ]).catch(reason => {
    return Promise.reject(reason);
  });

  var sImage = await page.$("#ContentPlaceHolder1_imgFoto");
  await sImage.screenshot({omitBackground: true, encoding: 'base64'})
    .then((imgBase64) => initialData['simgb64'] = imgBase64);

  //Close page
  await page.close();

  return initialData;
}


exports.getStudentData = async function(email ,password){
  var browser = await PuppService.GetBrowser();

  //Navigate to login page
  const page = await browser.newPage();
  page.setViewport({ width: 1280, height: 926 });
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

  //Go to student data
  await Promise.all([
    page.click("#lnkInfoEst"),
    page.waitForNavigation({waitUntil: 'networkidle0' })
  ]);

  var DataStudent = {};

  //Get student img, take screenshot
  var sImage = await page.$("#ContentPlaceHolder1_imgFoto");
  await sImage.screenshot({omitBackground: true, encoding: 'base64'})
    .then((imgBase64) => DataStudent['simgb64'] = imgBase64);

  //const nocar = await page.$eval('#ContentPlaceHolder1_lblNoCarnet', e => e.textContent);
  //DataStudent['Carnet'] = nocar;

  //Ger personal data
  await Promise.all([
    page.$eval('#ContentPlaceHolder1_lblNoCarnet', e => e.textContent),
    page.$eval('#ContentPlaceHolder1_lblNombres', e => e.textContent),
    page.$eval('#ContentPlaceHolder1_lblApellidos', e => e.textContent),
    page.$eval('#ContentPlaceHolder1_lblFNac', e => e.textContent),
    page.$eval('#ContentPlaceHolder1_lblSexo', e => e.textContent),
    page.$eval('#ContentPlaceHolder1_lblEstadoCiv', e => e.textContent),
    page.$eval('#ContentPlaceHolder1_lblDireccion', e => e.textContent),
    page.$eval('#ContentPlaceHolder1_lblTelefono1', e => e.textContent),
    page.$eval('#ContentPlaceHolder1_lblTelefono2', e => e.textContent),
    page.$eval('#ContentPlaceHolder1_lblCorreo', e => e.textContent),
    page.$eval('#ContentPlaceHolder1_lblCelular', e => e.textContent)
  ]).then(values => {
    DataStudent['psdata'] = values;
  });

  //Get career data
  await Promise.all([
    page.$eval('#ContentPlaceHolder1_lblFacultad > a', e => e.textContent),
    page.$eval('#ContentPlaceHolder1_lblCarrera', e => e.textContent),
    page.$eval('#ContentPlaceHolder1_lnkPlanEstudios', e => e.textContent),
    page.$eval('#ContentPlaceHolder1_lblTurno', e => e.textContent),
    page.$eval('#ContentPlaceHolder1_lblEstCarEstado', e => e.textContent),
    page.$eval('#ContentPlaceHolder1_lblAIngreso', e => e.textContent)
  ]).then(values => {
    DataStudent['csdata'] = values;
  });

  /*const noCarnet = await page.$eval("#ContentPlaceHolder1_lblNoCarnet", e => e.textContent);
  DataStudent['noCarnet'] = noCarnet;
  const nombres = await page.$eval("#ContentPlaceHolder1_lblNombres", e => e.textContent);
  DataStudent['nombres'] = nombres;
  const apellidos = await page.$eval("#ContentPlaceHolder1_lblApellidos", e => e.textContent);
  DataStudent['apellidos'] = apellidos;
  const fechaNac = await page.$eval("#ContentPlaceHolder1_lblFNac", e => e.textContent);
  DataStudent['fechaNac'] = fechaNac;
  const sexo = await page.$eval("#ContentPlaceHolder1_lblSexo", e => e.textContent);
  DataStudent['sexo'] = sexo;
  const estadoCivil = await page.$eval("#ContentPlaceHolder1_lblEstadoCiv", e.textContent);
  DataStudent['estadoCivil'] = estadoCivil;
  const direccion = await page.$eval("#ContentPlaceHolder1_lblDireccion", e => e.textContent);
  const tel1 = await page.$eval("#ContentPlaceHolder1_lblTelefono1", e => e.textContent);
  const tel2 = await page.$eval("#ContentPlaceHolder1_lblTelefono2", e => e.textContent);*/

  //Close
  await page.close();

  return DataStudent;
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