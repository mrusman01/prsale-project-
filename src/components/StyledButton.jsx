import { Button } from "@mui/material";

function StyledButton({ children, ...props }) {
  return (
    <Button
      {...props}
      disableRipple={true}
      sx={{
        color: "#fff",
        background: "#098CDC",
        fontSize: "16px",
        textTransform: "capitalize",
        borderRadius: "5px",
        width: props.width,
        height: "40px",
        "&:hover": {
          color: "#000",
          background: "transparent",
          border: "1.5px solid #098cdc",
        },
      }}
    >
      {children}
    </Button>
  );
}

export default StyledButton;
