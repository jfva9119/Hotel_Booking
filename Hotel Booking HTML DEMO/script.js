document.addEventListener("DOMContentLoaded", function () {
    const habitaciones = {
        sencilla: 12,
        doble: 8,
        suite: 5
    };

    const ctx = document.getElementById('habitacionesChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Sencilla', 'Doble', 'Suite'],
            datasets: [{
                data: [
                    habitaciones.sencilla,
                    habitaciones.doble,
                    habitaciones.suite
                ],
                backgroundColor: ['#3498db', '#2ecc71', '#e74c3c']
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    
    const form = document.getElementById("formReserva");
    const resultado = document.getElementById("resultado");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const fecha = document.getElementById("fecha").value;
        const noches = document.getElementById("noches").value;
        const tipo = document.getElementById("habitacion").value;

        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

      
        const existe = reservas.some(r => r.nombre === nombre && r.fecha === fecha);
        if (existe) {
            resultado.innerHTML = `<p style="color: red;">⚠️ Ya existe una reserva para ${nombre} el ${fecha}. ⚠️</p>`;
            return;
        }

        if (habitaciones[tipo] > 0) {
            habitaciones[tipo]--;
            chart.data.datasets[0].data = [
                habitaciones.sencilla,
                habitaciones.doble,
                habitaciones.suite
            ];
            chart.update();

            const nuevaReserva = { nombre, fecha, noches, habitacion: tipo };
            reservas.push(nuevaReserva);
            localStorage.setItem('reservas', JSON.stringify(reservas));

            resultado.innerHTML = `<p>✅ ¡Gracias ${nombre}, tu reserva para una habitación ${tipo} por ${noches} noche(s) el ${fecha} fue registrada! ✅</p>`;
            form.reset();
        } else {
            resultado.innerHTML = `<p style="color: red;">Lo sentimos, no quedan habitaciones ${tipo} disponibles.</p>`;
        }
    });

    // Imagen y descripción dinámica de habitaciones
    const selectHabitacion = document.getElementById('habitacion');
    const imagenHabitacion = document.getElementById('imagenHabitacion');
    const descripcionHabitacion = document.getElementById('descripcionHabitacion');

    const info = {
        sencilla: {
            imagen: 'img/sencilla.jpg',
            descripcion: 'Una habitación sencilla ideal para una persona, cómoda y funcional.'
        },
        doble: {
            imagen: 'img/doble.jpg',
            descripcion: 'Habitación doble perfecta para parejas o amigos, con dos camas amplias.'
        },
        suite: {
            imagen: 'img/suite.jpg',
            descripcion: 'Suite de lujo con sala privada, minibar y vistas panorámicas.'
        }
    };

    // Inicializar descripción al cargar
    function actualizarInfo(tipo) {
        imagenHabitacion.src = info[tipo].imagen;
        imagenHabitacion.alt = `Habitación ${tipo}`;
        descripcionHabitacion.textContent = info[tipo].descripcion;
    }

    actualizarInfo(selectHabitacion.value);

    selectHabitacion.addEventListener('change', () => {
        actualizarInfo(selectHabitacion.value);
    });
});
