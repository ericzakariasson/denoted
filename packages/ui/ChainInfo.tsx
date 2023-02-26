type ChainInfoProps = {
  chain: string;
  address: string;
};

export const ChainInfo = (props: ChainInfoProps) => {
  return (
    <>
      <h3>Connected to : {props.chain}</h3>
      <h3>Your Address : {props.address}</h3>
    </>
  );
};
