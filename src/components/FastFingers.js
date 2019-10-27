import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

import { words } from '../constants/Words';
import { NEW, CORRECT, FAIL, CURRENT } from '../constants/wordStatus';

const useStyles = makeStyles(theme => ({
    size: {
        width: '100%'
    },
    words: {
        width: '100%',
        textAlign: 'left',
        border: 'solid 1px rgba(0, 0, 0, 0.38)',
    },
}));

const FastFingers = () => {
    const [activeWords, setActiveWords] = useState([]);
    const [currentWord, setCurrentWord] = useState(0);
    const [inputWord, setInputWord] = useState("");
    const style = useStyles();

    const getNewWords = () => {
        const newWords = []
        for (let i = 0; i < 10; i++) {
            const randomWord = words[Math.floor(Math.random()*words.length)];
            newWords.push({
                word: randomWord,
                status: NEW
            });
        }
        setActiveWords(newWords);
    };

    const validateCurrentWord = () => {
        const newActiveWords = [...activeWords];
        if(activeWords[currentWord].word === inputWord.trim()) newActiveWords[currentWord].status = CORRECT;
        else newActiveWords[currentWord].status = FAIL;

        setActiveWords(newActiveWords);
    };

    const nextWord = () => {
        validateCurrentWord();
        if(currentWord === activeWords.length-1) {
            setCurrentWord(0);
            getNewWords();
        } else {
            setCurrentWord(currentWord + 1);
        }
    };

    const getColor = ({status}) => {
        if (status === CORRECT) return "green";
        else if (status === FAIL) return "red";
        else return "";
    };

    const compareInput = () => {
        return activeWords[currentWord].word.includes(inputWord.trim());
    };

    useEffect(() => {
        setCurrentWord(currentWord);
    }, [activeWords, currentWord]);

    return(
        <div>
            { activeWords.length === 0 && getNewWords() }

            <Grid container style={{padding: "8px"}} className={style.words}>
                { activeWords && activeWords.map((word, index) => {
                    return (
                        <Paper 
                        elevation={0}
                        key={index} 
                        style={{padding: "3px", margin: "3px", background: getColor(word)}}>{word.word}</Paper>
                    );
                })}
            </Grid>
            <TextField 
                error={!!inputWord && !compareInput()}
                className={style.size}
                margin="normal"
                value={inputWord}
                autoFocus
                onChange={(event) => {
                    setInputWord(event.target.value);
                }}
                onKeyPress={(event) => {
                    if(event.key === " ") {
                        nextWord();
                        setInputWord("");
                    }
                }}
            />
        </div>
    );
}

export default FastFingers;
