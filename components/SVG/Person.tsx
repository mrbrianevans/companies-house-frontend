export const Person = ({ size = 10 }: { size?: number }) => {
  const unit = size
  return (
    <svg height={unit * 4} width={unit * 4}>
      <circle cx={unit * 2} cy={unit * 1.5} r={unit} />
      <circle cx={unit * 2} cy={unit * 5} r={unit * 2} fill={'transparent'} stroke={'black'} strokeWidth={unit / 3} />
    </svg>
  )
}
