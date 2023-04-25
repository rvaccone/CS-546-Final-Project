import userRoutes from "./users.js";
// import gameRoutes from './games.js';
import courtRoutes from "./courts.js";

const constructorMethod = (app) => {
  // app.get('/', (req, res) => {
  //  TODO: Add view page to this render.
  //  res.render()
  // })
  //app.use("/user", userRoutes);
  //app.use("/game", gameRoutes);
  app.use("/courts", courtRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Route Not found" });
  });
};

export default constructorMethod;
