import React from "react";

export default function layout(props: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-7xl">{props.children}</div>;
}
