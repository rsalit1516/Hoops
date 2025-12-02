// Resolver removed from DI graph to prevent circular dependencies. If reintroduced,
// prefer a standalone, side-effect-free resolver that doesn't inject services used
// by routes/components it resolves for.
export class GamesResolver {}
