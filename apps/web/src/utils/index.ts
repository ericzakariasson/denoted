import * as chains from '@wagmi/chains';

export const formatEthAddress = (
  address: string,
  sub: number,
  number: number
) => {
  return address.replace(address.substring(sub, number), "...");
};

export const timeConverter = (timeStamp: number) => {
  var a = new Date(timeStamp * 1000);
  var months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time =
    date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
  return time;
};

export const SUPPORTED_CHAINS = [
  chains.arbitrum,
  chains.mainnet,
  chains.polygon,
  chains.optimism
] as const;