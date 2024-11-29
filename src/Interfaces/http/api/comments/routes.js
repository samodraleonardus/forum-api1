const routes = (handler) => [
  {
    method: "POST",
    path: "/threads/{threadId}/comments",
    handler: handler.commentCreateHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
  {
    method: "DELETE",
    path: "/threads/{threadId}/comments/{commentId}",
    handler: handler.commentRemoveHandler,
    options: {
      auth: "forumapi_jwt",
    },
  },
];

module.exports = routes;
