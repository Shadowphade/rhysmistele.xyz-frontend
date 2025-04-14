
import { useRef, useEffect } from 'react';

type particle_connection = {
    particleA: particle;
    particleB: particle;
    connection_strength: number;
}

type particle = {
    x_pos: number;
    y_pos: number;
    direction_vec: {x: number, y: number};
    speed: number;
};



export default function Background() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const particles = useRef<Array<particle>>([]);
    const particle_connections = useRef<Array<particle_connection>>([]);
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

            particles.current = createArrayParticle(canvas.width / 2, canvas.height / 2, 50, 50, 3, 3);
            console.log(particles.current);
            draw();
        };



        const draw_particles = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, particles: particle[], connection_list: particle_connection[]) => {

            for( let i = 0; i < particles.length; i++) {
                for (let k = 1; k < particles.length; k++) {
                    if (particles[i] == particles[k]) continue;

                    if(get_distance(particles[i], particles[k]) < 20) {

                        add_particle_connection(particles[i], particles[k], connection_list);
                        set_distance(particles[i], particles[k], 15);
                    }
                }
            }
            for (let i = 0; i < particles.length; i++) {
                //update_particle_state(canvas, particles[i]);
                draw_particle(context, particles[i]);
            }
        }

        const draw = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);

            //console.log(colors.current);
            //console.log(particles);
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

function update_particle_state(canvas: HTMLCanvasElement, particle: particle) {
    let virtualParticle: particle = {
        x_pos: particle.direction_vec.x,
        y_pos: particle.direction_vec.y,
        direction_vec: {x: 0, y: 0},
        speed: 0,
    }

    if (particle.x_pos > canvas.width) {
        particle.x_pos = 25;
    }
    if (particle.y_pos > canvas.height) {
        particle.y_pos = 25;
    }
    if (particle.x_pos < 0) {
        particle.x_pos = canvas.width - 25;
    }
    if (particle.y_pos < 0) {
        particle.y_pos = canvas.height - 25;
    }

    let speed = get_distance(particle, virtualParticle);
    let tmp = virtualParticle;

    set_distance(particle, virtualParticle, speed/2);

    particle.direction_vec.x = tmp.x_pos;
    particle.direction_vec.y = tmp.y_pos;
}

// function draw_particle_connections(_canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, connection_list: particle_connection[]) {
//
//     for(let i = 0; i < connection_list.length; i++) {
//         context.beginPath();
//         context.moveTo(connection_list[i].particleA.x_pos, connection_list[i].particleA.y_pos);
//         //@ts-ignore;
//         context.lineTo(connection_list[i].particleB.x_pos,connection_list[i].particleB.y_pos);
//         context.stroke();
//     }
// }

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
                y_pos: start_y + i * spacing_y,
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

function add_particle_connection(particleA: particle, particleB: particle, connection_list: particle_connection[]) {
    let new_connection: particle_connection = {
        particleA: particleA,
        particleB: particleB,
        connection_strength: particleA.speed + particleB.speed / 2,
    }

    connection_list.push(new_connection);
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
