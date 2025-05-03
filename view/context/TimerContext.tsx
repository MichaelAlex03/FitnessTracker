import React, { createContext, useState } from 'react'

interface TimerContextProps {
  elapsedTime: number;
  setElapsedTime: (value: number) => void;
}

const TimerContext = createContext<TimerContextProps>({} as TimerContextProps)

export const TimerContextProvider = ({ children }: { children: React.ReactNode }) => {

  const [elapsedTime, setElapsedTime] = useState<TimerContextProps['elapsedTime']>(0);

  return (
    <TimerContext.Provider value={{ elapsedTime, setElapsedTime }}>
      {children}
    </TimerContext.Provider>
  )
}

export default TimerContext
