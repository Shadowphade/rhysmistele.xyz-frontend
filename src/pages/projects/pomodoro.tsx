import { Stack, LinearProgress, Checkbox, FormControlLabel, Fade, IconButton, TextField } from '@mui/material'
import { useEffect, useState, useRef } from 'react';
import { TransitionGroup } from 'react-transition-group'
import AddIcon from '@mui/icons-material/Add';

interface Task {
    id: number,
    description: string,
    checked: boolean,
}

interface TimerSettings {
    sprintTimeMin: number,
    shortBreakTimeMin: number,
    longBreakTimeMin: number,
}

class Timer  {
    static SPRINT = "sprint";
    static SHORT = "short";
    static LONG = "long";
};


export function PomodoroUi() {

    const [taskList, setTaskList] = useState<Task[]>([]);
    const [taskId, setTaskId] = useState<number>(0);
    const [addTask, setAddTask] = useState<boolean>(false);
    const [addTaskString, setAddTaskString] = useState<string>("");
    const Ref = useRef(null);
    const [timer, setTimer] = useState("00:00");
    const [timeSettings, setTimeSetting] = useState<TimerSettings>({sprintTimeMin: 25, shortBreakTimeMin: 5, longBreakTimeMin: 30})
    const [currentTimer, setCurrentTimer] = useState<Timer>(Timer.SPRINT);

    const createNewTask = (description: string) => {
        for(var i = 0; i < taskList.length; i++) {
            if(taskList[i].id == taskId) { return; }
        }
        var newTask: Task = {
            checked: false,
            description: description,
            id: taskId,
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
    };

    useEffect(() => {
        createNewTask("test");
        console.log(taskList);
    }, [])

    useEffect(() => {
        var newTaskList: Task[] = [];
        for(var i = 0; i < taskList.length; i++) {
            if(taskList[i].checked){
                continue;
            }
            newTaskList.push(taskList[i]);
        }
        setTaskList(newTaskList);
    }, [taskList])

    const handleCheckBoxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { id } = event.target;
        var newTaskList: Task[] = [];

        for(var i = 0; i < taskList.length; i++) {
            if(taskList[i].id == Number(id)) {
                var newTask = taskList[i];
                newTask.checked = !taskList[i].checked;
                newTaskList.push(newTask);
                continue;
            }
            newTaskList.push(taskList[i])
        }
        setTaskList(newTaskList);
    }

    const handleAddTask = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddTaskString(event.target.value);
    }

    const handleAddTaskSubmit = () => {
        createNewTask(addTaskString);
        setAddTaskString("");
        setAddTask(false);
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
            <LinearProgress variant='determinate' value={10} />
            <TransitionGroup>
            <Stack
                direction="column"
                spacing={1}
                sx={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                }}
            >

                    {taskList && (taskList.map((task) =>
                    <Fade in={!task.checked} timeout={1500}>
                        <FormControlLabel
                            label={task.description}
                            control={
                                <Checkbox
                                    checked={task.checked}
                                    id={String(task.id)}
                                    onChange={handleCheckBoxChange}
                                />
                            }
                        />
                        </Fade>
                    ))}
                {!addTask && (
                    <IconButton onClick={ () => {setAddTask(true)}}>
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
