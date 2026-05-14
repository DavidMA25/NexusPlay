export default function Stats() {
    
    const stats = [
        { value: "50K+", label: "Active Players" },
        { value: "2.5K+", label: "Pro Teams" },
        { value: "15K+", label: "Successful Matches" },
    ];

    return (
        
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 pt-4 pb-12">

            {}
            {stats.map((item, index) => (
                <div key={index} className="text-center">
                    {}
                    <h2 className="text-white text-4xl md:text-5xl font-bold mb-1 tracking-tight">
                        {item.value}
                    </h2>
                    {}
                    <p className="text-gray-400 text-sm md:text-base font-medium">
                        {item.label}
                    </p>
                </div>
            ))}

        </div>
    );
}