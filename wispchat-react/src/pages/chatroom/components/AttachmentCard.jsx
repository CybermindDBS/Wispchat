import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import DownloadIcon from '@mui/icons-material/Download';
import Button from '@mui/material/Button';
import {API_BASE_URL} from "../../../constants/config.js";

export default function AttachmentCard({content, chatroomId}) {

    if (!content) return

    return (<Button component="a"
                    href={`${API_BASE_URL}/chatroom/${chatroomId}/download/${encodeURIComponent(content.name)}`}
                    variant="outlined"
                    sx={{
                        marginTop: '5px',
                        borderRadius: '15px',
                        width: 'fit-content',
                        paddingX: '15px',
                        paddingY: '10px',
                        '& .MuiButton-endIcon svg': {
                            fontSize: 30,
                        },
                    }}
                    endIcon={<DownloadIcon/>}
    >
        <Box sx={{
            display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingRight: '40px',
        }}>
            <Box>
                <Typography variant="subtitle2" noWrap sx={{
                    maxWidth: "50vw"
                }}>{content.name}</Typography>
            </Box>
            <Box>
                <Typography variant="body2">{`${content.size} MB`}</Typography>
            </Box>
        </Box>
    </Button>)
}