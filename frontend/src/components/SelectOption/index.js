import Select from 'react-select';

function SelectOption(props) {
  return (
    <Select
      className='select-control-wrapper'
      classNamePrefix='select'
      menuPlacement='auto'
      {...props}
    />
  )
}

export default SelectOption
