import { browser, by, element, protractor } from 'protractor';

import { App } from '../../../app.po';
//import { LoanPage } from './loan.po';

describe('Document Viewer', () => {

  let app: App = new App();
  let webdriver = require('selenium-webdriver');
  //let page: LoanPage = new LoanPage();

  beforeEach(() => {
    app.navigateTo('/#/loan/100151518');
  });

  it('should have a documents dropdown button with a list of documents', () => {
    element(by.css('.e2e-dropdown-docs')).click();
    let subject = element.all(by.css('.e2e-dropdown-docs-list button')).count();
    expect(subject).toBeGreaterThan(0);
  });

  it('should be able to change the currently viewed document', () => {
    element(by.css('.e2e-dropdown-docs')).click(); // No idea why this needs to go twice
    element(by.css('.e2e-dropdown-docs')).click();
    element.all(by.css('.e2e-dropdown-docs-list button')).get(1).click();
    return true;
  });

  it('should have a web links dropdown button with a list of links', () => {
    element(by.css('.e2e-dropdown-web')).click();
    let subject = element.all(by.css('.e2e-dropdown-web-list button')).count();
    expect(subject).toBeGreaterThan(0);
  });

  it('should be able to click a web link', () => {
    element(by.css('.e2e-dropdown-web')).click(); // No idea why this needs to go twice
    //browser.driver.sleep(3000);
    element(by.css('.e2e-dropdown-web')).click();
    element.all(by.css('.e2e-dropdown-web-list button')).get(0).click();
    return true;
  });

  it('should have a document title', () => {
    element(by.css('.e2e-docname')).getText().then(function (text) {
      expect(text.length).not.toEqual(0);
    });
  });

});
