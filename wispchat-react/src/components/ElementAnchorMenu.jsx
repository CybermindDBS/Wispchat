import * as React from "react";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";

export default function ElementAnchorMenu({
                                              anchorEl, onClose, options, onSelect, orientation
                                          }) {

    return (<Menu
        sx={{mt: '45px'}}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={onClose}
        anchorOrigin={{
            vertical: orientation.y, horizontal: orientation.x,
        }}
        transformOrigin={{
            vertical: orientation.y, horizontal: orientation.x,
        }}

    >
        {options.map((option) => (<MenuItem
            key={option.status}
            onClick={() => onSelect(option)}>
            <Typography sx={{textAlign: 'center'}} color="inherit">{option.status}</Typography>
        </MenuItem>))}
    </Menu>)
}