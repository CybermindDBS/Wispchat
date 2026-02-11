import {styled} from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import AttachFileIcon from "@mui/icons-material/AttachFile";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

export default function AttachFileButton({handleFileUpload}) {
    return (
        <IconButton
            component="label"
            role={undefined}
            variant="contained"
            tabIndex={-1}
        >
            <AttachFileIcon/>
            <VisuallyHiddenInput
                type="file"
                onChange={(event) => handleFileUpload(event.target.files[0])}
                multiple
            />
        </IconButton>
    );
}