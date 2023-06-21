import Select from 'react-select';

function SelectOption(props) {
  return (
    <Select
      className='select-control-wrapper'
      classNamePrefix='select'
      {...props}
    />
  )
}

export default SelectOption
