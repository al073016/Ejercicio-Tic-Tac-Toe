import React, { useState } from 'react';

export default function SettingsMenu({
    currentSize,
    currentTrack,
    currentVolume,
    musicOptions,
    onApplySettings,
    onClose
}) {
    // Estado local para guardar la selección 
    const [tempSize, setTempSize] = useState(currentSize);
    const [tempTrack, setTempTrack] = useState(currentTrack);
    const [tempVolume, setTempVolume] = useState(currentVolume);


    const handleSubmit = (e) => {
        e.preventDefault(); // Evita que la página se recargue
        onApplySettings({
            newSize: Number(tempSize),
            newTrack: tempTrack,
            newVolume: Number(tempVolume)
        }); // Envía el nuevo tamaño a Game
        onClose(); // Cierra el menú
    };

    return (

        <div id="settings-area" className="visible">
            <div id="settings-panel">
                <h2>Configuración</h2>
                <form id="settings-form" onSubmit={handleSubmit}>

                    <div>
                        <label htmlFor="grid-size">Tamaño Cuadrícula (NxN):</label>
                        <input
                            type="number"
                            id="grid-size"
                            min="3"
                            max="9"
                            step="2"
                            value={tempSize}
                            onChange={(e) => setTempSize(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="music-track">Música:</label>
                        <select
                            id="music-track"
                            value={tempTrack}
                            onChange={(e) => setTempTrack(e.target.value)}
                        >
                            {musicOptions.map((option) => (
                                <option key={option.name} value={option.src}>
                                    {option.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="music-volume">Volumen:</label>
                        <input
                            type="range"
                            id="music-volume"
                            min="0"
                            max="1"
                            step="0.1"
                            value={tempVolume}
                            onChange={(e) => setTempVolume(e.target.value)}
                        />
                    </div>

                    <button type="submit">Aplicar</button>

                    <button type="button" onClick={onClose} style={{ marginLeft: '10px' }}>
                        Cancelar
                    </button>
                </form>
            </div>
        </div>
    );
}