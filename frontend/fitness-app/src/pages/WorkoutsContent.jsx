import Card from "./Card";

const WorkoutContent = () => {
  const cardsData = [
    { title: "Workout 1", body: "Body text for whatever you'd like to say." },
    { title: "Workout 2", body: "Body text for whatever you'd like to say." },
    { title: "Workout 3", body: "Body text for whatever you'd like to say." }
  ];

  return (
    <div style={{ 
      width: "100vw",            // full viewport width
      overflowX: "hidden",       // prevent horizontal scrollbar
      backgroundColor: "#333", 
      color: "#fff",
      padding: "45px 0",         // vertical padding only
      boxSizing: "border-box"

    }}>
      <h1 style={{ padding: "0 35px" }}>Your Workouts</h1>
      <h3 style={{ color: "#aaa", padding: "0 45px" }}>See your workouts</h3>

      <div style={{ 
        display: "flex", 
        gap: "20px", 
        marginTop: "20px",
        padding: "0 20px" // inner spacing for cards
      }}>
        {cardsData.map((card, index) => (
          <Card
            key={index}
            title={card.title}
            body={card.body}
            style={{ flex: 1 }} // stretch cards equally
          />
        ))}
      </div>
    </div>
  );
};

export default WorkoutContent;
