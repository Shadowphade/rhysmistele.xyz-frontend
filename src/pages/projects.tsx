import { Box, Typography } from "@mui/material";
import { CardGrid, CardContent } from "../components/cardgrid";
import { useState } from "react";

function Projects() {
    var cardArray: CardContent[] = [];

    const [activeId, setActiveId] = useState("");

    var TestCard: CardContent = {
        title: "Test Title",
        description: "This is a test Card",
        imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.9jIo4O9En26EVOkXaR9qoAHaEK%26cb%3Diwp2%26pid%3DApi&f=1&ipt=f4b1f45ff10ae7718104625f46d31fe4a14a7301452ff50248158dcbb5d7ea05&ipo=images"
    }
    var TestCard1: CardContent = {
        title: "Test Title",
        description: "This is a test Card",
        imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.9jIo4O9En26EVOkXaR9qoAHaEK%26cb%3Diwp2%26pid%3DApi&f=1&ipt=f4b1f45ff10ae7718104625f46d31fe4a14a7301452ff50248158dcbb5d7ea05&ipo=images"
    }
    var TestCard2: CardContent = {
        title: "Test Title",
        description: "This is a test Card",
        imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.9jIo4O9En26EVOkXaR9qoAHaEK%26cb%3Diwp2%26pid%3DApi&f=1&ipt=f4b1f45ff10ae7718104625f46d31fe4a14a7301452ff50248158dcbb5d7ea05&ipo=images"
    }
    var TestCard3: CardContent = {
        title: "Test Title",
        description: "This is a test Card",
        imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse2.mm.bing.net%2Fth%3Fid%3DOIP.9jIo4O9En26EVOkXaR9qoAHaEK%26cb%3Diwp2%26pid%3DApi&f=1&ipt=f4b1f45ff10ae7718104625f46d31fe4a14a7301452ff50248158dcbb5d7ea05&ipo=images"
    }

    cardArray.push(TestCard);
    cardArray.push(TestCard1);
    cardArray.push(TestCard2);
    cardArray.push(TestCard3);

    return (
       <Box className="content-container" sx={{ p: 4 }}>
            <Typography variant='h3'> Projects</Typography>
            <hr />
            <CardGrid cardContent={cardArray} activeCardId={activeId} setActiveCardId={setActiveId}/>
        </Box>
    );
}

export default Projects;
