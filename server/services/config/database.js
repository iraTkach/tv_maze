import { connect, connection } from 'mongoose';

const connectDB = () => {
    const uri = `mongodb+srv://iratkach:1234@cluster0.c9qav.mongodb.net/tv_maze?retryWrites=true&w=majority`
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true
    };

    connect(uri, options);
};

const db = connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
    console.log("Connected successfully");
});

export default connectDB;