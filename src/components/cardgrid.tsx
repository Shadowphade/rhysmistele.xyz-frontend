import {Card, CardActionArea, CardContent, CardMedia, Grid, Typography} from "@mui/material"
import { Dispatch, SetStateAction } from "react";


export interface CardContent {
    title: string;
    description: string;
    imageUrl?: string;
    actions?: () => React.ReactNode;
}

export interface CardGridProps {
    cardContent: CardContent[];
    activeCardId: string;
    setActiveCardId: Dispatch<SetStateAction<string>>;
}

export function CardGrid(props: CardGridProps) {
    const cardContent = props.cardContent;
    const setActiveCardId = props.setActiveCardId;

    return (
        <Grid container spacing={1}>
            {cardContent.map((card, index) =>
                 <Grid key={index} size={{xs: 12, sm:6, md:4, lg:3}}>
                    <Card>
                        <CardActionArea onClick={ () => {setActiveCardId(card.title)}} >

                        {card.imageUrl && (
                            <CardMedia
                                component="img"
                                height="120"
                                image={card.imageUrl}
                                alt={card.title}
                            />
                        )}
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {card.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {card.description}
                            </Typography>
                        </CardContent>
                        </CardActionArea>
                    </Card>
                </Grid>
            )}
        </Grid>
    );
};
