import { Box, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { CardGrid, CardContent } from '../components/cardgrid'
import { useNavigate, useParams } from 'react-router';
import { MuiMarkdown } from 'mui-markdown';
//import { Highlight, themes } from 'prism-react-renderer';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export function Articles() {
    const [currentArticle, setCurrentArticle] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [cardContents, setCardContents] = useState<CardContent[]>();
    const navigate = useNavigate();
    useEffect(() => {
        const fetchCards = async () => {
            try {
                setIsLoading(true)
                const responce = await fetch(API_BASE_URL + "/api/articles");

                if (!responce.ok) {
                    throw new Error(`Responce Status: ${responce.status}`);
                }

                const json = await responce.json();

                var newCardContent: CardContent[] = [];
                for(var i = 0; i < json.length; i++){

                    var newCard: CardContent = {
                        title: json[i].title,
                        description: json[i].description,
                        imageUrl: API_BASE_URL + json[i].imageUrl,
                    }
                    newCardContent.push(newCard)
                }
                setCardContents(newCardContent)
                // console.log(cardContent);

            } catch (error: any) {
                console.error(error.message);
            } finally {
                setIsLoading(false);
            }
        }

        fetchCards();
    }, [])

    useEffect (() => {
        if(currentArticle == "") {
            return;
        }
        navigate("/article/" + currentArticle)
    }, [currentArticle, navigate])

    if(isLoading) {
        return (
            <Box className="content-container" sx={{ p: 4 }}>
                <Typography variant='h3'>Articles</Typography>
                <hr />
                <CircularProgress />
            </Box>
        );
    } if (cardContents) {
        return (
            <Box className="content-container" sx={{ p: 4 }}>
                <Typography variant='h3'>Articles</Typography>
                <hr />
                <CardGrid cardContent={cardContents} activeCardId={currentArticle} setActiveCardId={setCurrentArticle}/>
            </Box>
        );
    }
}

export function Article() {
    const { name } = useParams();
    const [articleText, setArticleText] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchArticleText = async () => {
            try {
                setIsLoading(true)
                const responce = await fetch(`${API_BASE_URL}/api/article/${name}`)
                if(!responce.ok) {
                    throw new Error(`Body Text Not fetched: ${responce.status}`);
                }
                const text = await responce.text();
                console.log(text)
                setArticleText(text);
            } catch (error: any) {
                console.error(error.message);
            } finally {
                setIsLoading(false)
            }

        }

        fetchArticleText();
    }, [])

    if(isLoading) {
            return (
                <Box className="content-container" sx={{ p: 4 }}>
                        <Typography variant='h3'>{name}</Typography>
                        <hr />
                        <CircularProgress />
                </Box>
            );
    } else {
        return (
            <Box className="content-container" sx={{ p: 4 }}>
                    <Typography variant='h3'>{name}</Typography>
                    <hr />
                    <MuiMarkdown>
                        {articleText}
                    </MuiMarkdown>
            </Box>
        );
    }
}
