import * as React from "react";
import {MemberCard} from "../components";
import Box from "@mui/material/Box";
import {AnimatePresence, motion} from "framer-motion";
import {sortMembers} from "../../../utils/memberSort.js";

export default function MemberList({members}) {

    const sortedMembers = React.useMemo(() => sortMembers(members), [members]);

    return (<Box display="flex" flexDirection="column" gap="10px">
        <AnimatePresence initial={true}>
            {sortedMembers.map((member) => (<motion.div
                key={member.id}
                layout
                initial={{opacity: 0, height: 0}}
                animate={{opacity: 1, height: 'auto'}}
                exit={{opacity: 0, height: 0}}
                transition={{
                    layout: {
                        type: 'spring', stiffness: 500, damping: 35,
                    }, opacity: {duration: 0.25},
                }}
            >

                <MemberCard id={member.id} name={member.name} status={member.status}></MemberCard>
            </motion.div>))}
        </AnimatePresence>
    </Box>)
}