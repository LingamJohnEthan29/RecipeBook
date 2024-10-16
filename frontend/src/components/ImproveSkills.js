export default function ImproveSkills() {
    const list = [
        "Learn New Recepies",
        "Experiment with Food",
        "Write your own recepies",
        "Know Nutritional Facts",
        "Get Cooking Tips",
        "Get Ranked"
    ]
    
    return (
        <div className="section improve-skills">
            <div className="col img">
            <img id="myImage" src="/img/gallery/img_10.jpg" alt="Culinary Skills" />
            </div>
            <div className="col typography">
                <h1 className="title">Let's Build our Culinary Skills</h1>
                { list.map((item,index)=> (
                    <p className="skill-item" key={index}>{item}</p>
                ))}
                <button className="btn">Sign Up Now</button>
            </div>
        </div>
    );
}
