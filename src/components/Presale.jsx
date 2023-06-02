import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import {
  usePresaleContract,
  useTokenContract,
} from "../ConnectivityAssets/hooks";
import { AppContext } from "../utils";
import { formatUnits, parseUnits } from "@ethersproject/units";

const StyledBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginTop: "30px",
  flexWrap: "wrap",
});
const Presale = () => {
  const { signer, account } = useContext(AppContext);
  const presaleContract = usePresaleContract(signer);
  const tokenContract = useTokenContract(signer);

  // Token read function
  const [tokenName, setTokenName] = useState("");
  const [tokenDecimal, setTokenDecimal] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenSupply, setTokenSupply] = useState();
  const [bnbToToken, setBnbToToken] = useState("");
  const [soldTokens, setSoldTokens] = useState("");
  const [claimToken, setClaimToken] = useState("");
  const [limit, setLimit] = useState({ min: 0.01, max: 10 });

  const [tokenAmount, setTokenAmount] = useState();

  const init = async () => {
    const decimal = await tokenContract.decimals();
    setTokenDecimal(decimal);
    const tokenNames = await tokenContract.name();
    setTokenName(tokenNames);
    const symbols = await tokenContract.symbol();
    setTokenSymbol(symbols);
    const supply = await tokenContract.totalSupply();
    setTokenSupply(formatUnits(supply.toString(), 18));

    const minAmounts = await presaleContract.minAmount();
    const maxAmounts = await presaleContract.maxAmount();

    const maxContribution = await presaleContract.soldToken();
    setSoldTokens(formatUnits(maxContribution).toString(), "soldToken");

    const claimTokens = await presaleContract.claimed(account);
    console.log(claimTokens); ////
    setClaimToken(claimTokens);

    setLimit({
      min: Number(formatUnits(minAmounts.toString(), 18)),
      max: Number(formatUnits(maxAmounts.toString(), 18)),
    });
  };

  const token = async () => {
    const bnbToTokens = await presaleContract.bnbToToken(
      parseUnits(tokenAmount.toString(), "18")
    );
    setBnbToToken(formatUnits(bnbToTokens.toString(), "18"));
  };

  // console.log(limit.min, "limit.min");

  const BuyToken = async () => {
    if (!tokenAmount) {
      alert("enter somthing");
    } else if (tokenAmount <= 0) {
      alert("enter correct amount grater then 0");
    } else if (tokenAmount < limit.min || tokenAmount > limit.max) {
      alert("add correct amount");
    } else {
      try {
        const tx1 = await presaleContract.buyToken({
          value: parseUnits(tokenAmount.toString(), 18),
          gasLimit: 210000,
        });
        await tx1.wait();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    if (tokenAmount) token();
  }, [tokenAmount]);

  return (
    <Container maxWidth="sm">
      <Box
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        flexDirection={"column"}
        gap={2}
      >
        <Typography variant="h5">Presale</Typography>
        <TextField
          variant="outlined"
          type="number"
          onChange={(e) => setTokenAmount(e.target.value)}
        />
        <Typography variant="h6">Tokens</Typography>
        <TextField variant="outlined" type="number" value={bnbToToken} />

        <Button variant="contained" onClick={BuyToken}>
          Buy
        </Button>
      </Box>

      <StyledBox>
        <Typography>Token Name</Typography>
        <Typography>{tokenName}</Typography>
      </StyledBox>
      <StyledBox>
        <Typography>Decimal</Typography>
        <Typography>{tokenDecimal}</Typography>
      </StyledBox>
      <StyledBox>
        <Typography>Token Symbol</Typography>
        <Typography>{tokenSymbol}</Typography>
      </StyledBox>
      <StyledBox>
        <Typography>Token Supply</Typography>
        <Typography>{tokenSupply}</Typography>
      </StyledBox>
      <Divider sx={{ my: 5 }} />
      <StyledBox>
        <Typography>Sold Token</Typography>
        <Typography>{soldTokens}</Typography>
      </StyledBox>
      <StyledBox>
        <Typography>Claimable Token</Typography>
        <Typography>{claimToken}</Typography>
      </StyledBox>
    </Container>
  );
};

export default Presale;
