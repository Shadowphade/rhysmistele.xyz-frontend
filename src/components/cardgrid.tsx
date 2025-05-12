import {Card, CardContent, CardMedia, Grid, Typography} from "@mui/material"

export interface CardContent {
    title: string;
    description: string;
    imageUrl?: string;
    actions?: React.ReactNode;
}

export interface CardGridProps {
    cardContent: CardContent[];
}

export function CardGrid(props: CardGridProps) {
    const { cardContent } = props;

    return (
        <Grid container spacing={1}>
            {cardContent.map((card, index) =>
                 <Grid key={index} size={{xs: 12, sm:6, md:4, lg:3}}>
                    <Card>
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
                    </Card>
                </Grid>
            )}
        </Grid>
    );
};
