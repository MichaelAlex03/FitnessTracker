import {useState } from 'react'
import DropdownButton from '../DropdownButton/DropdownButton'
import DropdownContent from '../DropdownContent/DropdownContent'



function Dropdown({ buttonText, content }) {

  const [open, setOpen] = useState(false);

  const toggleDropdown = () => {
    setOpen(open => !open)
  }
  
  return (
    <div className='relative'>
        <DropdownButton toggle={toggleDropdown} open={open}>{buttonText}</DropdownButton>
        <DropdownContent open={open}>{content}</DropdownContent>
    </div>
  )
}

export default Dropdown