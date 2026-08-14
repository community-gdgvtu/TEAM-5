import React from "react";

export const Snowfall: React.FC<{ className?: string }> = ({ className }) => {
  const baseClass = "absolute inset-0 pointer-events-none";
  const extraClass = className ? " " + className : "";
  return <div className={baseClass + extraClass + " opacity-20"} aria-hidden="true" />;
};