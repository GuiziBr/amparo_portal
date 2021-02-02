import React, {
  InputHTMLAttributes, useEffect, useRef, useState, useCallback,
} from 'react'
import { useField } from '@unform/core'
import { FiAlertCircle } from 'react-icons/fi'
import { Container, Error } from './styles'
import { cpfMask } from '../../utils/cpfMask'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  isCpf?: boolean
}

const Input: React.FC<InputProps> = ({ name, isCpf, ...rest }) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [isFilled, setIsFilled] = useState(false)

  const {
    fieldName, defaultValue, error, registerField,
  } = useField(name)

  const handleInputBlur = useCallback(() => {
    setIsFocused(false)
    setIsFilled(!!inputRef.current?.value)
  }, [])

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    if (!isCpf) return
    e.currentTarget.value = cpfMask(e.currentTarget.value)
  }

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: 'value',
    })
  }, [registerField, fieldName])
  return (
    <Container isErrored={!!error} isFocused={isFocused} isFilled={isFilled}>
      <input
        onFocus={() => setIsFocused(true)}
        onBlur={handleInputBlur}
        defaultValue={defaultValue}
        ref={inputRef}
        // value={document}
        onChange={(e) => handleChange(e)}
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

export default Input
