
import { useRef, useEffect } from 'react';

type particle = {
    x_pos: number;
    y_pos: number;
    direction_vec: {x: number, y: number};
    speed: number;
};



export default function Background() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particles = useRef<Array<particle>>([]);
    const particle_connections = useRef<Array<Array<boolean>>>([]);
    const colors = useRef<Array<number>>([]);
    colors.current.push(0);
    colors.current.push(0);
    colors.current.push(0);



    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas == null) return;


        const context = canvas.getContext('2d');
        if (context == null) return;
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            console.log(particles.current);
            draw();
        };
        particles.current = createArrayParticle(25, 25, canvas.width / 3, canvas.height / 3, 3, 3);
        particle_connections.current = create_particle_connections(particles.current);

        const draw_particles = (_canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, particles: particle[], _connection_list: Array<Array<boolean>>) => {

            for( let i = 0; i < particles.length; i++) {
                for (let k = 1; k < particles.length; k++) {
                    if (particles[i] == particles[k]) continue;

                    if(get_distance(particles[i], particles[k]) < 20) {
                        set_distance(particles[i], particles[k], 15);
                    }
                }
            }
            draw_particle_connections(canvas, context, particle_connections.current, particles);
            for (let i = 0; i < particles.length; i++) {
                draw_particle(context, particles[i]);
                update_particle_state(canvas, particles, particle_connections.current);
            }
        }

        const draw = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            draw_particles(canvas, context, particles.current, particle_connections.current);
        };

        const animate = () => {
            draw();
            requestAnimationFrame(animate);
        }

        resizeCanvas();
        animate();
        window.addEventListener('resize', resizeCanvas);

        return () => window.removeEventListener('resize', resizeCanvas);
    }, []);

    return <canvas ref={canvasRef} className='background-canvas' />;
}


function update_particle_state(canvas: HTMLCanvasElement, particles: particle[], particle_connection: Array<Array<boolean>>) {
    for(let i = 0; i < particles.length; i++) {

        let connection_count = 0;
        let connection_average_x = 0;
        let connection_average_y = 0;
        for(let j = 0; j < particles.length; j++) {
            if (particle_connection[i][j]) {
                set_distance(particles[i], particles[j], - particles[i].speed / 50);
            }
        }

        let virtual_particle: particle = {
            x_pos: particles[i].direction_vec.x,
            y_pos: particles[i].direction_vec.y,
            direction_vec: {x:0, y:0},
            speed: 0,
        }

        let sign_x = Math.ceil((Math.random() - 0.5) * 2) < 1 ? -1 : 1;
        let new_x = Math.floor(Math.random() * (100 - 10 + 1) + 1);
        let sign_y = Math.ceil((Math.random() - 0.5) * 2) < 1 ? -1 : 1;
        let new_y = Math.floor(Math.random() * (100 - 10 + 1) + 1);

        set_distance(particles[i], virtual_particle, particles[i].speed / 10);

        particles[i].direction_vec.x = particles[i].direction_vec.x + (sign_x * new_x);
        particles[i].direction_vec.y = particles[i].direction_vec.y + (sign_y * new_y);

        if (particles[i].x_pos > canvas.width) {
            particles[i].direction_vec.x = -1 * particles[i].direction_vec.x;

        }
        if (particles[i].y_pos > canvas.height) {
            particles[i].direction_vec.y = -1 * particles[i].direction_vec.y;
        }
        if (particles[i].x_pos < 0) {
            particles[i].direction_vec.x = -1 * particles[i].direction_vec.x;
        }
        if (particles[i].y_pos < 0) {
            particles[i].direction_vec.y = -1 * particles[i].direction_vec.y;
        }
    }
}


