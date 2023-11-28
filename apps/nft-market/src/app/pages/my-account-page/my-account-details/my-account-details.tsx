import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Container } from "@mui/material";
import { useParams } from "react-router-dom";
import { useImpersonateAccount } from "@fantohm/shared-web3";
import OwnerInfo from "../../../components/owner-info/owner-info";
import { RootState } from "../../../store";

export function MyAccountDetails() {
  const params = useParams();

  const { impersonateAddress, isImpersonating } = useImpersonateAccount();

  const { user } = useSelector((state: RootState) => state.backend);
  const address = useMemo(() => {
    return !!params["walletAddress"] && params["walletAddress"].length > 1
      ? params["walletAddress"]
      : user.address ?? "";
  }, [user, params["walletAddress"]]);
  const userAddress = isImpersonating ? impersonateAddress : address;

  return (
    <Container sx={{ mt: "30px" }} maxWidth="lg">
      <OwnerInfo address={userAddress} />
    </Container>
  );
}

export default MyAccountDetails;
