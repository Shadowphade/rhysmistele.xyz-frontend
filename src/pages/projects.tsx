import { Box, Typography } from "@mui/material";
import { CardGrid, CardContent } from "../components/cardgrid";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";

function Projects() {
    var cardArray: CardContent[] = [];

    const [activeId, setActiveId] = useState("");
    const navigate = useNavigate();

    var Pomodoro: CardContent = {
        title: "Pomodoro Timer",
        description: "A timer based focusing tool.",
        imageUrl: ""
    }
    var TestCard1: CardContent = {
        title: "Test Title",
        description: "This is a test Card",
        imageUrl: ""
    }
    var TestCard2: CardContent = {
        title: "Test Title",
        description: "This is a test Card",
        imageUrl: ""
    }
    var TestCard3: CardContent = {
        title: "Test Title",
        description: "This is a test Card",
        imageUrl: ""
    }

    cardArray.push(Pomodoro);
    cardArray.push(TestCard1);
    cardArray.push(TestCard2);
    cardArray.push(TestCard3);


    useEffect (() => {
        if(activeId == "") {
            return;
        }
        if(activeId == "Test Title") {
            return;
        }
        if(activeId == Pomodoro.title) {
            navigate("pomodoro");
        }

    }, [activeId, navigate])

    return (
       <Box className="content-container" sx={{ p: 4 }}>
            <Typography variant='h3'> Projects</Typography>
            <hr />
            <CardGrid cardContent={cardArray} activeCardId={activeId} setActiveCardId={setActiveId}/>
        </Box>
    );
}

export default Projects;
