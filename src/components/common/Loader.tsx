import React from 'react';
import { Alert, Flex, Spin } from 'antd';
import "../../styles/globals.css";

interface ContentStyle {
  width: number;
  height: number;
  padding: number;
  background: string;
  borderRadius: number;
}

const contentStyle: ContentStyle = {
  width: 400,
  height: 400,
  padding: 50,
  background: 'rgba(0, 0, 0, 0.05)',
  borderRadius: 7,
};

const content = <div style={contentStyle} />;

const Loader: React.FC = () => (
  <div className='min-h-screen flex justify-center items-center'>
    <Flex gap="middle" vertical>
      <Flex>
        <Spin size="large">
          {content}
        </Spin>
      </Flex>
    </Flex>
  </div>
);

export default Loader;
