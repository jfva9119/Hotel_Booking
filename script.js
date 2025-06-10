document.addEventListener("DOMContentLoaded", function () {
    // ======= Inventario inicial de habitaciones =======
    const habitaciones = {
        sencilla: 12,
        doble: 8,
        suite: 5
    };

    // ======= Configuración del gráfico (Chart.js) =======
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
                },
                title: {
                    display: true,
                    text: 'Distribución de Habitaciones',
                    align: 'center',
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        top: 10,
                        bottom: 10
                    }
                }
            }
        }
    });

    // ======= Formulario de Reserva =======
    const form = document.getElementById("formReserva");
    const resultado = document.getElementById("resultado");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const fecha = document.getElementById("fecha").value;
        const noches = document.getElementById("noches").value;
        const tipo = document.getElementById("habitacion").value;

        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

        // Verificar si ya existe una reserva con el mismo nombre y fecha
        const existe = reservas.some(r => r.nombre === nombre && r.fecha === fecha);
        if (existe) {
            resultado.innerHTML = `<p style="color: red;">⚠️ Ya existe una reserva para ${nombre} el ${fecha}. ⚠️</p>`;
            return;
        }

        // Validar disponibilidad
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

    // ======= Info dinámica de habitaciones (imagen + descripción) =======
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

    function actualizarInfo(tipo) {
        imagenHabitacion.src = info[tipo].imagen;
        imagenHabitacion.alt = `Habitación ${tipo}`;
        descripcionHabitacion.textContent = info[tipo].descripcion;
    }

    actualizarInfo(selectHabitacion.value);

    selectHabitacion.addEventListener('change', () => {
        actualizarInfo(selectHabitacion.value);
    });

    // ======= Consulta de Reservas y/o Cancelarlas  =======
   const formGestion = document.getElementById("formGestionReserva");
    const resultadoConsulta = document.getElementById("resultadoConsulta");

    formGestion.addEventListener("submit", function (e) {
        e.preventDefault();

    const nombre = document.getElementById("nombreConsulta").value.trim();
    const fecha = document.getElementById("fechaConsulta2").value;

        let reservas = JSON.parse(localStorage.getItem('reservas')) || [];

    const indice = reservas.findIndex(r => r.nombre === nombre && r.fecha === fecha);

    if (indice !== -1) {
        const reserva = reservas[indice];
        resultadoConsulta.innerHTML = `
            <p>🔍 Se encontró una reserva:</p>
            <ul>
                <li><strong>Nombre:</strong> ${reserva.nombre}</li>
                <li><strong>Fecha:</strong> ${reserva.fecha}</li>
                <li><strong>Noches:</strong> ${reserva.noches}</li>
                <li><strong>Tipo:</strong> ${reserva.habitacion}</li>
            </ul>
            <button id="btnCancelarReserva">❌ Cancelar Reserva</button>
        `;

        // Evento para cancelar
        document.getElementById("btnCancelarReserva").addEventListener("click", () => {
            reservas.splice(indice, 1);
            localStorage.setItem('reservas', JSON.stringify(reservas));

            // Restaurar disponibilidad
            habitaciones[reserva.habitacion]++;
            chart.data.datasets[0].data = [
                habitaciones.sencilla,
                habitaciones.doble,
                habitaciones.suite
            ];
            chart.update();

            resultadoConsulta.innerHTML = `<p style="color: green;">✅ La reserva fue cancelada con éxito.</p>`;
        });

    } else {
        resultadoConsulta.innerHTML = `<p style="color: red;">❌ No se encontró ninguna reserva con ese nombre y fecha.</p>`;
    }
});


});
