import { useEffect, useState } from 'react'
import { splitDate } from '../../helpers/utils/DateUtils'

const styles = require('./BirthDate.module.sass')

type BirthDateProps = {
  loading?: boolean
  birthDate?: number
}

export const BirthDate: (props: BirthDateProps) => JSX.Element = ({ loading, birthDate }) => {
  const [date, setDate] = useState<{ month: string; year: number }>()
  useEffect(() => {
    if (!loading && birthDate) setDate(splitDate(birthDate))
  }, [loading, birthDate])
  return (
    <div className={styles.container}>
      {loading || !date ? 'Loading Birth Date' : `Born in ${date.month} of ${date?.year}`}
    </div>
  )
}
