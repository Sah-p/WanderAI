function Destinations() {
  const places = [
    {
      name: "Goa",
      image: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800",
      description: "Sun-kissed beaches, vibrant nightlife, Portuguese heritage, and fresh seafood.",
      tags: ["Beach", "Nightlife", "Food"],
    },
    {
      name: "Mysore",
      image: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Mysore_Palace_Morning.jpg",
      description: "Magnificent palaces, royal heritage, fragrant sandalwood, and silk sarees.",
      tags: ["Heritage", "Culture", "Shopping"],
    },
    {
      name: "Hampi",
      image: "https://images.unsplash.com/photo-1570458436416-b8fcccfe883f?w=800",
      description: "Ancient Vijayanagara ruins, boulder landscapes, and timeless temples.",
      tags: ["History", "Trekking", "Photography"],
    },
    {
      name: "Kerala",
      image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800",
      description: "Serene backwaters, lush tea gardens, Ayurveda, and spice trails.",
      tags: ["Backwaters", "Nature", "Wellness"],
    },
    {
      name: "Manali",
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800",
      description: "Snow-capped peaks, adventure sports, river rafting, and mountain trails.",
      tags: ["Snow", "Adventure", "Trekking"],
    },
    {
      name: "Delhi",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800",
      description: "Historic monuments, world-class street food, museums, and bazaars.",
      tags: ["History", "Food", "Culture"],
    },
    {
      name: "Jaipur",
      image: "https://images.unsplash.com/photo-1477587458883-47145ed6b1f5?w=800",
      description: "The Pink City — forts, palaces, camel rides, and Rajasthani cuisine.",
      tags: ["Forts", "Culture", "Shopping"],
    },
    {
      name: "Ladakh",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      description: "High-altitude deserts, monasteries, Pangong Lake, and starlit skies.",
      tags: ["Mountains", "Adventure", "Spiritual"],
    },
    {
      name: "Andaman",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      description: "Crystal-clear waters, coral reefs, scuba diving, and untouched beaches.",
      tags: ["Beach", "Diving", "Island"],
    },
  ];

  const tagColors = {
    Beach: "bg-blue-100 text-blue-700",
    Nightlife: "bg-purple-100 text-purple-700",
    Food: "bg-orange-100 text-orange-700",
    Heritage: "bg-yellow-100 text-yellow-700",
    Culture: "bg-pink-100 text-pink-700",
    Shopping: "bg-green-100 text-green-700",
    History: "bg-amber-100 text-amber-700",
    Trekking: "bg-lime-100 text-lime-700",
    Photography: "bg-indigo-100 text-indigo-700",
    Backwaters: "bg-teal-100 text-teal-700",
    Nature: "bg-emerald-100 text-emerald-700",
    Wellness: "bg-cyan-100 text-cyan-700",
    Snow: "bg-sky-100 text-sky-700",
    Adventure: "bg-red-100 text-red-700",
    Forts: "bg-stone-100 text-stone-700",
    Spiritual: "bg-violet-100 text-violet-700",
    Mountains: "bg-slate-100 text-slate-700",
    Island: "bg-cyan-100 text-cyan-700",
    Diving: "bg-blue-100 text-blue-700",
  };

  return (
    <div className="bg-slate-100 min-h-screen px-10 py-20">

      {/* TITLE */}
      <h1 className="text-7xl font-bold text-center mb-4">
        Popular Destinations
      </h1>
      <p className="text-center text-2xl text-gray-500 mb-16">
        Explore amazing places across India with WanderAI
      </p>

      {/* CARDS GRID */}
      <div className="grid md:grid-cols-3 gap-10 max-w-[1400px] mx-auto">
        {places.map((place, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition duration-300"
          >
            {/* IMAGE */}
            <div className="relative">
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-[280px] object-cover"
                onError={(e) => {
                  e.target.src =
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <h2 className="absolute bottom-4 left-6 text-4xl font-extrabold text-white">
                {place.name}
              </h2>
            </div>

            {/* CONTENT */}
            <div className="p-7">
              <p className="text-xl text-gray-600 leading-8 mb-5">
                {place.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {place.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-4 py-1 rounded-full text-base font-semibold ${
                      tagColors[tag] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

export default Destinations;
