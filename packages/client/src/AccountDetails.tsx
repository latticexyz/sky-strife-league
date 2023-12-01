import { useMUD } from "./MUDContext";

export function AccountDetails() {
  const {
    network: {
      walletClient,
      config: { privateKey },
    },
  } = useMUD();

  return (
    <div className="m-2">
      <div className="text-xl">Account</div>
      <div>Address: {walletClient.account.address}</div>
      <div>Private Key: {privateKey}</div>
    </div>
  );
}
