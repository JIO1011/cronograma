/*
// Actualiza la hora y la fecha en tiempo real
function updateDateTime() {
    const now = new Date();

    // Formato de tiempo: HH:mm:ss
    const formattedTime = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    document.getElementById('time-display').textContent = formattedTime;

    // Formato de fecha: día de la semana, día del mes de mes del año
    const formattedDate = now.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    document.getElementById('date-display').textContent = formattedDate;

    // Filtrar y colorear filas según la hora actual
    filterAndColorRows(now);
}

// Convertir tiempo (HH:MM) a minutos transcurridos
function convertToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
    return hours * 60 + minutes;
}

// Filtrar filas y aplicar colores según la hora actual
function filterAndColorRows(now) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const tableBody = document.getElementById('schedule-table').querySelector('tbody');

    for (let i = 0; i < tableBody.children.length; i++) {
        const row = tableBody.children[i];
        const rowTime = row.children[3].textContent;

        // Convertir la hora de la fila a minutos
        const rowMinutes = convertToMinutes(rowTime);

        if (currentMinutes - 20 <= rowMinutes && rowMinutes <= currentMinutes + 120) {
            row.style.display = ''; // Mostrar filas dentro del rango
            
            // Aplicar colores según el tiempo relativo a la hora actual
            if (currentMinutes - 7 <= rowMinutes && rowMinutes <= currentMinutes + 10) {
                row.style.backgroundColor = 'lightgreen'; // Dentro de los 7 minutos de la hora actual
            } else if (rowMinutes < currentMinutes - 7) { 
                row.style.backgroundColor = 'red'; // Pasaron más de 7 minutos de la hora actual
            } else {
                row.style.backgroundColor = 'white'; // Aún faltan más de 7 minutos para llegar a la hora actual
            }
        } else {
            row.style.display = 'none'; // Ocultar filas fuera del rango
        }
    }
}

// Comparar dos tiempos en formato HH:MM
function compareTimes(time1, time2) {
    const minutes1 = convertToMinutes(time1);
    const minutes2 = convertToMinutes(time2);
    return minutes1 - minutes2;
}

// Función para abrir el formulario de entrada de datos
function openDataEntryForm() {
    document.getElementById('data-entry-dialog').style.display = 'flex';
}

// Función para cerrar el formulario de entrada de datos
function closeDataEntryForm() {
    document.getElementById('data-entry-dialog').style.display = 'none';
}

// Procesar el formulario de entrada de datos y agregar a la tabla
function submitDataEntryForm(event) {
    event.preventDefault();

    const form = event.target;
    const subject = form.subject.value;
    const professor = form.professor.value;
    const lab = form.lab.value;
    const time = form.time.value;

    const newRow = document.createElement('tr');
    const cells = [subject, professor, lab, time];
    
    cells.forEach(cell => {
        const newCell = document.createElement('td');
        newCell.textContent = cell;
        newRow.appendChild(newCell);
    });

    const tableBody = document.getElementById('schedule-table').querySelector('tbody');
    
    // Insertar fila en la posición correcta según el tiempo
    let inserted = false;
    for (let i = 0; i < tableBody.children.length; i++) {
        const row = tableBody.children[i];
        const rowTime = row.children[3].textContent;
        if (compareTimes(rowTime, time) > 0) {
            tableBody.insertBefore(newRow, row);
            inserted = true;
            break;
        }
    }
    
    if (!inserted) {
        tableBody.appendChild(newRow);
    }

    filterAndColorRows(new Date()); // Aplicar filtros y colores después de agregar una nueva fila
    closeDataEntryForm(); // Cerrar el formulario después de agregar la fila
}

// Actualizar la hora y la fecha cada segundo
setInterval(updateDateTime, 1000);


// Función para procesar el archivo CSV cargado
function processCsvFile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        const text = e.target.result;
        const data = csvToArray(text);

        // Limpiar la tabla antes de agregar nuevos datos
        const tableBody = document.getElementById('schedule-table').querySelector('tbody');
        tableBody.innerHTML = '';

        // Agregar datos a la tabla
        populateSchedule(data);
    };

    reader.readAsText(file);
}

// Convertir contenido CSV a array de datos
function csvToArray(csvString) {
    const lines = csvString.split("\n");
    const result = [];

    for (const line of lines) {
        if (line.trim() !== "") {
            const values = line.split(",");
            result.push(values);
        }
    }

    return result;
}

// Agregar datos a la tabla
function populateSchedule(data) {
    const tableBody = document.getElementById('schedule-table').querySelector('tbody');

    data.forEach((item) => {
        if (item.length < 4) return; // Saltar filas incompletas

        const [subject, professor, lab, time] = item;

        const newRow = document.createElement('tr');
        const cells = [subject, professor, lab, time];
        
        cells.forEach(cell => {
            const newCell = document.createElement('td');
            newCell.textContent = cell;
            newRow.appendChild(newCell);
        });

        let inserted = false;
        for (let i = 0; i < tableBody.children.length; i++) {
            const row = tableBody.children[i];
            const rowTime = row.children[3].textContent;
            if (compareTimes(rowTime, time) > 0) {
                tableBody.insertBefore(newRow, row);
                inserted = true;
                break;
            }
        }
        
        if (!inserted) {
            tableBody.appendChild(newRow);
        }
    });

    // Aplicar filtros y colores después de agregar las filas
    filterAndColorRows(new Date());
}

// Filtrar y colorear filas
function filterAndColorRows(now) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const tableBody = document.getElementById('schedule-table').querySelector('tbody');

    for (let i = 0; i < tableBody.children.length; i++) {
        const row = tableBody.children[i];
        const rowTime = row.children[3].textContent;

        const rowMinutes = convertToMinutes(rowTime);

        if (currentMinutes - 20 <= rowMinutes && rowMinutes <= currentMinutes + 120) {
            row.style.display = ''; // Mostrar filas dentro del rango

            if (currentMinutes - 7 <= rowMinutes && rowMinutes <= currentMinutes + 10) {
                row.style.backgroundColor = 'lightgreen'; // Dentro de los 7 minutos de la hora actual
            } else if (rowMinutes < currentMinutes - 7) { 
                row.style.backgroundColor = 'red'; // Han pasado más de 7 minutos desde la hora actual
            } else {
                row.style.backgroundColor = 'white'; // Aún faltan más de 7 minutos para la hora actual
            }
        } else {
            row.style.display = 'none'; // Ocultar filas fuera del rango
        }
    }
}

// Convertir tiempo (HH:MM) a minutos transcurridos
function convertToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(num => parseInt(num, 10));
    return hours * 60 + minutes;
}

// Comparar dos tiempos en formato HH:MM
function compareTimes(time1, time2) {
    const minutes1 = convertToMinutes(time1);
    const minutes2 = convertToMinutes(time2);
    return minutes1 - minutes2;
}

// Actualizar la hora y la fecha cada segundo
setInterval(updateDateTime, 1000);

// Función para abrir y cerrar formularios
function openDataEntryForm() {
    document.getElementById('data-entry-dialog').style.display = 'flex';
}

function closeDataEntryForm() {
    document.getElementById('data-entry-dialog').style.display = 'none';
}

// Función para enviar datos desde el formulario
function submitDataEntryForm(event) {
    event.preventDefault();

    const form = event.target;
    const subject = form.subject.value;
    const professor = form.professor.value;
    const lab = form.lab.value;
    const time = form.time.value;

    const newRow = document.createElement('tr');
    const cells = [subject, professor, lab, time];
    
    cells.forEach(cell => {
        const newCell = document.createElement('td');
        newCell.textContent = cell;
        newRow.appendChild(newCell);
    });

    const tableBody = document.getElementById('schedule-table').querySelector('tbody');
    
    // Insertar fila en la posición correcta
    let inserted = false;
    for (let i = 0; i < tableBody.children.length; i++) {
        const row = tableBody.children[i];
        const rowTime = row.children[3].textContent;
        if (compareTimes(rowTime, time) > 0) {
            tableBody.insertBefore(newRow, row);
            inserted = true;
            break;
        }
    }
    
    if (!inserted) {
        tableBody.appendChild(newRow);
    }

    filterAndColorRows(new Date()); // Aplicar filtros y colores después de agregar una nueva fila
    closeDataEntryForm(); // Cerrar el formulario después de agregar la fila
}
*/




