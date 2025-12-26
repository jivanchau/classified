const Footer = () => {
    const today = new Date();
      const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
      
    return (
        <div className='footerMain'>
            <div className='footerRemark'>
            Developed by <a href='#'>Prooey</a>
            </div>
            <div className='footerStatus'>
            Logged in as <a href="#">Admin</a> | <span className='date'>{formattedDate}</span>
            </div>
        </div>
    )
}

export default Footer;