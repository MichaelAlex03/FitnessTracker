import { StyleSheet, Text, View, Modal } from 'react-native'
import React from 'react'
import FailureSetModal from './FailureSet'
import WarmUpSet from './WarmUpSet'
import DropSetModal from './DropSet'

interface SetTypeInfoProps {
  showSetTypeInfo: boolean
  setShowSetTypeInfo: (show: boolean) => void
  setType: string
}

const SetTypeInfo = ({ showSetTypeInfo, setShowSetTypeInfo, setType }: SetTypeInfoProps) => {
  return (
    <Modal
      visible={showSetTypeInfo}
      onRequestClose={() => setShowSetTypeInfo(false)}
      transparent={true}
      animationType='slide'
    >
      <View className='flex-1 items-center justify-center p-6 bg-black/50'>
        {setType === 'warmup' && <WarmUpSet setShowSetTypeInfo={setShowSetTypeInfo} />}
        {setType === 'drop' && <DropSetModal setShowSetTypeInfo={setShowSetTypeInfo} />}
        {setType === 'failure' && <FailureSetModal setShowSetTypeInfo={setShowSetTypeInfo} />}
      </View>

    </Modal>
  )
}

export default SetTypeInfo
