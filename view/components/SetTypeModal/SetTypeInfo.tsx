import { StyleSheet, Text, View, Modal } from 'react-native'
import React from 'react'
import FailureSetModal from './FailureSetModal'
import WarmUpSet from './WarmUpSet'
import DropSetModal from './DropSetModal'

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
    >
      {setType === 'warmup' && <WarmUpSet />}
      {setType === 'drop' && <DropSetModal />}
      {setType === 'failure' && <FailureSetModal />}
    </Modal>
  )
}

export default SetTypeInfo
