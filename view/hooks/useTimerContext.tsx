import { useContext } from 'react'
import TimerContext from '@/context/TimerContext'

const useTimerContext = () => {
    return useContext(TimerContext);
}

export default useTimerContext
