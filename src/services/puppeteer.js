const puppeteer = require('puppeteer');

let browser = null;

exports.GetBrowser = async function() {
  if(browser == null)
    browser = await puppeteer.launch();
  return browser;
}

exports.Initiate = async function(){
  browser = await puppeteer.launch();
}

