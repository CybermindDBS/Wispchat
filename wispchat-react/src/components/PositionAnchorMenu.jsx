import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

export default function PositionAnchorMenu({
                                               anchorPosition, onClose, options, onSelect
                                           }) {

    return (<Menu
        anchorReference="anchorPosition"
        anchorPosition={anchorPosition}
        open={Boolean(anchorPosition)}
        onClose={onClose}
    >
        {options.map((option) => (<MenuItem key={option.status} onClick={() => onSelect(option)}>
            <Typography sx={{textAlign: 'center'}} color="inherit">{option.status}</Typography>
        </MenuItem>))}
    </Menu>)
}