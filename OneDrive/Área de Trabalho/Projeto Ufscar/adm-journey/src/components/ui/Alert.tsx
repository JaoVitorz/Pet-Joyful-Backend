// Alert Component
interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  onClose?: () => void
}

export function Alert({ type, message, onClose }: AlertProps) {
  const colors = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  }
  
  const icons = {
    success: '✓',
    error: '✕',
    warning: '!',
    info: 'ⓘ',
  }
  
  return (
    <div className={`border-l-4 p-4 rounded ${colors[type]}`} role="alert">
      <div className="flex items-start">
        <span className="mr-3 font-bold text-lg">{icons[type]}</span>
        <div className="flex-1">
          <p>{message}</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="ml-4 font-bold text-lg cursor-pointer">
            ×
          </button>
        )}
      </div>
    </div>
  )
}
