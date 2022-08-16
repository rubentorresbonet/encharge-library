const { chromium } = require('playwright-core');

export class Encharge
{
  private browser : any
  private page : any

  constructor(){}

  public async start(custom_cdp: string = "", headless: boolean = true)
  {
    if (custom_cdp != "")
    {
      this.browser = await chromium.connectOverCDP(custom_cdp)
    }
    else
    {
      this.browser = await chromium.launch({headless: headless})
    }
    this.page = await this.browser.newPage();
  }


  public async finish()
  {
    await this.browser.close();
  }

  public async login(user: string, pwd: string)
  {
    await this.page.goto('https://app.encharge.io/login');
    await this.page.fill('[placeholder="Email"]', user);
    await this.page.fill('[placeholder="Password"]', pwd);
    await Promise.all([
      this.page.waitForNavigation(/*{ url: 'https://app.encharge.io/emails?emails-folder-item=allEmails' }*/),
      this.page.click('button:has-text("Login")')
    ]);
  }

  public async createEmail(email_name: string, from_name: string, subject: string, content: string)
  {
    await this.page.goto('https://app.encharge.io/emails?emails-folder-item=allEmails');
    await this.page.waitForTimeout(500);
  
    //console.log('Creating email...')
    await this.page.click('[data-testid="createNewButton"]');
    await this.page.waitForTimeout(500);
    await this.page.click('[data-testid="addTextEmail"]');
    await this.page.waitForTimeout(500);

    //console.log('Preparing email...')
    await this.page.click('text=Send something awesome...');
    await this.page.fill('text=Send something awesome...', content);
    await this.page.waitForTimeout(500);

    // Email name
    await this.page.click('[placeholder="Enter email name"]');
    await this.page.fill('[placeholder="Enter email name"]', email_name);
    await this.page.waitForTimeout(500);

    // From name
    await this.page.click('[id="from-name"]');
    await this.page.fill('[id="from-name"]', from_name);
    await this.page.waitForTimeout(500);

    // Subject
    await this.page.click('[value="No Subject"]');
    await this.page.fill('[value="No Subject"]', subject);
    await this.page.waitForTimeout(500);
  
    // Click text=Save
    //console.log('Saving email...')
    await Promise.all([
      this.page.waitForNavigation(/*{ url: 'https://app.encharge.io/emails?emails-folder-item=allEmails&email=75738' }*/),
      this.page.click('text=Save and close')
    ]);
    await this.page.waitForTimeout(3000);
  }

};
