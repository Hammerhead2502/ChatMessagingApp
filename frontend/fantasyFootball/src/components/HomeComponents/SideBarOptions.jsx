import React, { useEffect } from 'react'
import { motion, AnimatePresence } from "framer-motion"

const SideBarOptions = ({option, value, func, font, messages, index}) => {
  useEffect(() => {}, [messages])
	return (
    <div>
        <motion.div className='flex items-start py-4 px-2 text-sm font-medium rounded-lg bg-white text-black transition-colors mb-1'>
						  <AnimatePresence>
							  {
								  <motion.button
									  className={`ml-4 whitespace-nowrap ${font} text-left`}
									  initial={{ opacity: 0, width: 0 }}
									  animate={{ opacity: 1, width: "auto" }}
									  exit={{ opacity: 0, width: 0 }}
									  transition={{ duration: 0.2, delay: 0.3 }}
									  value={value}
									  onClick={func}
								  >
									  {option}{messages && messages.length ? messages?.[index]?.length ? <p className='text-sm font-light'>{messages?.[index]?.[0]?.messages.slice(-1)[0]?.message}</p> : <p className='text-sm font-light'>No chat</p>: <></>}
								  </motion.button>
							  }
						  </AnimatePresence>
					  </motion.div>
    </div>
  )
}

export default SideBarOptions