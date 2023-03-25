import { useRef, useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { IoLocationOutline } from 'react-icons/io5';
import styles from './SearchAddress.module.scss';

function SearchAddress({address, setAddress}) {
    // const [address, setAddress] = useState('');
    const inputRef = useRef(null);
    const [autoAddress, setAutoAddress] = useState('');

    const handleChange = (address) => {
        setAddress('');
        setAutoAddress(address);
    }

    const handleSelect = async(address) => {
        const results = await geocodeByAddress(address);
        // const latLng = await getLatLng(results[0]);
        inputRef.current.value = address;
        setAddress(address);
        setAutoAddress(address);
    }

    return (
        <div className={styles.wrapper}>
            <PlacesAutocomplete
                value={autoAddress}
                onChange={handleChange}
                onSelect={handleSelect}>
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className='form-group'>
                    <label>Địa chỉ</label>
                    <input
                        ref={inputRef}
                        {...getInputProps({
                            placeholder: "Nhập vào địa chỉ...",
                            className: "form-control",
                        })}
                    />
                    <div>
                        {loading ? <div>Đang tải...</div> : null}
                        
                        <div className={styles.suggestionWrap}>
                            {suggestions.map((suggestion) => {
                                const style = {
                                    backgroundColor: suggestion.active ? "#fafafa" : "#fff",
                                    cursor: 'pointer',
                                };
                                return (
                                <div
                                    {...getSuggestionItemProps(suggestion, { style })}
                                    key={suggestion.placeId}
                                    className="p-2 d-flex"
                                >
                                    <div className='me-1'><IoLocationOutline/></div>
                                    <span>{suggestion.description}</span>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                )}
            </PlacesAutocomplete>
        </div>
    )
}

export default SearchAddress;