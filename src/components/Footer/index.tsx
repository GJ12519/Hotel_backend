/* Footer 页面底部 */
import React from "react";
import { Layout } from "antd";
import "./index.less";

const { Footer } = Layout;

interface Props {
  className?: string;
}

export default function FooterCom(props: Props) {
  return (
    <Footer className={`footer ${props.className}`}>
      {/* © 2018-{new Date().getFullYear() + " "}
      <a
        href="https://blog.isluo.com"
        target="_blank"
        rel="noopener noreferrer"
      >
        blog.isluo.com
      </a>
      , Inc. */}
      酒店客房管理系统
    </Footer>
  );
}
