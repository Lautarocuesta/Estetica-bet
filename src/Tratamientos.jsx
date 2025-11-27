import React, { useState } from 'react';
import data from '../data.json';

// =========================================================
// FUNCIÓN PARA REDIRECCIONAR A GOOGLE CALENDAR
// =========================================================
const handleGoogleCalendarRedirect = (tratamiento) => {
    const baseURL = 'https://calendar.google.com/calendar/r/eventedit';
    const title = encodeURIComponent(`Turno Estética: ${tratamiento.nombre}`);
    const details = encodeURIComponent(
        `¡Hola! Quisiera reservar este turno.\nTratamiento: ${tratamiento.nombre}\nDuración: ${tratamiento.duracionMinutos} min.`
    );
    const calendarURL = `${baseURL}?text=${title}&details=${details}&location=Tu%20Ubicación%20Estética`;
    window.open(calendarURL, '_blank');
};

// =========================================================
// MODAL TRATAMIENTOS
// =========================================================
const ModalStock = ({ tratamiento, onClose }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <div className="modal-header">
                <h3>Reservar: {tratamiento.nombre}</h3>
                <button onClick={onClose} className="modal-close-btn">&times;</button>
            </div>

            <p className="text-md font-semibold mb-3">Insumos Necesarios:</p>
            <ul className="insumos-list">
                {tratamiento.insumos?.length > 0 ? (
                    tratamiento.insumos.map((item, i) => <li key={i}>{item}</li>)
                ) : (
                    <li className="text-gray-500 italic">No hay insumos específicos listados.</li>
                )}
            </ul>

            <button onClick={onClose} className="btn-close-modal">Cerrar</button>
        </div>
    </div>
);

// =========================================================
// TARJETA TRATAMIENTO
// =========================================================
const TratamientoCard = ({ tratamiento, onVerStockClick }) => {
    const precioFormateado = tratamiento.precio.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
    });

    return (
        <div className="card">
            {tratamiento.imagen && (
                <img src={tratamiento.imagen} alt={tratamiento.nombre} className="card-image" />
            )}

            <h4 className="card-title">{tratamiento.nombre}</h4>
            <p className="card-price">{precioFormateado}</p>

            <div className="card-details">
                <p>⏱️ Duración: <strong>{tratamiento.duracionMinutos} min</strong></p>
                <p>💳 Pago: {tratamiento.formasDePago.join(', ')}</p>
            </div>

            <div className="card-actions">
                <button 
                    onClick={() => handleGoogleCalendarRedirect(tratamiento)}
                    className="btn-primary"
                >
                    Reservar en Google Calendar 🗓️
                </button>

                <button 
                    onClick={() => onVerStockClick(tratamiento)}
                    className="btn-secondary"
                >
                    Ver Stock / Insumos
                </button>
            </div>
        </div>
    );
};

// =========================================================
// MODAL PRODUCTO
// =========================================================
const ModalProducto = ({ producto, onClose }) => (
    <div className="modal-overlay">
        <div className="modal-content">
            <div className="modal-header">
                <h3>Producto: {producto.nombre}</h3>
                <button onClick={onClose} className="modal-close-btn">&times;</button>
            </div>

            <p className="text-md font-semibold mb-3">Stock Disponible:</p>
            <p className="text-lg font-bold">{producto.stock} unidades</p>

            <button onClick={onClose} className="btn-close-modal">Cerrar</button>
        </div>
    </div>
);

// =========================================================
// TARJETA PRODUCTO
// =========================================================
const ProductoCard = ({ producto, onVerStockClick }) => {
    const precioFormateado = producto.precio.toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0
    });

    return (
        <div className="card">
            <h4 className="card-title">{producto.nombre}</h4>
            <p className="card-price">{precioFormateado}</p>

            <div className="card-details">
                <p>📦 Stock: <strong>{producto.stock}</strong></p>
            </div>

            <div className="card-actions">
                <button 
                    onClick={() => onVerStockClick(producto)}
                    className="btn-secondary"
                >
                    Ver Stock
                </button>

                <button
                    onClick={() => producto.urlML && window.open(producto.urlML, "_blank")}
                    className="btn-primary"
                    disabled={!producto.urlML}
                >
                    Comprar 🛒
                </button>
            </div>
        </div>
    );
};

// =========================================================
// COMPONENTE PRINCIPAL
// =========================================================
export function Tratamientos() {
    const [stockSeleccionado, setStockSeleccionado] = useState(null);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [busqueda, setBusqueda] = useState("");

    const tratamientos = data.tratamientos;
    const productos = data.productos;

    const filtro = busqueda.toLowerCase();

    const tratamientosFiltrados = tratamientos.filter((t) =>
        t.nombre.toLowerCase().includes(filtro)
    );

    const productosFiltrados = productos.filter((p) =>
        p.nombre.toLowerCase().includes(filtro)
    );

    return (
        <div className="tratamientos-page">

            {/* ================= BUSCADOR GLOBAL ================= */}
            <div className="header-container">
                <h1>Catálogo de Tratamientos y Productos ✨</h1>
                <p>Buscá tratamientos o productos por nombre.</p>

                <input
                    type="text"
                    placeholder="Buscar..."
                    className="search-input"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                />
            </div>

            {/* ================= TRATAMIENTOS ================= */}
            <header className="header-container">
                <h2>Tratamientos</h2>
            </header>

            <div className="tratamientos-grid">
                {tratamientosFiltrados.map((t) => (
                    <TratamientoCard 
                        key={t.id}
                        tratamiento={t}
                        onVerStockClick={setStockSeleccionado}
                    />
                ))}
            </div>

            {/* ================= PRODUCTOS ================= */}
            <header className="header-container" style={{ marginTop: "50px" }}>
                <h2>Productos</h2>
            </header>

            <div className="tratamientos-grid">
                {productosFiltrados.map((p) => (
                    <ProductoCard 
                        key={p.id}
                        producto={p}
                        onVerStockClick={setProductoSeleccionado}
                    />
                ))}
            </div>

            {/* MODALES */}
            {stockSeleccionado && (
                <ModalStock 
                    tratamiento={stockSeleccionado}
                    onClose={() => setStockSeleccionado(null)}
                />
            )}

            {productoSeleccionado && (
                <ModalProducto 
                    producto={productoSeleccionado}
                    onClose={() => setProductoSeleccionado(null)}
                />
            )}
        </div>
    );
}
