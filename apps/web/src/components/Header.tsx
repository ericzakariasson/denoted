import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";

function Header() {
  return (
    <>
      <header
        style={{
          paddingTop: "1%",
          paddingLeft: "2%",
          paddingRight: "2%",
          height: "3vh",
        }}
      >
        <div style={{ float: "right" }}>
          <ConnectButton showBalance={false} />
        </div>
      </header>
    </>
  );
}

export default Header;
