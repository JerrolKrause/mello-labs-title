import { browser, by, element } from 'protractor';

import { App } from '../../app.po';
import { HomePage } from './home.po';

describe('Home Page', () => {

  let app: App = new App();
  let page: HomePage = new HomePage();

  beforeEach(() => {
    app.navigateTo('/#/');
  });

  it('should have a nav menu', () => {
    let subject = element(by.css('.navbar-nav')).isPresent();
    let result = true;
    expect<any>(subject).toEqual(result);
  });

  it('should have 3 tabs', () => {
    let subject = element.all(by.css('.nav-tabs .nav-item')).count();
    let result = 3;
    expect<any>(subject).toEqual(result);
  });
  
  it('should have a grid with 7 columns', () => {
    let subject = element.all(by.css('.datagrid-header-cell')).count();
    let result = 7;
    expect<any>(subject).toEqual(result);
  });

  it('should have an exceptions tab with 8 columns', () => {
    element.all(by.css('.nav-tabs .nav-item')).get(2).click();
    let subject = element.all(by.css('.datagrid-header-cell')).count();
    let result = 8;
    expect<any>(subject).toEqual(result);
  });

  it('should have links which go to the loan page', () => {
    element.all(by.css('.datagrid-cell-data a')).get(0).click();
    return browser.driver.wait(function () {
      return browser.driver.getCurrentUrl().then(function (url) {
        return url.indexOf('loan') !== -1 ? true : false;
      });
    }, 10000);
  });

});
