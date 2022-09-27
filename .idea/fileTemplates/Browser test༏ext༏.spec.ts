import test from '../nextFixture'
import { TestUrl } from '../../helpers/TestUrl'
import { expect } from '@playwright/test'

test('test $NAME', async ({page, port})=>{
  const testUrl = new TestUrl({ port })
  await page.goto(testUrl.getUrl())
  
})