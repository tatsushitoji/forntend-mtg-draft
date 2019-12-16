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
  await page.goto('https://hackmd.io/')
  const coverHeading = await page.$('.cover-heading')
  const coverheadingText = await (await coverHeading.getProperty('textContent')).jsonValue()
  await browser.close()
  res.json({headText: coverheadingText})
}

