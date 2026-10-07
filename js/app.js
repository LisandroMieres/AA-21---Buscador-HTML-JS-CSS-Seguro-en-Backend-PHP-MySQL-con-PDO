'use strict';

const API = 'api/productos.php';

const form          = document.getElementById('form-producto');
const tbody         = document.getElementById('tbody-productos');
const mensaje       = document.getElementById('mensaje');
const tituloForm    = document.getElementById('titulo-form');
const btnGuardar    = document.getElementById('btn-guardar');
const btnCancelar   = document.getElementById('btn-cancelar');
const inputBuscar   = document.getElementById('input-buscar');
const btnBuscar     = document.getElementById('btn-buscar');

/* ---------- Utilidades de UI ---------- */

function mostrarMensaje(texto, tipo = 'ok') {
    mensaje.textContent = texto;
    mensaje.className = tipo;
    if (tipo === 'ok') {
        setTimeout(() => {
            mensaje.className = '';
            mensaje.textContent = '';
        }, 3500);
    }
}

function limpiarErroresCampos() {
    document.querySelectorAll('.error-campo').forEach(el => el.textContent = '');
}

function mostrarErroresCampos(errores) {
    limpiarErroresCampos();
    for (const [campo, texto] of Object.entries(errores)) {
        const span = document.querySelector(`[data-error="${campo}"]`);
        if (span) span.textContent = texto;
    }
}

function resetFormulario() {
    form.reset();
    document.getElementById('id').value = '';
    tituloForm.textContent = 'Nuevo producto';
    btnGuardar.textContent = 'Guardar';
    btnCancelar.hidden = true;
    limpiarErroresCampos();
}

/* ---------- Render ---------- */

function renderProductos(productos) {
    tbody.innerHTML = '';

    if (!productos.length) {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.colSpan = 6;
        td.textContent = 'No hay productos para mostrar.';
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }

    for (const p of productos) {
        const tr = document.createElement('tr');

        // Uso textContent (no innerHTML) para evitar XSS al mostrar datos.
        const celdas = [
            p.id,
            p.nombre,
            p.categoria,
            formatearPrecio(p.precio),
            p.stock,
        ];

        for (const valor of celdas) {
            const td = document.createElement('td');
            td.textContent = valor;
            tr.appendChild(td);
        }

        const tdAcciones = document.createElement('td');
        tdAcciones.className = 'acciones';

        const btnEditar = document.createElement('button');
        btnEditar.textContent = 'Editar';
        btnEditar.className = 'btn-editar';
        btnEditar.addEventListener('click', () => cargarParaEditar(p.id));

        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = 'Eliminar';
        btnEliminar.className = 'btn-eliminar';
        btnEliminar.addEventListener('click', () => eliminarProducto(p.id, p.nombre));

        tdAcciones.appendChild(btnEditar);
        tdAcciones.appendChild(btnEliminar);
        tr.appendChild(tdAcciones);

        tbody.appendChild(tr);
    }
}

function formatearPrecio(valor) {
    const num = Number(valor);
    return num.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
    });
}

/* ---------- Peticiones fetch ---------- */

async function pedirJSON(url, opciones = {}) {
    const respuesta = await fetch(url, opciones);
    let data = null;
    try {
        data = await respuesta.json();
    } catch {
        data = null;
    }

    if (!respuesta.ok) {
        const err = new Error((data && (data.error || data.mensaje)) || 'Error en la petición');
        err.status = respuesta.status;
        err.data = data;
        throw err;
    }
    return data;
}

async function cargarProductos(buscar = '') {
    tbody.innerHTML = '<tr><td colspan="6">Cargando...</td></tr>';
    try {
        const url = buscar
            ? `${API}?buscar=${encodeURIComponent(buscar)}`
            : API;

        const productos = await pedirJSON(url);
        renderProductos(productos);
    } catch (e) {
        tbody.innerHTML = '<tr><td colspan="6">Error al cargar productos.</td></tr>';
        mostrarMensaje(e.message, 'error');
    }
}

async function cargarParaEditar(id) {
    try {
        const p = await pedirJSON(`${API}?id=${encodeURIComponent(id)}`);

        document.getElementById('id').value        = p.id;
        document.getElementById('nombre').value    = p.nombre;
        document.getElementById('categoria').value = p.categoria;
        document.getElementById('precio').value    = p.precio;
        document.getElementById('stock').value     = p.stock;

        tituloForm.textContent = `Editar producto #${p.id}`;
        btnGuardar.textContent = 'Actualizar';
        btnCancelar.hidden = false;
        limpiarErroresCampos();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
        mostrarMensaje(e.message, 'error');
    }
}

async function eliminarProducto(id, nombre) {
    if (!confirm(`¿Eliminar "${nombre}"?`)) return;

    try {
        await pedirJSON(API, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        mostrarMensaje('Producto eliminado correctamente.', 'ok');
        resetFormulario();
        cargarProductos(inputBuscar.value.trim());
    } catch (e) {
        mostrarMensaje(e.message, 'error');
    }
}

/* ---------- Submit ---------- */

form.addEventListener('submit', async (evento) => {
    evento.preventDefault();
    limpiarErroresCampos();

    const id = document.getElementById('id').value;

    const datos = {
        nombre:    document.getElementById('nombre').value.trim(),
        categoria: document.getElementById('categoria').value.trim(),
        precio:    document.getElementById('precio').value,
        stock:     document.getElementById('stock').value,
    };

    const esEdicion = id !== '';
    if (esEdicion) datos.id = Number(id);

    try {
        const respuesta = await pedirJSON(API, {
            method: esEdicion ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos),
        });

        mostrarMensaje(respuesta.mensaje || 'Operación exitosa.', 'ok');
        resetFormulario();
        cargarProductos(inputBuscar.value.trim());
    } catch (e) {
        if (e.status === 422 && e.data && e.data.errores) {
            mostrarErroresCampos(e.data.errores);
            mostrarMensaje('Revisá los campos marcados.', 'error');
        } else {
            mostrarMensaje(e.message, 'error');
        }
    }
});

btnCancelar.addEventListener('click', resetFormulario);

btnBuscar.addEventListener('click', () => {
    cargarProductos(inputBuscar.value.trim());
});

inputBuscar.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        cargarProductos(inputBuscar.value.trim());
    }
});

/* ---------- Init ---------- */
cargarProductos();