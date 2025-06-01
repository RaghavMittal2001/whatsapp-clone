import React from 'react'

function Defaultpage() {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#f0f2f5] dark:bg-[#222e35]">
        <div className="text-center text-[#41525d] dark:text-[#8696a0] max-w-md p-6">
          <h1 className="mb-4 text-3xl font-light">WhatsApp Web</h1>
          <p className="mb-6">
            Send and receive messages without keeping your phone online.
            Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
          </p>
          <div className="text-sm text-[#8696a0]">
            <p>End-to-end encrypted</p>
          </div>
        </div>
      </div>
  )
}

export default Defaultpage
