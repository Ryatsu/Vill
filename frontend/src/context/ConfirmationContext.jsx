import { createContext, useContext, useState } from 'react'

const ConfirmationContext = createContext()

export function ConfirmationProvider({ children }) {
  const [state, setState] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    onConfirm: null,
    onCancel: null,
  })

  const confirm = (options) => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        title: options.title || 'Confirm',
        message: options.message || 'Are you sure?',
        confirmText: options.confirmText || 'Confirm',
        cancelText: options.cancelText || 'Cancel',
        onConfirm: () => {
          setState(prev => ({ ...prev, isOpen: false }))
          resolve(true)
        },
        onCancel: () => {
          setState(prev => ({ ...prev, isOpen: false }))
          resolve(false)
        },
      })
    })
  }

  const close = () => {
    setState(prev => ({ ...prev, isOpen: false }))
  }

  return (
    <ConfirmationContext.Provider value={{ ...state, confirm, close }}>
      {children}
    </ConfirmationContext.Provider>
  )
}

export function useConfirm() {
  const context = useContext(ConfirmationContext)
  if (!context) {
    throw new Error('useConfirm must be used within ConfirmationProvider')
  }
  return context.confirm
}

export default ConfirmationContext