function draw_particle_connections(_canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, connection_list: Array<Array<boolean>>, particles: particle[]) {

    for(let i = 0; i < particles.length; i++) {
        let particleA = particles[i];
        for(let j = 0; j < particles.length; j++) {
            //console.log(connection_list);
            if(connection_list[i][j] == true) {

                let particleB = particles[j];
                context.beginPath();
                context.moveTo(particleA.x_pos, particleA.y_pos);
                context.lineTo(particleB.x_pos, particleB.y_pos);
                context.lineWidth = 4;
                context.strokeStyle = "rgb(101, 109, 201)";
                context.stroke();
            }
        }
    }

}
// for the time being it will be random
function create_particle_connections(particles: particle[]): Array<Array<boolean>> {
    let output = new Array<Array<boolean>>

    for(let i = 0; i < particles.length; i++) {
        output.push(new Array<boolean>);
        for(let j = 0; j < particles.length; j++) {
            output[i].push(false);
        }
    }

    for( let i = 0; i < particles.length; i++) {
        for( let j = 0; j < particles.length; j++){
            if (i == j) {output[i][j] = false; continue;}
            let new_connection = Math.random();
            if (new_connection < 0.10) {
                output[i][j] = false;
            } else {

                output[i][j] = true;
                console.log(output);
            }
        }
    }
    return output;

}

function get_distance(particleA: particle, particleB: particle): number {
    let x_delta = particleB.x_pos - particleA.x_pos;
    let y_delta = particleB.y_pos - particleA.y_pos;

    let x_delta_sqrd = x_delta * x_delta;
    let y_delta_sqrd = y_delta * y_delta;

    return Math.sqrt(x_delta_sqrd + y_delta_sqrd);
}

function set_distance(particleA: particle, particleB: particle, distance: number) { // Set distance of A relitive to B
    let cur_distance_x = particleA.x_pos - particleB.x_pos;
    let cur_distance_y = particleA.y_pos - particleB.y_pos;

    let length = Math.sqrt((cur_distance_x * cur_distance_x) + (cur_distance_y * cur_distance_y));

    let unit_vec_x = cur_distance_x / length;
    let unit_vec_y = cur_distance_y / length;

    let new_x = particleA.x_pos + unit_vec_x * distance;
    let new_y = particleA.y_pos + unit_vec_y * distance;

    particleA.x_pos = new_x;
    particleA.y_pos = new_y;

    particleA.direction_vec.x = particleB.x_pos;
    particleA.direction_vec.y = particleB.y_pos;
}

function draw_particle(context: CanvasRenderingContext2D, particle: particle) {
    context.beginPath();
    context.arc(particle.x_pos, particle.y_pos, 10 , 0, 2 * Math.PI);
    context.fillStyle = "rgb(255, 255, 255, )";
    context.fill();
    context.lineWidth = 4;
    context.strokeStyle = "rgb(101, 109, 201)";
    context.stroke();
}


function createRandomParticle(canvas: HTMLCanvasElement): particle {
//     let rand_x = Math.random() * canvas.width;
//     let rand_y = Math.random() * canvas.height;
    var output: particle = {
        x_pos: Math.floor(canvas.width/2),
        y_pos: Math.floor(canvas.height/2),
        direction_vec: {
            x: Math.floor(Math.random() * ((canvas.width/2 + 25) - (canvas.width/2 - 25)) + canvas.width/2 - 25),
            y: Math.floor(Math.random() * ((canvas.height/2 + 25) - (canvas.height/2 - 25)) + canvas.height/2 - 25),
        },
        speed: Math.floor(Math.random() + 1 * 3),
    };

    return output;
}

function createArrayParticle(start_x: number, start_y: number, spacing_x: number, spacing_y: number, size_x: number, size_y: number): particle[] {
    let output: particle[] = [];

    for(let i = 0; i < size_x; i++) {
        for (let j = 0; j < size_y; j++) {
            let new_particle: particle = {
                x_pos: start_x + i * spacing_x,
                y_pos: start_y + j * spacing_y,
                direction_vec: {
                        x: start_x + (size_x * spacing_x) / 2,
                        y: start_y + (size_y * spacing_y) / 2,
                },
                speed: 1,
            }
            output.push(new_particle);
        }
    }

    return output;
}


// function remove_particle_connection(particleA: particle, particleB: particle, connection_list: particle_connection[]) {
//     for(let i = 0; i < connection_list.length; i++) {
//         if (
//             (connection_list[i].particleA == particleA || connection_list[i].particleA == particleB)
//             &&
//             (connection_list[i].particleB == particleA || connection_list[i].particleB == particleB)
//         ) {
//             connection_list.splice(i,i);
//         }
//     }
// }
