const LikesHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "likes",
  register: async (server, { container }) => {
    const likesHandler = new LikesHandler(container);
    await server.route(routes(likesHandler));
  },
};
