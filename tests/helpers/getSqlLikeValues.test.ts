import { getSqlLikeValues } from '../../helpers/getSqlLikeValues'

const testOutput = getSqlLikeValues(
  { values: ['A', 'a', 'B', 'b'], field: 'test', comparison: 'is exactly', exclude: false, dataType: 'string' },
  false
)

console.assert(testOutput[0].sort() === ['a', 'a', 'b', 'b'].sort())
