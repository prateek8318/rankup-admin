import React from "react";
import { Flex, Spin } from "antd";
import "../../styles/globals.css";

interface LoaderProps {
  fullPage?: boolean;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ fullPage = true, message }) => {
  const containerClassName = fullPage
    ? "min-h-screen flex justify-center items-center"
    : "";

  return (
    <div className={containerClassName}>
      <Flex gap="small" vertical align="center" justify="center">
        <Spin size="large" />
        {message && (
          <div
            style={{
              marginTop: 12,
              fontSize: 14,
              color: "#6b7280",
              textAlign: "center",
            }}
          >
            {message}
          </div>
        )}
      </Flex>
    </div>
  );
};

export default Loader;


