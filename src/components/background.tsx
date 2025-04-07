
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

        for(let i = 0; i < 1; i++){
            particles.current.push(createRandomParticle(canvas));
        }


        const context = canvas.getContext('2d');
        if (context == null) return;
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            for(let i = 0; i < 10; i++){
                particles.current.push(createRandomParticle(canvas));
            }
            draw();
        };

        const draw_particles = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, particles: particle[], connection_list: particle_connection[]) => {

            for( let i = 0; i < particles.length; i++) {
                for (let k = 1; k < particles.length; k++) {
                    if (particles[i] == particles[k]) continue;

                    if(get_distance(particles[i], particles[k]) < 20) {
                        //console.log("particle too close")

                        // particles[i].speed = particles[k].speed;
                        // particles[k].speed = particles[k].speed + 1;
                        add_particle_connection(particles[i], particles[k], connection_list);
                        set_distance(particles[i], particles[k], 15);
                    }
                }
            }
            for (let i = 0; i < particles.length; i++) {
                update_particle_state(particles[i]);
                draw_particle_connections(canvas, context, particles[i]);
                draw_particle(canvas, context, particles[i]);
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

function update_particle_state(particle: particle) {
    let virtualParticle: particle = {
        x_pos: particle.direction_vec.x,
        y_pos: particle.direction_vec.y,
        direction_vec: {x: 0, y: 0},
        speed: 0,
    }

    for(let i = 0; i < particle.connected_particles.length; i++){
        let tmp = particle.connected_particles[i].particle;
        if(tmp != null){
            if(get_distance(particle, tmp) > 200) {
                console.log(get_distance(particle, tmp));
                remove_particle_connection(particle, tmp);
                particle.connected_particles.splice(i, i);
            }
        }

    }

    set_distance(particle, virtualParticle, particle.speed/2);
}

function draw_particle_connections(_canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, particle: particle) {

    for(let i = 0; i < particle.connected_particles.length; i++) {
        if(particle.connected_particles[i].particle == null) continue;
        context.beginPath();
        context.moveTo(particle.x_pos, particle.y_pos);
        //@ts-ignore;
        context.lineTo(particle.connected_particles[i].particle.x_pos, particle.connected_particles[i].particle.y_pos);
        context.stroke();
    }
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

function draw_particle(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, particle: particle) {
    if (particle.x_pos > canvas.width) {

        particle.x_pos = 25;
        particle.direction_vec.x = particle.direction_vec.y;
    }
    if (particle.y_pos > canvas.height) {

        particle.y_pos = 25;
        particle.direction_vec.y = particle.direction_vec.x;
    }
    if (particle.x_pos < 0) {

        particle.speed = particle.speed - 1;
        particle.x_pos = canvas.width - 25;
        particle.direction_vec.x = particle.direction_vec.y;

    }
    if (particle.y_pos < 0) {

        particle.y_pos = canvas.height - 25;
        particle.direction_vec.y = particle.direction_vec.x;
    }

    context.beginPath();
    context.arc(particle.x_pos, particle.y_pos, 10 , 0, 2 * Math.PI);
    context.lineWidth = 4;
    context.strokeStyle = "rgb(101, 109, 201)";
    context.stroke();
}


function createRandomParticle(canvas: HTMLCanvasElement): particle {
    var output: particle = {
        x_pos: Math.floor(Math.random() * canvas.width),
        y_pos: Math.floor(Math.random() * canvas.height),
        direction_vec: {x: Math.floor(Math.random() * canvas.width), y: Math.floor(Math.random() * canvas.height)},
        speed: Math.floor(Math.random()+1 * 3),
    };

    return output;
}

function add_particle_connection(particleA: particle, particleB: particle, connection_list: particle_connection) {
    let new_connection: particle_connection = {
        particleA: particleA,
        particleB: particleB,
        connection_strength: particleA.speed + particleB.speed / 2,
    }

    connection_list.push(new_connection);
}

function remove_particle_connection(particleA: particle, particleB: particle, connection_list: particle_connection[]) {
    for(let i = 0; i < connection_list.length; i++) {
        if (
            (connection_list[i].particleA == particleA || connection_list[i].particleA == particleB)
            &&
            (connection_list[i].particleB == particleA || connection_list[i].particleB == particleB)
        ) {
            connection_list.splice(i,i);
        }
    }
}