// Actualiza la hora y la fecha en tiempo real
function updateDateTime() {
    const now = new Date();

    // Formato de tiempo: HH:mm:ss
    const formattedTime = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });

    document.getElementById('time-display').textContent = formattedTime;

    // Formato de fecha: día de la semana, día del mes de mes del año
    const formattedDate = now.toLocaleDateString('es-ES', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    document.getElementById('date-display').textContent = formattedDate;

    // Filtrar y colorear filas según la hora actual
    filterAndColorRows(now);
}

// Convertir tiempo (HH:MM) a minutos transcurridos
function convertToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(num => parseInt(num, 10));
    return hours * 60 + minutes;
}

// Filtrar filas y aplicar colores según la hora actual
function filterAndColorRows(now) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const tableBody = document.getElementById('schedule-table').querySelector('tbody');

    for (let i = 0; i < tableBody.children.length; i++) {
        const row = tableBody.children[i];
        const rowTime = row.children[4].textContent;

        // Convertir la hora de la fila a minutos
        const rowMinutes = convertToMinutes(rowTime);

        if (currentMinutes - 20 <= rowMinutes && rowMinutes <= currentMinutes + 120) {
            row.style.display = ''; // Mostrar filas dentro del rango
            
            // Aplicar colores según el tiempo relativo a la hora actual
            if (currentMinutes - 7 <= rowMinutes && rowMinutes <= currentMinutes + 10) {
                row.style.backgroundColor = 'lightgreen'; // Dentro de los 7 minutos de la hora actual
            } else if (rowMinutes < currentMinutes - 7) { 
                row.style.backgroundColor = 'red'; // Pasaron más de 7 minutos de la hora actual
            } else {
                row.style.backgroundColor = 'white'; // Aún faltan más de 7 minutos para llegar a la hora actual
            }
        } else {
            row.style.display = 'none'; // Ocultar filas fuera del rango
        }
    }
}

