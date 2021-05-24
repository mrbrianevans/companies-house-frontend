import { getSqlLikeValues } from '../../helpers/getSqlLikeValues'

const testOutput = getSqlLikeValues(
  { values: ['A', 'a', 'B', 'b'], category: 'test', comparison: 'is exactly', exclude: false, type: 'string' },
  false
)

console.assert(testOutput[0].sort() === ['a', 'a', 'b', 'b'].sort())
