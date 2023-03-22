import {
  WalletBalanceWidget,
  WalletBalanceWidgetProps,
} from "../balance/Balance";

type WalletBalanceProps = {
  component: "balance";
  props: WalletBalanceWidgetProps;
};

type WalletWidgetProps = WalletBalanceProps;

export const WalletWidget = ({ component, props }: WalletWidgetProps) => {
  switch (component) {
    case "balance":
      return <WalletBalanceWidget {...props} />;
    default:
      return null;
  }
};
