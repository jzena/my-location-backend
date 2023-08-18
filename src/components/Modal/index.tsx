import { XMarkIcon } from "../LiveLocation/svgIcons"

interface WrapperDialongProps {
  open: boolean
  title: string
  onClose: () => void
  children: React.ReactNode
}
export function Modal(props: WrapperDialongProps) {
  const { open, title } = props

  if (!open) {
    return null
  }

  return (
    <>
      <div className="min-w-[300px] max-w-[350px] min-h-[150px] absolute top-[35%] mx-auto z-[300] bg-white rounded-[10px] p-2 shadow shadow-lg">
        <span className="!pb-[2px]">
          <div className="flex items-center justify-between h-[40px]">
            <span className="font-[600]">{title}</span>
            <div
              onClick={props.onClose}
              className="flex items-center justify-center !p-0"
              style={{
                position: 'absolute',
                right: 10,
                top: 13,
              }}
            >
              <div className="!w-[25px] !h-[25px] flex items-center justify-center !text-gray-500 font-[600]">
                <XMarkIcon />
              </div>
            </div>
          </div>
        </span>
        {props.children}
      </div>
    </>
  )
}