// Función para cargar datos desde localStorage
function loadData() {
    const schedule = JSON.parse(localStorage.getItem('weeklySchedule'));
    if (schedule) {
        const today = new Date().toLocaleDateString('es-ES', { weekday: 'long' }).toLowerCase();
        const data = csvToArray(schedule[today]);
        populateSchedule(today, data);
    }
}

// Convertir contenido CSV a array de datos
function csvToArray(csvString) {
    const lines = csvString.split("\n");
    const result = [];

    for (const line of lines) {
        if (line.trim() !== "") {
            const values = line.split(",");
            result.push(values);
        }
    }

    return result;
}

// Agregar datos a la tabla
function populateSchedule(day, data) {
    const tableBody = document.getElementById('schedule-table').querySelector('tbody');

    data.forEach((item) => {
        if (item.length < 4) return; // Saltar filas incompletas

        const [subject, professor, lab, time] = item;

        const newRow = document.createElement('tr');
        const dayCell = document.createElement('td');
        dayCell.textContent = day.charAt(0).toUpperCase() + day.slice(1);

        const cells = [subject, professor, lab, time];
        newRow.appendChild(dayCell);
        
        cells.forEach(cell => {
            const newCell = document.createElement('td');
            newCell.textContent = cell;
            newRow.appendChild(newCell);
        });

        let inserted = false;
        for (let i = 0; i < tableBody.children.length; i++) {
            const row = tableBody.children[i];
            const rowDay = row.children[0].textContent.toLowerCase();
            const rowTime = row.children[4].textContent;
            if (rowDay === day && compareTimes(rowTime, time) > 0) {
                tableBody.insertBefore(newRow, row);
                inserted = true;
                break;
            }
        }

        if (!inserted) {
            tableBody.appendChild(newRow);
        }
    });
}

// Comparar dos horas en formato HH:MM
function compareTimes(time1, time2) {
    const minutes1 = convertToMinutes(time1);
    const minutes2 = convertToMinutes(time2);
    return minutes1 - minutes2;
}

// Actualizar la hora y la fecha cada segundo
setInterval(updateDateTime, 1000);

// Cargar datos al inicio
window.onload = loadData;