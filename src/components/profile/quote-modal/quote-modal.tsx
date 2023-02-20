import { Modal } from 'antd';
import React from 'react';

export const QuoteModal: React.FC<{
    isQuoteModalVisible: boolean;
    setIsQuoteModalVisible: (value: boolean) => void;
}> = ({ isQuoteModalVisible, setIsQuoteModalVisible }) => {
  return (
    <Modal
      title="Requesting the code"
      open={isQuoteModalVisible}
      onCancel={() => {
        setIsQuoteModalVisible(false);
      }}
      width={740}
    >
    </Modal>
  );
};
