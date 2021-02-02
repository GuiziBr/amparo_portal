import React, {
  useRef, useEffect, useState, useCallback,
} from 'react'
import { useField } from '@unform/core'
import { FiAlertCircle } from 'react-icons/fi'

import ReactSelect, {
  OptionTypeBase,
  Props as ReactSelectProps,

} from 'react-select'

import { Container, Error } from './styles'

interface Props extends ReactSelectProps {
  name: string;
}

const Select: React.FC<Props> = ({ name, ...rest }) => {
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)

  const {
    fieldName, defaultValue, registerField, error,
  } = useField(name)

  const selectRef = useRef(null)

  const handleInputBlur = useCallback(() => {
    setIsFocused(false)
  }, [])

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      getValue: (ref) => (ref.props.isMulti
        ? ref.state.value?.map((option: OptionTypeBase) => option.label) || []
        : ref.state.value?.label || ''),
      setValue: (ref, value) => {
        ref.select.setValue(value || null)
      },
      clearValue: (ref) => {
        ref.select.clearValue()
      },
    })
  }, [fieldName, registerField, rest.isMulti])

  return (
    <Container isErrored={!!error} isFocused={isFocused} isFilled={isFilled}>
      <ReactSelect
        ref={selectRef}
        defaultValue={defaultValue}
        onFocus={() => setIsFocused(true)}
        onBlur={handleInputBlur}
        isClearable
        isSearchable
        {...rest}
      />
      {error && (
      <Error title={error}>
        <FiAlertCircle color="#c53030" size={20} />
      </Error>
      )}
    </Container>
  )
}

export default Select
