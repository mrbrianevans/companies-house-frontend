const style = require('./Logo.module.css')

const Logo = () => {
  return (
    <h1 className={style.logo}>
      F<span className={style.little}>ilter</span> F<span className={style.little}>acility</span>
    </h1>
  )
}

export default Logo
