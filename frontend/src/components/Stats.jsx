export default function Stats() {
    // Aquí guardamos la información en una lista 
    const stats = [
        { value: "50K+", label: "Active Players" },
        { value: "2.5K+", label: "Pro Teams" },
        { value: "15K+", label: "Successful Matches" },
    ];

    return (
        // Este es el contenedor principal. Usamos Flexbox para alinearlos.
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 py-12">

            {/* Aquí le decimos a React: "Por cada dato en mi lista, dibuja esto" */}
            {stats.map((item, index) => (
                <div key={index} className="text-center">
                    {/* El número grande en blanco */}
                    <h2 className="text-white text-4xl md:text-5xl font-bold mb-1 tracking-tight">
                        {item.value}
                    </h2>
                    {/* El texto pequeño en gris */}
                    <p className="text-gray-400 text-sm md:text-base font-medium">
                        {item.label}
                    </p>
                </div>
            ))}

        </div>
    );
}