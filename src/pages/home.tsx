//import React from "react";
import { Box, Typography } from '@mui/material';

function Home() {
    return (
        <Box className="content-container" sx={{ p: 4 }}>
            <Typography variant='h2'> Welcome</Typography>
            <hr />
            <Typography variant='h3'>About Me</Typography>
            <Box
                component="img"
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fblog.udemy.com%2Fwp-content%2Fuploads%2F2014%2F05%2Fbigstock-test-icon-63758263.jpg&f=1&nofb=1&ipt=a605336ccbb97fffa3a9e9277eba0e547ceffd589a51a249e09192d3eb726af5"
                alt="Example"
                sx={{
                float: 'right',
                width: 200,
                height: 'auto',
                ml: 2,
                mb: 2,
                }}
            />

            <Typography variant='body1'>
                I am Rhys, a software developer based out of the panhandle of Florida, For any inquires you can contact me at rhys.mistele@gmail.com
                My current interests are Rust, Go and computer graphics, im currently studying different shader techniques and will hopefully be applying them soon to create a game.
            </Typography>
        </Box>
    );
}

export default Home;
