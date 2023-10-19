import "./index.css";

import { useState, lazy, Suspense } from "react";
import type { WidgetProps, WalletPassThroughProps } from "./types";
import { twMerge } from "tailwind-merge";
import { FidaIcon } from "./components/fida-icon";

const Widget = lazy(() => import(`./widget`));

const EntryPoint = ({
  rootWrapperClassNames,
  rootWrapperStyles,
  ...props
}: WidgetProps) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className={twMerge("fixed bottom-3 right-3 z-1", rootWrapperClassNames)}
      style={rootWrapperStyles}
    >
      <button
        onClick={() => setVisible(!visible)}
        className="w-[50px] h-[50px] rounded-full bg-background-primary overflow-hidden text-text-primary p-2 flex items-center justify-center"
        type="button"
        aria-label={visible ? "Close SNS widget" : "Open SNS widget"}
        aria-haspopup="true"
      >
        <FidaIcon />
      </button>

      <Suspense>{visible && <Widget {...props} />}</Suspense>
    </div>
  );
};

export type { WidgetProps, WalletPassThroughProps };
export default EntryPoint;
