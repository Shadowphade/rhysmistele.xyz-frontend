import { Stack, LinearProgress, Checkbox, FormControlLabel, Fade, IconButton, TextField, Typography } from '@mui/material'
import { useEffect, useState, useRef, useCallback } from 'react';
import { TransitionGroup } from 'react-transition-group'
import AddIcon from '@mui/icons-material/Add';

interface Task {
    id: number,
    description: string,
    checked: boolean,
    animating: boolean,
}

interface TimerSettings {
    sprintTimeMin: number,
    shortBreakTimeMin: number,
    longBreakTimeMin: number,
    shortLongSwaps: number,
}

class Timer  {
    static SPRINT = "sprint";
    static SHORT = "short";
    static LONG = "long";
};


export function PomodoroUi() {

    const [taskList, setTaskList] = useState<Task[]>([]);
    const taskListRef = useRef(taskList);
    const [taskId, setTaskId] = useState<number>(0);
    const [addTask, setAddTask] = useState<boolean>(false);
    const [addTaskString, setAddTaskString] = useState<string>("");
    const Ref = useRef(NaN);
    const [timer, setTimer] = useState("00:00");
    const [timerPercentage, setTimerPercentage] = useState<number>(0);
    const [timeSettings, setTimeSetting] = useState<TimerSettings>({sprintTimeMin: 25, shortBreakTimeMin: 5, longBreakTimeMin: 30, shortLongSwaps: 4, })
    const [shortBreakSprintCount, setShortBreakSprintCount] = useState<number>(0);
    const [currentTimer, setCurrentTimer] = useState<Timer>(Timer.SHORT);

    const createNewTask = (description: string) => {
        for(var i = 0; i < taskList.length; i++) {
            if(taskList[i].id == taskId) { return; }
        }
        var newTask: Task = {
            checked: false,
            description: description,
            id: taskId,
            animating: false,
        };
        setTaskId(taskId + 1);
        if (!taskList) {
            setTaskList([newTask]);
            return;
        } else {
            var newTaskList = taskList;
            newTaskList.push(newTask);
            setTaskList(newTaskList);
        }
        console.log("Added Task To list");
        console.log(taskList)
    };

    useEffect(() => {
        console.log(`Task List Changed:`);
        console.log(taskList);
        taskListRef.current = taskList;
    }, [taskList])

    const handleCheckBoxChange = (id: number) => {
        console.log("Handle Check Box Change Called");

        setTaskList(prevTasks => prevTasks.map(task =>
            task.id === id ? {...task, checked: !task.checked} : task
        ));

        setTimeout(() => {
            setTaskList(prevTasks =>
                prevTasks.map(task =>
                    task.id === id ? {...task, animating: true} : task
                )
            )
            const animationTime = 1000;
            setTimeout(() => {
                setTaskList(prevTasks => {
                    const updatedTasks = prevTasks.filter(task => task.id !== id);
                    return updatedTasks;
                })
            }, animationTime);
        }, 100);



    };

    const handleAddTask = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        console.log("Handle Add Task Called");
        setAddTaskString(event.target.value);
    }, []);

    const lookupCurrentTimer = (timer: Timer) => {
        if(timer == Timer.SPRINT) {
            return timeSettings.sprintTimeMin;
        }
        if(timer == Timer.SHORT) {
            return timeSettings.shortBreakTimeMin;
        }
        if(timer == Timer.LONG) {
            return timeSettings.longBreakTimeMin;
        }
        return NaN;
    }

    const calcTimeRemaining = (currentTime: string) => {
        const total = Date.parse(currentTime) - Date.parse(new Date().toString());
        const seconds = Math.floor((total/1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);

        var totalSecs = total / 1000;
        var percentage = totalSecs / (lookupCurrentTimer(currentTimer) * 60);
        var normalizedPercentage = percentage * 100;
        setTimerPercentage(normalizedPercentage);

        return {total, seconds, minutes}
    }

    const startTimer = (currentTime: string) => {
        let {total, minutes, seconds } = calcTimeRemaining(currentTime);
        if (total >= 0) {
            let newMinutes: string = "";
            let newSeconds: string = "";
            if (minutes > 9) {
                newMinutes = minutes.toString();
            } else {
                newMinutes = `0${minutes}`
            }
            if (seconds > 9) {
                newSeconds = seconds.toString();
            } else {
                newSeconds = `0${seconds}`
            }

            setTimer(`${newMinutes}:${newSeconds}`);
        } else {
            changeTimer();
        }

    }

    const handleAddTaskBool = useCallback(() => {
        setAddTask(true);
    }, []);

    const clearTimer = (currentTime: string) => {
        const timer = lookupCurrentTimer(currentTimer);
        setTimer(`${timer}:00`);
        if(Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            startTimer(currentTime);
        }, 1000);
        Ref.current = id;
    }

    const genDeadline = () => {
        let deadline = new Date();
        console.log(lookupCurrentTimer(currentTimer));
        deadline.setMinutes(deadline.getMinutes() + lookupCurrentTimer(currentTimer));
        console.log(deadline);
        return deadline.toString();
    }

    useEffect(() => {
        clearTimer(genDeadline());
    }, [])

    useEffect(() => {
        clearTimer(genDeadline());
    }, [currentTimer])


    const handleAddTaskSubmit = () => {
        createNewTask(addTaskString);
        setAddTaskString("");
        setAddTask(false);
    }

    const changeTimer = () => {
        console.log("Change Timer Called");
        if(shortBreakSprintCount > timeSettings.shortLongSwaps && currentTimer == Timer.LONG) {
            setCurrentTimer(Timer.LONG);
            setShortBreakSprintCount(0);
            clearTimer(genDeadline());
        }
        if(currentTimer == Timer.SHORT) {
            setCurrentTimer(Timer.SPRINT);
        }
        if(currentTimer == Timer.LONG) {
            setCurrentTimer(Timer.SHORT)
            setShortBreakSprintCount(shortBreakSprintCount + 1);
        }
    }

    return (
        <Stack
            className='content-container'
            direction="column"
            spacing={2}
            sx={{
                justifyContent: "flex-star",
                alignItems: "stretch",
            }}
        >
            <LinearProgress variant='determinate' value={timerPercentage} />
         <TransitionGroup>
            <Stack
                direction="column"
                spacing={1}
                sx={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                }}
            >
                <Typography>{timer}</Typography>

                {taskList && (taskList.map((task) =>
                    <Fade key={task.id.toString()} in={!task.checked} timeout={1000}>
                        <FormControlLabel
                            label={task.description}
                            key={task.id.toString()}
                            control={
                                <Checkbox
                                    key={task.id.toString()}
                                    checked={task.checked}
                                    id={String(task.id)}
                                    onChange={() => handleCheckBoxChange(task.id)}
                                />
                            }
                        />
                        </Fade>
                ))}

                {!addTask && (
                    <IconButton onClick={ () => {handleAddTaskBool()}}>
                        <AddIcon />
                    </IconButton>
                )}
                {addTask && (
                    <TextField
                        id="fullWidth"
                        label="New Task"
                        variant="standard"
                        onChange={handleAddTask}
                        onBlur={handleAddTaskSubmit}
                        onKeyDown={((event: React.KeyboardEvent<HTMLInputElement>) => {
                            if (event.key === 'Enter') {
                                handleAddTaskSubmit();
                            }
                        })}
                    />
                )}
            </Stack>
        </TransitionGroup>
        </Stack>
    );

}
