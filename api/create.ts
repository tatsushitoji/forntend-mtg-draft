import { NowRequest, NowResponse } from '@now/node'
import chrome from 'chrome-aws-lambda'
import puppeteer from 'puppeteer-core'

// FIXME: specify chrome when now dev
const exePath = process.platform === 'win32'
? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'

export default async (req: NowRequest, res: NowResponse) => {
  const browser = await puppeteer.launch({
    args: chrome.args,
    executablePath: process.env.NODE_ENV === 'development' ? exePath : await chrome.executablePath,
    headless: chrome.headless,
  })
  const page = await browser.newPage()
  await page.goto('https://hackmd.io/login')
  await page.type('input[name="email"]', process.env.MAIL_ADRESS)
  await page.type('input[name="password"]', process.env.PASSWORD)
  await page.click('#login > .user-container > .form-horizontal > div > .btn')
  await page.waitForNavigation()

  await page.goto('https://hackmd.io/?nav=overview&template=3f8f6b87-807f-40c7-a49c-3dcc9ded007b')
  const button = await page.waitForSelector('.modal-body > .row > .col-sm-4 > .ui-templates-container > .btn-primary', { visible: true })
  await button.click()
  await page.waitForNavigation()
  await page.waitForSelector('h1#フロントエンドMTG', { visible: true })

  const pageURL = page.url()
  // const name = await page.$('.ui-name')
  // const nameText = await (await name.getProperty('textContent')).jsonValue()
  await browser.close()
  res.json({url: pageURL})
}

